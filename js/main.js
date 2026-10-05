const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('open');
    }
  });
}

const scheduleRows = [...document.querySelectorAll('.schedule-table tbody tr')];
let selectedBranch = 'all';
let selectedSport = 'all';

function updateSchedule() {
  let visibleCount = 0;

  scheduleRows.forEach((row) => {
    const branchMatches = selectedBranch === 'all' || row.dataset.branch === selectedBranch;
    const sportMatches = selectedSport === 'all' || row.dataset.sport === selectedSport;
    const isVisible = branchMatches && sportMatches;
    row.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  const result = document.querySelector('.filter-result');
  if (result) {
    result.textContent = visibleCoun
      ? `Showing ${visibleCount} ${visibleCount === 1 ? 'class time' : 'class times'}.`
      : 'No class times match these filters.';
  }
}

document.querySelectorAll('[data-branch-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    selectedBranch = button.dataset.branchFilter;
    document.querySelectorAll('[data-branch-filter]').forEach((filter) => {
      const isSelected = filter === button;
      filter.classList.toggle('selected', isSelected);
      filter.setAttribute('aria-pressed', String(isSelected));
    });
    updateSchedule();
  });
});

document.querySelectorAll('[data-sport-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    selectedSport = button.dataset.sportFilter;
    document.querySelectorAll('[data-sport-filter]').forEach((filter) => {
      const isSelected = filter === button;
      filter.classList.toggle('selected', isSelected);
      filter.setAttribute('aria-pressed', String(isSelected));
    });
    updateSchedule();
  });
});

const enquiryForm = document.querySelector('[data-demo-form]');

if (enquiryForm) {
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!enquiryForm.reportValidity()) return;

    const status = enquiryForm.querySelector('.form-status');
    status.textContent = 'Thanks! Your request has been submitted (demo only).';
  });
}
\n