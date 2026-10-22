/* Marks each trade show tile as upcoming or past from its date, so the section stays right without edits. */
(function () {
  var cards = document.querySelectorAll('.event-card[data-date]');
  if (!cards.length) return;
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  cards.forEach(function (card) {
    var p = card.getAttribute('data-date').split('-');
    var day = new Date(+p[0], +p[1] - 1, +p[2]);
    var past = day < today;
    card.classList.toggle('is-past', past);
    var s = card.querySelector('.event-status');
    if (s) {
      s.classList.toggle('is-past', past);
      s.classList.toggle('is-upcoming', !past);
      s.textContent = past ? 'We were there' : "We'll be there";
    }
    var link = card.querySelector('.event-link');
    if (link && past) link.remove();
  });
})();
