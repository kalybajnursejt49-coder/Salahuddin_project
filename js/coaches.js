const coachSearch = document.querySelector('#coach-search');
const coachCards = document.querySelectorAll('[data-coach-card]');
const searchStatus = document.querySelector('#coach-search-status');

if (coachSearch && searchStatus) {
  coachSearch.addEventListener('input', () => {
    const searchText = coachSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    coachCards.forEach((card) => {
      const cardText = card.textContent.toLowerCase();
      const matches = cardText.includes(searchText);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    searchStatus.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'coach' : 'coaches'}.`;
  });
}
