/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MEUS 15 ANOS — script_main.js  ✦ Debutante Edition
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── CURSOR ──────────────────────────────────────────────── */
const cDot  = document.getElementById('cDot');
const cRing = document.getElementById('cRing');
let mx = 0, my = 0, rx = 0, ry = 0;
let isMoving = false, moveTimer;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (!isMoving) {
    isMoving = true;
    cDot.style.opacity = '1'; cRing.style.opacity = '1';
  }
  clearTimeout(moveTimer);
  moveTimer = setTimeout(() => {
    isMoving = false;
    cDot.style.opacity = '0.4'; cRing.style.opacity = '0.4';
  }, 2000);
});

document.querySelectorAll('a, button, summary, .g-item, .stat-box, .pix-feat').forEach(el => {
  el.addEventListener('mouseenter', () => cRing.classList.add('hov'));
  el.addEventListener('mouseleave', () => cRing.classList.remove('hov'));
});

function animCursor() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  cDot.style.cssText  = `left:${mx}px;top:${my}px`;
  cRing.style.cssText = `left:${rx}px;top:${ry}px`;
  requestAnimationFrame(animCursor);
}
animCursor();

/* ── LOADER ──────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('out');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    initReveal();
    initCounters();
    initParallax();
    initDriveEmbed();
    initMural();
    initQuiz();
  }, 2000);
});

/* ── GOOGLE DRIVE EMBED ──────────────────────────────────── */
function getDriveFolderId(url) {
  if (!url) return null;
  const s = String(url).trim();
  let m = s.match(/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/i);
  if (m && m[1]) return m[1];
  m = s.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (m && m[1]) return m[1];
  return null;
}

function initDriveEmbed() {
  const link  = document.getElementById('driveLink');
  const frame = document.getElementById('driveFrame');
  const hint  = document.getElementById('driveHint');
  if (!link || !frame) return;
  const folderId = getDriveFolderId(link.getAttribute('href') || '');
  if (folderId) {
    frame.src = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}#grid`;
    if (hint) hint.textContent = 'Aponte a câmera do celular para acessar o álbum pelo botão, se preferir.';
    return;
  }
  frame.src = 'about:blank';
  if (hint) hint.textContent = 'Configure um link de pasta do Google Drive (compartilhado) para exibir as fotos aqui.';
}

/* ── NAVBAR ──────────────────────────────────────────────── */
const nav = document.getElementById('nav');
const ham = document.getElementById('ham');
const nl  = document.getElementById('navLinks');
const btt = document.getElementById('btt');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  nav.classList.toggle('scrolled', sy > 50);
  btt.classList.toggle('visible', sy > 400);
  if (sy > 100) {
    if (sy > lastScrollY + 5)       nav.style.transform = 'translateY(-100%)';
    else if (sy < lastScrollY - 5)  nav.style.transform = 'translateY(0)';
  } else {
    nav.style.transform = 'translateY(0)';
  }
  lastScrollY = sy;
}, { passive: true });

nav.style.transition = 'background .5s, padding .4s, border-color .5s, box-shadow .5s, transform .4s cubic-bezier(.25,.46,.45,.94)';

ham.addEventListener('click', () => {
  const isOpen = ham.classList.toggle('open');
  nl.classList.toggle('mob');
  ham.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

nl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    ham.classList.remove('open'); nl.classList.remove('mob');
    ham.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' }); }
  });
});
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── SCROLL REVEAL ───────────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
}

/* ── ANIMATED COUNTERS ───────────────────────────────────── */
function initCounters() {
  document.querySelectorAll('.stat-n[data-target]').forEach(el => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const target = +el.dataset.target, dur = 1800, start = performance.now();
      const step = now => {
        const p = Math.min((now - start) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target).toLocaleString('pt-BR');
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('pt-BR');
      };
      requestAnimationFrame(step); obs.unobserve(el);
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}

/* ── PARALLAX ORBS ───────────────────────────────────────── */
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        orbs.forEach((orb, i) => { orb.style.transform = `translateY(${sy * (.08 + i * .04)}px)`; });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── GIFT FILTER ─────────────────────────────────────────── */
let activeCategory = 'all', searchQuery = '';

document.querySelectorAll('.flt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.flt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeCategory = btn.dataset.cat; runFilter();
  });
});

const searchInput = document.getElementById('searchInput');
let searchDebounce;
searchInput.addEventListener('input', e => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => { searchQuery = e.target.value.toLowerCase().trim(); runFilter(); }, 180);
});

function runFilter() {
  let visible = 0;
  document.querySelectorAll('.g-item').forEach(item => {
    const catMatch  = activeCategory === 'all' || item.dataset.cat === activeCategory;
    const nameMatch = !searchQuery || item.dataset.name.toLowerCase().includes(searchQuery) || item.dataset.cat.toLowerCase().includes(searchQuery);
    if (catMatch && nameMatch) {
      item.style.display = '';
      item.style.opacity = '0'; item.style.transform = 'translateY(12px)';
      setTimeout(() => {
        item.style.transition = 'opacity .3s ease, transform .3s ease';
        item.style.opacity = '1'; item.style.transform = '';
      }, visible * 30);
      visible++;
    } else { item.style.display = 'none'; }
  });
  document.getElementById('noRes').style.display = visible === 0 ? 'block' : 'none';
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   💚  PIX — PAYLOAD EMV REAL (padrão Banco Central)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Dados da recebedora:
   Chave  : CPF 12964137480
   Nome   : Maria Eduarda Carvalho de Santana
   Cidade : Camaragibe
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const PIX_KEY    = '12964137480';           /* CPF sem pontos/traços */
const PIX_NAME   = 'Maria Eduarda C Santana'; /* máx 25 caracteres */
const PIX_CITY   = 'Camaragibe';            /* máx 15 caracteres */
const PIX_TXID   = 'MEUS15ANOS';           /* ID da transação, alfanum, máx 25 */

/* ── Gerador de CRC16-CCITT (XMODEM) ── */
function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return ((crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0'));
}

/* ── Monta campo TLV (Tag + Length + Value) ── */
function tlv(id, value) {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/* ── Gerador do payload PIX completo ── */
function buildPixPayload(amount) {
  /* Merchant Account Information (ID 26) — dados do PIX */
  const gui        = tlv('00', 'BR.GOV.BCB.PIX');
  const keyField   = tlv('01', PIX_KEY);
  const mai        = tlv('26', gui + keyField);

  /* Valor (apenas se amount > 0) */
  const amtStr     = amount ? parseFloat(amount).toFixed(2) : '';
  const amtField   = amtStr ? tlv('54', amtStr) : '';

  /* Additional Data Field (ID 62) — txid */
  const txid       = tlv('05', PIX_TXID);
  const adf        = tlv('62', txid);

  /* Nome e cidade — máx permitidos pelo Bacen */
  const name       = PIX_NAME.slice(0, 25).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  const city       = PIX_CITY.slice(0, 15).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

  /* Monta payload sem CRC */
  const payload =
    tlv('00', '01')          /* Payload Format Indicator */
  + tlv('01', '12')          /* Point of Initiation Method: 12 = reutilizável */
  + mai                      /* Merchant Account Information */
  + tlv('52', '0000')        /* Merchant Category Code */
  + tlv('53', '986')         /* Transaction Currency: BRL */
  + amtField                 /* Transaction Amount (opcional) */
  + tlv('58', 'BR')          /* Country Code */
  + tlv('59', name)          /* Merchant Name */
  + tlv('60', city)          /* Merchant City */
  + adf                      /* Additional Data Field */
  + '6304';                  /* CRC16 — tag + 4 dígitos calculados a seguir */

  return payload + crc16(payload);
}

/* ── Atualiza o QR Code ── */
function updateQR(amount) {
  const qrImg   = document.getElementById('qrImg');
  const payload = buildPixPayload(amount);
  qrImg.style.opacity    = '0';
  qrImg.style.transition = 'opacity .3s ease';
  setTimeout(() => {
    qrImg.src    = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(payload)}`;
    qrImg.onload = () => { qrImg.style.opacity = '1'; };
  }, 200);
}

/* Gera QR inicial sem valor fixo ao carregar a página */
document.addEventListener('DOMContentLoaded', () => updateQR(''));

/* ── Botões de valor ── */
document.querySelectorAll('.pv').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pv').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateQR(btn.dataset.amount);
  });
});

/* ── Copiar chave PIX ── */
function copyPix() {
  const value   = PIX_KEY;
  const copyBtn = document.getElementById('copyBtn');
  const reset   = () => { copyBtn.classList.remove('copied'); copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar'; };
  const ok      = () => { copyBtn.classList.add('copied'); copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!'; setTimeout(reset, 2600); };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(value).then(ok).catch(() => legacyCopy());
  } else { legacyCopy(); }
  function legacyCopy() {
    const input = document.getElementById('pixKey');
    input.removeAttribute('readonly'); input.select();
    try { document.execCommand('copy'); ok(); } catch(e){}
    input.setAttribute('readonly', '');
  }
}
window.copyPix = copyPix;

/* ── KEYBOARD NAV ────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (nl.classList.contains('mob')) {
      ham.classList.remove('open'); nl.classList.remove('mob');
      ham.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
    }
    closeQuizAdmin();
  }
});

/* ── ACTIVE NAV LINK ─────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting)
      navLinks.forEach(a => a.classList.toggle('active-nav', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { threshold: 0.45 });
sections.forEach(s => navObs.observe(s));

/* helper */
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}



/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✉️  MURAL DE RECADOS — SheetDB (nuvem real ☁️)
   Planilha: https://sheetdb.io/api/v1/gtbjsmr0fzsth
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SHEETDB_URL  = 'https://sheetdb.io/api/v1/gtbjsmr0fzsth';
const MURAL_EMOJIS = ['🌸','💕','✨','🎀','🌷','💖','🦋','🌺','💐','🎊','🥂','👑','💫','🌟','🎁'];

/* ── Buscar recados (ordenados do mais novo) ── */
async function fetchMuralMsgs() {
  try {
    const res  = await fetch(`${SHEETDB_URL}?limit=100`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    /* Ordena do ID maior para menor (mais recentes primeiro) */
    return data.sort((a, b) => Number(b.id) - Number(a.id));
  } catch { return []; }
}

/* ── Salvar recado no SheetDB ── */
async function postMuralMsg(name, msg, emoji) {
  const ts  = new Date().toLocaleDateString('pt-BR');
  const id  = Date.now().toString();
  const res = await fetch(SHEETDB_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ data: [{ id, name, msg, emoji, ts }] })
  });
  if (!res.ok) throw new Error('Erro ao salvar recado');
}

/* ── Deletar todos os recados (admin) ── */
async function deleteAllMuralMsgs() {
  await fetch(`${SHEETDB_URL}/all`, { method: 'DELETE' });
}

/* ── Inicializar mural ── */
function initMural() {
  renderMural();   /* carrega recados da nuvem ao abrir */

  const form   = document.getElementById('muralForm');
  const nameI  = document.getElementById('muralName');
  const msgI   = document.getElementById('muralMsg');
  const emojiP = document.getElementById('muralEmojiPicker');
  const charC  = document.getElementById('muralCharCount');
  if (!form) return;

  let selectedEmoji = '🌸';

  /* Emoji picker */
  MURAL_EMOJIS.forEach(em => {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.textContent = em;
    btn.className = 'emoji-opt' + (em === selectedEmoji ? ' active' : '');
    btn.setAttribute('aria-label', em);
    btn.addEventListener('click', () => {
      selectedEmoji = em;
      emojiP.querySelectorAll('.emoji-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    emojiP.appendChild(btn);
  });

  /* Contador de caracteres */
  msgI.addEventListener('input', () => {
    const len = msgI.value.length;
    charC.textContent = `${len}/200`;
    charC.style.color = len > 180 ? '#d4607a' : '';
  });

  /* Submit */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = nameI.value.trim();
    const msg  = msgI.value.trim();
    if (!name || !msg) return;

    const submitBtn = document.getElementById('muralSubmitBtn');
    const origHtml  = submitBtn.innerHTML;

    /* Feedback de carregando */
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      await postMuralMsg(name, msg, selectedEmoji);

      /* Limpa campos */
      nameI.value = ''; msgI.value = ''; charC.textContent = '0/200';

      /* Feedback de sucesso */
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Recado enviado! 🎉';
      submitBtn.style.background = 'linear-gradient(135deg,#5aaa7a,#7dca9d)';
      setTimeout(() => {
        submitBtn.innerHTML = origHtml;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);

      /* Recarrega mural e rola até ele */
      await renderMural();
      document.getElementById('muralGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch {
      submitBtn.innerHTML = '<i class="fas fa-times"></i> Erro, tente de novo';
      submitBtn.style.background = 'linear-gradient(135deg,#e05555,#f07070)';
      setTimeout(() => {
        submitBtn.innerHTML = origHtml;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

/* ── Renderizar cards do mural ── */
async function renderMural() {
  const grid  = document.getElementById('muralGrid');
  const empty = document.getElementById('muralEmpty');
  if (!grid) return;

  /* Exibe skeleton de loading */
  grid.innerHTML = `
    <div class="mural-skeleton"></div>
    <div class="mural-skeleton"></div>
    <div class="mural-skeleton"></div>`;
  if (empty) empty.style.display = 'none';

  const msgs = await fetchMuralMsgs();
  grid.innerHTML = '';

  if (msgs.length === 0) {
    if (empty) empty.style.display = 'flex';
    return;
  }

  msgs.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'mural-card';
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div class="mural-card-top">
        <span class="mural-emoji">${m.emoji || '🌸'}</span>
        <div class="mural-meta">
          <strong class="mural-author">${escHtml(m.name)}</strong>
          <span class="mural-date">${m.ts}</span>
        </div>
      </div>
      <p class="mural-text">"${escHtml(m.msg)}"</p>`;
    grid.appendChild(card);
  });
}

/* ── Admin: limpar mural ── */
async function muralAdminClear() {
  const pwd = prompt('Senha para limpar o mural:');
  if (pwd === null) return;
  if (pwd !== 'debutante15') { alert('Senha incorreta.'); return; }
  if (!confirm('Apagar TODOS os recados do mural? Isso não pode ser desfeito.')) return;
  try {
    await deleteAllMuralMsgs();
    await renderMural();
    alert('Mural limpo com sucesso! ✅');
  } catch { alert('Erro ao limpar. Tente novamente.'); }
}
window.muralAdminClear = muralAdminClear;


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎀  QUIZ DA DEBUTANTE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const QUIZ_KEY = 'm15_quiz';

const QUIZ_QUESTIONS = [
  { id:1, q:'Qual é a cor favorita da debutante?',
    opts:['Rosa 🌸','Azul 💙','Lilás 💜','Verde 💚'], ci:null, expl:'' },
  { id:2, q:'Qual é o sonho de profissão da debutante?',
    opts:['Médica 🩺','Designer 🎨','Advogada ⚖️','Professora 📚'], ci:null, expl:'' },
  { id:3, q:'Qual é a comida favorita da debutante?',
    opts:['Pizza 🍕','Sushi 🍣','Churrasco 🥩','Macarrão 🍝'], ci:null, expl:'' },
  { id:4, q:'O que ela mais gosta de fazer no tempo livre?',
    opts:['Ouvir música 🎵','Ler livros 📖','Assistir séries 📺','Sair com amigos 🥳'], ci:null, expl:'' },
  { id:5, q:'Destino de viagem dos sonhos da debutante?',
    opts:['Paris 🗼','Maldivas 🏝️','Nova York 🗽','Japão 🌸'], ci:null, expl:'' },
  { id:6, q:'Qual estilo musical ela mais curte?',
    opts:['Gospel 🙏','Pop 🎤','Sertanejo 🤠','K-Pop 🌟'], ci:null, expl:'' },
  { id:7, q:'Qual é o animal favorito da debutante?',
    opts:['Gato 🐱','Cachorro 🐶','Coelho 🐰','Hamster 🐹'], ci:null, expl:'' },
  { id:8, q:'O que ela nunca sai de casa sem?',
    opts:['Perfume 🌹','Fone de ouvido 🎧','Batom 💄','A Bíblia 📖'], ci:null, expl:'' }
];

let QS = { q: 0, answers: [], done: false };

const getQuizSaved  = () => { try { return JSON.parse(localStorage.getItem(QUIZ_KEY) || '{}'); } catch { return {}; } };
const saveQuizData  = d  => localStorage.setItem(QUIZ_KEY, JSON.stringify(d));

function initQuiz() {
  /* Carrega respostas salvas pela debutante */
  const saved = getQuizSaved();
  QUIZ_QUESTIONS.forEach(q => {
    if (saved[q.id] !== undefined) { q.ci = saved[q.id].ci; q.expl = saved[q.id].expl || ''; }
  });
  renderQuiz();
  const adminBtn = document.getElementById('quizAdminBtn');
  if (adminBtn) adminBtn.addEventListener('click', openQuizAdmin);
}

function renderQuiz() {
  const box = document.getElementById('quizContainer');
  if (!box) return;

  const configured = QUIZ_QUESTIONS.filter(q => q.ci !== null).length;

  if (configured === 0) {
    box.innerHTML = `
      <div class="quiz-pending">
        <div class="quiz-pending-icon">🎀</div>
        <p class="quiz-pending-title">O quiz ainda não foi configurado!</p>
        <p class="quiz-pending-sub">Clique em <strong>"Configurar Quiz"</strong> abaixo e adicione as respostas certas.</p>
      </div>`;
    return;
  }

  if (QS.done) { renderResult(); return; }

  const q    = QUIZ_QUESTIONS[QS.q];
  const prog = (QS.q / QUIZ_QUESTIONS.length) * 100;

  box.innerHTML = `
    <div class="quiz-header">
      <div class="quiz-progress-wrap">
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${prog}%"></div></div>
        <span class="quiz-q-count">${QS.q + 1} / ${QUIZ_QUESTIONS.length}</span>
      </div>
    </div>
    <div class="quiz-body">
      <span class="quiz-q-label">Pergunta ${QS.q + 1}</span>
      <h3 class="quiz-q-text">${q.q}</h3>
      <div class="quiz-options" id="quizOpts">
        ${q.opts.map((o, i) => `
          <button class="quiz-opt" data-i="${i}" type="button">
            <span class="quiz-opt-letter">${'ABCD'[i]}</span>
            <span class="quiz-opt-text">${o}</span>
          </button>`).join('')}
      </div>
      <div class="quiz-feedback" id="quizFb"></div>
    </div>`;

  box.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => answerQuiz(parseInt(btn.dataset.i)));
  });
}

function answerQuiz(idx) {
  const q      = QUIZ_QUESTIONS[QS.q];
  const right  = idx === q.ci;
  const opts   = document.querySelectorAll('.quiz-opt');
  const fb     = document.getElementById('quizFb');

  opts.forEach((b, i) => {
    b.disabled = true;
    if (i === q.ci) b.classList.add('correct');
    else if (i === idx && !right) b.classList.add('wrong');
  });

  QS.answers.push({ right });

  if (fb) {
    fb.className = 'quiz-feedback ' + (right ? 'right' : 'wrong');
    fb.innerHTML = right
      ? `<span class="fb-icon">✨</span><span>Acertou!</span>${q.expl ? `<small>${q.expl}</small>` : ''}`
      : `<span class="fb-icon">💕</span><span>Não foi dessa vez!</span>${q.expl ? `<small>${q.expl}</small>` : ''}`;
  }

  setTimeout(() => {
    if (QS.q + 1 < QUIZ_QUESTIONS.length) { QS.q++; renderQuiz(); }
    else { QS.done = true; renderResult(); }
  }, 1900);
}

function renderResult() {
  const box    = document.getElementById('quizContainer');
  const acertos = QS.answers.filter(a => a.right).length;
  const total   = QUIZ_QUESTIONS.length;
  const pct     = Math.round((acertos / total) * 100);

  const medals = [
    [100, '👑', 'Incrível! Você conhece a debutante de cor e salteado!'],
    [75,  '🌟', 'Uau! Vocês são muito próximos! 💕'],
    [50,  '🌸', 'Bom! Você a conhece bastante bem!'],
    [25,  '🌷', 'Hmm... ainda têm muito a descobrir um do outro!'],
    [0,   '🎀', 'Ops! Hora de marcar um café com a aniversariante! ☕']
  ];
  const [, medal, msg] = medals.find(([min]) => pct >= min);

  box.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-medal">${medal}</div>
      <h3 class="quiz-result-title">Resultado</h3>
      <div class="quiz-result-score">
        <span class="quiz-score-num">${acertos}</span>
        <span class="quiz-score-sep">/</span>
        <span class="quiz-score-tot">${total}</span>
      </div>
      <div class="quiz-bar-wrap">
        <div class="quiz-bar-track"><div class="quiz-bar-fill" style="width:0" data-w="${pct}%"></div></div>
        <span class="quiz-bar-label">${pct}%</span>
      </div>
      <p class="quiz-result-msg">${msg}</p>
      <button class="btn-gold-filled quiz-retry" type="button" onclick="retryQuiz()">
        <i class="fas fa-redo"></i><span>Jogar novamente</span>
      </button>
    </div>`;

  setTimeout(() => {
    const fill = box.querySelector('.quiz-bar-fill');
    if (fill) fill.style.width = fill.dataset.w;
  }, 300);

  launchPetals();
}

function retryQuiz() { QS = { q:0, answers:[], done:false }; renderQuiz(); }
window.retryQuiz = retryQuiz;


/* ── QUIZ ADMIN — debutante configura as respostas ──────── */
function openQuizAdmin() {
  const pwd = prompt('🔒 Senha para configurar o quiz:');
  if (pwd === null) return;
  if (pwd !== 'debutante15') { alert('Senha incorreta! A senha padrão é: debutante15\n(você pode alterá-la no código)'); return; }

  const overlay = document.createElement('div');
  overlay.id = 'qaOverlay';
  overlay.className = 'qa-overlay';
  overlay.innerHTML = `
    <div class="qa-modal" role="dialog" aria-modal="true">
      <button class="qa-close" type="button" onclick="closeQuizAdmin()" aria-label="Fechar">✕</button>
      <div class="qa-header">
        <span class="s-label">✦ Painel da Debutante</span>
        <h2 class="qa-title">Configurar Quiz</h2>
        <p class="qa-sub">Marque a resposta certa de cada pergunta e, se quiser, adicione uma explicação divertida que aparecerá após a resposta.</p>
      </div>
      <div class="qa-questions" id="qaQuestions"></div>
      <div class="qa-footer">
        <button class="btn-gold-filled" type="button" onclick="saveQuizAdmin()">
          <i class="fas fa-heart"></i><span>Salvar e publicar!</span>
        </button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('open'));

  const body = document.getElementById('qaQuestions');
  QUIZ_QUESTIONS.forEach(q => {
    const sec = document.createElement('div');
    sec.className = 'qa-q';
    sec.innerHTML = `
      <p class="qa-q-title"><em>${q.id}.</em> ${q.q}</p>
      <div class="qa-opts-grid">
        ${q.opts.map((o, i) => `
          <label class="qa-opt-lbl ${q.ci === i ? 'selected' : ''}">
            <input type="radio" name="q${q.id}" value="${i}" ${q.ci === i ? 'checked':''}>
            <span class="qa-opt-pill">${'ABCD'[i]}. ${o}</span>
          </label>`).join('')}
      </div>
      <label class="qa-expl-lbl">Explicação <span>(opcional)</span></label>
      <input class="qa-expl-input" id="expl_${q.id}" type="text" maxlength="120"
             placeholder="Ex.: Minha cor favorita desde pequena! 🌸"
             value="${escHtml(q.expl || '')}">`;
    /* Highlight ao selecionar */
    sec.querySelectorAll('input[type=radio]').forEach(radio => {
      radio.addEventListener('change', () => {
        sec.querySelectorAll('.qa-opt-lbl').forEach(l => l.classList.remove('selected'));
        radio.closest('.qa-opt-lbl').classList.add('selected');
      });
    });
    body.appendChild(sec);
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) closeQuizAdmin(); });
}

function closeQuizAdmin() {
  const ov = document.getElementById('qaOverlay');
  if (!ov) return;
  ov.classList.remove('open');
  setTimeout(() => { ov.remove(); document.body.style.overflow = ''; }, 350);
}
window.closeQuizAdmin = closeQuizAdmin;

function saveQuizAdmin() {
  const data = {};
  let allSet = true;
  QUIZ_QUESTIONS.forEach(q => {
    const r = document.querySelector(`input[name="q${q.id}"]:checked`);
    if (!r) { allSet = false; return; }
    q.ci   = parseInt(r.value);
    q.expl = (document.getElementById(`expl_${q.id}`)?.value || '').trim();
    data[q.id] = { ci: q.ci, expl: q.expl };
  });
  if (!allSet) { alert('Por favor, selecione a resposta correta para todas as perguntas! 😊'); return; }
  saveQuizData(data);
  closeQuizAdmin();
  QS = { q:0, answers:[], done:false };
  setTimeout(() => {
    renderQuiz();
    const btn = document.getElementById('quizAdminBtn');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-check"></i> <span>Quiz publicado! 🎉</span>';
      btn.style.background = 'linear-gradient(135deg,#5aaa7a,#7dca9d)';
      setTimeout(() => { btn.innerHTML = '<i class="fas fa-cog"></i> <span>Configurar Quiz</span>'; btn.style.background = ''; }, 3500);
    }
  }, 400);
}
window.saveQuizAdmin = saveQuizAdmin;


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🌸  CONFETTI DE PÉTALAS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function launchPetals() {
  if (!document.getElementById('petalCSS')) {
    const s = document.createElement('style');
    s.id = 'petalCSS';
    s.textContent = `
      @keyframes petalFall {
        0%   { transform: translateY(0) rotate(0deg) scale(1); opacity:1; }
        80%  { opacity:.9; }
        100% { transform: translateY(105vh) rotate(720deg) scale(.5); opacity:0; }
      }`;
    document.head.appendChild(s);
  }
  const syms = ['🌸','💕','✨','🎀','🌷','💖','⭐'];
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('span');
    el.textContent = syms[Math.floor(Math.random() * syms.length)];
    el.style.cssText = `position:fixed;top:-40px;left:${Math.random()*100}vw;
      font-size:${.9+Math.random()*1.3}rem;pointer-events:none;z-index:99998;
      animation:petalFall ${1.6+Math.random()*2.2}s ease-in ${Math.random()*.9}s forwards`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎵  PLAYER DE MÚSICA FLUTUANTE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function initMusicPlayer() {
  const player    = document.getElementById('musicPlayer');
  const bubble    = document.getElementById('mpBubble');
  const disc      = document.getElementById('mpDisc');
  const waves     = document.getElementById('mpWaves');
  const toggleBtn = document.getElementById('mpToggle');
  const toggleIco = document.getElementById('mpIcon');
  const muteBtn   = document.getElementById('mpMute');
  const muteIco   = document.getElementById('mpMuteIcon');
  const minimize  = document.getElementById('mpMinimize');
  const ytFrame   = document.getElementById('ytFrame');
  if (!player || !ytFrame) return;

  let isPlaying = true;   /* começa tocando */
  let isMuted   = false;
  let ytReady   = false;
  let ytPlayer  = null;

  /* ── YouTube IFrame API ── */
  window.onYouTubeIframeAPIReady = function () {
    ytReady = true;
    ytPlayer = new YT.Player('ytFrame', {
      events: {
        onReady: e => {
          e.target.setVolume(60);
          e.target.playVideo();
        },
        onStateChange: e => {
          /* Se o YouTube pausar sozinho (política de autoplay), sincroniza o ícone */
          if (e.data === YT.PlayerState.PLAYING) setPlayState(true);
          if (e.data === YT.PlayerState.PAUSED)  setPlayState(false);
        }
      }
    });
  };

  /* Carrega a API do YouTube dinamicamente */
  if (!document.getElementById('ytApiScript')) {
    const tag = document.createElement('script');
    tag.id  = 'ytApiScript';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }

  /* ── Helpers ── */
  function setPlayState(playing) {
    isPlaying = playing;
    toggleIco.className = playing ? 'fas fa-pause' : 'fas fa-play';
    disc.classList.toggle('paused', !playing);
    waves.classList.toggle('paused', !playing);
  }

  function togglePlay() {
    if (!ytReady || !ytPlayer) {
      /* Fallback: recarregar iframe com autoplay */
      ytFrame.src = ytFrame.src.replace('autoplay=0','autoplay=1');
      setPlayState(true); return;
    }
    if (isPlaying) { ytPlayer.pauseVideo(); setPlayState(false); }
    else           { ytPlayer.playVideo();  setPlayState(true);  }
  }

  function toggleMute() {
    isMuted = !isMuted;
    muteIco.className = isMuted ? 'fas fa-volume-xmark' : 'fas fa-volume-high';
    muteBtn.style.color = isMuted ? 'var(--c-rose)' : '';
    if (!ytReady || !ytPlayer) return;
    if (isMuted) ytPlayer.mute(); else ytPlayer.unMute();
  }

  function minimizePlayer() {
    player.classList.add('minimized');
    bubble.classList.add('visible');
  }

  function openPlayer() {
    player.classList.remove('minimized');
    bubble.classList.remove('visible');
  }

  /* ── Eventos ── */
  toggleBtn.addEventListener('click', togglePlay);
  muteBtn.addEventListener('click', toggleMute);
  minimize.addEventListener('click', minimizePlayer);
  bubble.addEventListener('click', openPlayer);

  /* Mostrar iframe após interação do usuário (política de autoplay) */
  document.addEventListener('click', function unlockAudio() {
    ytFrame.style.display = 'block';
    document.removeEventListener('click', unlockAudio);
  }, { once: true });

})();