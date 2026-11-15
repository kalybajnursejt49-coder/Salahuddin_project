const sportFilter = document.querySelector('#sport-filter');
const filterStatus = document.querySelector('#filter-status');
const scheduleRows = document.querySelectorAll('.table tbody tr');

if (sportFilter && filterStatus) {
  sportFilter.addEventListener('change', () => {
    const selectedSport = sportFilter.value.toLowerCase();
    let visibleCount = 0;

    scheduleRows.forEach((row) => {
      const sportName = row.querySelector('th').textContent.trim().toLowerCase();
      const shouldShow = selectedSport === 'all' || sportName === selectedSport;
      row.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    filterStatus.textContent = selectedSport === 'all'
      ? `Showing all ${visibleCount} class times.`
      : `Showing ${visibleCount} ${sportFilter.options[sportFilter.selectedIndex].text} class times.`;
  });
}
