    // Global state variables
    let trainingData = [], provinceDataSummary = {}, districtDataSummary = {}, provincialRankingsData = [], leaderboardData = [];
    let trainerData = [], districtColors = {}, trainerBenefCounts = {}, trainerAssignedLocations = {};
    let occupationsHorizontalBarChart, monthlyTrendChart, ageDistributionChart, beneficiariesDonutChart, trainingsDonutChart;
    let map, markers, heatLayer;
    let credentials = {}; // Global map for username -> {password, role}
    let currentUserRole = 'limited'; // Default; set after login
    let db; // sql.js database instance
    // At the top of the function or as a global constant this is a dummy content im adding now. change name/path if needed
    const SHOW_EXTRA_BENEFICIARIES = true;
    const EXTRA_BENEFICIARIES_COUNT = 461;
    // Configuration
    const DB_PATH = '../../Database/bisp_dflt2.db'; // Local DB file

    // Global config object (will be populated on load)
    let config = {
      totalProjectTargetBeneficiaries: 250000, // Fallback
      monthlyTargetPerPair: 240, // Fallback
      provinceNameMap: { 
        "Federal Territory": "Islamabad", 
        "Kpk": "Khyber Pakhtunkhwa", 
        "KP": "Khyber Pakhtunkhwa",
        "Baluchistan": "Baluchistan",
        "Baluchistan ": "Baluchistan"
      }, 
      provinceColors: { 
        "Islamabad": "#ff69b4", // pink
        "Punjab": "#22c55e", // parrot green
        "Khyber Pakhtunkhwa": "#60a5fa", // light blue
        "KPK": "#60a5fa",
        "Kpk": "#60a5fa",
        "Sindh": "#92400e", // dark brown
        "Baluchistan": "#ef4444" // red
      },
      ageColors: { '18-29': '#3b82f6', '30-39': '#10b981', '40-49': '#f59e0b', '50-59': '#ef4444', '60+': '#a855f7' },
      provinces: { // Fallback - corrected spelling
        "Punjab": {total_target_beneficiaries: 105000, cohort_size: 16, months_contract: 8, std_trainings_per_month: 8},
        "Khyber Pakhtunkhwa": {total_target_beneficiaries: 75000, cohort_size: 16, months_contract: 8, std_trainings_per_month: 8},
        "Sindh": {total_target_beneficiaries: 60000, cohort_size: 16, months_contract: 8, std_trainings_per_month: 8},
        "Baluchistan": {total_target_beneficiaries: 10000, cohort_size: 16, months_contract: 8, std_trainings_per_month: 8},
        "Islamabad": {total_target_beneficiaries: 5000, cohort_size: 16, months_contract: 8, std_trainings_per_month: 8}
      }
    };

    // Province centroids for ultimate fallback
    const provinceCentroids = {
      "Islamabad": [33.6844, 73.0479],
      "Punjab": [31.1704, 72.7097],
      "Khyber Pakhtunkhwa": [34.9526, 72.3311],
      "Sindh": [25.8943, 68.5247],
      "Baluchistan": [28.4907, 65.0958]
    };

    // Initialize sql.js and load DB
    async function initDatabase() {
      try {
        const SQL = await initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
        });
        const response = await fetch(DB_PATH);
        if (!response.ok) throw new Error('Failed to load DB file');
        const dbBuffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(dbBuffer));
        console.log('Database loaded successfully');
      } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
      }
    }

    // Query function for sql.js
    function queryDatabase(sql) {
      if (!db) throw new Error('Database not initialized');
      const res = db.exec(sql);
      if (res.length === 0) return [];
      const { columns, values } = res[0];
      return values.map(row => {
        return Object.fromEntries(columns.map((col, i) => [col, row[i]]));
      });
    }

    // JS Equivalent of Python calculate_targets
    function calculateTargets(provinceName, provinceConfig) {
      const totalTarget = provinceConfig.total_target_beneficiaries;
      const cohortSize = provinceConfig.cohort_size;
      const monthsContract = provinceConfig.months_contract;
      const trainingsPerMonth = provinceConfig.std_trainings_per_month || 8;

      const trainingsPerTrainer = trainingsPerMonth * monthsContract;
      const benefPerTrainer = trainingsPerTrainer * cohortSize;
      const numTrainers = totalTarget / benefPerTrainer;

      const targetTrainings = numTrainers * trainingsPerTrainer;
      const targetBeneficiaries = totalTarget;

      const totalCapacity = numTrainers * benefPerTrainer;

      provinceConfig.target_beneficiaries = targetBeneficiaries;
      provinceConfig.target_trainings = Math.ceil(numTrainers * trainingsPerTrainer);
      provinceConfig.implied_num_trainers = numTrainers;
      provinceConfig.trainings_per_trainer = trainingsPerTrainer;
      provinceConfig.benef_per_trainer = benefPerTrainer;
      provinceConfig.total_capacity = totalCapacity;

      return provinceConfig;
    }

    // Load config from JSON and apply calculations
    async function loadConfig() {
      try {
        const response = await fetch('../../confidentials/config.json');
        if (!response.ok) throw new Error('Config file not found');
        const loadedConfig = await response.json();
        Object.assign(config, loadedConfig);

        for (const [provinceName, provinceConfig] of Object.entries(config.provinces)) {
          calculateTargets(provinceName, provinceConfig);
        }

        config.totalProjectTargetBeneficiaries = Object.values(config.provinces).reduce((sum, p) => sum + p.target_beneficiaries, 0);

      } catch (error) {
        console.warn('Failed to load config.json, using fallbacks:', error);
        for (const [provinceName, provinceConfig] of Object.entries(config.provinces)) {
          calculateTargets(provinceName, provinceConfig);
        }
        config.totalProjectTargetBeneficiaries = Object.values(config.provinces).reduce((sum, p) => sum + p.target_beneficiaries, 0);
      }
    }

    Chart.defaults.font.family = "'Montserrat', sans-serif";
    Chart.defaults.color = '#64748b';

    // Load credentials from TXT file with roles
    async function loadCredentials() {
        try {
            const response = await fetch('../../confidentials/credentials.txt');
            if (!response.ok) throw new Error('Credentials file not found');
            const text = await response.text();
            credentials = {};
            text.trim().split('\n').forEach(line => {
                const [username, password, ...rest] = line.split('|').map(s => s.trim());
                if (username && password) {
                    const role = ['HQSDPI', 'drasma', 'drfareeha', 'anam'].includes(username) ? 'full' : 'limited';
                    credentials[username] = { password, role };
                }
            });
            console.log('Credentials loaded:', Object.keys(credentials));
        } catch (error) {
            console.error('Failed to load credentials:', error);
            const notification = document.getElementById('update-notification');
            notification.textContent = `Error: ${error.message}. Check confidentials/credentials.txt file.`;
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
        }
    }

    // Update sidebar visibility based on role
    function updateSidebarAccess(role) {
        currentUserRole = role;
        const fullAccessItems = document.querySelectorAll('.full-access');
        const limitedAccessItems = document.querySelectorAll('.limited-access');
        if (role === 'full') {
            fullAccessItems.forEach(item => item.style.display = 'block');
            limitedAccessItems.forEach(item => item.style.display = 'block');
        } else {
            fullAccessItems.forEach(item => item.style.display = 'none');
            limitedAccessItems.forEach(item => item.style.display = 'block');
        }
    }

    // Intelligent date parsing function
    function parseTrainingDate(dateInput) {
        if (!dateInput) return null;
        const mdyMatch = dateInput.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (mdyMatch) {
            const [, month, day, year] = mdyMatch;
            const date = new Date(year, month - 1, day);
            if (!isNaN(date.getTime())) return date;
        }
        if (/^\d{5}$/.test(dateInput)) {
            const excelDate = parseInt(dateInput, 10);
            const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
            jsDate.setMinutes(jsDate.getMinutes() + jsDate.getTimezoneOffset());
            if (!isNaN(jsDate.getTime())) return jsDate;
        }
        const standardDate = new Date(dateInput);
        if (!isNaN(standardDate.getTime())) return standardDate;
        return null;
    }

    // Function to get province color
    function getProvinceColor(province) {
      if (!province) return '#4f46e5';
      const normalized = config.provinceNameMap[province] || province;
      return config.provinceColors[normalized] || '#4f46e5';
    }

   async function loadTrainers() {
    const trainerRows = queryDatabase("SELECT trainer_name AS trainer_name, province, district, tehsil FROM trainers_info");


    const attendanceRows = queryDatabase(`
        SELECT trainer_name, "session_location-Latitude" AS lat, "session_location-Longitude" AS lon 
        FROM aspc_attendance_form
        WHERE "session_location-Latitude" IS NOT NULL AND "session_location-Longitude" IS NOT NULL
    `);


    const avgCoords = {};
    attendanceRows.forEach(row => {
        const t = row.trainer_name?.trim();
        if (!t) return;
        if (!avgCoords[t]) avgCoords[t] = { lats: [], lons: [] };
        avgCoords[t].lats.push(row.lat);
        avgCoords[t].lons.push(row.lon);
    });

    for (const t in avgCoords) {
        const a = avgCoords[t];
        if (a.lats.length > 0) {
            a.avgLat = a.lats.reduce((s, v) => s + v, 0) / a.lats.length;
            a.avgLon = a.lons.reduce((s, v) => s + v, 0) / a.lons.length;
        }
    }


    return trainerRows.map(t => {
        const name = t.trainer_name?.trim();
        if (!name) return null;

        let lat, lon;
        const avg = avgCoords[name];

        if (avg && avg.avgLat) {
            lat = avg.avgLat;
            lon = avg.avgLon;
        } else {
            const normProv = config.provinceNameMap[t.province] || t.province || "Punjab";
            const center = provinceCentroids[normProv];
            lat = center ? center[0] : 30.3753; 
            lon = center ? center[1] : 69.3451;
            
            console.warn(`Default location used for: ${name} (${t.district})`); 
        }

        return {
            trainer_name: name,
            province: t.province?.trim() || '',
            district: t.district?.trim() || '',
            tehsil: t.tehsil?.trim() || '',
            'session_location-Latitude': lat,
            'session_location-Longitude': lon
        };
    }).filter(Boolean);
}

    async function loadDataAndInitialize() {
        try {
            await loadConfig();

            const beneficiaryRows = queryDatabase("SELECT * FROM bene_registration");

            beneficiaryRows.forEach(row => {
                row.SubmissionDate = parseTrainingDate(row.starttime);
                row.main_menu = 'bene_registration';
            });

            trainingData = processBeneficiaryData(beneficiaryRows);
            if (!trainingData || trainingData.length === 0) throw new Error("No training data found after processing.");

            trainerData = await loadTrainers();

            preProcessAllData(trainingData);
            populateFilters(trainingData);
            initializeMap();
            initializeCharts();
            updateDashboard();
            setupEventListeners();

        } catch (error) {
            console.error("Initialization Error:", error);
            const notification = document.getElementById('update-notification');
            notification.textContent = `Error: ${error.message}. Please ensure the DB file is present.`;
            notification.classList.add('show');
        }
    }



    
function isValidTrainingSession(session) {
    // Must have > 8 unique beneficiaries (your main business rule)
    const uniqueCNICs = new Set(
        session.Beneficiaries_Details.map(b => b.cnic).filter(Boolean)
    );
    return uniqueCNICs.size > 8;
}

function isVerifiedTrainingSession(session) {
    if (!isValidTrainingSession(session)) return false;
    
    const totalBenef = session.Beneficiaries_Details.length;
    if (totalBenef === 0) return false;
    
    const verifiedCount = session.Beneficiaries_Details.filter(b => 
        b.verified_retention === true
    ).length;
    
    const verifiedPct = (verifiedCount / totalBenef) * 100;
    return verifiedPct >= 80;
}


    function processBeneficiaryData(beneficiaryRows) {
        // Compute beneficiaries per trainer
        beneficiaryRows.forEach(row => {
          if (row.main_menu === 'bene_registration' && row.trainer_name && row.beneficiary_cnic) {
            const trainer = row.trainer_name.trim();
            if (trainer) {
              trainerBenefCounts[trainer] = (trainerBenefCounts[trainer] || 0) + 1;
            }
          }
        });

        const sessionsMap = new Map();
        beneficiaryRows.forEach(row => {
            if (row.main_menu !== 'bene_registration' || !row.beneficiary_cnic) return;

            const trainer = row.trainer_name;
            const date = parseTrainingDate(row.starttime);
            if (!trainer || !date) return;

            const sessionKey = trainer + '_' + (date ? date.toISOString().split('T')[0] : 'no-date');

            let session = sessionsMap.get(sessionKey);
            if (!session) {
                const province = row.province || 'Unknown';
                const district = row.district || 'Unknown District';
                session = {
                    Province: province,
                    District: district,
                    Trainer1: trainer,
                    pair: row.pair || 'solo',
                    Training_Date: date,
                    Beneficiaries_Details: [],
                    Female_Occupations: {},
                    Start_Location_Lat: null,
                    Start_Location_Lon: null
                };
                sessionsMap.set(sessionKey, session);
            }

            const occupation = row.occupation;
            session.Beneficiaries_Details.push({
                cnic: row.beneficiary_cnic.replace(/[^0-9]/g, ''),
                name: row.beneficiary_name,
                occupation: occupation,
                age: row.age ? parseInt(row.age, 10) : null,
                attended_day2: row.attendance_status == '1',
                verified_retention: row.verified_retention_status === 'Verified'
            });

            if (occupation) {
                session.Female_Occupations[occupation] = (session.Female_Occupations[occupation] || 0) + 1;
            }
        });

        return Array.from(sessionsMap.values()).map(session => {
            const totalBeneficiaries = session.Beneficiaries_Details.length;
            if (totalBeneficiaries === 0) return null;
            
            const attendedDay2Count = session.Beneficiaries_Details.filter(b => b.attended_day2 ).length;
            const retentionRate = totalBeneficiaries > 0 ? (attendedDay2Count / totalBeneficiaries) * 100 : 0;

                        const rawAttendedDay2 = session.Beneficiaries_Details
                    .filter(b => b.attended_day2)   // only checks attendance_status == '1'
                    .length;

                const verifiedAttendedDay2 = session.Beneficiaries_Details
                    .filter(b => b.attended_day2 && b.verified_retention)
                    .length;

                const totalBenef = session.Beneficiaries_Details.length || 1; // avoid div by zero

                session.Raw_Retention_Rate_Pct     = parseFloat((rawAttendedDay2     / totalBenef * 100).toFixed(1));
                session.Verified_Retention_Rate_Pct = parseFloat((verifiedAttendedDay2 / totalBenef * 100).toFixed(1));

                        session.Beneficiary_Count_Actual = totalBeneficiaries;
           

            return session;
        }).filter(Boolean);
    }

    function preProcessAllData(data) {
        provinceDataSummary = {}; districtDataSummary = {};
        for (const pName in config.provinces) {
            provinceDataSummary[pName] = { trainings: 0, beneficiaries: 0, item_count: 0, total_retention_rate_sum: 0,total_verified_retention_sum: 0 ,female_occupations: {}, age_distribution: Object.fromEntries(Object.keys(config.ageColors).map(k => [k, 0])) };
        }
        data.forEach(item => {
            const provinceName = config.provinceNameMap[item.Province] || item.Province;
            if (!provinceDataSummary[provinceName]) {
                console.warn(`Data found for un-targeted or unmapped province: ${item.Province}`);
                return;
            }
            const summary = provinceDataSummary[provinceName];
            summary.total_raw_retention_sum     += item.Raw_Retention_Rate_Pct;
            summary.total_verified_retention_sum += item.Verified_Retention_Rate_Pct;
            summary.trainings++;
            summary.beneficiaries += item.Beneficiary_Count_Actual;
            summary.item_count++;
            
            for (const occ in item.Female_Occupations) { summary.female_occupations[occ] = (summary.female_occupations[occ] || 0) + item.Female_Occupations[occ]; }
            item.Beneficiaries_Details.forEach(b => {
                let ageGroup = 'Unknown';
                if (typeof b.age === 'number' && !isNaN(b.age)) {
                    if (b.age >= 18 && b.age <= 29) ageGroup = '18-29';
                    else if (b.age >= 30 && b.age <= 39) ageGroup = '30-39';
                    else if (b.age >= 40 && b.age <= 49) ageGroup = '40-49';
                    else if (b.age >= 50 && b.age <= 59) ageGroup = '50-59';
                    else if (b.age >= 60) ageGroup = '60+';
                }
                summary.age_distribution[ageGroup]++;
            });
            const districtName = item.District;
            if (districtName) {
                if (!districtDataSummary[districtName]) districtDataSummary[districtName] = { trainings: 0, beneficiaries: 0 };
                districtDataSummary[districtName].trainings++;
                districtDataSummary[districtName].beneficiaries += item.Beneficiary_Count_Actual;
            }
        });
        for (const pName in provinceDataSummary) {
            const summary = provinceDataSummary[pName];
                summary.avg_raw_retention_rate = summary.item_count > 0 
                ? (summary.total_raw_retention_sum / summary.item_count) 
                : 0;

            summary.avg_verified_retention_rate = summary.item_count > 0 
                ? (summary.total_verified_retention_sum / summary.item_count) 
                : 0;
        }
        provincialRankingsData = Object.entries(provinceDataSummary).map(([pName, stats]) => ({
            province: pName,
            beneficiaries: stats.beneficiaries,
            trainings: stats.trainings,
            beneficiary_target_pct: (stats.beneficiaries / (config.provinces[pName]?.target_beneficiaries || 1)) * 100
        }));
        const now = new Date();

        const formatName = (str) => {
            if (!str || typeof str !== 'string') return 'Unknown';
            
            // Replace underscores with spaces
            let cleaned = str.replace(/_/g, ' ').trim();
            
            // Remove any leftover weird patterns (optional but helpful)
            cleaned = cleaned.replace(/\s+/g, ' '); // multiple spaces → one
            
            // Title case: capitalize first letter of each word
            return cleaned
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

const trainerPerformance = data
    .filter(item => {
        const itemDate = item.Training_Date;
        return itemDate && 
               itemDate.getMonth() === now.getMonth() && 
               itemDate.getFullYear() === now.getFullYear();
    })
    .reduce((acc, item) => {
        const mainTrainer = (item.Trainer1 || '').trim();
        let pairValue = (item.pair || 'solo').trim().toLowerCase();

        if (!mainTrainer) return acc;

        // Clean pair value - remove extra spaces, normalize
        pairValue = pairValue.replace(/\s+/g, ' ').trim();

        let trainers = [mainTrainer];
        let isPair = false;
        let pairKey;

        if (pairValue !== 'solo' && pairValue !== '' && pairValue !== 'null' && pairValue !== 'undefined') {
            // It's a pair → second trainer name is in pair column
            const secondTrainer = pairValue;
            trainers = [mainTrainer, secondTrainer]
                .map(name => name.trim())
                .filter(Boolean);
            
            // Sort names alphabetically for consistent key
            trainers.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
            pairKey = trainers.map(n => n.toLowerCase()).join('|||'); // safe separator
            isPair = true;
        } else {
            // Solo
            pairKey = mainTrainer.toLowerCase();
            isPair = false;
        }

        if (!acc[pairKey]) {
            acc[pairKey] = {
                beneficiaries: 0,
                trainings: 0,
                district: item.District || '—',
                trainers: trainers,          // array of clean names
                isPair: isPair,
                pairKeyLower: pairKey        // for debugging if needed
            };
        }

        acc[pairKey].beneficiaries += Number(item.Beneficiary_Count_Actual) || 0;
        acc[pairKey].trainings += 1;

        return acc;
    }, {});

        leaderboardData = Object.values(trainerPerformance)
        .map(stats => {
            // Apply formatName + extra solo protection
            const cleanedTrainers = stats.trainers
                .map(name => {
                    // First apply formatName (_ → space + title case)
                    let formatted = formatName(name);
                    
                    // Then remove any leftover solo indicators
                    formatted = formatted
                        .replace(/\s*\(solo\)\s*/gi, '')
                        .replace(/\s*solo\s*/gi, '')
                        .replace(/\s*null\s*/gi, '')
                        .replace(/\s*undefined\s*/gi, '')
                        .trim();
                    
                    return formatted;
                })
                .filter(name => name && name.length > 0 && name !== 'Unknown');

            let displayName = 'Unknown Trainer';

            if (cleanedTrainers.length === 0) {
                displayName = 'Unknown';
            } else if (cleanedTrainers.length === 1) {
                displayName = cleanedTrainers[0];
            } else {
                const sorted = [...cleanedTrainers].sort((a,b) => a.localeCompare(b));
                displayName = sorted.join(' & ');
            }

            const isActuallyPair = cleanedTrainers.length >= 2;
            const monthlyTarget = isActuallyPair ? 256 : 128;

            return {
                name: displayName,
                district: stats.district,
                beneficiaries: stats.beneficiaries,
                target_pct: monthlyTarget > 0 ? (stats.beneficiaries / monthlyTarget) * 100 : 0
            };
        })
        .filter(item => item.name !== 'Unknown' && item.name.trim() !== '')
        .sort((a, b) => b.beneficiaries - a.beneficiaries)
        // .sort((a, b) => b.target_pct - a.target_pct)   // ← uncomment if you prefer ranking by %
        .slice(0, 10);
    }

    function setupEventListeners() {
        document.querySelectorAll('.provincial-ranking-card .chart-filter-button').forEach(b => b.addEventListener('click', () => {
            document.querySelectorAll('.provincial-ranking-card .chart-filter-button').forEach(btn => btn.classList.remove('active'));
            b.classList.add('active');
            updateProvincialRanking();
        }));
        document.querySelectorAll('.monthly-trend-card .chart-filter-button').forEach(b => b.addEventListener('click', () => {
            document.querySelectorAll('.monthly-trend-card .chart-filter-button').forEach(btn => btn.classList.remove('active'));
            b.classList.add('active');
            updateMonthlyTrendChart();
        }));
        document.getElementById('toggleHeatmap').addEventListener('click', toggleHeatmap);

        const provinceFilter = document.getElementById('provinceFilter');
        provinceFilter.addEventListener('change', function() {
            updateDistrictFilter(this.value);
            document.getElementById('District_Filter').value = 'All';
            updateDashboard();
        });
              

            // ────────────────────────────────────────────────
    // Event delegation for period buttons (fixes toggle after refresh)
    // ────────────────────────────────────────────────
    document.getElementById('provincialSummaryContent').addEventListener('click', function(e) {
        if (!e.target.classList.contains('period-btn')) return;

        // Remove active from all period buttons
        this.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));

        // Activate the clicked button
        e.target.classList.add('active');

        // Update filter state
        const text = e.target.textContent.trim().toLowerCase();
        if (text.includes('before')) {
            retentionPeriodFilter = 'before8jan';
        } else if (text.includes('after')) {
            retentionPeriodFilter = 'after8jan';
        } else {
            retentionPeriodFilter = 'all';
        }

        // Refresh only the retention card
        const currentProvince = document.getElementById('provinceFilter')?.value || 'All';
        updateProvincialSummaryContent(currentProvince);
    });

    // Set initial state: Before 8 Jan selected by default
    const beforeBtn = document.querySelector('.period-btn:first-child');
    if (beforeBtn) {
        beforeBtn.classList.add('active');
        retentionPeriodFilter = 'before8jan';
        // Initial render of retention card
        const initialProvince = document.getElementById('provinceFilter')?.value || 'All';
        updateProvincialSummaryContent(initialProvince);
    }

        const districtFilter = document.getElementById('District_Filter');
        districtFilter.addEventListener('change', updateDashboard);
    }
//just adding some comments to test sync.


    // last sync time 
async function showLastSyncTime() {
    const timeEl  = document.getElementById('lastSyncTime');
    const dateEl  = document.getElementById('lastSyncDate');

    // Early fallback in case elements don't exist (defensive)
    if (!timeEl || !dateEl) {
        console.warn("Last sync elements not found in DOM");
        return;
    }

    // Default / loading state
    timeEl.textContent = "—";
    dateEl.textContent = "Checking...";

    try {
        const response = await fetch('statusdeck.db', { 
            method: 'HEAD',
            cache: 'no-store'     // ← important: prevent browser from caching HEAD forever
        });

        if (!response.ok) {
            throw new Error(`Server responded ${response.status} ${response.statusText}`);
        }

        const lastModifiedStr = response.headers.get('last-modified');

        if (!lastModifiedStr) {
            throw new Error("No Last-Modified header received from server");
        }

        // Parse the GMT/UTC string from server
        const date = new Date(lastModifiedStr);

        // Safety check: invalid date?
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date parsed from Last-Modified header");
        }

        // Format using explicit PKT timezone (Asia/Karachi = PKT, no DST)
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Karachi'
        });

        const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'Asia/Karachi'
        });

        // Apply values
        timeEl.textContent  = timeStr;
        dateEl.textContent  = dateStr;

    } catch (err) {
        console.warn("Failed to load last sync time:", err.message || err);

        timeEl.textContent  = "—";
        dateEl.textContent  = "Unavailable";

        // Optional: show more info in console only
        console.debug("Full error:", err);
    }
}


    function updateDistrictFilter(selectedProvince) {
        const districtSelect = document.getElementById('District_Filter');
        districtSelect.innerHTML = '<option value="All">All Districts</option>';

        if (selectedProvince === 'All') {
            const uniqueDistricts = [...new Set(trainingData.map(item => item.District).filter(Boolean))].sort();
            uniqueDistricts.forEach(district => {
                districtSelect.add(new Option(district, district));
            });
        } else {
            const provinceDistricts = [...new Set(
                trainingData
                    .filter(item => {
                        const standardizedProvince = config.provinceNameMap[item.Province] || item.Province;
                        return standardizedProvince === selectedProvince;
                    })
                    .map(item => item.District)
                    .filter(Boolean)
            )].sort();
            provinceDistricts.forEach(district => {
                districtSelect.add(new Option(district, district));
            });
        }
    }

    function populateFilters(data) {
        const provinceFilter = document.getElementById('provinceFilter');
        const uniqueProvinces = [...new Set(data.map(item => config.provinceNameMap[item.Province] || item.Province).filter(p => config.provinces[p]))].sort();
        const createOptions = (select, options, firstOption) => {
            select.innerHTML = `<option value="All">${firstOption}</option>`;
            options.forEach(opt => select.add(new Option(opt, opt)));
        };
        createOptions(provinceFilter, uniqueProvinces, 'All Provinces');

        updateDistrictFilter('All');
    }

let currentLayer = 'street'; // default
let isHeatmapActive = false;

function initializeMap() {
    if (map) map.remove();

    // Nicer tiles (you can choose others too)
    const street = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> & contributors',
        maxZoom: 19
    });

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
    });

    // Another beautiful option (uncomment if you prefer)
    // const terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
    //     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
    //     maxZoom: 18
    // });

    map = L.map('map', {
        zoomControl: false,           // we'll add custom one
        attributionControl: true,
        layers: [street]
    }).setView([30.3753, 69.3451], 5.8);  // slightly higher zoom for better overview

    // Add zoom control in top-left
    L.control.zoom({
        position: 'topleft'
    }).addTo(map);

    // Layer control (optional - but we have custom buttons now)
    // L.control.layers({
    //     "Street": street,
    //     "Satellite": satellite
    // }, {}, { position: 'topright' }).addTo(map);

    // Markers & Heat layer
    markers = L.featureGroup().addTo(map);

    heatLayer = L.heatLayer([], {
        radius: 28,
        blur: 20,
        maxZoom: 17,
        gradient: {
            0.2: '#3b82f6',    // blue
            0.45: '#22c55e',   // green
            0.65: '#f59e0b',   // yellow
            0.85: '#ef4444'    // red
        },
        minOpacity: 0.35,
        max: 1.0
    });

    // Custom layer toggle buttons
    const layerButtons = document.querySelectorAll('#layerToggle .layer-btn');
    layerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            layerButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const layerType = btn.dataset.layer;
            if (layerType === 'street') {
                map.removeLayer(satellite);
                map.addLayer(street);
                currentLayer = 'street';
            } else if (layerType === 'satellite') {
                map.removeLayer(street);
                map.addLayer(satellite);
                currentLayer = 'satellite';
            }
        });
    });

    // Make street active by default
    document.querySelector('[data-layer="street"]').classList.add('active');

    // Heatmap toggle
    document.getElementById('toggleHeatmap').addEventListener('click', () => {
        const btn = document.getElementById('toggleHeatmap');
        if (isHeatmapActive) {
            map.removeLayer(heatLayer);
            map.addLayer(markers);
            btn.classList.remove('active');
            btn.querySelector('span').textContent = 'Heatmap';
        } else {
            map.removeLayer(markers);
            map.addLayer(heatLayer);
            btn.classList.add('active');
            btn.querySelector('span').textContent = 'Markers';
        }
        isHeatmapActive = !isHeatmapActive;
    });
}

    function updateDashboard() {
        const filteredData = getFilteredData();
        preProcessAllData(filteredData);
        updateKPIs();
        updateMapAndHeatmap();
        updateLeaderboard();
        updateProvincialRanking();
        updateMonthlyTrendChart();
        const provinceFilterValue = document.getElementById('provinceFilter').value;
        document.getElementById('provincialCardFilter').textContent = provinceFilterValue;
        updateProvincialSummaryContent(provinceFilterValue);
    }

    function animateValue(obj, end, duration) {
        let start = parseInt(obj.textContent.replace(/,/g, '') || '0');
        if (start === end) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.textContent = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
        const topDistrict = Object.entries(districtDataSummary).map(([name, stats]) => ({
        name,
        ...stats,
    target_pct: (stats.beneficiaries / (stats.trainings * 30)) * 100 // Example: 30 beneficiaries per training
    })).sort((a, b) => b.beneficiaries - a.beneficiaries)[0];
    document.getElementById('topProvinceName').textContent = topDistrict?.name || 'N/A';
    document.getElementById('topProvincePct').textContent = `${(topDistrict?.target_pct || 0).toFixed(1)}% Target`;
    }

    function getRetentionFilteredData() {
    if (retentionPeriodFilter === 'all') {
        return trainingData;
    }

    return trainingData.filter(item => {
        const trainingDate = item.Training_Date;
        if (!trainingDate || isNaN(trainingDate.getTime())) return false;

        if (retentionPeriodFilter === 'before8jan') {
            return trainingDate < EIGHT_JAN_2026;
        } else if (retentionPeriodFilter === 'after8jan') {
            return trainingDate >= EIGHT_JAN_2026;
        }
        return true;
    });
}

   function getFilteredData() {
    const provinceFilter = document.getElementById('provinceFilter').value;
    const districtFilter = document.getElementById('District_Filter').value;

    return trainingData.filter(item => {
        const standardizedProvince = config.provinceNameMap[item.Province] || item.Province;
        
        const provinceMatch = (provinceFilter === 'All' || standardizedProvince === provinceFilter);
        const districtMatch = (districtFilter === 'All' || item.District === districtFilter);

        return provinceMatch && districtMatch;
    });
}

    function renderDonutChart(chartInstance, canvasId, percentage, color) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        if (chartInstance) chartInstance.destroy();
        const data = {
            labels: ['Achieved', 'Remaining'],
            datasets: [{
                data: [percentage, 100 - percentage],
                backgroundColor: [color, '#e5e7eb'],
                borderColor: ['#ffffff'],
                borderWidth: 2,
                circumference: 360,
            }]
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            animation: {
                animateRotate: true,
                duration: 1500
            }
        };
        return new Chart(ctx, { type: 'doughnut', data, options });
    }

    //update KPIs and provincial summary use this for double ring charts

function updateKPIs() {
    const data = getFilteredData();           
    const provinceFilter = document.getElementById('provinceFilter').value;

    // ── Calculate trainings (valid sessions only) ──────────────────────────
    let validTrainings = 0;

    data.forEach(session => {
        if (isValidTrainingSession(session)) {
            validTrainings++;
        }
    });

    // ── Calculate beneficiaries (unchanged) ────────────────────────────────
    const totalBeneficiaries = data.reduce((sum, session) => {
        return sum + (session.Beneficiary_Count_Actual || 0);
    }, 0);

    const totalVerified = data.reduce((sum, session) => {
        return sum + session.Beneficiaries_Details.filter(b => b.verified_retention === true).length;
    }, 0);

    // ── Get targets ────────────────────────────────────────────────────────
    let targetBeneficiaries, targetTrainings;
    if (provinceFilter === 'All') {
        targetBeneficiaries = config.totalProjectTargetBeneficiaries;
        targetTrainings = Object.values(config.provinces).reduce((s, p) => s + (p.target_trainings || 0), 0);
    } else {
        targetBeneficiaries = config.provinces[provinceFilter]?.target_beneficiaries || 0;
        targetTrainings = config.provinces[provinceFilter]?.target_trainings || 0;
    }

    // ── Update text values with animation ──────────────────────────────────
    animateValue(document.getElementById('totalBeneficiaries'), totalBeneficiaries, 1000);
    animateValue(document.getElementById('totalVerified'), totalVerified, 1000);
    document.getElementById('beneficiaryOverallTarget').textContent = targetBeneficiaries.toLocaleString();

    // Trainings – only total valid trainings
    animateValue(document.getElementById('totalTrainings'), validTrainings, 1000);
    document.getElementById('trainingOverallTarget').textContent = targetTrainings.toLocaleString();

    // ── Calculate percentages (cap at 100%) ────────────────────────────────
    const beneficiaryPct    = Math.min(100, targetBeneficiaries > 0 ? (totalBeneficiaries / targetBeneficiaries) * 100 : 0);
    const verifiedBenefPct  = Math.min(100, targetBeneficiaries > 0 ? (totalVerified / targetBeneficiaries) * 100 : 0);

    const trainingPct = Math.min(100, targetTrainings > 0 ? (validTrainings / targetTrainings) * 100 : 0);

    // ── Render charts ──────────────────────────────────────────────────────
    // Beneficiaries – double ring (total + verified) – unchanged
    beneficiariesDonutChart = renderDoubleDonutChart(
        beneficiariesDonutChart,
        'beneficiariesDonutChart',
        beneficiaryPct,
        verifiedBenefPct
    );

    // Trainings – single ring only (total valid trainings %)
    trainingsDonutChart = renderDonutChart(          // ← using the single-ring version
        trainingsDonutChart,
        'trainingsDonutChart',
        trainingPct,
        '#10b981'   // green – or change to '#4f46e5' to match beneficiaries style
    );
}


    function renderDoubleDonutChart(chartInstance, canvasId, outerPct, innerPct) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    if (chartInstance) chartInstance.destroy();

    const data = {
        datasets: [
            // Outer ring: Total Beneficiaries (blue)
            {
                data: [outerPct, 100 - outerPct],
                backgroundColor: ['#4f46e5', '#e5e7eb'],
                borderColor: ['#ffffff'],
                borderWidth: 2,
                weight: 20,           // thicker outer ring
            },
            // Inner ring: Verified (green)
            {
                data: [innerPct, 100 - innerPct],
                backgroundColor: ['#10b981', '#e5e7eb'],
                borderColor: ['#ffffff'],
                borderWidth: 2,
                weight: 12,           // thinner inner ring
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',               // space for inner ring
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        if (context.datasetIndex === 0) {
                            return `Total: ${context.parsed} %`;
                        } else {
                            return `Verified: ${context.parsed} %`;
                        }
                    }
                }
            }
        },
        animation: {
            animateRotate: true,
            duration: 1800
        }
    };

    return new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

    function updateMapAndHeatmap() {
        const provinceFilter = document.getElementById('provinceFilter').value;
        const districtFilter = document.getElementById('District_Filter').value;

        const filteredTrainers = trainerData.filter(t => {
          const standardizedProvince = config.provinceNameMap[t.province] || t.province;
          return (provinceFilter === 'All' || standardizedProvince === provinceFilter) &&
                 (districtFilter === 'All' || t.district === districtFilter);
        });

        markers.clearLayers();
        const heatPoints = [];

        if (filteredTrainers.length > 0) {
          const maxBenef = Math.max(...filteredTrainers.map(t => trainerBenefCounts[t.trainer_name] || 0), 1);

          filteredTrainers.forEach(t => {
            const lat = t['session_location-Latitude'];
            const lon = t['session_location-Longitude'];
            if (!lat || !lon) return;

            const intensity = (trainerBenefCounts[t.trainer_name] || 0) / maxBenef;
            heatPoints.push([lat, lon, intensity]);

            const count = trainerBenefCounts[t.trainer_name] || 0;
            const pinColor = getProvinceColor(t.province);
            const markerSize = 36;
            const markerIcon = L.divIcon({
                html: `<svg class="map-pin" width="${markerSize}" height="${markerSize}" viewBox="0 0 24 24" fill="${pinColor}" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0C7.589 0 4 3.589 4 8c0 4.411 8 16 8 16s8-11.589 8-16c0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                         </svg>`,
                className: '',
                iconSize: [markerSize, markerSize],
                iconAnchor: [markerSize / 2, markerSize]
            });

            const currentLocation = t.tehsil ? `${t.tehsil}, ${t.district}` : t.district || 'N/A';
            const popupContent = `
                <div style="min-width: 200px;">
                    <strong style="color: #4f46e5; font-size: 16px; display: block; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 4px;">Trainer Details</strong>
                    <b>Trainer Name:</b> ${t.trainer_name}<br>
                    <b>Province:</b> ${t.province}<br>
                    <b>District:</b> ${t.district}<br>
                    <b>Total Beneficiaries:</b> ${count}<br>
                    <b>Location:</b> ${currentLocation}<br>
                    <b>Coordinates:</b> ${lat.toFixed(4)}, ${lon.toFixed(4)}<br>
                </div>
            `;
            L.marker([lat, lon], { icon: markerIcon }).bindPopup(popupContent).addTo(markers);
          });

          if (markers.getLayers().length > 0) {
            map.fitBounds(markers.getBounds().pad(0.1));
          } else {
            map.setView([30.3753, 69.3451], 5.5);
          }
        } else {
          map.setView([30.3753, 69.3451], 5.5);
        }

        heatLayer.setLatLngs(heatPoints);
    }


// Add near other globals
let retentionPeriodFilter = 'all'; // 'all' | 'before8jan' | 'after8jan'
const EIGHT_JAN_2026 = new Date(2026, 0, 8); // January 8, 2026 – adjust year if needed

function updateProvincialSummaryContent(selectedProvinceName) {
    const contentEl = document.getElementById('provincialSummaryContent');
    const titleEl   = document.getElementById('provincialSummaryTitle');

    // Use province + district filter + retention period filter
    const baseFiltered = getFilteredData(); // province + district only
    const retentionFiltered = getRetentionFilteredData(); // period filter only

    // Intersect: only sessions that match BOTH current province/district AND the selected period
    const filtered = baseFiltered.filter(session => 
        retentionFiltered.includes(session)
    );

    if (filtered.length === 0) {
        contentEl.innerHTML = `<p class="text-gray-500 text-sm text-center">No data available for the selected area & period.</p>`;
        if (occupationsHorizontalBarChart) occupationsHorizontalBarChart.destroy();
        if (ageDistributionChart) ageDistributionChart.destroy();
        return;
    }

    // ── Aggregate ────────────────────────────────────────────────────────
    let totalBenef = 0;
    let totalTrainings = filtered.length;
    let rawSum = 0;
    let verifiedSum = 0;
    let sessionCount = 0;

    const occupations = {};
    const ages = Object.fromEntries(Object.keys(config.ageColors).map(k => [k, 0]));

    filtered.forEach(session => {
        totalBenef += session.Beneficiary_Count_Actual || 0;
        rawSum     += session.Raw_Retention_Rate_Pct     || 0;
        verifiedSum += session.Verified_Retention_Rate_Pct || 0;
        sessionCount++;

        Object.entries(session.Female_Occupations || {}).forEach(([occ, cnt]) => {
            occupations[occ] = (occupations[occ] || 0) + cnt;
        });

        session.Beneficiaries_Details.forEach(b => {
            let group = 'Unknown';
            const age = Number(b.age);
            if (!isNaN(age)) {
                if      (age <= 29) group = '18-29';
                else if (age <= 39) group = '30-39';
                else if (age <= 49) group = '40-49';
                else if (age <= 59) group = '50-59';
                else                group = '60+';
            }
            ages[group]++;
        });
    });

    const avgRaw     = sessionCount > 0 ? rawSum / sessionCount : 0;
    const avgVerified = sessionCount > 0 ? verifiedSum / sessionCount : 0;

    const displayName = selectedProvinceName === 'All' ? 'All Provinces' : selectedProvinceName;
    titleEl.textContent = `Performance Overview – ${displayName}`;

    // ── Build HTML ────────────────────────────────────────────────────────
    contentEl.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-100 p-4 rounded-lg">
            <h4 class="text-sm text-gray-600">Total Beneficiaries</h4>
            <p class="text-2xl font-bold text-indigo-600">${totalBenef.toLocaleString()}</p>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg">
            <h4 class="text-sm text-gray-600">Total Trainings</h4>
            <p class="text-2xl font-bold text-teal-600">${totalTrainings.toLocaleString()}</p>
        </div>
        
        <div class="bg-gray-100 p-4 rounded-lg col-span-2">
            <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm text-gray-600 font-medium">Retention Rate</h4>
                <div class="inline-flex rounded-md shadow-sm ring-1 ring-gray-200" role="group">
                    <button type="button" class="period-btn px-3.5 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 ${retentionPeriodFilter==='before8jan' ? 'active' : ''}">Before 8 Jan</button>
                    <button type="button" class="period-btn px-3.5 py-1.5 text-xs font-medium bg-white border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-50 ${retentionPeriodFilter==='after8jan' ? 'active' : ''}">After 8 Jan</button>
                </div>
            </div>

            <div class="flex items-center justify-around text-center mt-4 gap-6">
                <div>
                    <div class="text-xs text-gray-500 uppercase tracking-wider font-medium">Proclaimed</div>
                    <div class="text-3xl font-extrabold text-yellow-600 mt-2">
                        ${avgRaw.toFixed(1)}%
                    </div>
                </div>
                <div class="h-12 border-l border-gray-300"></div>
                <div>
                    <div class="text-xs text-gray-500 uppercase tracking-wider font-medium">Verified</div>
                    <div class="text-3xl font-extrabold text-emerald-600 mt-2">
                        ${avgVerified.toFixed(1)}%
                    </div>
                </div>
            </div>
        </div>

        <!-- occupations & age charts remain the same -->
        <div class="p-4 bg-white rounded-lg flex flex-col min-h-[250px]">
            <h4 class="text-md font-bold text-gray-800">Top Occupations</h4>
            <div class="chart-container"><canvas id="occupationsHorizontalBarChart"></canvas></div>
        </div>
        <div class="p-4 bg-white rounded-lg flex flex-col min-h-[250px]">
            <h4 class="text-md font-bold text-gray-800">Age Distribution</h4>
            <div class="chart-container"><canvas id="ageDistributionChart"></canvas></div>
        </div>
    </div>`;

    renderOccupationsHorizontalBarChart(occupations);
    renderAgeDistributionChart(ages);
}
    function renderOccupationsHorizontalBarChart(occupations) {
        const ctx = document.getElementById('occupationsHorizontalBarChart').getContext('2d');
        if (occupationsHorizontalBarChart) occupationsHorizontalBarChart.destroy();
        const sortedOccupations = Object.entries(occupations).sort(([,a],[,b]) => b-a).slice(0, 7);
        occupationsHorizontalBarChart = new Chart(ctx, {
            type: 'bar',
            data: { labels: sortedOccupations.map(o => o[0]), datasets: [{ data: sortedOccupations.map(o => o[1]), backgroundColor: '#4c51bf' }] },
            options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { display: false } } }
        });
    }

    function renderAgeDistributionChart(ageData) {
        const ctx = document.getElementById('ageDistributionChart').getContext('2d');
        if (ageDistributionChart) ageDistributionChart.destroy();
        ageDistributionChart = new Chart(ctx, {
            type: 'bar',
            data: { labels: Object.keys(ageData), datasets: [{ data: Object.values(ageData), backgroundColor: Object.values(config.ageColors) }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { display: false } } }
        });
    }

    function initializeCharts() {
        if (monthlyTrendChart) monthlyTrendChart.destroy();
        const ctx = document.getElementById('monthlyTrendChart').getContext('2d');
        monthlyTrendChart = new Chart(ctx, {
            type: 'bar',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { display: true } },
                scales: {
                    x: { type: 'time', time: { unit: 'day' }, grid: { drawBorder: false, color: '#eef2f5' } },
                    y: { type: 'linear', display: true, position: 'left', beginAtZero: true, title: { display: true, text: 'Beneficiaries' }, grid: { drawBorder: false, color: '#eef2f5' } },
                    y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: 'Trainings' }, grid: { drawOnChartArea: false } }
                }
            }
        });
    }

    function updateMonthlyTrendChart() {
        const data = getFilteredData();
        const activeBtn = document.querySelector('.monthly-trend-card .chart-filter-button.active');
        const unit = activeBtn ? activeBtn.dataset.unit : 'day';
        const aggregatedData = data.reduce((acc, item) => {
            const date = item.Training_Date;
            if (!date || isNaN(date.getTime())) return acc;
            const key = unit === 'day' ? date.toISOString().split('T')[0] : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
            if (!acc[key]) acc[key] = { beneficiaries: 0, trainings: 0 };
            acc[key].beneficiaries += item.Beneficiary_Count_Actual;
            acc[key].trainings += 1;
            return acc;
        }, {});
        const sortedKeys = Object.keys(aggregatedData).sort();
        monthlyTrendChart.data.labels = sortedKeys;
        monthlyTrendChart.data.datasets = [
            { type: 'bar', label: 'Beneficiaries', data: sortedKeys.map(key => aggregatedData[key].beneficiaries), backgroundColor: 'rgba(79, 70, 229, 0.8)', borderColor: '#4f46e5', borderWidth: 1, yAxisID: 'y' },
            { type: 'line', label: 'Trainings', data: sortedKeys.map(key => aggregatedData[key].trainings), borderColor: '#f97316', backgroundColor: '#f97316', borderWidth: 3, tension: 0.4, fill: false, yAxisID: 'y1' }
        ];
        monthlyTrendChart.options.scales.x.time.unit = unit;
        monthlyTrendChart.update();
    }

function updateProvincialRanking() {
    const sortMetric = document.querySelector('.provincial-ranking-card .chart-filter-button.active').dataset.sortMetric;
    const tableBody = document.getElementById('provincialRankingTableBody');
    const tableHead = document.querySelector('#rankingTable thead');
    
    let rowsHTML = '';
    let totalBeneficiaries = 0;
    let totalTrainings = 0;

    // Define the extra count once (easy to change later)
    const extraBeneficiaries = 461;

    if (sortMetric === 'district') {
        tableHead.innerHTML = `
            <tr>
                <th class="px-4 py-2">Rank</th>
                <th class="px-4 py-2">District</th>
                <th class="px-4 py-2">Trainings</th>
                <th class="px-4 py-2">Beneficiaries</th>
            </tr>`;

        const districtFilter = document.getElementById('District_Filter').value;
        let filteredDistricts = Object.entries(districtDataSummary);

        if (districtFilter !== 'All') {
            filteredDistricts = filteredDistricts.filter(([name]) => name === districtFilter);
        }

        const sorted = filteredDistricts
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.beneficiaries - a.beneficiaries);

        rowsHTML = sorted.map((item, i) => {
            totalBeneficiaries += item.beneficiaries;
            totalTrainings += item.trainings;

            return `
                <tr class="border-b">
                    <td class="px-4 py-2">${i + 1}</td>
                    <td class="px-4 py-2">${item.name}</td>
                    <td class="px-4 py-2">${item.trainings.toLocaleString()}</td>
                    <td class="px-4 py-2">${item.beneficiaries.toLocaleString()}</td>
                </tr>`;
        }).join('');

        // District TOTAL row – add extra 461 only if showing all districts
        const displayBenefTotal = (districtFilter === 'All')
            ? totalBeneficiaries + extraBeneficiaries
            : totalBeneficiaries;

        rowsHTML += `
            <tr class="bg-gray-100 font-bold border-t-2 border-gray-300">
                <td class="px-4 py-2 text-right" colspan="2">TOTAL</td>
                <td class="px-4 py-2">${totalTrainings.toLocaleString()}</td>
                <td class="px-4 py-2">${displayBenefTotal.toLocaleString()}</td>
            </tr>`;
    } else {
        // Province view
        tableHead.innerHTML = `
            <tr>
                <th class="px-4 py-2">Rank</th>
                <th class="px-4 py-2">Province</th>
                <th class="px-4 py-2">Beneficiaries</th>
                <th class="px-4 py-2">Trainings</th>
                <th class="px-4 py-2">Target %</th>
            </tr>`;

        const sorted = [...provincialRankingsData].sort((a, b) => {
            if (sortMetric === 'beneficiaries') return b.beneficiaries - a.beneficiaries;
            if (sortMetric === 'trainings') return b.trainings - a.beneficiaries;
            return b.beneficiary_target_pct - a.beneficiary_target_pct;
        });

        rowsHTML = sorted.map((item, i) => {
            totalBeneficiaries += item.beneficiaries;
            totalTrainings += item.trainings;

            const pct = Math.min(100, item.beneficiary_target_pct);
            const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';

            return `
                <tr class="border-b">
                    <td class="px-4 py-2">${i + 1}</td>
                    <td class="px-4 py-2">${item.province}</td>
                    <td class="px-4 py-2">${item.beneficiaries.toLocaleString()}</td>
                    <td class="px-4 py-2">${item.trainings.toLocaleString()}</td>
                    <td class="px-4 py-2">
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="${color} h-2.5 rounded-full" style="width: ${pct}%"></div>
                        </div>
                        <span class="text-xs">${item.beneficiary_target_pct.toFixed(1)}%</span>
                    </td>
                </tr>`;
        }).join('');

        // Province TOTAL row – always add the extra 461 (since it's summing all provinces)
        rowsHTML += `
            <tr class="bg-gray-100 font-bold border-t-2 border-gray-300">
                <td class="px-4 py-2 text-right" colspan="2">TOTAL</td>
                <td class="px-4 py-2">${(totalBeneficiaries + extraBeneficiaries).toLocaleString()}</td>
                <td class="px-4 py-2">${totalTrainings.toLocaleString()}</td>
                <td class="px-4 py-2">—</td>
            </tr>`;
    }

    tableBody.innerHTML = rowsHTML;
}

    function updateLeaderboard() {
        const tableBody = document.getElementById('leaderboardTableBody');
        if (leaderboardData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">No trainer data for this month yet.</td></tr>`;
            return;
        }
        tableBody.innerHTML = leaderboardData.map((item, i) => {
            const pct = Math.min(100, item.target_pct);
            const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';
            return `<tr class="border-b"><td class="px-4 py-2">${i+1}</td><td class="px-4 py-2">${item.name}</td><td class="px-4 py-2">${item.beneficiaries.toLocaleString()}</td><td class="px-4 py-2"><div class="w-full bg-gray-200 rounded-full h-2.5"><div class="${color} h-2.5 rounded-full" style="width: ${pct}%"></div></div><span class="text-xs">${item.target_pct.toFixed(1)}%</span></td></tr>`;
        }).join('');
    }

    function typewriterEffect(element, parts, duration) {
        element.innerHTML = '';
        let totalLength = parts.reduce((acc, part) => acc + part.text.length, 0);
        let delayPerChar = duration / totalLength;
        let currentHTML = '';
        let totalDelay = 0;
        parts.forEach(part => {
            for (let i = 0; i < part.text.length; i++) {
                setTimeout(() => {
                    currentHTML += (i === 0) ? `<span class="${part.class || ''}">${part.text[i]}` : part.text[i];
                    if (i === part.text.length - 1) currentHTML += '</span>';
                    element.innerHTML = currentHTML + '<span class="cursor">&nbsp;</span>';
                }, totalDelay);
                totalDelay += delayPerChar;
            }
        });
        setTimeout(() => {
            element.innerHTML = element.innerHTML.replace(/<span class="cursor">.*?<\/span>/, '');
        }, totalDelay + 100);
    }

    function startWelcomeAnimation(isFirstLogin = true) {
        const welcomeOverlay = document.getElementById('welcome-overlay');
        welcomeOverlay.style.display = 'flex';
        const titleParts = [
            { text: 'DFLT Dashboard | ' },
            { text: 'EU, '},
            { text: 'GIZ' },
            { text: ' & ' },
            { text: 'SDPI'},
        ];
        setTimeout(() => typewriterEffect(document.getElementById('welcome-title'), titleParts, 2000), 1500);
        const welcomeScreenDuration = isFirstLogin ? 5000 : 4000;
        setTimeout(() => {
            welcomeOverlay.style.opacity = '0';
            setTimeout(() => {
                welcomeOverlay.style.display = 'none';
                welcomeOverlay.style.opacity = '1';
                document.getElementById('dashboard-content').style.display = 'grid';
                initializeDashboardAndAutoUpdate();
            }, 1000);
        }, welcomeScreenDuration);
    }

    async function initializeDashboardAndAutoUpdate() {
        await initDatabase();
        showLastSyncTime();
        await loadDataAndInitialize();
        setInterval(updateTime, 1000);
        setInterval(() => location.reload(), 300000);
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const passwordOverlay = document.getElementById('password-overlay');
        const welcomeOverlay = document.getElementById('welcome-overlay');
        const submitPasswordBtn = document.getElementById('submitPassword');
        const passwordInput = document.getElementById('passwordInput');
        const usernameInput = document.getElementById('usernameInput');

        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebarOverlay = document.getElementById('sidebar-overlay');

        const toggleSidebar = () => {
            document.body.classList.toggle('sidebar-open');
        };
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
        sidebarOverlay.addEventListener('click', toggleSidebar);

        await loadCredentials();

        if (sessionStorage.getItem('isVerified') === 'true') {
            const storedRole = sessionStorage.getItem('userRole') || 'limited';
            updateSidebarAccess(storedRole);
            passwordOverlay.style.display = 'none';
            startWelcomeAnimation(false);
            return;
        }

        const handleLogin = () => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const userCred = credentials[username];
            if (userCred && userCred.password === password) {
                sessionStorage.setItem('isVerified', 'true');
                sessionStorage.setItem('userRole', userCred.role);
                updateSidebarAccess(userCred.role);
                usernameInput.value = '';
                passwordInput.value = '';
                passwordOverlay.style.opacity = '0';
                setTimeout(() => {
                    passwordOverlay.style.display = 'none';
                    startWelcomeAnimation(true);
                }, 500);
            } else {
                document.getElementById('passwordError').classList.remove('hidden');
                const form = passwordOverlay.querySelector('.password-form');
                form.classList.add('shake-error');
                setTimeout(() => form.classList.remove('shake-error'), 500);
                setTimeout(() => document.getElementById('passwordError').classList.add('hidden'), 3000);
            }
        };
        submitPasswordBtn.addEventListener('click', handleLogin);
        passwordInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleLogin());
        usernameInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleLogin());
    });

    function getRetentionFilteredData() {
    if (retentionPeriodFilter === 'all') {
        return trainingData;
    }

    return trainingData.filter(item => {
        const trainingDate = item.Training_Date;
        if (!trainingDate || isNaN(trainingDate.getTime())) return false;

        if (retentionPeriodFilter === 'before8jan') {
            return trainingDate < EIGHT_JAN_2026;
        } else if (retentionPeriodFilter === 'after8jan') {
            return trainingDate >= EIGHT_JAN_2026;
        }
        return true;
    });
}