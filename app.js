const noteInput = document.getElementById('note-input');
const btnGenerate = document.getElementById('btn-generate');
const cardGrid = document.getElementById('card-grid');
const cardCount = document.getElementById('card-count');

btnGenerate.addEventListener('click', generateDeck);

function generateDeck() {
  const text = noteInput.value.trim();
  cardGrid.innerHTML = '';

  if (!text) {
    cardCount.textContent = '0';
    return;
  }

  const lines = text.split('\n');
  let count = 0;

  lines.forEach(line => {
    if (line.includes(':')) {
      const parts = line.split(':');
      const term = parts[0].trim();
      const definition = parts.slice(1).join(':').trim();

      if (term && definition) {
        count++;
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.innerHTML = `
          <div class="term">${term}</div>
          <div class="definition">${definition}</div>
        `;
        cardGrid.appendChild(cardEl);
      }
    }
  });

  cardCount.textContent = count;
}

// Generate default deck on load
generateDeck();

