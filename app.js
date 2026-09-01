const noteInput = document.getElementById('note-input');
const btnGenerate = document.getElementById('btn-generate');
const cardGrid = document.getElementById('card-grid');
const cardCount = document.getElementById('card-count');

const btnOpenCamera = document.getElementById('btn-open-camera');
const btnCloseCamera = document.getElementById('btn-close-camera');
const btnCapture = document.getElementById('btn-capture');
const cameraModal = document.getElementById('camera-modal');
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('capture-canvas');
const ocrStatus = document.getElementById('ocr-status');
const ocrMsg = document.getElementById('ocr-msg');

let mediaStream = null;

// Generate Deck
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

// Camera Operations
btnOpenCamera.addEventListener('click', async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    webcam.srcObject = mediaStream;
    cameraModal.style.display = 'flex';
  } catch (err) {
    alert('Unable to access camera. Please allow camera permissions.');
  }
});

btnCloseCamera.addEventListener('click', closeCamera);

function closeCamera() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }
  cameraModal.style.display = 'none';
}

// Snap Photo & OCR
btnCapture.addEventListener('click', async () => {
  const ctx = canvas.getContext('2d');
  canvas.width = webcam.videoWidth;
  canvas.height = webcam.videoHeight;
  ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);

  closeCamera();
  ocrStatus.style.display = 'block';
  ocrMsg.textContent = 'Extracting text from image... (This takes a few seconds)';

  try {
    const { data: { text } } = await Tesseract.recognize(canvas, 'eng');
    ocrStatus.style.display = 'none';
    noteInput.value += (noteInput.value ? '\n' : '') + text;
    generateDeck();
  } catch (err) {
    ocrStatus.style.display = 'none';
    alert('Failed to process image text.');
  }
});

generateDeck();
