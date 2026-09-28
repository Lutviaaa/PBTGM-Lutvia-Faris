// ================= DATA =================
const EKSKUL = [
  ['jurnalistik','Jurnalistik','📰'],['pramuka','Pramuka','⛺'],['pmr','Palang Merah Remaja (PMR)','➕'],
  ['paskibra','Paskibra','🚩'],['basket','Basket','🏀'],['futsal','Futsal','⚽'],
  ['rebana','Rebana','🥁'],['silat','Pencak Silat','🥋'],['seni-tari','Seni Tari','💃'],
  ['drumband','Drumband','🎺'],['bahasa-jepang','Bahasa Jepang','🇯🇵'],['self-riding','Self Riding','🏍️'],
  ['voli','Voli','🏐'],['paduan-suara','Paduan Suara','🎤'],['rohis','Rohis','🕌']
];
const JURUSAN = [['RPL',4],['BUSANA',4],['TKJ',3],['KULINER',3],['TSM',4],['TKR',4]];
const TINGKAT = ['X','XI','XII'];

// Isi dropdown kelas & ekskul otomatis
const kelasSel = document.getElementById('kelas');
TINGKAT.forEach(t => {
  const g = document.createElement('optgroup');
  g.label = 'Kelas ' + t;
  JURUSAN.forEach(([j,n]) => {
    for(let i=1;i<=n;i++){
      const o = document.createElement('option');
      o.value = `${t}-${j}-${i}`.toLowerCase();
      o.textContent = `${t} ${j} ${i}`;
      g.appendChild(o);
    }
  });
  kelasSel.appendChild(g);
});

const ekskulSel = document.getElementById('ekskul');
const grid = document.getElementById('ekskulGrid');
EKSKUL.forEach(([val,nama,ico]) => {

  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'ekskul-card';
  b.dataset.val = val;
  b.innerHTML = `<span class="ico">${ico}</span><span>${nama}</span>`;
  b.addEventListener('click', () => {
    ekskulSel.value = val;
    validateField('ekskul');
    syncCards();
    updateProgress();
    document.getElementById('daftar').scrollIntoView({behavior:'smooth'});
  });
  grid.appendChild(b);
});

function syncCards(){
  grid.querySelectorAll('.ekskul-card').forEach(c =>
    c.classList.toggle('active', c.dataset.val === ekskulSel.value));
}

// ================= FORM VALIDATION =================
const form = document.getElementById('regForm');
const successBox = document.getElementById('successBox');

const rules = {
  nama: v => v.trim().length >= 3,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  password: v => v.length >= 8,
  konfirmasi: v => v.length > 0 && v === document.getElementById('password').value,
  kelas: v => v !== '',
  ekskul: v => v !== ''
};

function validateField(id){
  const input = document.getElementById(id);
  const wrap = document.getElementById('field-' + id);
  const isValid = rules[id](input.value);
  wrap.classList.remove('valid','invalid');
  const isSelect = id === 'kelas' || id === 'ekskul';
  if(input.value === '' && !isSelect) return isValid;
  wrap.classList.add(isValid ? 'valid' : 'invalid');
  return isValid;
}

function updateProgress(){
  const done = Object.keys(rules).filter(id => rules[id](document.getElementById(id).value)).length;
  document.getElementById('progressBar').style.width = (done / 6 * 100) + '%';
  document.getElementById('progressText').textContent = done + ' dari 6 kolom terisi';
}

['nama','email','password','konfirmasi'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => {
    validateField(id);
    if(id === 'password' && document.getElementById('konfirmasi').value !== '') validateField('konfirmasi');
    updateProgress();
  });
  el.addEventListener('blur', () => validateField(id));
});
kelasSel.addEventListener('change', () => { validateField('kelas'); updateProgress(); });
ekskulSel.addEventListener('change', () => { validateField('ekskul'); syncCards(); updateProgress(); });

// Tombol lihat/sembunyikan password
document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Sembunyi' : 'Lihat';
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  successBox.classList.remove('show');
  let allValid = true;
  Object.keys(rules).forEach(id => {
    const ok = rules[id](document.getElementById(id).value);
    const wrap = document.getElementById('field-' + id);
    wrap.classList.remove('valid','invalid');
    wrap.classList.add(ok ? 'valid' : 'invalid');
    if(!ok) allValid = false;
  });
  if(allValid){
    successBox.classList.add('show');
    form.scrollIntoView({behavior:'smooth', block:'nearest'});
  } else {
    const first = form.querySelector('.invalid input, .invalid select');
    if(first) first.focus();
  }
});

// ================= CHATBOT =================
const toggle = document.getElementById('chatToggle');
const panel = document.getElementById('chatPanel');
const body = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
let started = false;

function addMsg(text, who){
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function botReply(raw){
  const t = raw.toLowerCase();
  if(t.includes('ekskul') || t.includes('ekstrakurikuler'))
    return 'Pilihan ekskul: ' + EKSKUL.map(e => e[1]).join(', ') + '.';
  if(t.includes('kelas'))
    return 'Kelas tersedia untuk tingkat X dengan jurusan RPL, Busana, TKJ, Kuliner, TSM, dan TKR. Pilih di dropdown "Pilihan Kelas".';
  if(t.includes('password') || t.includes('sandi'))
    return 'Password minimal 8 karakter, dan Konfirmasi Password harus sama persis.';
  if(t.includes('email'))
    return 'Gunakan format email yang benar, misalnya nama@contoh.com.';
  if(t.includes('cara') || t.includes('daftar'))
    return 'Isi nama, email, password, pilih kelas dan ekskul, lalu klik "Kirim Pendaftaran". Kamu juga bisa mengetuk kartu ekskul di atas.';
  if(t.includes('nama'))
    return 'Nama Lengkap wajib diisi, minimal 3 karakter.';
  if(t.includes('makasih') || t.includes('terima kasih'))
    return 'Sama-sama! Semangat mendaftar ya 🙌';
  return 'Aku bisa bantu soal pilihan kelas, pilihan ekskul, syarat password, atau cara mengisi formulir.';
}

function sendUserMessage(text){
  if(!text.trim()) return;
  addMsg(text.trim(), 'user');
  chatInput.value = '';
  setTimeout(() => addMsg(botReply(text), 'bot'), 350);
}

toggle.addEventListener('click', () => {
  const open = panel.classList.toggle('open');
  toggle.classList.toggle('open', open);
  if(open && !started){
    started = true;
    addMsg('Halo! Aku asisten pendaftaran ekstrakurikuler. Ada yang bisa dibantu seputar formulir ini?', 'bot');
  }
});
document.getElementById('chatSend').addEventListener('click', () => sendUserMessage(chatInput.value));
chatInput.addEventListener('keydown', e => { if(e.key === 'Enter') sendUserMessage(chatInput.value); });
document.querySelectorAll('.chat-quick button').forEach(btn => {
  btn.addEventListener('click', () => {
    const q = { kelas:'Apa saja pilihan kelasnya?', ekskul:'Apa saja pilihan ekskulnya?', password:'Apa syarat passwordnya?' };
    sendUserMessage(q[btn.dataset.q]);
  });
});


// ================= TAMBAHAN JS =================

// 1) Angka statistik hero naik dari 0 saat halaman dibuka
document.querySelectorAll('.stats b').forEach(el => {
  const target = parseInt(el.textContent, 10);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce || isNaN(target)) return;
  const start = performance.now(), dur = 1200;
  (function tick(now){
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if(p < 1) requestAnimationFrame(tick);
  })(start);
});

// 2) Kotak cari ekskul
(function(){
  const title = document.querySelector('.section-title');
  const wrap = document.createElement('div');
  wrap.className = 'cari';
  wrap.innerHTML = '<input type="search" id="cariEkskul" placeholder="Cari ekskul, misalnya basket..." aria-label="Cari ekskul">';
  title.appendChild(wrap);
  const empty = document.createElement('p');
  empty.className = 'cari-kosong';
  empty.textContent = 'Ekskul tidak ditemukan. Coba kata kunci lain.';
  empty.hidden = true;
  grid.after(empty);

  wrap.firstChild.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    let shown = 0;
    grid.querySelectorAll('.ekskul-card').forEach(c => {
      const match = c.textContent.toLowerCase().includes(q);
      c.hidden = !match;
      if(match) shown++;
    });
    empty.hidden = shown > 0;
  });
})();

// 3) Indikator kekuatan password
(function(){
  const pw = document.getElementById('password');
  const box = document.createElement('div');
  box.className = 'strength';
  box.innerHTML = '<div class="strength-bar"><i></i></div><small></small>';
  pw.closest('.pw-wrap').after(box);
  const bar = box.querySelector('i'), label = box.querySelector('small');
  const levels = [
    ['', '0%', ''],
    ['Lemah', '25%', '#C0392B'],
    ['Cukup', '50%', '#E08E0B'],
    ['Kuat', '75%', '#1BB3A3'],
    ['Sangat kuat', '100%', '#1E8E6E']
  ];
  pw.addEventListener('input', () => {
    const v = pw.value;
    let s = 0;
    if(v.length >= 8) s++;
    if(/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
    if(/\d/.test(v)) s++;
    if(/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
    if(!v) s = 0;
    const [txt, w, col] = levels[s];
    bar.style.width = w; bar.style.background = col;
    label.textContent = txt ? 'Kekuatan password: ' + txt : '';
  });
})();

// 4) Simpan draft otomatis (nama, email, kelas, ekskul — password tidak disimpan)
const DRAFT_KEY = 'ekskul-draft';
const draftFields = ['nama', 'email', 'kelas', 'ekskul'];
function saveDraft(){
  try {
    const d = {};
    draftFields.forEach(id => d[id] = document.getElementById(id).value);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch(e) {}
}
function loadDraft(){
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if(!d) return;
    draftFields.forEach(id => {
      if(d[id]) { document.getElementById(id).value = d[id]; validateField(id); }
    });
    syncCards(); updateProgress();
  } catch(e) {}
}
draftFields.forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', saveDraft);
  el.addEventListener('change', saveDraft);
});
loadDraft();

// 5) Ringkasan setelah berhasil daftar + tombol "Daftar lagi"
form.addEventListener('submit', () => {
  if(!successBox.classList.contains('show')) return;
  const nama = document.getElementById('nama').value.trim();
  const kelas = kelasSel.options[kelasSel.selectedIndex].text;
  const ekskul = ekskulSel.options[ekskulSel.selectedIndex].text;
  successBox.querySelector('span').innerHTML =
    'Pendaftaran berhasil!<br><b></b> (kelas ' + kelas + ') terdaftar di ekskul <b>' + ekskul +
    '</b>. Silakan cek email untuk info lebih lanjut.<br><button type="button" class="again-btn">Daftar lagi</button>';
  successBox.querySelectorAll('b')[0].textContent = nama;   // aman dari HTML injection
  try { localStorage.removeItem(DRAFT_KEY); } catch(e) {}
  successBox.querySelector('.again-btn').addEventListener('click', () => {
    form.reset();
    document.querySelectorAll('.field').forEach(f => f.classList.remove('valid', 'invalid'));
    successBox.classList.remove('show');
    document.querySelector('.strength-bar i').style.width = '0';
    document.querySelector('.strength small').textContent = '';
    syncCards(); updateProgress();
    document.getElementById('nama').focus();
  });
});