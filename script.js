// ============================================================
// CIPHER IMPLEMENTATIONS
// ============================================================

// --- Caesar Cipher ---
function caesarEncrypt(text, key) {
  const shift = ((parseInt(key) || 3) % 26 + 26) % 26;
  return text.toUpperCase().replace(/[A-Z]/g, c =>
    String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65)
  );
}
function caesarDecrypt(text, key) {
  return caesarEncrypt(text, 26 - ((parseInt(key) || 3) % 26 + 26) % 26);
}

// --- Vigenere Cipher ---
function vigenereEncrypt(text, key) {
  if (!key || !/[a-zA-Z]/.test(key)) key = 'KEY';
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  let i = 0;
  return text.toUpperCase().replace(/[A-Z]/g, c => {
    const enc = String.fromCharCode(
      (c.charCodeAt(0) - 65 + key.charCodeAt(i % key.length) - 65) % 26 + 65
    );
    i++;
    return enc;
  });
}
function vigenereDecrypt(text, key) {
  if (!key || !/[a-zA-Z]/.test(key)) key = 'KEY';
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  let i = 0;
  return text.toUpperCase().replace(/[A-Z]/g, c => {
    const dec = String.fromCharCode(
      (c.charCodeAt(0) - 65 - (key.charCodeAt(i % key.length) - 65) + 26) % 26 + 65
    );
    i++;
    return dec;
  });
}

// --- Rail Fence Cipher ---
function railFenceEncrypt(text, key) {
  const rails = Math.max(2, parseInt(key) || 3);
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
  const fence = Array.from({ length: rails }, () => []);
  let rail = 0, dir = 1;
  for (const c of clean) {
    fence[rail].push(c);
    if (rail === 0) dir = 1;
    if (rail === rails - 1) dir = -1;
    rail += dir;
  }
  return fence.map(r => r.join('')).join('');
}
function railFenceDecrypt(text, key) {
  const rails = Math.max(2, parseInt(key) || 3);
  const n = text.length;
  const pattern = [];
  let rail = 0, dir = 1;
  for (let i = 0; i < n; i++) {
    pattern.push(rail);
    if (rail === 0) dir = 1;
    if (rail === rails - 1) dir = -1;
    rail += dir;
  }
  const sorted = pattern.map((r, i) => ({ r, i })).sort((a, b) => a.r - b.r || a.i - b.i);
  const result = new Array(n);
  for (let i = 0; i < n; i++) result[sorted[i].i] = text[i];
  return result.join('');
}

// --- Playfair Cipher ---
function buildPlayfairMatrix(key) {
  const seen = new Set();
  const order = (key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '') + 'ABCDEFGHIKLMNOPQRSTUVWXYZ')
    .split('').filter(c => { if (!seen.has(c)) { seen.add(c); return true; } return false; });
  return Array.from({ length: 5 }, (_, i) => order.slice(i * 5, i * 5 + 5));
}
function preparePlayfair(text) {
  let result = '';
  let i = 0;
  while (i < text.length) {
    const a = text[i];
    const b = text[i + 1];
    if (!b || a === b) { result += a + 'X'; i++; }
    else { result += a + b; i += 2; }
  }
  if (result.length % 2 !== 0) result += 'X';
  return result;
}
function findPos(matrix, c) {
  for (let r = 0; r < 5; r++)
    for (let col = 0; col < 5; col++)
      if (matrix[r][col] === c) return [r, col];
  return [0, 0];
}
function playfairEncrypt(text, key) {
  if (!key || !/[a-zA-Z]/.test(key)) key = 'KEY';
  const matrix = buildPlayfairMatrix(key);
  const prepared = preparePlayfair(text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I'));
  let result = '';
  for (let i = 0; i < prepared.length; i += 2) {
    const [a, b] = [prepared[i], prepared[i + 1]];
    const [ra, ca] = findPos(matrix, a), [rb, cb] = findPos(matrix, b);
    if (ra === rb) {
      result += matrix[ra][(ca + 1) % 5] + matrix[rb][(cb + 1) % 5];
    } else if (ca === cb) {
      result += matrix[(ra + 1) % 5][ca] + matrix[(rb + 1) % 5][cb];
    } else {
      result += matrix[ra][cb] + matrix[rb][ca];
    }
  }
  return result;
}
function playfairDecrypt(text, key) {
  if (!key || !/[a-zA-Z]/.test(key)) key = 'KEY';
  const matrix = buildPlayfairMatrix(key);
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '';
  for (let i = 0; i < clean.length; i += 2) {
    const [a, b] = [clean[i], clean[i + 1] || 'X'];
    const [ra, ca] = findPos(matrix, a), [rb, cb] = findPos(matrix, b);
    if (ra === rb) {
      result += matrix[ra][(ca + 4) % 5] + matrix[rb][(cb + 4) % 5];
    } else if (ca === cb) {
      result += matrix[(ra + 4) % 5][ca] + matrix[(rb + 4) % 5][cb];
    } else {
      result += matrix[ra][cb] + matrix[rb][ca];
    }
  }
  return result;
}

// ============================================================
// APP LOGIC
// ============================================================

const messages = [];

function getCipher() { return document.getElementById('cipherSelect').value; }
function getKey()    { return document.getElementById('keyInput').value || '3'; }

function encrypt(text) {
  const c = getCipher(), k = getKey();
  if (c === 'caesar')    return caesarEncrypt(text, k);
  if (c === 'vigenere')  return vigenereEncrypt(text, k);
  if (c === 'railfence') return railFenceEncrypt(text, k);
  if (c === 'playfair')  return playfairEncrypt(text, k);
}

function decrypt(text, cipher, key) {
  if (cipher === 'caesar')    return caesarDecrypt(text, key);
  if (cipher === 'vigenere')  return vigenereDecrypt(text, key);
  if (cipher === 'railfence') return railFenceDecrypt(text, key);
  if (cipher === 'playfair')  return playfairDecrypt(text, key);
}

function updateBadge() {
  const c = document.getElementById('cipherSelect').value.toUpperCase();
  const k = getKey();
  document.getElementById('cipherBadge').textContent = `${c} / KEY:${k}`;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function sendMessage() {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if (!text) return;
  const cipher = getCipher(), key = getKey();
  const ciphertext = encrypt(text);
  addMessage({ type: 'sent', plain: text, cipher: ciphertext, cipherAlgo: cipher, cipherKey: key, time: now() });
  input.value = '';
  input.style.height = 'auto';
}

function sendDecryptedMessage() {
  const input = document.getElementById('msgInput');
  const ciphertext = input.value.trim();
  if (!ciphertext) return;
  const cipher = getCipher(), key = getKey();
  const plaintext = decrypt(ciphertext, cipher, key);
  addMessage({ type: 'sent', plain: plaintext, cipher: ciphertext, cipherAlgo: cipher, cipherKey: key, time: now(), isDecrypted: true });
  input.value = '';
  input.style.height = 'auto';
}

const SAMPLE_MSGS = [
  'Meet me at the usual spot',
  'The package has arrived',
  'Confirm receipt of this message',
  'Operation is a go',
  'All clear on our end'
];

function simulateReceive() {
  const plain = SAMPLE_MSGS[Math.floor(Math.random() * SAMPLE_MSGS.length)];
  const cipher = getCipher(), key = getKey();
  const ciphertext = encrypt(plain);
  addMessage({ type: 'received', plain: null, cipher: ciphertext, cipherAlgo: cipher, cipherKey: key, time: now() });
}

function addMessage(msg) {
  messages.push(msg);
  document.getElementById('emptyState')?.remove();
  renderMessage(msg);
}

function renderMessage(msg) {
  const area = document.getElementById('chatArea');
  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper ${msg.type}`;
  const cipherLabel = msg.cipherAlgo.toUpperCase();
  const metaLabel = msg.type === 'sent' ? 'YOU' : 'REMOTE';
  const idx = messages.length - 1;

  let inner = `
    <div class="msg-meta">
      <span>${metaLabel}</span>
      <span class="cipher-tag">${cipherLabel}</span>
      <span>${msg.time}</span>
    </div>
    <div class="msg-bubble">`;

  if (msg.type === 'sent') {
    if (msg.isDecrypted) {
      inner += `
        <div class="ciphertext-label">CIPHERTEXT</div>
        <div class="ciphertext" title="Click to copy" onclick="copyText('${msg.cipher}')">${msg.cipher}</div>
        <div class="ciphertext-label" style="margin-top:8px">DECRYPTED</div>
        <div class="plaintext" style="margin-top:2px">🔓 ${msg.plain}</div>`;
    } else {
      inner += `
        <div class="plaintext">📨 ${msg.plain}</div>
        <div class="ciphertext-label">ENCRYPTED</div>
        <div class="ciphertext" title="Click to copy" onclick="copyText('${msg.cipher}')">${msg.cipher}</div>`;
    }
  } else {
    inner += `
      <div class="ciphertext-label">RECEIVED CIPHERTEXT</div>
      <div class="ciphertext" style="color:var(--accent2);border-color:var(--accent2)">${msg.cipher}</div>
      <div id="decoded-${idx}" style="display:none">
        <div class="ciphertext-label" style="margin-top:8px">DECRYPTED</div>
        <div class="plaintext" style="margin-top:2px">🔓 <span></span></div>
      </div>
      <button class="decode-btn" onclick="decodeMsg(this,'${msg.cipher}','${msg.cipherAlgo}','${msg.cipherKey}',${idx})">▶ DECRYPT</button>`;
  }

  inner += `</div>`;
  wrapper.innerHTML = inner;
  area.appendChild(wrapper);
  area.scrollTop = area.scrollHeight;
}

function decodeMsg(btn, cipher, algo, key, idx) {
  const box = document.getElementById(`decoded-${idx}`);
  if (box.style.display === 'none') {
    const plain = decrypt(cipher, algo, key);
    box.querySelector('span').textContent = plain;
    box.style.display = 'block';
    btn.textContent = '▼ HIDE DECRYPTED';
  } else {
    box.style.display = 'none';
    btn.textContent = '▶ DECRYPT';
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast('Ciphertext copied!'))
    .catch(() => showToast('Copy failed'));
}

function now() {
  const d = new Date();
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}

// ── EVENT LISTENERS ──
document.getElementById('cipherSelect').addEventListener('change', updateBadge);
document.getElementById('keyInput').addEventListener('input', updateBadge);

document.getElementById('msgInput').addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});
document.getElementById('msgInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});