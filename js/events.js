/* Labels each trade show tile Past, Next up or Upcoming from its date, so the section stays current without edits. */
(function () {
  var cards = [].slice.call(document.querySelectorAll('.event-card[data-date]'));
  if (!cards.length) return;
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var nextFound = false;
  cards.forEach(function (card) {
    var p = card.getAttribute('data-date').split('-');
    var day = new Date(+p[0], +p[1] - 1, +p[2]);
    var past = day < today;
    var next = !past && !nextFound;
    if (next) nextFound = true;
    card.classList.toggle('is-past', past);
    var tag = card.querySelector('.event-when');
    if (!tag) return;
    tag.className = 'event-when ' + (past ? 'is-past' : next ? 'is-next' : 'is-upcoming');
    tag.textContent = past ? 'Past' : next ? (day.getTime() === today.getTime() ? 'Today' : 'Next up') : 'Upcoming';
  });
})();
