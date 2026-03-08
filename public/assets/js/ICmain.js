// Config for targets
const config = {
    totalProjectTargetSessions: 100,
    totalProjectTargetBeneficiaries: 10000,
    icTargetSessions: 20,
    provinces: {
    'Sindh': { target_beneficiaries: 300000, target_trainings:15000 },
    },
    BEN_PER_TRAINING: 20,
};
let currentUser = sessionStorage.getItem('username') || '';
// XLSX Parsing for Beneficiary Data
const TrainerLocation = {
    'Abida_Parveen': '27.17267, 67.82603',
    'Adila_Parveen': '32.34068, 71.87737',
    'Afsari_Ahmad': '30.20661, 71.47391',
    'Ahsanulhaq': '35.03617, 72.89836',
    'Ajwa_Zafar': '29.50258, 71.23458',
    'Aliya_Sultan': '34.29049, 71.65115',
    'Amna_Liaqat': '29.99450, 73.26559',
    'Ana_Kanwal': '32.29042, 71.37193',
    'Anam_Zai': '25.39033, 68.27472',
    'Aneela_Basheer': '31.61777, 71.08912',
    'Aneela_Mansoor': '25.31514, 68.42306',
    'Anees_Fatima': '32.74260, 71.94432',
    'Ansa_Nasren_Bano': '26.84044, 68.10669',
    'Ansa_Qaisar_Mehmood': '32.00903, 74.21667',
    'Aqsa_Azam': '32.42525, 73.57263',
    'Aqsa_Naeem': '28.65436, 70.64230',
    'Areesha_Naz': '29.51016, 71.63867',
    'Arshad_Iqbal': '32.10567, 70.96895',
    'Asia': '27.54099, 68.75265',
    'Asima_Bibi': '33.98926, 72.95897',
    'Asma_Razaq': '31.46491, 74.30662',
    'Asma_Shakir': '34.00781, 72.11988',
    'Asmat_Darwaish': '34.93916, 72.47253',
    'Atif_Khan': '33.01816, 70.69294',
    'Atika_Siddique': '32.25888, 75.16235',
    'Ayesha_Ishfaq': '31.80364, 71.10887',
    'Ayesha_Parveen': '31.06478, 72.95308',
    'Bas_Khatoon': '30.23367, 67.01304',
    'Beenish_Murtaza': '33.52741, 71.06491',
    'Bushra': '32.81772, 73.85718',
    'Bushra_Naz': '30.96033, 70.96293',
    'Bushra_Saeed': '28.37971, 68.35198',
    'Donia_Gul': '34.16826, 73.23277',
    'Faiza_Batool': '33.41737, 73.37234',
    'Farah': '27.69012, 68.88457',
    'Farida_Bibi': '30.16179, 72.70268',
    'Farman_Ullah': '34.98574, 72.03558',
    'Farzana_Kaukab': '34.16834, 73.23262',
    'Farzana_Perveen': '29.80907, 72.17668',
    'Fatima_Younas': '34.03039, 71.60138',
    'Fouzia_Bashir': '31.39001, 71.43988',
    'Fozia_Bashir': '34.16819, 73.23279',
    'Fozia_Iqbal': '33.57241, 72.64671',
    'Fozia_Zawar': '29.40432, 70.92857',
    'Ghazala_Jabeen': '33.58802, 73.09801',
    'Gul_E_Lala': '29.51019, 71.63857',
    'Hafiza_Bushra': '29.40437, 70.92848',
    'Hafsa_Fiaz': '33.25108, 72.27276',
    'Hajra_Bibi': '34.66601, 73.04755',
    'Haleema_Bibi_': '31.54542, 70.76183',
    'Hansa': '34.53139, 72.27634',
    'Haroon_Akbar': '34.01088, 71.76275',
    'Haseena': '30.23995, 66.98768',
    'Humaira_Aslam': '29.50260, 71.23454',
    'Humaira_Mustafa': '30.15991, 73.56671',
    'Husna_Bibi': '34.73996, 71.53219',
    'Hyder_Zameer': '34.35316, 73.20004',
    'Iqra_Asad': '31.89011, 73.26566',
    'Iqra_Liaqat': '33.71978, 73.07667',
    'Iram_Karamat': '31.47033, 74.10312',
    'Ishrat_Ayub': '34.21311, 71.55070',
    'Jameela': '26.30035, 68.10947',
    'Kainat_Hayat': '34.21313, 71.55068',
    'Kashaf_Zafar': '30.34896, 73.38541',
    'Kashmala_Liaqat': '29.11643, 71.75172',
    'Kausar_Peveen': '31.17464, 72.09857',
    'Khair_Ul_Shahab': '35.85354, 71.78319',
    'Kinza_Bibi': '33.76597, 72.35974',
    'Kinza_Rani': '34.05537, 73.16488',
    'Kishwar_Fatima': '26.87079, 68.35394',
    'Komal': '27.10208, 68.40879',
    'Kousar_Parveen': '30.66723, 73.13671',
    'Madiha_Siddiqui': '24.81538, 67.04724',
    'Mafia_Niamat': '30.16179, 72.70267',
    'Mafia_Waris': '31.55099, 74.42827',
    'Mahnoor_Begum': '33.39041, 71.33484',
    'Maira_Abbas': '32.16790, 74.19392',
    'Maria_Rehman': '32.26543, 72.90778',
    'Mariyam': '26.76003, 69.12567',
    'Maryam_Anayat': '33.58820, 73.09774',
    'Maryam_Yasir': '33.64376, 73.09211',
    'Mehak_Basheer': '24.93194, 67.06494',
    'Mehreen_Hussain': '31.84198, 70.90013',
    'Mehwish_Bibi': '30.68464, 74.07571',
    'Mehwish_Imran': '34.11741, 72.46445',
    'Mehwish_Ramzan': '29.63277, 71.90300',
    'Minahil_Asim': '32.41682, 74.11894',
    'Misbah_Faiz': '30.96030, 70.96285',
    'Misbah_Mujahid': '30.25561, 71.48777',
    'Moazma_Ayesha': '32.59058, 71.53909',
    'Momina_Ghafar': '31.40650, 73.13972',
    'Muhammad_Islam': '26.29449, 63.08155',
    'Muhammad_Nadeem': '34.00760, 72.11982',
    'Muhammad_Shaheen_Zada': '33.17008, 71.25317',
    'Muhammad_Umair': '31.84923, 70.89539',
    'Muqadas_Bibi': '30.04086, 72.35835',
    'Muqadas_Shafique': '30.86955, 73.59753',
    'Nadia_Hameed': '32.68403, 71.27653',
    'Nadia_Lal_Hameed': '34.05714, 71.51058',
    'Nadia_Nawaz': '34.35242, 73.20105',
    'Nadia_Parveen': '32.81769, 73.85714',
    'Naila_Bibi': '33.01815, 70.69293',
    'Naila_Jabeen': '29.11645, 71.75176',
    'Najib_Ullah': '30.66490, 66.68553',
    'Najma_Parveen': '30.83546, 72.07481',
    'Naseer_Ahmed': '25.06499, 66.96288',
    'Nasreen_Akhtar': '27.10213, 68.40879',
    'Nasreen_Fatima': '32.05506, 72.71015',
    'Natasha_Batool': '35.85258, 71.78401',
    'Nayab_Siraj': '34.21115, 72.50754',
    'Nazish_Nawaz': '28.43481, 70.34769',
    'Nazmeen_Bibi': '32.81417, 70.78124',
    'Nimra_Sajjad': '29.91370, 71.31144',
    'Nosheen_Akhtar': '33.26921, 73.29350',
    'Nyla_Mubeen': '32.10902, 74.87893',
    'Qalab_Fatima': '26.87063, 68.35384',
    'Qandeel_Fatima': '30.30344, 71.91715',
    'Qandeel_Zahra': '31.72161, 72.99274',
    'Rabeea_Bukhari': '34.01081, 71.76279',
    'Rabia_Akhtar': '29.99445, 73.26556',
    'Razia_Mustafa': '30.66226, 73.66163',
    'Reehana_Ghaffar': '29.10643, 70.34872',
    'Riffat_Hamid': '29.10645, 70.34871',
    'Romina': '34.00580, 71.33754',
    'Rozina_Rafique': '24.93962, 66.99303',
    'Rubab': '31.44878, 73.71659',
    'Rukhsana_Bibi': '29.66286, 70.60145',
    'Rukhsana_Jamil': '24.91670, 67.25035',
    'Ruqia_Noor': '24.98855, 67.04075',
    'Saadia_Bibi': '29.66281, 70.60132',
    'Sabar_Tasleem': '33.00789, 71.07259',
    'Sabika_Zahra': '31.61775, 71.08916',
    'Sabina_Asif': '29.79799, 71.75350',
    'Sabira_Arif': '33.71049, 73.06531',
    'Sadaf_Ishfaq': '33.71054, 73.06527',
    'Sadaf_Kauser': '32.50076, 74.51645',
    'Sadaf_Momin': '34.01090, 71.76278',
    'Sadaf_Raheem': '24.81540, 67.04717',
    'Sadaf_Younas': '34.16842, 73.23263',
    'Saddiqa_Bibi': '34.54740, 73.34904',
    'Safeena_Zaman_Yousifzai': '24.84999, 67.20754',
    'Safia_Bibi': '30.90682, 71.50479',
    'Safia_Kanwal': '24.89409, 67.01938',
    'Sagheer_Ahmed': '30.10284, 67.93335',
    'Saima': '27.54099, 68.75262',
    'Saima_Bibi': '34.05538, 73.16487',
    'Saima_Munawar': '30.76490, 72.43639',
    'Saira_Mustafa': '30.45379, 70.97381',
    'Sajida': '34.82926, 73.05389',
    'Sajida_Kalhoro': '26.73870, 67.76818',
    'Sajida_Perveen': '31.72058, 72.99348',
    'Sameena': '27.86156, 69.10820',
    'Sami_Ullah': '32.61126, 70.90646',
    'Samina_Bibi': '34.03041, 71.60146',
    'Samina_Faiz': '28.43479, 70.34761',
    'Sarwat_Fatima': '33.25145, 72.27266',
    'Sayed_Mujtaba_Hussain': '33.91126, 70.09216',
    'Shabana_Batool': '29.86842, 70.63997',
    'Shagufta_Zubair': '30.90675, 71.50489',
    'Shahana_Gul': '34.11743, 72.46440',
    'Shaheen_Bibi': '30.07239, 71.18332',
    'Shahila_Hoor': '30.23367, 67.01306',
    'Shahista_Jabin': '30.72059, 70.65495',
    'Shahnaz_Begum': '32.87662, 70.65920',
    'Shakila_Bibi': '30.73267, 72.64389',
    'Shama': '24.86887, 67.29218',
    'Shameem_Taj': '33.74923, 70.96310',
    'Shamim_Bibi': '31.84201, 70.90016',
    'Shanza_Komal': '32.88935, 73.76058',
    'Shazia_Bibi': '34.48048, 72.48992',
    'Shazia_Naseer': '33.64322, 73.09207',
    'Shazia_Yaseen': '31.80362, 71.10886',
    'Shehla_Aqil': '33.57245, 72.64672',
    'Shehla_Habib': '29.50253, 71.23458',
    'Shehraz_Ahmed': '34.35242, 73.20105',
    'Shugufta_Naz': '31.06476, 72.95311',
    'Shumaila': '26.24966, 68.42484',
    'Sidra_Bashir': '33.71054, 73.06530',
    'Sidra_Naveed': '31.57660, 73.48371',
    'Sobia_Kanwal': '30.30344, 71.91713',
    'Sobia_Qaddus': '32.28678, 72.29202',
    'Sumaira_Shaukat': '30.07224, 71.18336',
    'Sumera': '24.95342, 67.13372',
    'Sumerea_Jihad': '33.97410, 71.47951',
    'Sumra_Sameena': '31.53167, 74.26425',
    'Syeda_Malika_Bukhari': '31.55100, 74.42829',
    'Tania_Shaheen': '31.25246, 72.36169',
    'Tasleem_Zohra': '32.92650, 72.42970',
    'Taslim_Jehan': '34.91770, 72.87318',
    'Tausif_Raza': '31.53174, 74.26420',
    'Ubaid_Aslam': '30.10573, 66.97828',
    'Umme_Habiba': '31.54526, 70.76175',
    'Uroosa_Abdul_Gfhafoor': '24.87942, 67.15214',
    'Usman': '34.35242, 73.20105',
    'Uzma_Atif': '32.41684, 74.11893',
    'Uzma_Aziz': '35.85253, 71.78408',
    'Uzma_Mujahid': '29.14267, 71.22890',
    'Uzma_Saeed': '30.20644, 71.47395',
    'Wajiha_Shafqat': '33.88618, 73.28329',
    'Zahida_Bibi': '34.95179, 71.68821',
    'Zainab_Manzoor': '28.65457, 70.64222',
    'Zareena': '30.10575, 66.97832',
    'Zohra': '24.87204, 66.98803',
    'Zubaida_Parveen': '34.73992, 71.53215',
    'Zubair_Ahmed': '27.81933, 66.60009',
    'Zulaikha_Khadija_Shah': '34.13470, 71.76210'
};
// Load CSV Data for Monitoring

// Function to download CSV file
function downloadCsv(filename, data, headers) {
    const csv = Papa.unparse({ fields: headers, data });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// Issue Status Management
function loadIssueStatusesFromStorage(data) {
    const stored = localStorage.getItem('issueStatuses');
    if (stored) {
        const statuses = JSON.parse(stored);
        data.forEach(row => {
            const storedStatus = statuses.find(s => s.uniqueId === row.uniqueId);
            if (storedStatus) {
                row.issue_status = storedStatus.status;
                row.statusUpdatedBy = storedStatus.updatedBy;
                row.statusUpdatedAt = storedStatus.updatedAt;
            }
        });
    }
}
function saveIssueStatusToStorage(uniqueId, status) {
    let stored = localStorage.getItem('issueStatuses');
    stored = stored ? JSON.parse(stored) : [];
    const update = {
        uniqueId,
        status,
        updatedBy: currentUser,
        updatedAt: new Date().toISOString()
    };
    const existing = stored.find(s => s.uniqueId === uniqueId);
    if (existing) {
        existing.status = status;
        existing.updatedBy = currentUser;
        existing.updatedAt = new Date().toISOString();
    } else {
        stored.push(update);
    }
    localStorage.setItem('issueStatuses', JSON.stringify(stored));
}
// Verified Visit Management
function loadVerifiedFromStorage(data) {
    const stored = localStorage.getItem('visitVerifies');
    if (stored) {
        const verifies = JSON.parse(stored);
        data.forEach(row => {
            const storedVerify = verifies.find(v => v.uniqueId === row.uniqueId);
            if (storedVerify) {
                row.verified = storedVerify.verified;
                row.verifyUpdatedBy = storedVerify.updatedBy;
                row.verifyUpdatedAt = storedVerify.updatedAt;
            }
        });
    }
}
function saveVerifiedToStorage(uniqueId, verified) {
    let stored = localStorage.getItem('visitVerifies');
    stored = stored ? JSON.parse(stored) : [];
    const update = {
        uniqueId,
        verified,
        updatedBy: currentUser,
        updatedAt: new Date().toISOString()
    };
    const existing = stored.find(s => s.uniqueId === uniqueId);
    if (existing) {
        existing.verified = verified;
        existing.updatedBy = currentUser;
        existing.updatedAt = new Date().toISOString();
    } else {
        stored.push(update);
    }
    localStorage.setItem('visitVerifies', JSON.stringify(stored));
}
// Toast Notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = isError ? 'error show' : 'show';
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Haversine formula - distance between two lat/lon points in kilometers
function getDistanceInKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // 1 decimal place
}

// Function to convert lat, lon to place name using Nominatim API
async function getPlaceName(lat, lon) {
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        return 'N/A';
    }
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&zoom=18`);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        if (data && data.display_name) {
            return data.display_name;
        } else {
            return `${lat.toFixed(7)}, ${lon.toFixed(7)}`;
        }
    } catch (error) {
        console.error('Geocoding failed for', lat, lon, ':', error);
        return `${lat.toFixed(7)}, ${lon.toFixed(7)}`;
    }
}


// Global Variables
let beneficiaryData = [];
let icData = [];
let aggregatedData = {};
let attendanceComplianceChart, monitoringChart, visitComplianceChart, visitsOverTimeChart;
let trainingHandbooksChart, trainersMobilesChart;
let icFormCharts = {};
let trainersData = [];
let globalTrainerTotalAttendance = {};
const CHART_COLORS_IC = {
    primary: '#4c51bf', secondary: '#667eea', tertiary: '#38a169',
    warning: '#ecc94b', danger: '#e53e3e', info: '#0bc5ea',
    lightGrey: '#e2e8f0', darkGrey: '#4a5568'
};
const CHART_COLORS = [
    '#FF6384', // Red
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF', // Purple
    '#FF9F40' // Orange
];
// Likert scales
const LIKERT_LABELS = {
    'B1-B6': ['Disagree', 'Neither', 'Agree', 'Strongly Agree', 'Not Applicable'],
    'B7-B11': ['Disagree', 'Neither', 'Agree', 'Strongly Agree', 'Not Applicable'],
    'B12-B15': ['Disagree', 'Neither', 'Agree', 'Strongly Agree', 'Not Applicable'],
    'C1-C3': ['Strongly Disagree', 'Disagree', 'Neither', 'Agree', 'Strongly Agree', 'Not Applicable'],
    'C4-C10': ['Strongly Disagree', 'Disagree', 'Neither', 'Agree', 'Strongly Agree', 'Not Applicable'],
    'D1-D8': ['Strongly Disagree', 'Disagree', 'Neither', 'Agree', 'Strongly Agree', 'Not Applicable'],
    'E1-E3': ['Strongly Disagree', 'Disagree', 'Neither', 'Agree', 'Strongly Agree', 'Not Applicable'],
    'F1': ['Very Engaged', 'Somewhat Engaged', 'Only Slightly Engaged', 'Not at all']
};
// Question labels from survey
const QUESTION_LABELS = {
    'B1-B6': [
        "The explanations provided in training were very clear and precise.",
        "The complex concepts (budgeting, saving, planning etc.) were explained in an easy to understand manner.",
        "Training content and material have been validated/ checked by the co-trainer/co-facilitator (Applicable if two facilitators were conducting the session)",
        "Messages on Birth Registration, Positive parenting, Climate Change & Gender Equality were effectively communicated.",
        "The Trainer covered the syllabus accurately and sequentially",
        "Were there any instances when the content was unclear or confusing? What were the topics or concepts that were hard to understand for participants? If yes, please provide details"
    ],
    'B7-B11': [
        "Training content and handbook were successful in addressing the specific learning needs of the participants?",
        "Real-life examples were provided to illustrate the relevance of the concepts.",
        "Participants frequently referred to their own financial experiences or challenges when discussing training topics?",
        "Participants asked questions or sought clarifications on topics that were directly applicable to their personal or professional financial needs?",
        "Participants appeared to be more confident in discussing digital financial tools and strategies by the end of the training"
    ],
    'B12-B15': [
        "The examples and scenarios presented in the training reflected diverse backgrounds and were relevant to all participants.",
        "The training materials were easy to navigate and understand, regardless of the participants' prior knowledge on the subject",
        "The training methodology was adjusted to ensure optimal participation and engagement from all participants",
        "The trainer managed time effectively and kept the sessions on track, making it easy to follow along."
    ],
    'C1-C3': [
        "The facilitator demonstrated a strong understanding of the subject matter.",
        "There were instances where the trainer struggled to address specific questions or concerns."
    ],
    'C4-C10': [
        "The trainer was effective in communicating complex concepts clearly and concisely?",
        "Trainer encouraged questions and discussions, fostering a participatory learning environment?",
        "Participants engaged and were attentive throughout the training.",
        "Used open-ended questions to generate the dialogue and use local examples.",
        "The trainer followed the narrative format and kept the characters of the handbook alive (Naila-Shumaila and Akbari-Asghari)",
        "There were no language barriers or challenges in understanding the trainer's instructions?",
        "Adjustments were made in response to feedback or identified areas of difficulty."
    ],
    'D1-D8': [
        "The trainer very effectively conveyed key concepts while using variety of interactive training methodologies (peer sharing, storytelling, group work, local examples, hands-on experience, mobile phone/ calculator/ fake currency, learning material on positive parenting, birth registration, climate change and gender equality etc)",
        "The trainer converted story-line content into ‘Role-Play’ sessions by participants",
        "The training environment was conducive/ friendly to learning?",
        "Paid attention and responded to the participants’ views",
        "The training session provided practical, actionable knowledge ( participants used a handbook during different sessions)",
        "The training schedule was explained and indicates the methodology and time needed per session/ module",
        "The designed schedule allowed for adequate breaks and participant engagement",
        "Were there any instances of sessions running over or finishing early?"
    ],
    'E1-E3': [
        "Training space was adequate to adjust at least 20 persons",
        "The training space was comfortable and conducive to learning, offering amenities such as natural lighting, appropriate seating arrangements (e.g. mats, or rugs), adequate ventilation, and sufficient room for group activities and movement.",
        "Drinking water was available for the participants."
    ],
    'F1': [
        "Think about the overall session. How engaged with the materials and discussions, overall, were the attendees?"
    ]
};
// Colors for Likert responses (adjusted to match screenshot: red=Disagree, yellow=Neither, light blue=Agree, blue=SA, gray=NA; extend for 6 opts)
const LIKERT_COLORS_5 = ['#e53e3e', '#ecc94b', '#bee3f8', '#3182ce', '#e2e8f0']; // Disagree(red), Neither(yellow), Agree(lblue), SA(blue), NA(gray)
const LIKERT_COLORS_6 = ['#c53030', '#e53e3e', '#ecc94b', '#bee3f8', '#3182ce', '#e2e8f0']; // SD(dred), D(red), N(y), A(lb), SA(b), NA(g)
const LIKERT_COLORS_4 = ['#38a169', '#ecc94b', '#ed8936', '#e53e3e']; // Very(green), Some(y), Slight(orange), Not(red) for F1
// Section columns (skip text fields like C3)
const SECTION_COLUMNS = {
    'B1-B6': ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'],
    'B7-B11': ['B7', 'B8', 'B9', 'B10', 'B11'],
    'B12-B15': ['B12', 'B13', 'B14', 'B15'],
    'C1-C3': ['C1', 'C2'], // Skip C3 (text)
    'C4-C10': ['C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
    'D1-D8': ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
    'E1-E3': ['E1', 'E2', 'E3'],
    'F1': ['F1']
};
const SECTION_NAMES = {
    'B1-B6': 'Training Clarity & Content Delivery',
    'B7-B11': 'Participant Learning & Engagement',
    'B12-B15': 'Inclusivity & Training Materials',
    'C1-C3': 'Facilitator Expertise',
    'C4-C10': 'Trainer Interaction & Participation',
    'D1-D8': 'Interactive Methods & Environment',
    'E1-E3': 'Venue Facilities',
    'F1': 'Overall Session Engagement'
};

// DOM Elements for Mobile
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const leftSidebar = document.getElementById('left-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
// Issues Modal Elements
const issuesModal = document.getElementById('issuesModal');
const issuesList = document.getElementById('issuesList');
const closeIssuesModal = document.getElementById('closeIssuesModal');
const statusFilter = document.getElementById('statusFilter');
const exportIssuesBtn = document.getElementById('exportIssuesBtn');
let currentIssues = [];
// Sessions Modal Elements
const sessionsModal = document.getElementById('sessionsModal');
const sessionsTableBody = document.getElementById('sessionsTableBody');
const closeSessionsModal = document.getElementById('closeSessionsModal');
const exportSessionsBtn = document.getElementById('exportSessionsBtn');
let currentSessions = [];
// Load Trainers Data
// ───────────────────────────────────────────────
//                DATABASE LOADING
// ───────────────────────────────────────────────



async function loadAllDataFromDatabase() {
    const loading = document.getElementById('loading-overlay');
    if (loading) loading.style.display = 'flex';
    try {
        const [beneRes, icRes, trainersRes] = await Promise.all([
            fetch('/api/bene-data'),
            fetch('/api/ic-monitoring'),
            fetch('/api/trainers')
        ]);
        if (!beneRes.ok || !icRes.ok || !trainersRes.ok) {
            throw new Error('One or more API requests failed');
        }
        const [rawBene, rawIc, rawTrainers] = await Promise.all([
            beneRes.json(), icRes.json(), trainersRes.json()
        ]);

        // ── 1. Beneficiaries ───────────────────────────────
        beneficiaryData = rawBene;

        // ── 2. IC Monitoring Forms ─────────────────────────
        icData = rawIc;
        icData.forEach(d => {
            d.starttime = new Date(d.starttime);
            d.start = new Date(d.starttime);
            d.end = new Date(d.endtime);

            d['session_location-Latitude']  = +d['session_location-Latitude']  || 0;
            d['session_location-Longitude'] = +d['session_location-Longitude'] || 0;
            d['session_location-Altitude']  = +d['session_location-Altitude']  || 0;
            d['session_location-Accuracy']  = +d['session_location-Accuracy']  || 0;

            d.issue_status = d.issue_status || 'unresolved';
            d.verified = false;

            if (!d.uniqueId) {
                d.uniqueId = `ic_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;
            }
        });
        loadIssueStatusesFromStorage(icData);
        loadVerifiedFromStorage(icData);

        // ── 3. Trainers ────────────────────────────────────
        trainersData = rawTrainers.filter(row => row.trainer_name && row.assigned_ic);

        return true;
    } catch (err) {
        console.error('CRITICAL - Data loading failed:', err);
        alert('Cannot load dashboard data!\n\n' + err.message);
        return false;
    } finally {
        if (loading) loading.style.display = 'none';
    }
}
// Check Missing Forms
function checkMissingForms() {
    const selectedDateStr = document.getElementById('selectedDate').value;
    if (!selectedDateStr) {
        alert('Please select a date');
        return;
    }
    const selectedDate = new Date(selectedDateStr + 'T00:00:00');
    const dateDisplay = document.getElementById('dateDisplay');
    const missingList = document.getElementById('missingList');
    const missingBox = document.getElementById('missingBox');
    const selectedIC = document.getElementById('icFilter').value;
    dateDisplay.textContent = `Selected Date: ${selectedDate.toLocaleDateString('en-GB')}`;
    // Get submissions on the selected date (date only), filtered by IC
    const submissionsOnDate = icData.filter(row => {
        const subDate = new Date(row.starttime);
        return subDate.toDateString() === selectedDate.toDateString() &&
               (selectedIC === 'All' || row.ic_name_select === selectedIC);
    });
    // Group submitted trainers by IC
    const submittedTrainersByIC = {};
    submissionsOnDate.forEach(row => {
        const ic = row.ic_name_select;
        const trainer = row.trainer_name;
        if (ic && trainer) {
            if (!submittedTrainersByIC[ic]) submittedTrainersByIC[ic] = new Set();
            submittedTrainersByIC[ic].add(trainer);
        }
    });

    // Loads sql.js + database file once

// Loads ALL data tables into global arrays


    // Find missing trainers, filtered by selected IC
    const missing = [];
    const filteredTrainers = trainersData.filter(row => selectedIC === 'All' || row.assigned_ic === selectedIC);
    filteredTrainers.forEach(trainerRow => {
        const trainerName = trainerRow.trainer_name;
        const assignedIC = trainerRow.assigned_ic;
        if (assignedIC && (!submittedTrainersByIC[assignedIC] || !submittedTrainersByIC[assignedIC].has(trainerName))) {
            missing.push({ trainer: trainerName, ic: assignedIC });
        }
    });
    // Display results
    if (missing.length === 0) {
        missingList.innerHTML = '<li class="no-missing">All trainer forms submitted on this date!</li>';
    } else {
        missingList.innerHTML = missing.map(m => `<li>${m.trainer} (IC: ${m.ic})</li>`).join('');
    }
    missingBox.classList.remove('hidden');
}
// Show Sessions List
function showSessionsList() {
    const selectedIC = document.getElementById('icFilter').value;
    const startDateStr = document.getElementById('startDate').value;
    const endDateStr = document.getElementById('endDate').value;
    const startDate = startDateStr ? new Date(startDateStr) : null;
    const endDate = endDateStr ? new Date(endDateStr) : null;
    const filteredIC = icData.filter(row => {
        const matchesIC = selectedIC === 'All' || row.ic_name_select === selectedIC;
        const subDate = getDateOnly(row.starttime);
        const sDate = startDate ? getDateOnly(startDate) : null;
        const eDate = endDate ? getDateOnly(endDate) : null;
        const matchesDate = !sDate || subDate >= sDate;
        const matchesEndDate = !eDate || subDate <= eDate;
        return matchesIC && matchesDate && matchesEndDate;
    });
    currentSessions = filteredIC;
    buildSessionsTable();
    sessionsModal.classList.add('active');
}
function buildSessionsTable() {
    sessionsTableBody.innerHTML = '';

    if (currentSessions.length === 0) {
        sessionsTableBody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500 py-4">No sessions found</td></tr>';
        return;
    }

    currentSessions.forEach(row => {
        const date = new Date(row.starttime).toLocaleDateString('en-GB');

        const icLat  = parseFloat(row['session_location-Latitude'])  || null;
        const icLon  = parseFloat(row['session_location-Longitude']) || null;
        const icLoc  = (icLat && icLon) ? `${icLat.toFixed(5)}, ${icLon.toFixed(5)}` : '—';

        const trainerName = row.trainer_name?.trim() || 'N/A';
        const trainerCoords = TrainerLocation[trainerName];
        let trainerLocDisplay = 'Not found';
        let mismatchDisplay = '—';
        let rowStyle = '';

        if (trainerCoords) {
            const [tLat, tLon] = trainerCoords.split(',').map(parseFloat);
            trainerLocDisplay = trainerCoords;

            if (row.mode_of_monitoring?.toLowerCase() === 'in-person' && icLat && icLon) {
                const distance = getDistanceInKm(tLat, tLon, icLat, icLon);
                if (distance !== null) {
                    mismatchDisplay = distance.toFixed(1);
                    if (distance > 2) {
                        rowStyle = 'background-color: #fee2e2; font-weight: 500;'; // light red
                        mismatchDisplay = `<strong>${distance.toFixed(1)}</strong> km`;
                    } else {
                        mismatchDisplay = `${distance.toFixed(1)} km`;
                    }
                }
            }
        }

        const tr = document.createElement('tr');
        tr.style.cssText = rowStyle;

        tr.innerHTML = `
            <td>${trainerName}</td>
            <td>${row.ic_name_select || 'N/A'}</td>
            <td>${row.mode_of_monitoring || 'N/A'}</td>
            <td>${date}</td>
            <td>${icLoc}</td>
            <td>${trainerLocDisplay}</td>
            <td>${mismatchDisplay}</td>
        `;

        sessionsTableBody.appendChild(tr);
    });
}

async function exportSessions() {
    if (currentSessions.length === 0) {
        alert('No sessions to export.');
        return;
    }

    const rows = await Promise.all(currentSessions.map(async row => {
        const trainerName = row.trainer_name?.trim() || 'N/A';
        const trainerCoords = TrainerLocation[trainerName] || 'Not found';

        let mismatch = '—';
        if (row.mode_of_monitoring?.toLowerCase() === 'in-person') {
            const icLat = parseFloat(row['session_location-Latitude']);
            const icLon = parseFloat(row['session_location-Longitude']);
            if (trainerCoords !== 'Not found' && !isNaN(icLat) && !isNaN(icLon)) {
                const [tLat, tLon] = trainerCoords.split(',').map(parseFloat);
                const dist = getDistanceInKm(tLat, tLon, icLat, icLon);
                mismatch = dist !== null ? `${dist.toFixed(1)} km` : '—';
            }
        }

        const place = await getPlaceName(
            row['session_location-Latitude'],
            row['session_location-Longitude']
        );

        return {
            'Trainer Name': trainerName,
            'IC Name': row.ic_name_select || 'N/A',
            'Mode of Monitoring': row.mode_of_monitoring || 'N/A',
            'Visit Date': new Date(row.starttime).toLocaleDateString('en-GB'),
            'Location of IC': place,
            'Location of Trainer': trainerCoords,
            'Mismatch (km)': mismatch
        };
    }));

    downloadCsv(
        `sessions_monitored_${new Date().toISOString().split('T')[0]}.csv`,
        rows,
        ['Trainer Name', 'IC Name', 'Mode of Monitoring', 'Visit Date', 'Location of IC', 'Location of Trainer', 'Mismatch (km)']
    );
}



// Mobile Sidebar
function toggleMobileSidebar() {
    leftSidebar.classList.toggle('mobile-open');
    sidebarOverlay.classList.toggle('hidden');
}
function closeMobileSidebar() {
    leftSidebar.classList.remove('mobile-open');
    sidebarOverlay.classList.add('hidden');
}
// Hierarchy State Management
function saveOpenStates() {
    const openStates = {};
    document.querySelectorAll('#hierarchyContainer [id^="ul_"]').forEach(ul => {
        openStates[ul.id] = ul.style.display !== 'none';
    });
    return openStates;
}
function restoreOpenStates(openStates) {
    Object.keys(openStates).forEach(id => {
        const ul = document.getElementById(id);
        if (ul) {
            ul.style.display = openStates[id] ? 'block' : 'none';
        }
    });
}
window.toggleVisitVerify = async function(uniqueId, checked) {
    const row = icData.find(r => r.uniqueId === uniqueId);
    if (row) {
        row.verified = checked;
        row.verifyUpdatedBy = currentUser;
        row.verifyUpdatedAt = new Date().toISOString();
        saveVerifiedToStorage(uniqueId, checked);
        showToast('Visit verification updated successfully');
        const openStates = saveOpenStates();
        updateHierarchy();
        restoreOpenStates(openStates);
    }
}
window.toggleSub = function(targetId) {
    const ul = document.getElementById(`ul_${targetId}`);
    if (ul) {
        ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
    }
};
// Show Issues List
function showIssuesList() {
    currentIssues = icData.filter(row => row.faced_issues === 'yes' && row.issue_details).map(row => ({ ...row }));
    filterAndDisplayIssues();
    issuesModal.classList.add('active');
}
// Filter and Display Issues
function filterAndDisplayIssues() {
    const selectedStatus = statusFilter.value;
    const filteredIssues = selectedStatus === 'All'
        ? currentIssues
        : currentIssues.filter(issue => issue.issue_status === selectedStatus);
    issuesList.innerHTML = filteredIssues.map(issue => {
        const statusClass = issue.issue_status.replace(/-/g, '');
        const lastUpdated = issue.statusUpdatedBy ? `<br><strong>Last Updated:</strong> ${issue.statusUpdatedBy} on ${new Date(issue.statusUpdatedAt).toLocaleString('en-US')}` : '';
        return `
            <li class="issue-item">
                <select class="issue-status-select" onchange="updateIssueStatus('${issue.uniqueId}', this.value)">
                    <option value="unresolved" ${issue.issue_status === 'unresolved' ? 'selected' : ''}>Unresolved</option>
                    <option value="in-progress" ${issue.issue_status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="resolved" ${issue.issue_status === 'resolved' ? 'selected' : ''}>Resolved</option>
                </select>
                <strong>IC:</strong> ${issue.ic_name_select}<br>
                <strong>Training/Session:</strong> ${issue.session_id_select}<br>
                <strong>Date:</strong> ${new Date(issue.starttime).toLocaleDateString()}<br>
                <strong>Category:</strong> ${issue.issue_category || 'N/A'}<br>
                <strong>Subcategory:</strong> ${issue.issue_subcategory || 'N/A'}<br>
                <strong>Status:</strong> <span class="status-badge ${statusClass}">${issue.issue_status.replace(/-/g, ' ').toUpperCase()}</span><br>
                <strong>Details:</strong> ${issue.issue_details}${lastUpdated}
            </li>
        `;
    }).join('') || '<li class="text-center text-gray-500 py-4">No issues reported</li>';
}
async function updateIssueStatus(uniqueId, status) {
    const issue = icData.find(row => row.uniqueId === uniqueId);
    if (issue) {
        issue.issue_status = status;
        issue.statusUpdatedBy = currentUser;
        issue.statusUpdatedAt = new Date().toISOString();
        saveIssueStatusToStorage(uniqueId, status);
        showToast('Issue status updated successfully');
        // Refresh display
        filterAndDisplayIssues();
    }
}
// Export Issues List
async function exportIssuesList() {
    const selectedStatus = statusFilter.value;
    const filteredIssues = selectedStatus === 'All'
        ? currentIssues
        : currentIssues.filter(issue => issue.issue_status === selectedStatus);
    if (filteredIssues.length === 0) {
        alert('No issues to export.');
        return;
    }
    // Fetch place names for all issues
    const places = await Promise.all(filteredIssues.map(issue =>
        getPlaceName(issue['session_location-Latitude'], issue['session_location-Longitude'])
    ));
    const csvData = filteredIssues.map((issue, index) => ({
        'IC': issue.ic_name_select,
        'Training/Session': issue.session_id_select,
        'Trainer Name': issue.trainer_name || 'N/A',
        'Place': places[index],
        'Date': new Date(issue.starttime).toLocaleDateString(),
        'Category': issue.issue_category || 'N/A',
        'Subcategory': issue.issue_subcategory || 'N/A',
        'Status': issue.issue_status,
        'Details': issue.issue_details
    }));
    downloadCsv(`issues_list_${selectedStatus !== 'All' ? selectedStatus + '_' : ''}${new Date().toISOString().split('T')[0]}.csv`, csvData, Object.keys(csvData[0]));
}
closeIssuesModal.addEventListener('click', () => issuesModal.classList.remove('active'));
exportIssuesBtn.addEventListener('click', exportIssuesList);
issuesModal.addEventListener('click', (e) => {
    if (e.target === issuesModal) issuesModal.classList.remove('active');
});
closeSessionsModal.addEventListener('click', () => sessionsModal.classList.remove('active'));
exportSessionsBtn.addEventListener('click', exportSessions);
sessionsModal.addEventListener('click', (e) => {
    if (e.target === sessionsModal) sessionsModal.classList.remove('active');
});
// Compute IC Form Distributions
function computeICFormDistributions(data) {
    const icFormDistributions = {};
    Object.keys(SECTION_COLUMNS).forEach(section => {
        const columns = SECTION_COLUMNS[section];
        const numOptions = LIKERT_LABELS[section].length;
        icFormDistributions[section] = {};
        columns.forEach(col => {
            icFormDistributions[section][col] = Array(numOptions).fill(0);
            data.forEach(row => {
                const valStr = row[col];
                if (!valStr) return;
                let val = parseInt(valStr);
                let idx = -1;
                if (val >= 1 && val <= numOptions - 1) {
                    idx = val - 1;
                } else if (val === 98 || valStr === '98') {
                    idx = numOptions - 1;
                }
                if (idx >= 0) {
                    icFormDistributions[section][col][idx]++;
                }
            });
        });
    });
    return icFormDistributions;
}
// Init Dashboard
async function initDashboard() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    try {
        const success = await loadAllDataFromDatabase();
        if (!success) {
            throw new Error("Failed to load data from database");
        }

        // Calculate trainer attendance stats
        globalTrainerTotalAttendance = {};
        beneficiaryData.forEach(row => {
            const trainer = row.trainer_name?.trim();
            if (!trainer) return;
            const attendance = row.verified_retention_status==='Verified' ? 1 : 0;
            if (!globalTrainerTotalAttendance[trainer]) {
                globalTrainerTotalAttendance[trainer] = { sum: 0, count: 0 };
            }
            globalTrainerTotalAttendance[trainer].sum += attendance;
            globalTrainerTotalAttendance[trainer].count += 1;
        });

        // Default date ranges – IC monitoring
        const validStarts = icData.map(r => r.start).filter(d => d && !isNaN(d.getTime()));
        if (validStarts.length > 0) {
            const minStart = new Date(Math.min(...validStarts));
            const maxEnd   = new Date(Math.max(...icData.map(r => r.end).filter(d => d && !isNaN(d.getTime()))));
            document.getElementById('startDate')?.setAttribute('value', minStart.toISOString().split('T')[0]);
            document.getElementById('endDate')?.setAttribute('value', maxEnd.toISOString().split('T')[0]);
        }

        // Default date ranges – IC Form submissions
        const validSubs = icData.map(r => r.starttime).filter(d => d && !isNaN(d.getTime()));
        if (validSubs.length > 0) {
            const minSub = new Date(Math.min(...validSubs));
            const maxSub = new Date(Math.max(...validSubs));
            document.getElementById('startDateICForm')?.setAttribute('value', minSub.toISOString().split('T')[0]);
            document.getElementById('endDateICForm')?.setAttribute('value', maxSub.toISOString().split('T')[0]);
        }

        populateFilters();
        populateICFormTrainerFilter();
        initializeCharts();

        // Missing forms checker – today by default
        const todayStr = new Date().toISOString().split('T')[0];
        document.getElementById('selectedDate')?.setAttribute('value', todayStr);

        document.getElementById('checkBtn')?.addEventListener('click', checkMissingForms);

        updateDashboard();

        if (loadingOverlay) loadingOverlay.style.display = 'none';
    } catch (err) {
        console.error("Dashboard init failed:", err);
        alert("Error loading dashboard:\n" + err.message);
        if (loadingOverlay) loadingOverlay.style.display = 'none';
    }
}
// Populate Filters
function populateFilters() {
    const icFilter = document.getElementById('icFilter');
    const districtFilter = document.getElementById('districtFilter');
    // Use union of ICs from both datasets, remove extra "Saeed Ahmad"
    const allICs = [...new Set([...beneficiaryData.map(row => row.assigned_ic).filter(Boolean), ...icData.map(row => row.ic_name_select).filter(Boolean)])].filter(ic => ic !== 'Saeed Ahmad').sort();
    allICs.forEach(ic => icFilter.add(new Option(ic, ic)));
    const uniqueDistricts = [...new Set(beneficiaryData.map(row => row.district).filter(Boolean))].sort();
    uniqueDistricts.forEach(d => districtFilter.add(new Option(d, d)));
}
// Populate IC Form Trainer Filter
function populateICFormTrainerFilter() {
    const trainerFilterICForm = document.getElementById('trainerFilterICForm');
    const uniqueTrainers = [...new Set(icData.map(row => row.trainer_name).filter(Boolean))].sort();
    uniqueTrainers.forEach(t => trainerFilterICForm.add(new Option(t, t)));
}
// Update Time
function updateTime() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Karachi' };
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Karachi' };
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-GB', timeOptions);
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', dateOptions);
}
setInterval(updateTime, 1000);
updateTime();
document.getElementById('icFilter').addEventListener('change', updateDashboard);
document.getElementById('districtFilter').addEventListener('change', updateDashboard);
document.getElementById('startDate').addEventListener('change', updateDashboard);
document.getElementById('endDate').addEventListener('change', updateDashboard);
document.getElementById('startDateICForm').addEventListener('change', updateICFormGraphs);
document.getElementById('endDateICForm').addEventListener('change', updateICFormGraphs);
document.getElementById('trainerFilterICForm').addEventListener('change', updateICFormGraphs);
// Compute Metrics
function getDateOnly(date) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function computeMetrics(beneficiaryFiltered, icFiltered) {
    // From IC Data (Monitoring)
    const uniqueICs = new Set(icFiltered.map(row => row.ic_name_select).filter(Boolean));
    const uniqueTrainersFromIC = new Set(icFiltered.map(row => row.trainer_name).filter(Boolean));
    let totalSessions = icFiltered.length;
    let inPersonCount = 0;
    let onlineCount = 0;
    let sessionsWithIssues = icFiltered.filter(row => row.faced_issues === 'yes').length;
    let venueSuitableCount = 0;
    let venueReadyCount = 0;
    const monitoringModes = {};
    let trainingHandbooksYes = 0, trainingHandbooksNo = 0;
    let trainersMobilesYes = 0, trainersMobilesNo = 0;
    // Hierarchy Data - Separated by mode
    const inPersonHierarchy = {};
    const onlineHierarchy = {};
    icFiltered.forEach(row => {
        if (row.venu_suitable === 'yes') venueSuitableCount++;
        if (row.venu_ready === 'yes') venueReadyCount++;
        monitoringModes[row.mode_of_monitoring] = (monitoringModes[row.mode_of_monitoring] || 0) + 1;
        if (row.mode_of_monitoring === 'in-person') inPersonCount++;
        else onlineCount++;
        if (row.training_handbooks === 'yes') trainingHandbooksYes++;
        else if (row.training_handbooks === 'no') trainingHandbooksNo++;
        if (row.trainer_equiped_mobiles === 'yes') trainersMobilesYes++;
        else if (row.trainer_equiped_mobiles === 'no') trainersMobilesNo++;
        // Build hierarchy by mode - sort trainers by number of visits descending
        const ic = row.ic_name_select || 'Unknown';
        const trainer = row.trainer_name || 'Unknown';
        const dateStr = row.starttime.toLocaleDateString('en-US');
        const mode = row.mode_of_monitoring || 'N/A';
        const hData = mode === 'in-person' ? inPersonHierarchy : onlineHierarchy;
        if (!hData[ic]) hData[ic] = {};
        if (!hData[ic][trainer]) hData[ic][trainer] = [];
        hData[ic][trainer].push({ date: dateStr, mode, uniqueId: row.uniqueId, verified: row.verified || false, verifyUpdatedBy: row.verifyUpdatedBy, verifyUpdatedAt: row.verifyUpdatedAt });
    });
    // Sort hierarchies: ICs by total visits descending, then trainers by visits descending
    function sortHierarchy(hierarchy) {
        Object.keys(hierarchy).forEach(ic => {
            const trainers = Object.keys(hierarchy[ic]);
            trainers.sort((a, b) => hierarchy[ic][b].length - hierarchy[ic][a].length);
            // Reorder trainers in object
            const sortedTrainers = {};
            trainers.forEach(t => sortedTrainers[t] = hierarchy[ic][t]);
            hierarchy[ic] = sortedTrainers;
            // Sort visits within each trainer descending by date
            Object.keys(hierarchy[ic]).forEach(trainer => {
                hierarchy[ic][trainer].sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
            });
        });
        // Sort ICs by total visits descending
        const sortedICs = Object.keys(hierarchy).sort((a, b) => {
            const totalA = Object.values(hierarchy[a]).reduce((sum, visits) => sum + visits.length, 0);
            const totalB = Object.values(hierarchy[b]).reduce((sum, visits) => sum + visits.length, 0);
            return totalB - totalA;
        });
        const sortedHierarchy = {};
        sortedICs.forEach(ic => sortedHierarchy[ic] = hierarchy[ic]);
        return sortedHierarchy;
    }
    const sortedInPersonHierarchy = sortHierarchy(inPersonHierarchy);
    const sortedOnlineHierarchy = sortHierarchy(onlineHierarchy);
    const avgVenueSuitable = totalSessions > 0 ? (venueSuitableCount / totalSessions * 100).toFixed(1) : 0;
    const avgVenueReady = totalSessions > 0 ? (venueReadyCount / totalSessions * 100).toFixed(1) : 0;
    // Compute IC Form Distributions per question
    const icFormDistributions = computeICFormDistributions(icFiltered);
    // From Beneficiary Data (Operations)
    const trainerPerformance = {};
    const uniqueTrainersFromBen = new Set();
    const activeTrainers = new Set();
    let totalBeneficiaries = beneficiaryFiltered.length;
    let attendanceSum = 0;
    let attendanceCount = 0;
    const trainingTypes = {}; // Using occupation as proxy
    const trainerAttendance = {};
    const allMonths = new Set();
    beneficiaryFiltered.forEach(row => {
        const trainer = row.trainer_name;
        const date = new Date(row.starttime);
        if (isNaN(date.getTime())) return;
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const attendance = row.verified_retention_status==='Verified' ? 1 : 0;
        uniqueTrainersFromBen.add(trainer);
        activeTrainers.add(trainer);
        attendanceSum += attendance;
        attendanceCount++;
        allMonths.add(monthKey);
        if (!trainerAttendance[trainer]) trainerAttendance[trainer] = {};
        if (!trainerAttendance[trainer][monthKey]) trainerAttendance[trainer][monthKey] = { sum: 0, count: 0 };
        trainerAttendance[trainer][monthKey].sum += attendance;
        trainerAttendance[trainer][monthKey].count++;
        if (!trainerPerformance[trainer]) {
            trainerPerformance[trainer] = {
                trainer: trainer,
                beneficiaries: 0,
                province: row.province,
                district: row.district,
                status: 'Active',
                lastActivity: date,
                target: 128, // Beneficiary target per trainer
                retentionRate: 0
            };
        }
        trainerPerformance[trainer].beneficiaries++;
        if (date > trainerPerformance[trainer].lastActivity) trainerPerformance[trainer].lastActivity = date;
        const occ = row.occupation || 'Unknown';
        trainingTypes[occ] = (trainingTypes[occ] || 0) + 1;
    });
    // Calculate retention rate per trainer (global)
    Object.keys(trainerPerformance).forEach(trainerKey => {
        const ta = globalTrainerTotalAttendance[trainerKey];
        trainerPerformance[trainerKey].retentionRate = ta && ta.count > 0 ? (ta.sum / ta.count).toFixed(1) : 0;
    });
    // Calculate trainings based on beneficiaries / 16
    const totalTrainings = Math.floor(totalBeneficiaries / config.BEN_PER_TRAINING);
    const trainingsVsLastMonth = '✔ Done';
    // Update trainer performances
    Object.values(trainerPerformance).forEach(trainer => {
        trainer.trainings = Math.floor(trainer.beneficiaries / config.BEN_PER_TRAINING);
    });
    const avgAttendance = attendanceCount > 0 ? (attendanceSum / attendanceCount * 100).toFixed(1) : 0;
    const totalTrainers = [...new Set([...uniqueTrainersFromBen, ...uniqueTrainersFromIC])].length;
    const totalTarget = Object.values(trainerPerformance).reduce((sum, t) => sum + t.target, 0);
    const beneficiaryTargetAchieved = totalTarget > 0 ? (totalBeneficiaries / totalTarget * 100).toFixed(1) : 0;
    // Top 5 trainers trends
    const sortedTrainers = Object.keys(trainerPerformance).sort((a, b) => trainerPerformance[b].beneficiaries - trainerPerformance[a].beneficiaries).slice(0, 5);
    const topTrainersTrends = {};
    sortedTrainers.forEach(trainerName => {
        topTrainersTrends[trainerName] = {};
        const trainerTrends = trainerAttendance[trainerName] || {};
        Object.keys(trainerTrends).forEach(monthKey => {
            const { sum, count } = trainerTrends[monthKey];
            topTrainersTrends[trainerName][monthKey] = count > 0 ? (sum / count * 100) : 0;
        });
    });
    const months = Array.from(allMonths).sort();
    // Recent updates: Separate for trainers and ICs
    const recentFromIC = icFiltered.map(row => ({
        date: row.starttime,
        ic: row.ic_name_select,
        trainer: row.trainer_name,
        session: row.session_id_select,
        mode: row.mode_of_monitoring,
        suitable: row.venu_suitable,
        issues: row.issue_details || 'None',
        category: row.issue_catagory || 'None',
        subcategory: row.subcatagory || 'None'
    })).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
    const recentFromBen = beneficiaryFiltered.map(row => ({
        date: row.starttime,
        trainer: row.trainer_name,
        type: 'Beneficiary Registration',
        notes: `New beneficiary registered: ${row.beneficiary_name} (${row.occupation || 'N/A'})`
    })).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
    const dates = [...beneficiaryFiltered, ...icFiltered].map(row => row.starttime).filter(d => !isNaN(d));
    const minDate = dates.length > 0 ? new Date(Math.min(...dates)) : new Date();
    const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : new Date();
    const period = `${minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    // Visit Compliance (using spot_check_day)
    const visitCompliance = {};
    icFiltered.forEach(row => {
        const ic = row.ic_name_select || 'Unknown';
        const day = row.spot_check?.toLowerCase();
        if (!visitCompliance[ic]) visitCompliance[ic] = { day1: 0, day2: 0 };
        if (day === 'day1') {
            visitCompliance[ic].day1++;
        } else if (day === 'day2') {
            visitCompliance[ic].day2++;
        }
    });
    // Visits Over Time
    const allDateStrs = icFiltered.map(row => row.starttime.toISOString().split('T')[0]).filter(Boolean);
    const uniqueDates = [...new Set(allDateStrs)].sort();
    const icGroups = {};
    icFiltered.forEach(row => {
        const ic = row.ic_name_select || 'Unknown';
        if (!icGroups[ic]) icGroups[ic] = [];
        icGroups[ic].push({ dateStr: row.starttime.toISOString().split('T')[0], trainer: row.trainer_name || 'Unknown' });
    });
    const datasets = [];
    const colors = CHART_COLORS;
    let colorIdx = 0;
    Object.keys(icGroups).sort().forEach(ic => {
        const visits = icGroups[ic];
        const cumData = uniqueDates.map(date => {
            const upTo = visits.filter(v => v.dateStr <= date);
            return new Set(upTo.map(v => v.trainer)).size;
        });
        datasets.push({
            label: ic,
            data: cumData,
            borderColor: colors[colorIdx % colors.length],
            backgroundColor: colors[colorIdx % colors.length] + '20',
            fill: false,
            tension: 0.1
        });
        colorIdx++;
    });
    const visitsOverTimeData = {
        labels: uniqueDates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets
    };
    return {
        totalSessions,
        sessionsWithIssues,
        avgVenueSuitable: `${avgVenueSuitable}%`,
        avgVenueReady: `${avgVenueReady}%`,
        totalTrainers,
        totalBeneficiaries,
        beneficiaryTargetAchieved,
        totalTrainings,
        trainingsVsLastMonth,
        avgAttendance: `${avgAttendance}%`,
        trainerPerformance: Object.values(trainerPerformance),
        topTrainersTrends,
        months,
        monitoringModes,
        trainingTypes, // For potential use, but chart is monitoring modes
        recentFromBen,
        recentFromIC,
        period,
        inPersonHierarchy: sortedInPersonHierarchy,
        onlineHierarchy: sortedOnlineHierarchy,
        visitCompliance,
        visitsOverTime: visitsOverTimeData,
        trainingHandbooks: { yes: trainingHandbooksYes, no: trainingHandbooksNo },
        trainersMobiles: { yes: trainersMobilesYes, no: trainersMobilesNo },
        icFormDistributions,
        inPersonCount,
        onlineCount
    };
}
// Update Dashboard
function updateDashboard() {
    const selectedIC = document.getElementById('icFilter').value;
    const selectedDistrict = document.getElementById('districtFilter').value;
    const startDateStr = document.getElementById('startDate').value;
    const endDateStr = document.getElementById('endDate').value;
    const startDate = startDateStr ? new Date(startDateStr) : null;
    const endDate = endDateStr ? new Date(endDateStr) : null;
    let filteredBeneficiary = beneficiaryData.filter(row => {
        const matchesIC = selectedIC === 'All' || row.assigned_ic === selectedIC;
        const matchesDistrict = selectedDistrict === 'All' || row.district === selectedDistrict;
        const rowDate = getDateOnly(row.starttime);
        const sDate = startDate ? getDateOnly(startDate) : null;
        const eDate = endDate ? getDateOnly(endDate) : null;
        const matchesDate = !sDate || rowDate >= sDate;
        const matchesEndDate = !eDate || rowDate <= eDate;
        return matchesIC && matchesDistrict && matchesDate && matchesEndDate;
    });
    let filteredIC = icData.filter(row => {
        const matchesIC = selectedIC === 'All' || row.ic_name_select === selectedIC;
        const subDate = getDateOnly(row.starttime);
        const sDate = startDate ? getDateOnly(startDate) : null;
        const eDate = endDate ? getDateOnly(endDate) : null;
        const matchesDate = !sDate || subDate >= sDate;
        const matchesEndDate = !eDate || subDate <= eDate;
        return matchesIC && matchesDate && matchesEndDate;
    });
    aggregatedData = computeMetrics(filteredBeneficiary, filteredIC);
    updateOverallSummaryKPIs();
    updateTeamPerformanceRanking();
    updateAttendanceComplianceChart();
    updateMonitoringModeChart();
    updateTrainersFieldUpdates();
    updateICsFieldUpdates();
    updateTrainingHandbooksChart();
    updateTrainersMobilesChart();
    const openStates = saveOpenStates();
    updateHierarchy();
    restoreOpenStates(openStates);
    updateVisitBarChart();
    updateVisitsOverTimeChart();
    updateICFormGraphs();
}
// Update KPIs
function updateOverallSummaryKPIs() {
    const data = aggregatedData;
    animateValue(document.getElementById('sessionsWithIssues'), 0, data.sessionsWithIssues);
    animateValue(document.getElementById('totalSessions'), 0, data.totalSessions);
    document.getElementById('inPersonCount').textContent = data.inPersonCount;
    document.getElementById('onlineCount').textContent = data.onlineCount;
    animateValue(document.getElementById('totalBeneficiaries'), 0, data.totalBeneficiaries);
    document.getElementById('beneficiaryTargetAchieved').textContent = `${data.beneficiaryTargetAchieved}%`;
    document.getElementById('avgVenueSuitable').textContent = data.avgVenueSuitable;
    document.getElementById('avgVenueReady').textContent = data.avgVenueReady;
    // Conditional "Good Standing" for venue rates > 70%
    const suitable = parseFloat(data.avgVenueSuitable);
    const ready = parseFloat(data.avgVenueReady);
    const venueStatusEl = document.getElementById('venueStatus');
    if (suitable > 70 && ready > 70) {
        venueStatusEl.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Good Standing`;
        venueStatusEl.classList.add('positive');
        venueStatusEl.style.display = 'flex';
    } else {
        venueStatusEl.innerHTML = '';
        venueStatusEl.style.display = 'none';
    }
    animateValue(document.getElementById('totalTrainings'), 0, data.totalTrainings);
    document.getElementById('trainingsVsLastMonth').textContent = data.trainingsVsLastMonth;
    document.getElementById('avgAttendanceRate').textContent = data.avgAttendance;
}
function animateValue(el, start, end, duration = 1000) {
    let startTime = null;
    const step = (time) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        el.textContent = Math.floor(start + progress * (end - start));
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
// Update Ranking Table
function updateTeamPerformanceRanking() {
    const trainers = aggregatedData.trainerPerformance.sort((a, b) => b.beneficiaries - a.beneficiaries);
    const tbody = document.getElementById('trainerRankingTableBody');
    tbody.innerHTML = '';
    trainers.forEach((trainer, idx) => {
        const targetPct = (trainer.beneficiaries / trainer.target * 100).toFixed(1);
        const progressClass = targetPct >= 80 ? 'success' : (targetPct >= 50 ? 'warning' : 'danger');
        const rowClass = targetPct < 50 ? 'alert-row' : '';
        const row = `
            <tr class="${rowClass}">
                <td>${idx + 1}</td>
                <td class="font-bold">${trainer.trainer}</td>
                <td class="text-sm text-gray-600">${trainer.province}, ${trainer.district}</td>
                <td>${trainer.beneficiaries}</td>
                <td>${trainer.trainings}</td>
                <td>
                    <div class="progress-bar-container">
                        <div class="progress-bar ${progressClass}" style="width: ${Math.min(100, targetPct)}%;"></div>
                    </div>
                    <span class="text-xs text-gray-600">${targetPct}%</span>
                </td>
                <td>${trainer.retentionRate*100}%</td>
                <td><span class="status-dot ${trainer.status.toLowerCase()}"></span> ${trainer.status}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
    document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = '0%';
        setTimeout(() => bar.style.width = bar.style.width, 50);
    });
}

// Charts Initialization and Updates
function initializeCharts() {
    const ticksColor = CHART_COLORS_IC.darkGrey, gridColor = CHART_COLORS_IC.lightGrey;
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false, labels: { color: ticksColor, font: { family: 'Montserrat' } } },
            tooltip: { titleColor: CHART_COLORS_IC.darkGrey, bodyColor: CHART_COLORS_IC.darkGrey, backgroundColor: '#fff', borderColor: CHART_COLORS_IC.lightGrey, borderWidth: 1 },
            datalabels: { color: CHART_COLORS_IC.darkGrey, font: { family: 'Montserrat', size: 10, weight: 'bold' }, formatter: (value) => value.toLocaleString() }
        },
        scales: {
            x: { ticks: { color: ticksColor, font: { family: 'Montserrat' } }, grid: { color: gridColor } },
            y: { ticks: { color: ticksColor, font: { family: 'Montserrat' } }, grid: { color: gridColor } }
        }
    };
    // Attendance Line Chart
    const attendanceCanvas = document.getElementById('attendanceComplianceChart');
    attendanceComplianceChart = new Chart(attendanceCanvas.getContext('2d'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Retention %', data: [], borderColor: CHART_COLORS_IC.primary, backgroundColor: CHART_COLORS_IC.primary + '1A', fill: true, tension: 0.3 }] },
        options: { ...defaultOptions, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } }, plugins: { datalabels: { display: false } } }
    });
    // Monitoring Mode Pie Chart
    const monitoringCanvas = document.getElementById('monitoringModeChart');
    monitoringChart = new Chart(monitoringCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: CHART_COLORS
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'point'
            },
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: CHART_COLORS_IC.primary,
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return `Monitoring Mode: ${context[0].label}`;
                        },
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    // Training Handbooks Pie Chart
    const handbooksCanvas = document.getElementById('trainingHandbooksChart');
    trainingHandbooksChart = new Chart(handbooksCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Yes', 'No'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
    // Trainers Mobiles Pie Chart
    const mobilesCanvas = document.getElementById('trainersMobilesChart');
    trainersMobilesChart = new Chart(mobilesCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Yes', 'No'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
    // Visit Compliance Bar Chart
    const visitCanvas = document.getElementById('visitComplianceChart');
    visitComplianceChart = new Chart(visitCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Day 1',
                    data: [],
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Day 2',
                    data: [],
                    backgroundColor: 'rgba(147, 197, 253, 0.6)',
                    borderColor: 'rgba(147, 197, 253, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { font: { family: 'Montserrat' } }
                },
                x: {
                    ticks: { font: { family: 'Montserrat' } }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
    // Visits Over Time Line Chart
    const visitsCanvas = document.getElementById('visitsOverTimeChart');
    visitsOverTimeChart = new Chart(visitsCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { font: { family: 'Montserrat' } }
                },
                x: {
                    ticks: { font: { family: 'Montserrat' } }
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}
function updateTrainingHandbooksChart() {
    const data = aggregatedData.trainingHandbooks;
    trainingHandbooksChart.data.datasets[0].data = [data.yes, data.no];
    trainingHandbooksChart.update();
}
function updateTrainersMobilesChart() {
    const data = aggregatedData.trainersMobiles;
    trainersMobilesChart.data.datasets[0].data = [data.yes, data.no];
    trainersMobilesChart.update();
}
function updateAttendanceComplianceChart() {
    const { topTrainersTrends, months } = aggregatedData;
    if (months.length === 0) return;
    const labels = months.map(monthKey => {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    const colors = [CHART_COLORS_IC.primary, CHART_COLORS_IC.secondary, CHART_COLORS_IC.tertiary, CHART_COLORS_IC.warning, CHART_COLORS_IC.danger];
    const datasets = Object.keys(topTrainersTrends).map((trainerName, idx) => ({
        label: trainerName,
        data: months.map(m => topTrainersTrends[trainerName][m] || 0),
        borderColor: colors[idx % colors.length],
        backgroundColor: colors[idx % colors.length] + '20',
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
    }));
    attendanceComplianceChart.data.labels = labels;
    attendanceComplianceChart.data.datasets = datasets;
    attendanceComplianceChart.options.plugins.legend.display = datasets.length > 1;
    attendanceComplianceChart.update('none');
}
function updateMonitoringModeChart() {
    const modes = Object.entries(aggregatedData.monitoringModes || {}).map(([key, value]) => ({key, value}));
    if (modes.length === 0) return;
    monitoringChart.data.labels = modes.map(m => m.key);
    monitoringChart.data.datasets[0].data = modes.map(m => m.value);
    monitoringChart.update();
}
// IC Form Graphs - Updated for horizontal stacked bars
function updateICFormGraphs() {
    const selectedSection = document.getElementById('icFormFilter').value;
    const container = document.getElementById('icFormGraphsContainer');
    const selectedIC = document.getElementById('icFilter').value;
    const startDateICStr = document.getElementById('startDateICForm').value;
    const endDateICStr = document.getElementById('endDateICForm').value;
    const startDateIC = startDateICStr ? new Date(startDateICStr) : null;
    const endDateIC = endDateICStr ? new Date(endDateICStr) : null;
    const selectedTrainer = document.getElementById('trainerFilterICForm').value;
    // Filter icData based on IC Form specific filters
    let filteredICForForms = icData.filter(row => {
        const matchesIC = selectedIC === 'All' || row.ic_name_select === selectedIC;
        const subDate = getDateOnly(row.starttime);
        const sDate = startDateIC ? getDateOnly(startDateIC) : null;
        const eDate = endDateIC ? getDateOnly(endDateIC) : null;
        const matchesDate = !sDate || subDate >= sDate;
        const matchesEndDate = !eDate || subDate <= eDate;
        const matchesTrainer = selectedTrainer === 'All' || row.trainer_name === selectedTrainer;
        return matchesIC && matchesDate && matchesEndDate && matchesTrainer;
    });
    const distributions = computeICFormDistributions(filteredICForForms);
    // Destroy existing charts
    Object.values(icFormCharts).forEach(chart => chart.destroy());
    icFormCharts = {};
    const getColors = (numOptions) => {
        if (numOptions === 4) return LIKERT_COLORS_4;
        if (numOptions === 5) return LIKERT_COLORS_5;
        return LIKERT_COLORS_6;
    };
    if (selectedSection === 'All') {
        // Grid of small horizontal stacked bar charts per section
        container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
        container.innerHTML = '';
        Object.keys(SECTION_COLUMNS).forEach(sectionKey => {
            const qDist = distributions[sectionKey];
            if (Object.keys(qDist).length === 0) return;
            const questions = Object.keys(qDist);
            const numOptions = LIKERT_LABELS[sectionKey].length;
            const responseTypes = LIKERT_LABELS[sectionKey];
            const colors = getColors(numOptions);
            const datasets = responseTypes.map((label, idx) => ({
                label: label.substring(0, 3), // Short labels for legend/space
                data: questions.map(q => {
                    const counts = qDist[q];
                    const total = counts.reduce((a, b) => a + b, 0);
                    return total > 0 ? (counts[idx] / total * 100) : 0;
                }),
                backgroundColor: colors[idx % colors.length]
            }));
            const div = document.createElement('div');
            div.className = 'bg-gray-50 p-4 rounded-lg';
            div.innerHTML = `<h4 class="text-sm font-semibold mb-2">${SECTION_NAMES[sectionKey]}</h4><div class="small-chart-container"><canvas id="chart_${sectionKey}"></canvas></div>`;
            container.appendChild(div);
            icFormCharts[sectionKey] = new Chart(document.getElementById(`chart_${sectionKey}`).getContext('2d'), {
                type: 'bar',
                data: {
                    labels: questions, // Use question codes (B1, B2, etc.)
                    datasets
                },
                options: {
                    indexAxis: 'y', // Horizontal bars
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true,
                            min: 0,
                            max: 100,
                            ticks: { callback: v => v + '%', font: { size: 10 } }
                        },
                        y: {
                            stacked: true,
                            ticks: { font: { size: 8 } }
                        }
                    },
                    plugins: {
                        legend: { display: false }, // Hide to save space in small charts
                        datalabels: {
                            display: true,
                            color: '#333',
                            font: {
                                weight: 'bold',
                                size: 8
                            },
                            formatter: function(value) {
                                return value > 15 ? value.toFixed(0) + '%' : '';
                            },
                            anchor: 'center',
                            align: 'center'
                        },
                        tooltip: {
                            callbacks: {
                                title: function(context) {
                                    const sectionQuestions = QUESTION_LABELS[sectionKey];
                                    return sectionQuestions[context[0].dataIndex] || context[0].label;
                                },
                                label: ctx => `${ctx.dataset.label}: ${ctx.parsed.x.toFixed(1)}%`
                            }
                        }
                    }
                }
            });
        });
    } else {
        // Single large horizontal stacked bar chart
        const qDist = distributions[selectedSection];
        if (Object.keys(qDist).length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 py-4">No data for this section</p>';
            return;
        }
        const questions = Object.keys(qDist);
        const qLabels = QUESTION_LABELS[selectedSection]; // Full labels
        const numOptions = LIKERT_LABELS[selectedSection].length;
        const responseTypes = LIKERT_LABELS[selectedSection];
        const colors = getColors(numOptions);
        const datasets = responseTypes.map((label, idx) => ({
            label,
            data: questions.map(q => {
                const counts = qDist[q];
                const total = counts.reduce((a, b) => a + b, 0);
                return total > 0 ? (counts[idx] / total * 100) : 0;
            }),
            backgroundColor: colors[idx % colors.length]
        }));
        container.className = 'grid grid-cols-1 gap-6';
        container.innerHTML = `<div class="col-span-full"><h4 class="text-lg font-semibold mb-4">${SECTION_NAMES[selectedSection]}</h4><div class="chart-container"><canvas id="chart_${selectedSection}"></canvas></div></div>`;
        const canvas = document.getElementById(`chart_${selectedSection}`);
        icFormCharts[selectedSection] = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: questions, // Concise question codes on y-axis
                datasets
            },
            options: {
                indexAxis: 'y', // Horizontal bars
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        min: 0,
                        max: 100,
                        ticks: { callback: v => v + '%', font: { family: 'Montserrat', size: 12 } }
                    },
                    y: {
                        stacked: true,
                        ticks: { font: { family: 'Montserrat', size: 10 } }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Remove legend from side
                    },
                    datalabels: {
                        display: true,
                        color: '#333',
                        font: {
                            weight: 'bold',
                            size: 11
                        },
                        formatter: function(value) {
                            return value > 5 ? value.toFixed(1) + '%' : '';
                        },
                        anchor: 'center',
                        align: 'center'
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return qLabels[context[0].dataIndex] || context[0].label; // Full label on hover
                            },
                            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.x.toFixed(1)}%`
                        }
                    }
                }
            }
        });
    }
}
// Update Hierarchy - Now with left/right partitions
function updateHierarchy() {
    const container = document.getElementById('hierarchyContainer');
    const inPersonData = aggregatedData.inPersonHierarchy || {};
    const onlineData = aggregatedData.onlineHierarchy || {};
    let html = `
        <div class="flex flex-col lg:flex-row gap-6">
            <div class="lg:w-1/2">
                <h4 class="text-lg font-semibold mb-3 text-indigo-600">In-Person Monitoring</h4>
                <div class="max-h-48 overflow-y-auto">
                    <ul class="hierarchy-ul">
    `;
    Object.keys(inPersonData).forEach(ic => {
        const safeIc = ic.replace(/[^a-zA-Z0-9]/g, '_');
        html += `<li><span class="hierarchy-toggle" onclick="toggleSub('ic_in_${safeIc}')">${ic}</span><ul id="ul_ic_in_${safeIc}" style="display:none;">`;
        const trainers = inPersonData[ic];
        Object.keys(trainers).forEach(trainer => {
            const safeTrainer = trainer.replace(/[^a-zA-Z0-9]/g, '_');
            const visits = trainers[trainer];
            html += `<li><span class="hierarchy-toggle" onclick="toggleSub('tr_in_${safeTrainer}')">${trainer}</span><ul id="ul_tr_in_${safeTrainer}" style="display:none;">`;
            visits.forEach(visit => {
                const checked = visit.verified ? 'checked' : '';
                const updatedInfo = visit.verifyUpdatedBy ? `<br><small class="text-gray-500">Verified by ${visit.verifyUpdatedBy} at ${new Date(visit.verifyUpdatedAt).toLocaleString()}</small>` : '';
                html += `<li class="flex items-center justify-between"><span>${visit.date} - ${visit.mode}</span><label class="custom-checkbox"><input type="checkbox" ${checked} onchange="toggleVisitVerify('${visit.uniqueId}', this.checked)"><span class="checkmark"></span><span>IC Visit Verified</span></label>${updatedInfo}</li>`;
            });
            html += '</ul></li>';
        });
        html += '</ul></li>';
    });
    html += `
                    </ul>
                </div>
            </div>
            <div class="lg:w-1/2">
                <h4 class="text-lg font-semibold mb-3 text-green-600">Online Monitoring</h4>
                <div class="max-h-48 overflow-y-auto">
                    <ul class="hierarchy-ul">
    `;
    Object.keys(onlineData).forEach(ic => {
        const safeIc = ic.replace(/[^a-zA-Z0-9]/g, '_');
        html += `<li><span class="hierarchy-toggle" onclick="toggleSub('ic_on_${safeIc}')">${ic}</span><ul id="ul_ic_on_${safeIc}" style="display:none;">`;
        const trainers = onlineData[ic];
        Object.keys(trainers).forEach(trainer => {
            const safeTrainer = trainer.replace(/[^a-zA-Z0-9]/g, '_');
            const visits = trainers[trainer];
            html += `<li><span class="hierarchy-toggle" onclick="toggleSub('tr_on_${safeTrainer}')">${trainer}</span><ul id="ul_tr_on_${safeTrainer}" style="display:none;">`;
            visits.forEach(visit => {
                const checked = visit.verified ? 'checked' : '';
                const updatedInfo = visit.verifyUpdatedBy ? `<br><small class="text-gray-500">Verified by ${visit.verifyUpdatedBy} at ${new Date(visit.verifyUpdatedAt).toLocaleString()}</small>` : '';
                html += `<li class="flex items-center justify-between"><span>${visit.date} - ${visit.mode}</span><label class="custom-checkbox"><input type="checkbox" ${checked} onchange="toggleVisitVerify('${visit.uniqueId}', this.checked)"><span class="checkmark"></span><span>IC Visit Verified</span></label>${updatedInfo}</li>`;
            });
            html += '</ul></li>';
        });
        html += '</ul></li>';
    });
    html += `
                    </ul>
                </div>
            </div>
        </div>
    `;
    if (Object.keys(inPersonData).length === 0 && Object.keys(onlineData).length === 0) {
        html = '<p class="text-center text-gray-500 py-4">No hierarchy data available</p>';
    }
    container.innerHTML = html;
}
// Update Visit Bar Chart
function updateVisitBarChart() {
    const data = aggregatedData.visitCompliance || {};
    if (Object.keys(data).length === 0) return;
    const ics = Object.keys(data).sort();
    const day1 = ics.map(ic => data[ic].day1);
    const day2 = ics.map(ic => data[ic].day2);
    visitComplianceChart.data.labels = ics;
    visitComplianceChart.data.datasets[0].data = day1;
    visitComplianceChart.data.datasets[1].data = day2;
    visitComplianceChart.update();
}
// Update Visits Over Time Chart
function updateVisitsOverTimeChart() {
    const data = aggregatedData.visitsOverTime;
    if (!data || data.datasets.length === 0) return;
    visitsOverTimeChart.data.labels = data.labels;
    visitsOverTimeChart.data.datasets = data.datasets;
    visitsOverTimeChart.update();
}
// Trainer's Recent Updates
function updateTrainersFieldUpdates() {
    const list = document.getElementById('trainersUpdatesList');
    const periodEl = document.getElementById('trainersUpdatePeriod');
    const recent = aggregatedData.recentFromBen || [];
    periodEl.textContent = recent.length > 0 ? `(${aggregatedData.period})` : ' (No data)';
    list.innerHTML = recent.map((u, i) => {
        const icon = '<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>';
        const formattedDateTime = new Date(u.date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        return `<li class="update-item feed-item" style="animation-delay: ${i * 0.1}s;">
            <div class="update-header">
                <div class="flex items-start gap-3">
                    <div class="update-icon">${icon}</div>
                    <div>
                        <div class="update-content"><strong>${u.trainer}</strong></div>
                        <div class="update-notes">${u.notes}</div>
                    </div>
                </div>
                <div class="update-date">${formattedDateTime}</div>
            </div>
        </li>`;
    }).join('') || '<li class="text-center text-gray-500 py-4">No recent updates</li>';
}
// IC's Recent Updates
function updateICsFieldUpdates() {
    const list = document.getElementById('icsUpdatesList');
    const periodEl = document.getElementById('icsUpdatePeriod');
    const recent = aggregatedData.recentFromIC || [];
    periodEl.textContent = recent.length > 0 ? `(${aggregatedData.period})` : ' (No data)';
    list.innerHTML = recent.map((u, i) => {
        const icon = u.suitable === 'yes' ? '<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>' : '<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"></path></svg>';
        const formattedDateTime = new Date(u.date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        return `<li class="update-item feed-item" style="animation-delay: ${i * 0.1}s;">
            <div class="update-header">
                <div class="flex items-start gap-3">
                    <div class="update-icon">${icon}</div>
                    <div>
                        <div class="update-content"><strong>${u.ic} - ${u.trainer}</strong> (Session: ${u.session})</div>
                        <div class="update-notes">Mode: ${u.mode} | Suitable: ${u.suitable} | Issues: ${u.issues} (${u.category} - ${u.subcategory})</div>
                    </div>
                </div>
                <div class="update-date">${formattedDateTime}</div>
            </div>
        </li>`;
    }).join('') || '<li class="text-center text-gray-500 py-4">No recent updates</li>';
}
// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    if (sessionStorage.getItem('isVerified') !== 'true') {
        window.location.href = '/login.html';
        return;
    }
    currentUser = sessionStorage.getItem('username') || '';
    mobileMenuBtn.addEventListener('click', toggleMobileSidebar);
    closeSidebarBtn.addEventListener('click', closeMobileSidebar);
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
    document.querySelectorAll('#left-sidebar a').forEach(link => link.addEventListener('click', () => window.innerWidth < 1024 && closeMobileSidebar()));
    await initDashboard();
});

