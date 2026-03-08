// shared-sidebar.js – single source of truth for all deck sidebars
// Replaces the <ul> inside #left-sidebar with the canonical nav list
// and highlights the current page automatically.

(function () {
  const NAV = [
    {
      file: 'index.html',
      label: 'DFLT Status Deck',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>'
    },
    {
      file: 'Benefeciary_status_deck.html',
      label: 'Beneficiary Status',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>'
    },
    {
      file: 'beneficiary_data_deck.html',
      label: 'Beneficiary Data',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M3 6h18M3 18h18"/>'
    },
    {
      file: 'DFLT_2_Soft_launch_Map.html',
      label: 'DFLT Mapping',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>'
    },
    {
      file: 'Trainings_Locations_Viewers.html',
      label: 'DFLT Session',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>'
    },
    {
      file: 'trainers_deck.html',
      label: 'Trainers Progress',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>'
    },
    {
      file: 'ic_data_deck.html',
      label: 'IC Monitoring Deck',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>'
    },
    {
      file: 'GRM Table.html',
      label: 'GRM Analytics Table',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>'
    },
    {
      file: 'duration_deck.html',
      label: 'Duration Analysis',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    },
    {
      file: 'trainer_fact_report.html',
      label: 'Trainer Fact Report',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'
    },
    {
      file: 'DFLT-Target Deck.html',
      label: 'Target Achievement',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>'
    },
    {
      file: 'DFLT_Visuals_Deck.html',
      label: 'DFLT Visuals Deck',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>'
    },
    {
      file: 'DFLT Pre-Post.html',
      label: 'DFLT Pre Post',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>'
    },
    {
      file: 'trainer_audit_report.html',
      label: 'Trainers Audits Deck',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    }
  ];

  function buildSidebar() {
    const ul = document.querySelector('#left-sidebar nav ul') ||
               document.querySelector('#left-sidebar ul');
    if (!ul) return;

    // Detect current filename
    const current = window.location.pathname.split('/').pop() || 'index.html';

    ul.innerHTML = NAV.map(item => {
      const isActive = item.file === current;
      const aClass = isActive
        ? 'flex items-center p-2 text-base font-normal rounded-lg bg-indigo-100 text-indigo-700 font-semibold'
        : 'flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100';
      const svgClass = isActive ? 'w-6 h-6 shrink-0 text-indigo-600' : 'w-6 h-6 shrink-0 text-gray-500';
      return `
        <li>
          <a href="${item.file}" class="${aClass}">
            <svg class="${svgClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              ${item.icon}
            </svg>
            <span class="ml-3">${item.label}</span>
          </a>
        </li>`;
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSidebar);
  } else {
    buildSidebar();
  }
})();
