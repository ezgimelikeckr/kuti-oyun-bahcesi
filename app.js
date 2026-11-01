/* ==========================================================================
   KUTI CHILD EDUCATION DASHBOARD - FINAL INFOGRAPHIC MATCHED APP LOGIC
   - Girdiğin ana tasar/* ==========================================================================
   KUTI CHILD EDUCATION DASHBOARD - FINAL INFOGRAPHIC MATCHED APP LOGIC
   - Girdiğin ana tasarım şemasına (görsele) %100 uyumlu 3-6 yaş oyun matrisi
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Üst Kuti Maskotlu Görsel Geri Bildirim ve İpucu Sistemi
  function showVisualFeedback(message, type = "success") {
    let box = document.getElementById("kuti-visual-feedback-card");
    
    if (!box) {
      box = document.createElement("div");
      box.id = "kuti-visual-feedback-card";
      box.style.cssText = "position: absolute; top: 12px; left: 50%; transform: translateX(-50%); background: #E0F2F1; border: 2px solid #00796B; color: #004D40; padding: 10px 20px; border-radius: 20px; font-weight: 700; z-index: 99999; opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease; pointer-events: none; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); font-size: 0.9rem;";
      document.body.appendChild(box);
    }

    let kutiIconImg = type === "success" ? "kuti_mutlu.png" : "kuti_merakli.png";
    let bgColor = type === "success" ? "#E8F5E9" : type === "error" ? "#FFEBEE" : "#E0F2F1";
    let borderColor = type === "success" ? "#4CAF50" : type === "error" ? "#E57373" : "#00796B";
    let textColor = type === "success" ? "#1B5E20" : type === "error" ? "#B71C1C" : "#004D40";

    box.style.background = bgColor;
    box.style.borderColor = borderColor;
    box.style.color = textColor;

    box.innerHTML = `
      <img src="${kutiIconImg}" alt="Kuti" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1.5px solid ${borderColor};">
      <span>${message}</span>
    `;

    box.style.opacity = "1";
    box.style.transform = "translateX(-50%) translateY(4px)";

    setTimeout(() => {
      box.style.opacity = "0";
      box.style.transform = "translateX(-50%) translateY(0)";
    }, 2200);
  }

  const welcomeOverlay = document.getElementById('kuti-welcome-overlay');
  const btnStartWelcome = document.getElementById('btn-start-welcome');
  if (btnStartWelcome && welcomeOverlay) {
    btnStartWelcome.addEventListener('click', () => {
      welcomeOverlay.classList.add('hidden-welcome');
      if (soundEnabled) AudioEngine.playSuccess();
    });
  }

  const AudioEngine = {
    ctx: null,
    kalimbaTimer: null,
    init() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
    },
    playTone(freq, duration = 0.15, type = 'sine') {
      try {
        if (!soundEnabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.log('Audio error');
      }
    },
    playSuccess() {
      try {
        if (!soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        [432, 540, 648].forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.1);
          gain.gain.setValueAtTime(0.2, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.3);
        });
      } catch (e) {
        console.log('Audio error');
      }
    },
    start432HzKalimba() {
      this.init();
      if (this.kalimbaTimer) clearInterval(this.kalimbaTimer);
      const kalimbaNotes = [432, 540, 648, 864, 648, 540];
      let noteIndex = 0;

      this.kalimbaTimer = setInterval(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(kalimbaNotes[noteIndex], this.ctx.currentTime);
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 1.2);

          noteIndex = (noteIndex + 1) % kalimbaNotes.length;
        } catch (e) {}
      }, 1600);
    },
    stop432HzKalimba() {
      if (this.kalimbaTimer) {
        clearInterval(this.kalimbaTimer);
        this.kalimbaTimer = null;
      }
    }
  };

  let soundEnabled = true;
  let currentAgeLevel = '4-5';
  let sunProgress = 10;
  let sunTimerDuration = 120;
  let sunInterval = null;

  let plantStageIndex = 0;
  const plantVisualStages = ['🌱', '🌿', '🌻', '🌳'];

  const moodButtons = document.querySelectorAll('.mood-btn');
  const kutiSpeechText = document.getElementById('kuti-speech-text');

  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      if (kutiSpeechText) {
        if (mood === 'happy') {
          kutiSpeechText.textContent = "Ne harika! Senin adına çok sevindim, bugün enerji doluyuz! 🌟";
        } else if (mood === 'curious') {
          kutiSpeechText.textContent = "Harika! Merak etmek yeni şeyler öğrenmenin ilk adımıdır! 🔍";
        } else if (mood === 'calm') {
          kutiSpeechText.textContent = "Huzurlu ve sakin bir gün, bahçeyi keşfetmek için mükemmel bir zaman! 🌿";
        }
      }
      if (soundEnabled) AudioEngine.playSuccess();
    });
  });

  // ===== KUTİ'NİN KİTAPLIĞI (Ebeveyn Köşesi > Kitaplık) =====
  const KUTI_BOOKS = [
    { title: "Utangaç Ayı Monti", author: "Duncan Beedie", publisher: "İş Bankası Yayınları", themes: ["Duygular", "Cesaret ve özgüven"] },
    { title: "Hayvanat Bahçesinde Diş Fırçalama Günü", author: "Sophie Schoenwald", publisher: "İş Bankası Yayınları", themes: ["Öz bakım"] },
    { title: "Bana Sarılır mısın", author: "Sophie Schoenwald", publisher: "Beyaz Balina Yayınları", themes: ["Duygular", "Arkadaşlık"] },
    { title: "Cesaret Hep Yanımda", author: "Saniye Bencik Kangal", publisher: "Turta Kitap", themes: ["Cesaret ve özgüven"] },
    { title: "Özgüvenim Tam Hata Yapmaktan Korkmam", author: "Saniye Bencik Kangal", publisher: "Turta Kitap", themes: ["Cesaret ve özgüven", "Duygular"] },
    { title: "Küçük Meşe Palamudu", author: "Melanie Joyce", publisher: "İş Bankası Yayınları", themes: ["Doğa"] },
    { title: "Sevginin Gücü", author: "Caroline Richards", publisher: "İş Bankası Yayınları", themes: ["Duygular", "Arkadaşlık"] },
    { title: "Paylaşmak İstemeyen Ayı", author: "Oakley Graham", publisher: "İş Bankası Yayınları", themes: ["Arkadaşlık", "Duygular"] },
    { title: "Tarçın ve Büyük Tartışma", author: "Andreas König", publisher: "İş Bankası Yayınları", themes: ["Duygular", "Arkadaşlık"] }
  ];
  // Filtre çipleri bu sırayla gösterilir; kitabı olmayan tema otomatik gizlenir
  const KUTI_THEME_ORDER = ["Duygular", "Arkadaşlık", "Öz bakım", "Doğa", "Dikkat ve keşif", "Cesaret ve özgüven"];
  let kbActiveTheme = "Tümü";

  function renderKutiLibrary() {
    const chipsEl = document.getElementById('kb-chips');
    const listEl = document.getElementById('kb-list');
    if (!chipsEl || !listEl) return;

    const usedThemes = KUTI_THEME_ORDER.filter(t => KUTI_BOOKS.some(b => b.themes.includes(t)));
    if (kbActiveTheme !== "Tümü" && !usedThemes.includes(kbActiveTheme)) kbActiveTheme = "Tümü";

    chipsEl.innerHTML = ["Tümü", ...usedThemes].map(t =>
      `<button type="button" class="kb-chip${t === kbActiveTheme ? ' active' : ''}" data-theme="${t}">${t}</button>`
    ).join('');

    const shown = KUTI_BOOKS.filter(b => kbActiveTheme === "Tümü" || b.themes.includes(kbActiveTheme));
    listEl.innerHTML = shown.map(b => `
      <div class="kb-row">
        <button type="button" class="kb-item" aria-expanded="false">
          <span class="kb-item-icon">📖</span>
          <span class="kb-item-text">
            <span class="kb-item-title">${b.title}</span>
            <span class="kb-item-themes">${b.themes.join(' · ')}</span>
          </span>
          <span class="kb-item-chevron">›</span>
        </button>
        <div class="kb-item-detail"><b>Yazar:</b> ${b.author} &nbsp;·&nbsp; <b>Yayınevi:</b> ${b.publisher}</div>
      </div>`).join('');
  }

  (function initKutiLibraryEvents() {
    const chipsEl = document.getElementById('kb-chips');
    const listEl = document.getElementById('kb-list');
    if (chipsEl) {
      chipsEl.addEventListener('click', (e) => {
        const chip = e.target.closest('.kb-chip');
        if (!chip) return;
        kbActiveTheme = chip.dataset.theme;
        renderKutiLibrary();
        if (soundEnabled) AudioEngine.playTone(600, 0.1);
      });
    }
    if (listEl) {
      listEl.addEventListener('click', (e) => {
        const item = e.target.closest('.kb-item');
        if (!item) return;
        const row = item.closest('.kb-row');
        const open = row.classList.toggle('open');
        item.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  })();

  // ===== NASIL BİRLİKTE OYNANIR — SAYFA SAYFA KILAVUZ =====
  let howPage = 0;
  function howGoTo(n) {
    const pages = document.querySelectorAll('#how-pager .how-page');
    if (!pages.length) return;
    howPage = Math.max(0, Math.min(pages.length - 1, n));
    pages.forEach((p, i) => p.classList.toggle('active', i === howPage));
    const dots = document.getElementById('how-dots');
    if (dots) {
      dots.innerHTML = Array.from(pages).map((_, i) =>
        `<button type="button" class="how-dot${i === howPage ? ' active' : ''}" data-i="${i}" aria-label="Sayfa ${i + 1}"></button>`
      ).join('');
    }
    const counter = document.getElementById('how-counter');
    if (counter) counter.textContent = `${howPage + 1} / ${pages.length}`;
    const prev = document.getElementById('how-prev');
    const next = document.getElementById('how-next');
    if (prev) prev.disabled = howPage === 0;
    if (next) next.disabled = howPage === pages.length - 1;
    const body = document.getElementById('parent-panel-scroll-body');
    if (body) body.scrollTop = 0;
  }
  (function initHowPager() {
    const prev = document.getElementById('how-prev');
    const next = document.getElementById('how-next');
    const dots = document.getElementById('how-dots');
    if (prev) prev.addEventListener('click', () => { howGoTo(howPage - 1); if (soundEnabled) AudioEngine.playTone(500, 0.1); });
    if (next) next.addEventListener('click', () => { howGoTo(howPage + 1); if (soundEnabled) AudioEngine.playTone(600, 0.1); });
    if (dots) dots.addEventListener('click', (e) => {
      const d = e.target.closest('.how-dot');
      if (d) howGoTo(parseInt(d.dataset.i, 10));
    });
  })();

  const appLaunchOverlay = document.getElementById('app-launch-overlay');
  const launchPinError = document.getElementById('launch-pin-error');
  const launchPinDisplay = document.getElementById('launch-pin-display');
  const mathAnswerInput = document.getElementById('math-answer-input');
  const pinSubmitBtn = document.getElementById('pin-submit-btn');
  let currentMathAnswer = 0;

  function generateMathSecurityProblem() {
    const num1 = Math.floor(Math.random() * 8) + 2;
    const num2 = Math.floor(Math.random() * 8) + 2;
    currentMathAnswer = num1 + num2;
    if (launchPinDisplay) launchPinDisplay.textContent = `${num1} + ${num2} = ?`;
    if (mathAnswerInput) mathAnswerInput.value = '';
  }

  generateMathSecurityProblem();

  if (mathAnswerInput) {
    mathAnswerInput.addEventListener('input', () => {
      mathAnswerInput.value = mathAnswerInput.value.replace(/[^0-9]/g, '').slice(0, 2);
    });
    mathAnswerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkParentPin();
    });
  }

  function checkParentPin() {
    const entered = parseInt(mathAnswerInput ? mathAnswerInput.value : '', 10);
    if (isNaN(entered)) {
      if (launchPinError) launchPinError.textContent = 'Lütfen bir sayı girin.';
      return;
    }
    if (entered === currentMathAnswer) {
      if (soundEnabled) AudioEngine.playSuccess();
      if (appLaunchOverlay) {
        appLaunchOverlay.classList.add('unlocked');
        setTimeout(() => appLaunchOverlay.remove(), 300);
      }
    } else {
      if (launchPinError) launchPinError.textContent = 'Yanlış cevap! Yeni bir işlem oluşturuldu.';
      if (mathAnswerInput) mathAnswerInput.classList.add('pin-error-shake');
      setTimeout(() => {
        if (mathAnswerInput) mathAnswerInput.classList.remove('pin-error-shake');
        generateMathSecurityProblem();
        if (mathAnswerInput) mathAnswerInput.focus();
        if (launchPinError) launchPinError.textContent = '';
      }, 900);
    }
  }

  if (pinSubmitBtn) pinSubmitBtn.addEventListener('click', checkParentPin);

  const pinNewQuestionLink = document.getElementById('pin-new-question-link');
  if (pinNewQuestionLink) {
    pinNewQuestionLink.addEventListener('click', (e) => {
      e.preventDefault();
      generateMathSecurityProblem();
      if (launchPinError) launchPinError.textContent = '';
      if (mathAnswerInput) mathAnswerInput.focus();
    });
  }

  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
      soundToggleBtn.querySelector('span:last-child').textContent = soundEnabled ? 'Ses Açık' : 'Ses Kapalı';
      if (soundEnabled) AudioEngine.playTone(432);
      else AudioEngine.stop432HzKalimba();
    });
  }

  const sunProgressBar = document.getElementById('sun-progress-bar');
  const sunIcon = document.getElementById('sun-icon');
  const sunTimeText = document.getElementById('sun-time-text');
  const sleepOverlay = document.getElementById('sleep-mode-overlay');

  function updateSunPosition() {
    if (sunProgress >= 100) {
      sunProgress = 100;
      clearInterval(sunInterval);
      triggerSleepMode();
    }
    if (sunProgressBar) sunProgressBar.style.width = `${sunProgress}%`;
    if (sunIcon) sunIcon.style.left = `${sunProgress}%`;
    if (sunTimeText) {
      if (sunProgress < 40) sunTimeText.textContent = "Gündüz Vakti ☀️";
      else if (sunProgress < 80) sunTimeText.textContent = "Akşamüstü 🌅";
      else sunTimeText.textContent = "Gün Batımı 🌇";
    }
  }

  function startSunJourney() {
    if (sunInterval) clearInterval(sunInterval);
    const stepInterval = (sunTimerDuration * 1000) / 100;
    sunInterval = setInterval(() => {
      sunProgress += 1;
      updateSunPosition();
    }, stepInterval);
  }

  function triggerSleepMode() {
    if (sleepOverlay) sleepOverlay.classList.add('active');
    if (soundEnabled) {
      AudioEngine.start432HzKalimba();
    }
  }

  startSunJourney();

  const btnUnlockSleep = document.getElementById('btn-unlock-sleep');
  if (btnUnlockSleep) {
    btnUnlockSleep.addEventListener('click', () => {
      if (sleepOverlay) sleepOverlay.classList.remove('active');
      AudioEngine.stop432HzKalimba();
      sunProgress = 10;
      updateSunPosition();
      startSunJourney();
      if (soundEnabled) AudioEngine.playSuccess();
    });
  }

  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      if (soundEnabled) AudioEngine.playTone(648, 0.2);
    });
  });

  // --- DUYGU KÖŞESİ — YAŞA GÖRE 3 AYRI GERÇEK OYUN ---
  // 3 yaş: Kuti'nin Duygu Yüzleri (duygu tanıma - gösterilen yüzü 3 seçenekten bul)
  // 4-5 yaş: Kuti'nin Duygu Hikâyesi (rol yapma - önce duygu, sonra doğru çözümü seç)
  // 6 yaş: Kuti'nin Duygu Hikâyesini Kur (imgeleme - olay + duygu + çözüm kartını sırayla
  //         başlangıç/orta/son alanına yerleştirerek hikâyeyi kur)
  // Oyun görselleri: gorseller/<yas>/<köşe>/<dosya>
  const G = (p) => 'gorseller/' + p;

  const DUYGU_GAME_DATA = {
    '3': {
      title: "😊 Kuti'nin Duygu Yüzleri",
      instruction: 'Kuti şu an nasıl hissediyor? Doğru yüzü seç.',
      pool: [
        { name: 'Mutlu', label: '😊 Mutlu', image: 'kuti_mutlu.png' },
        { name: 'Üzgün', label: '😢 Üzgün', image: 'kuti_uzgun.png' },
        { name: 'Kızgın', label: '😠 Kızgın', image: 'kuti_ofkeli.png' }
      ]
    },
    '4-5': {
      title: '📖 Kuti\'nin Duygu Hikâyesi',
      scenes: [
        {
          text: 'Kuti en sevdiği oyuncağını kaybetti.',
          img: G('4_5_yas/duygu/kuti_oyuncagini_kaybediyor.jpg'),
          emotionOptions: [
            { name: 'Üzgün', label: '😢 Üzgün', correct: true },
            { name: 'Mutlu', label: '😊 Mutlu', correct: false }
          ],
          solutionOptions: [
            { label: '🔍 Birlikte arayalım', correct: true },
            { label: '🙈 Görmezden gelelim', correct: false }
          ]
        },
        {
          text: 'Kuti\'nin kulesi az önce yıkıldı.',
          img: G('4_5_yas/duygu/kuti_kule_dusuyor.jpg'),
          emotionOptions: [
            { name: 'Kızgın', label: '😠 Kızgın', correct: true },
            { name: 'Meraklı', label: '🤔 Meraklı', correct: false }
          ],
          solutionOptions: [
            { label: '🧘 Derin bir nefes alıp yeniden yapalım', correct: true },
            { label: '💥 Diğer oyuncakları da atalım', correct: false }
          ]
        }
      ]
    },
    '6+': {
      title: "📚 Kuti'nin Duygu Hikâyesini Kur",
      scenes: [
        {
          eventLabel: '🎂 Kuti\'nin doğum günü partisi yağmur yüzünden iptal oldu.',
          pics: [G('6_yas/duygu/kuti_yagmur.jpg'), null, null],
          emotionOptions: [
            { label: '😢 Üzgün', correct: true },
            { label: '😊 Mutlu', correct: false },
            { label: '😲 Şaşırmış', correct: false }
          ],
          solutionOptions: [
            { label: '🏠 Partiyi içeride, küçük bir sürprizle yapalım', correct: true },
            { label: '😡 Herkese kızalım', correct: false }
          ]
        },
        {
          eventLabel: '🎭 Kuti sahnede repliklerini unuttu.',
          pics: [G('6_yas/duygu/kuti_unutuyor.jpg'), null, null],
          emotionOptions: [
            { label: '😢 Üzgün', correct: true },
            { label: '🤔 Meraklı', correct: false },
            { label: '😊 Mutlu', correct: false }
          ],
          solutionOptions: [
            { label: '❤️ Sakinleşip derin bir nefes alalım', correct: true },
            { label: '🏃 Sahneden kaçalım', correct: false }
          ]
        },
        {
          eventLabel: '🍦 Kuti\'nin dondurması yere düştü.',
          startImg: G('6_yas/duygu/kuti_dondurma_aliyor.jpg'),
          pics: [G('6_yas/duygu/kuti_dondurma_dusuyor.jpg'), G('6_yas/duygu/kuti_fikir_geliyor.jpg'), G('6_yas/duygu/kuti_dondurma_yiyor.jpg')],
          emotionOptions: [
            { label: '😢 Üzgün', correct: true },
            { label: '😊 Mutlu', correct: false },
            { label: '😲 Şaşırmış', correct: false }
          ],
          solutionOptions: [
            { label: '🍦 Sakin kalıp dondurmacıdan nazikçe yenisini isteyelim', correct: true },
            { label: '😡 Dondurmacıya bağıralım', correct: false }
          ]
        }
      ]
    }
  };

  // Kuti'nin duygu yüzleri (kök klasördeki kuti_*.png dosyaları)
  const EMO_FACES = {
    'Mutlu':    { img: 'kuti_mutlu.png',   emoji: '😊' },
    'Üzgün':    { img: 'kuti_uzgun.png',   emoji: '😢' },
    'Kızgın':   { img: 'kuti_ofkeli.png',  emoji: '😠' },
    'Meraklı':  { img: 'kuti_merakli.png', emoji: '🤔' },
    'Şaşırmış': { img: 'kuti_sasirmis.png', emoji: '😲' }
  };
  function emoName(opt) { return opt.face || opt.name || (opt.label || '').replace(/^[^\p{L}]+/u, '').trim(); }

  function renderDuyguChoiceRow(container, options, onPick) {
    container.innerHTML = '';
    options.slice().sort(() => Math.random() - 0.5).forEach(opt => {
      const btn = document.createElement('button');
      const emo = EMO_FACES[emoName(opt)];
      if (emo) {
        // Duygu seçenekleri: Kuti'nin o duyguyu gösteren yüzü (yazı/emoji yok)
        btn.className = 'emo-face-btn';
        btn.setAttribute('aria-label', emoName(opt));
        btn.appendChild(makeImg(emo.img, emoName(opt), emo.emoji, 'emo-face-img'));
      } else {
        btn.className = 'btn-icon-pill scenario-opt-btn';
        btn.style.cssText = 'justify-content:flex-start; text-align:left; padding:0.45rem 0.8rem;';
        btn.textContent = opt.label;
      }
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        if (opt.correct) {
          btn.disabled = true;
          container.querySelectorAll('button').forEach(b => b.disabled = true);
          if (soundEnabled) AudioEngine.playSuccess();
          onPick(opt);
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          btn.classList.add('tap-order-shake');
          setTimeout(() => btn.classList.remove('tap-order-shake'), 400);
          showVisualFeedback('Tekrar deneyelim.', 'error');
        }
      });
      container.appendChild(btn);
    });
  }

  let lastDuyguScene = { '4-5': -1, '6+': -1 };
  function pickScene(level, scenes) {
    let i = Math.floor(Math.random() * scenes.length);
    if (scenes.length > 1 && i === lastDuyguScene[level]) i = (i + 1) % scenes.length;
    lastDuyguScene[level] = i;
    return scenes[i];
  }

  function initDuyguGame(level) {
    const wrapper = document.getElementById('duygu-game-wrapper');
    if (!wrapper) return;
    const data = DUYGU_GAME_DATA[level] || DUYGU_GAME_DATA['4-5'];

    if (level === '3') {
      const target = data.pool[Math.floor(Math.random() * data.pool.length)];
      wrapper.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.85rem; font-weight:700; color:var(--corner-color); margin-bottom:0.5rem;">${data.title}</p>
          <img src="${target.image}" alt="Kuti" class="mirror-face-img" id="duygu3-face-img">
          <p style="font-size:0.8rem; font-weight:700; color:#B71C1C; margin:0.5rem 0;">${data.instruction}</p>
          <div id="duygu3-options" style="display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap;"></div>
        </div>`;
      const optBox = document.getElementById('duygu3-options');
      data.pool.slice().sort(() => Math.random() - 0.5).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'emo-face-btn';
        btn.setAttribute('aria-label', opt.name);
        btn.appendChild(makeImg(opt.image, opt.name, (EMO_FACES[opt.name] || {}).emoji, 'emo-face-img'));
        btn.addEventListener('click', () => {
          if (opt.name === target.name) {
            if (soundEnabled) AudioEngine.playSuccess();
            showVisualFeedback(`Evet, Kuti ${opt.name.toLowerCase()}! 🎉`, 'success');
            initDuyguGame('3');
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            showVisualFeedback('Tekrar deneyelim.', 'error');
          }
        });
        optBox.appendChild(btn);
      });
    } else if (level === '4-5') {
      const scene = pickScene('4-5', data.scenes);
      wrapper.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.85rem; font-weight:700; color:var(--corner-color); margin-bottom:0.5rem;">${data.title}</p>
          <div id="duygu-pic" class="story-pic"></div>
          <p style="font-size:0.82rem; font-weight:700; color:#B71C1C; margin-bottom:0.55rem;">${scene.text}</p>
          <p style="font-size:0.72rem; color:var(--text-muted); margin-bottom:0.3rem;">1️⃣ Kuti ne hissediyor?</p>
          <div id="duygu45-step1" style="display:flex; flex-wrap:wrap; gap:0.6rem; justify-content:center; margin-bottom:0.6rem;"></div>
          <div id="duygu45-step2" style="display:flex; flex-direction:column; gap:0.4rem; align-items:center;"></div>
        </div>`;
      document.getElementById('duygu-pic').appendChild(makeImg(scene.img, scene.text, '🦊', 'story-pic-img'));
      const step1 = document.getElementById('duygu45-step1');
      const step2 = document.getElementById('duygu45-step2');
      renderDuyguChoiceRow(step1, scene.emotionOptions, () => {
        const p = document.createElement('p');
        p.style.cssText = 'font-size:0.72rem; color:var(--text-muted); margin:0.3rem 0;';
        p.textContent = '2️⃣ Şimdi ne yapmalıyız?';
        step2.appendChild(p);
        const choiceRow = document.createElement('div');
        choiceRow.style.cssText = 'display:flex; flex-direction:column; gap:0.4rem; align-items:center;';
        step2.appendChild(choiceRow);
        renderDuyguChoiceRow(choiceRow, scene.solutionOptions, () => {
          showVisualFeedback('Harika empati ve çözüm! 🎉', 'success');
          setTimeout(() => { if (currentAgeLevel === '4-5') initDuyguGame('4-5'); }, 1800);
        });
      });
    } else {
      const scene = pickScene('6+', data.scenes);
      wrapper.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.85rem; font-weight:700; color:var(--corner-color); margin-bottom:0.5rem;">${data.title}</p>
          <div id="duygu-pic" class="story-pic"></div>
          <div style="display:flex; gap:0.5rem; justify-content:center; margin-bottom:0.7rem;">
            <div class="story-slot" id="story-slot-1" data-label="Başlangıç">🎬</div>
            <div class="story-slot" id="story-slot-2" data-label="Orta">❓</div>
            <div class="story-slot" id="story-slot-3" data-label="Son">❓</div>
          </div>
          <p style="font-size:0.72rem; color:var(--text-muted); margin-bottom:0.3rem;">1️⃣ Kuti bunu hissediyor olabilir mi?</p>
          <div id="duygu6-step1" style="display:flex; flex-wrap:wrap; gap:0.6rem; justify-content:center; margin-bottom:0.6rem;"></div>
          <div id="duygu6-step2" style="display:flex; flex-direction:column; gap:0.4rem; align-items:center;"></div>
        </div>`;
      const picBox = document.getElementById('duygu-pic');
      const showPic = (src) => { if (!src) return; picBox.innerHTML = ''; picBox.appendChild(makeImg(src, 'Kuti hikâyesi', '🦊', 'story-pic-img')); };
      showPic(scene.pics[0]);
      const slot1 = document.getElementById('story-slot-1');
      const slot1Src = scene.startImg || scene.pics[0];
      if (slot1Src) { slot1.textContent = ''; slot1.appendChild(makeImg(slot1Src, 'Başlangıç', scene.eventLabel.split(' ')[0], 'story-slot-img')); }
      else slot1.textContent = scene.eventLabel.split(' ')[0];
      const step1 = document.getElementById('duygu6-step1');
      const step2 = document.getElementById('duygu6-step2');
      const p0 = document.createElement('p');
      p0.style.cssText = 'font-size:0.8rem; font-weight:700; color:#B71C1C; margin-bottom:0.4rem;';
      p0.textContent = scene.eventLabel;
      step1.parentElement.insertBefore(p0, step1);
      renderDuyguChoiceRow(step1, scene.emotionOptions, (picked) => {
        const slot2 = document.getElementById('story-slot-2');
        const face = EMO_FACES[emoName(picked)];
        slot2.textContent = '';
        if (face) slot2.appendChild(makeImg(face.img, emoName(picked), face.emoji, 'story-slot-img'));
        else slot2.textContent = picked.label.split(' ')[0];
        showPic(scene.pics[1]);
        const p = document.createElement('p');
        p.style.cssText = 'font-size:0.72rem; color:var(--text-muted); margin:0.3rem 0;';
        p.textContent = '2️⃣ Hikâyeyi nasıl bitirelim?';
        step2.appendChild(p);
        const choiceRow = document.createElement('div');
        choiceRow.style.cssText = 'display:flex; flex-direction:column; gap:0.4rem; align-items:center;';
        step2.appendChild(choiceRow);
        renderDuyguChoiceRow(choiceRow, scene.solutionOptions, (picked2) => {
          const slot3 = document.getElementById('story-slot-3');
          slot3.textContent = '';
          if (scene.pics[2]) slot3.appendChild(makeImg(scene.pics[2], 'Son', picked2.label.split(' ')[0], 'story-slot-img'));
          else slot3.textContent = picked2.label.split(' ')[0];
          showPic(scene.pics[2]);
          showVisualFeedback('🎉 Hikâyeni harika bir şekilde kurdun!', 'success');
          setTimeout(() => { if (currentAgeLevel === '6+') initDuyguGame('6+'); }, 2600);
        });
      });
    }
  }

  // ===== GÖRSEL YOLLARI + ORTAK YARDIMCILAR =====
  // Görsel dosyası yoksa emojiye düşen <img>
  function makeImg(src, alt, emoji, cls) {
    const img = document.createElement('img');
    if (cls) img.className = cls;
    img.alt = alt || '';
    img.draggable = false;
    setImgWithFallback(img, Array.isArray(src) ? src : [src], () => {
      const s = document.createElement('span');
      s.className = 'img-fallback-emoji';
      s.textContent = emoji || '🦊';
      img.replaceWith(s);
    });
    return img;
  }

  // Dokunmatik uyumlu sürükle-bırak: pointer events + "dokun-seç, sonra hedefe dokun" yolu.
  // Bırakma hedefleri data-drop özelliğine sahip olmalı. attach(tile, onDrop(tile, targetEl)).
  function createDnD(root) {
    let selected = null;
    function setSelected(t) {
      if (selected) selected.classList.remove('dnd-selected');
      selected = t;
      if (t) t.classList.add('dnd-selected');
    }
    function targetFrom(x, y) {
      const el = document.elementFromPoint ? document.elementFromPoint(x, y) : null;
      return el ? el.closest('[data-drop]') : null;
    }
    function attach(tile, onDrop) {
      tile._onDrop = onDrop;
      tile.classList.add('dnd-tile');
      tile.tabIndex = 0;
      tile.addEventListener('pointerdown', (e) => {
        if (tile.classList.contains('placed')) return;
        e.preventDefault();
        if (tile.setPointerCapture && e.pointerId !== undefined) { try { tile.setPointerCapture(e.pointerId); } catch (_) {} }
        const sx = e.clientX, sy = e.clientY;
        const rect = tile.getBoundingClientRect();
        const ox = sx - rect.left, oy = sy - rect.top;
        let ghost = null, over = null;
        const move = (ev) => {
          if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) {
            ghost = tile.cloneNode(true);
            ghost.classList.add('dnd-ghost');
            ghost.style.width = rect.width + 'px';
            ghost.style.height = rect.height + 'px';
            document.body.appendChild(ghost);
            tile.classList.add('dnd-dragging');
            setSelected(null);
          }
          if (ghost) {
            ghost.style.left = Math.round(ev.clientX - ox) + 'px';
            ghost.style.top = Math.round(ev.clientY - oy) + 'px';
            const t = targetFrom(ev.clientX, ev.clientY);
            if (t !== over) {
              if (over) over.classList.remove('dnd-over');
              over = t;
              if (over) over.classList.add('dnd-over');
            }
          }
        };
        const up = (ev) => {
          tile.removeEventListener('pointermove', move);
          tile.removeEventListener('pointerup', up);
          tile.removeEventListener('pointercancel', up);
          if (over) over.classList.remove('dnd-over');
          if (ghost) {
            const t = targetFrom(ev.clientX, ev.clientY);
            ghost.remove();
            tile.classList.remove('dnd-dragging');
            if (t) tile._onDrop(tile, t);
          } else if (ev.type === 'pointerup') {
            setSelected(selected === tile ? null : tile);
          }
        };
        tile.addEventListener('pointermove', move);
        tile.addEventListener('pointerup', up);
        tile.addEventListener('pointercancel', up);
      });
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(selected === tile ? null : tile); }
      });
    }
    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-drop]');
      if (!t || !selected) return;
      const s = selected;
      setSelected(null);
      s._onDrop(s, t);
    });
    return { attach, setSelected };
  }

  // Hafıza kartı yüzü: görselli ya da emojili
  function showMemoryFace(btn, card) {
    if (card.img) { btn.textContent = ''; btn.appendChild(makeImg(card.img, '', card.icon, 'memory-card-img')); }
    else btn.textContent = card.icon;
  }

  // --- GENEL YENİDEN KULLANILABİLİR: HAFIZA/EŞLEŞTİRME OYUNU ---
  // pairs: [{id, icon}] — her biri 2 kart olarak karışık dizilir, çocuk aynı ikona sahip
  // 2 kartı art arda bulmalıdır. Kuti'nin Hafıza Bahçesi gibi oyunlarda kullanılır.
  function initMemoryMatchGame(container, pairs, successMsg, onDone) {
    if (!container) return;
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'memory-match-grid';
    const cards = [];
    pairs.forEach(p => { cards.push({ ...p, cardId: p.id + '-a' }); cards.push({ ...p, cardId: p.id + '-b' }); });
    cards.sort(() => Math.random() - 0.5);

    let openCards = [];
    let lockBoard = false;
    let matchedCount = 0;

    cards.forEach(card => {
      const btn = document.createElement('button');
      btn.className = 'btn-icon-pill memory-card-btn';
      btn.textContent = '❓';
      btn.dataset.cardId = card.cardId;
      btn.addEventListener('click', () => {
        if (lockBoard || btn.disabled || btn.classList.contains('memory-card-open')) return;
        showMemoryFace(btn, card);
        btn.classList.add('memory-card-open');
        openCards.push({ btn, id: card.id });

        if (openCards.length === 2) {
          lockBoard = true;
          const [first, second] = openCards;
          if (first.id === second.id) {
            if (soundEnabled) AudioEngine.playSuccess();
            first.btn.disabled = true;
            second.btn.disabled = true;
            first.btn.classList.add('memory-card-matched');
            second.btn.classList.add('memory-card-matched');
            matchedCount++;
            openCards = [];
            lockBoard = false;
            if (matchedCount === pairs.length) {
              setTimeout(() => showVisualFeedback(successMsg, 'success'), 250);
              if (typeof onDone === 'function') onDone();
            } else {
              showVisualFeedback('Harika eşleşme!', 'success');
            }
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            showVisualFeedback('Eşleşmedi, tekrar dene.', 'error');
            setTimeout(() => {
              first.btn.textContent = '❓';
              second.btn.textContent = '❓';
              first.btn.classList.remove('memory-card-open');
              second.btn.classList.remove('memory-card-open');
              openCards = [];
              lockBoard = false;
            }, 700);
          }
        }
      });
      grid.appendChild(btn);
    });
    container.appendChild(grid);
  }

  // --- GENEL YENİDEN KULLANILABİLİR OYUN MEKANİKLERİ ---
  // "Sırayla Dokun": items DOĞRU sırayla verilir, ekranda karışık gösterilir.
  // Çocuk doğru sırayla tıkladıkça buton yeşile döner; yanlış tıklarsa sallanır ve hata sesi çalar.
  function initTapOrderGame(container, items, successMsg, onDone) {
    if (!container) return;
    container.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'tap-order-row';
    if (items.some(it => it.img)) { row.classList.add('pic-row'); if (items.length > 4) row.classList.add('pic-row-many'); }
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    let nextIndex = 0;

    shuffled.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'btn-icon-pill tap-order-btn';
      if (item.img) {
        btn.classList.add('pic-card');
        btn.appendChild(makeImg(item.img, item.label || '', item.emoji, 'pic-card-img'));
        const lb = document.createElement('span');
        lb.className = 'pic-card-label';
        lb.textContent = item.label || '';
        btn.appendChild(lb);
        btn.setAttribute('aria-label', item.label || '');
      } else {
        btn.innerHTML = item.html;
      }
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        if (item.id === items[nextIndex].id) {
          btn.disabled = true;
          btn.classList.add('tap-order-correct');
          if (soundEnabled) AudioEngine.playSuccess();
          nextIndex++;
          if (nextIndex === items.length) {
            setTimeout(() => showVisualFeedback(successMsg, "success"), 250);
            if (typeof onDone === 'function') onDone();
          } else {
            showVisualFeedback("Harika, sırada devam edelim!", "info");
          }
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          btn.classList.add('tap-order-shake');
          setTimeout(() => btn.classList.remove('tap-order-shake'), 400);
          showVisualFeedback("Tekrar deneyelim, doğru sırayı bul.", "error");
        }
      });
      row.appendChild(btn);
    });
    container.appendChild(row);
  }

  // "Bölgeye Sürükle": items bir zoneId'ye sahiptir, zones hedef kutulardır (görselli olabilir).
  // Doğru bölgeye bırakılan eleman bölgenin içine yerleşir; yanlışta sallanıp yerine döner.
  function initZoneDragGame(bankEl, zonesEl, items, zones, successMsg, onDone) {
    if (!bankEl || !zonesEl) return;
    bankEl.innerHTML = '';
    zonesEl.innerHTML = '';
    let remaining = items.length;
    const dnd = createDnD(bankEl.parentElement || bankEl);

    zones.forEach(zone => {
      const zoneDiv = document.createElement('div');
      zoneDiv.className = 'dnd-zone';
      zoneDiv.dataset.drop = zone.id;
      zoneDiv.tabIndex = 0;
      const pic = zone.img ? makeImg(zone.img, zone.label, zone.icon, 'dnd-zone-img') : null;
      if (pic) zoneDiv.appendChild(pic);
      else { const ic = document.createElement('span'); ic.className = 'zone-icon'; ic.textContent = zone.icon; zoneDiv.appendChild(ic); }
      const lb = document.createElement('span');
      lb.className = 'dnd-zone-label';
      lb.textContent = zone.label;
      zoneDiv.appendChild(lb);
      const slot = document.createElement('div');
      slot.className = 'dnd-zone-items';
      zoneDiv.appendChild(slot);
      zonesEl.appendChild(zoneDiv);
    });

    items.slice().sort(() => Math.random() - 0.5).forEach(item => {
      const tile = document.createElement('div');
      tile.className = 'dnd-item';
      tile.dataset.itemId = item.id;
      tile.setAttribute('role', 'button');
      tile.setAttribute('aria-label', item.name || item.id);
      if (item.img) tile.appendChild(makeImg(item.img, item.name || '', item.icon, 'dnd-item-img'));
      else tile.textContent = item.icon;
      dnd.attach(tile, (t, target) => {
        if (item.zoneId === target.dataset.drop) {
          if (soundEnabled) AudioEngine.playSuccess();
          t.classList.add('placed');
          target.querySelector('.dnd-zone-items').appendChild(t);
          remaining--;
          if (remaining === 0) { setTimeout(() => showVisualFeedback(successMsg, "success"), 250); if (typeof onDone === 'function') onDone(); }
          else showVisualFeedback("Doğru yere yerleşti!", "success");
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          t.classList.add('dnd-shake');
          setTimeout(() => t.classList.remove('dnd-shake'), 400);
          showVisualFeedback("Burası doğru yer değil, tekrar dene.", "error");
        }
      });
      bankEl.appendChild(tile);
    });
  }

  // --- BECERİ KÖŞESİ — OYUN 1 ---
  // 3 yaş: Kuti'nin Renk Yolu (söylenen renkteki alana dokun)
  // 4-5 yaş: Kuti'nin Bahçesini Tamamlıyorum (bahçeye uygun nesneleri yerleştir - sürükle-bırak)
  // 6 yaş: Kuti'nin Örüntü Bahçesi (renk/şekil/boyut örüntüsünü tamamla - çoklu kriter)
  const GARDEN_STEPS = [
    { id: 'sun',    icon: '☀️', name: 'Güneş', scene: 'gunesli_bahce', img: G('4_5_yas/doga/kuti_sevimli_gunes.png') },
    { id: 'tree',   icon: '🌳', name: 'Ağaç',  scene: 'agacli_bahce',  img: G('4_5_yas/beceri/kuti_agac.png') },
    { id: 'bench',  icon: '🪑', name: 'Bank',  scene: 'bankli_bahce',  img: G('4_5_yas/beceri/kuti_bank.png') },
    { id: 'grass',  icon: '🌱', name: 'Çimen', scene: 'cimenli_bahce', img: G('4_5_yas/beceri/kuti_cimen.png') },
    { id: 'flower', icon: '🌸', name: 'Çiçek', scene: 'cicekli_bahce', img: G('4_5_yas/doga/kuti_cicek.jpg') }
  ];

  // 4-5 yaş: bahçe sahnesi adım adım tamamlanır (görseller bu sırayla hazırlandığı için sıra sabit)
  function initGardenBuildGame(container) {
    container.innerHTML = '';
    const title = document.createElement('p');
    title.style.cssText = 'text-align:center; font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.5rem;';
    title.textContent = "🌻 Kuti'nin Bahçesini Tamamlıyorum";
    const stage = document.createElement('div');
    stage.className = 'garden-stage';
    stage.dataset.drop = 'garden';
    const hint = document.createElement('p');
    hint.className = 'garden-hint';
    const bank = document.createElement('div');
    bank.className = 'garden-bank';
    container.appendChild(title);
    container.appendChild(stage);
    container.appendChild(hint);
    container.appendChild(bank);

    const sceneImg = (file) => makeImg(G('4_5_yas/beceri/' + file + '.jpg'), 'Kuti\'nin bahçesi', '🏡', 'garden-img');
    stage.appendChild(sceneImg('bulutlu_bahce'));
    let step = 0;
    const setHint = () => { hint.textContent = step < GARDEN_STEPS.length ? `Sıradaki: ${GARDEN_STEPS[step].icon} ${GARDEN_STEPS[step].name} — bahçeye sürükle!` : ''; };
    setHint();

    const dnd = createDnD(container);
    GARDEN_STEPS.slice().sort(() => Math.random() - 0.5).forEach(s => {
      const tile = document.createElement('div');
      tile.className = 'garden-tile';
      tile.setAttribute('role', 'button');
      tile.setAttribute('aria-label', s.name);
      tile.appendChild(makeImg(s.img, s.name, s.icon, 'garden-tile-img'));
      const tl = document.createElement('span');
      tl.className = 'garden-tile-label';
      tl.textContent = s.name;
      tile.appendChild(tl);
      dnd.attach(tile, (t) => {
        if (s.id === GARDEN_STEPS[step].id) {
          if (soundEnabled) AudioEngine.playSuccess();
          t.classList.add('placed');
          t.style.display = 'none';
          stage.innerHTML = '';
          stage.appendChild(sceneImg(s.scene));
          step++;
          setHint();
          if (step === GARDEN_STEPS.length) {
            setTimeout(() => showVisualFeedback('🎉 Bahçeyi harika bir şekilde tamamladın!', 'success'), 300);
            gameDone('beceri', 3500);
            setTimeout(() => { if (currentAgeLevel === '4-5') initBeceriGame('4-5'); }, 5000);
          } else {
            showVisualFeedback('Harika, bahçe güzelleşiyor!', 'info');
          }
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          t.classList.add('dnd-shake');
          setTimeout(() => t.classList.remove('dnd-shake'), 400);
          showVisualFeedback(`Önce ${GARDEN_STEPS[step].icon} ${GARDEN_STEPS[step].name} lazım, onu dene.`, 'error');
        }
      });
      bank.appendChild(tile);
    });
  }

  // 6 yaş örüntüleri: şekil/çiçek şeritleri + fil boyut dizisi (küçükten büyüğe)
  const FIL_HEIGHT = { en_kucuk_fil: 66, kucuk_fil: 84, ortanca_fil: 102, buyuk_fil: 120, en_buyuk_fil: 138 };
  const BECERI6_PATTERNS = [
    { kind: 'strip', strip: 'ay_yildiz_oruntu', next: { f: 'yildiz_oruntu', e: '⭐' }, wrong: { f: 'ay_oruntu', e: '🌙' } },
    { kind: 'strip', strip: 'cicek_aycicegi_oruntu', next: { f: 'cicek_oruntu', e: '🌸' }, wrong: { f: 'lale_oruntu', e: '🌷' } },
    { kind: 'size', seq: ['en_kucuk_fil', 'kucuk_fil', 'ortanca_fil'], next: { f: 'buyuk_fil', e: '🐘' }, wrong: { f: 'en_kucuk_fil', e: '🐘' } }
  ];
  let lastBeceri6 = -1;

  function initBeceriGame(level) {
    const beceriContainer = document.getElementById('sirala-grid');
    if (!beceriContainer) return;
    beceriContainer.innerHTML = '';

    if (level === '3') {
      // Söylenen renk gösterilir, çocuk o renkteki alana (Kuti'nin durduğu renkli alan) dokunur
      const colors = [
        { id: 'red', name: 'Kırmızı', swatch: '🔴', img: G('3_yas/beceri/kuti_kirmizi_alan.jpg') },
        { id: 'yellow', name: 'Sarı', swatch: '🟡', img: G('3_yas/beceri/kuti_sari_alan.jpg') },
        { id: 'blue', name: 'Mavi', swatch: '🔵', img: G('3_yas/beceri/kuti_mavi_alan.jpg') }
      ];
      const target = colors[Math.floor(Math.random() * colors.length)];
      beceriContainer.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.85rem; font-weight:700; color:#2E7D32; margin-bottom:0.4rem;">🎨 Kuti'nin Renk Yolu</p>
          <p style="font-size:0.8rem; font-weight:700; color:#1B5E20; margin-bottom:0.6rem;">"${target.name}" renkteki alana dokun!</p>
          <div id="beceri-color-choices" class="color-row"></div>
        </div>`;
      const box = document.getElementById('beceri-color-choices');
      colors.slice().sort(() => Math.random() - 0.5).forEach(c => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'color-card';
        btn.setAttribute('aria-label', c.name);
        btn.appendChild(makeImg(c.img, c.name, c.swatch, 'color-card-img'));
        btn.addEventListener('click', () => {
          if (c.id === target.id) {
            if (soundEnabled) AudioEngine.playSuccess();
            showVisualFeedback('🎉 Doğru renge dokundun!', 'success');
            gameDone('beceri', 1800);
            initBeceriGame('3');
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            btn.classList.add('dnd-shake');
            setTimeout(() => btn.classList.remove('dnd-shake'), 400);
            showVisualFeedback('Tekrar bak, hangi renk söylendi?', 'error');
          }
        });
        box.appendChild(btn);
      });
    } else if (level === '4-5') {
      initGardenBuildGame(beceriContainer);
    } else {
      let pi = Math.floor(Math.random() * BECERI6_PATTERNS.length);
      if (pi === lastBeceri6) pi = (pi + 1) % BECERI6_PATTERNS.length;
      lastBeceri6 = pi;
      const p = BECERI6_PATTERNS[pi];
      beceriContainer.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.3rem;">🪴 Kuti'nin Örüntü Bahçesi</p>
          <p style="font-size:0.72rem; color:var(--text-muted); margin-bottom:0.5rem;">Sıradaki hangisi olmalı?</p>
          <div id="beceri-pattern-row" class="pat-row"></div>
          <div id="beceri-pattern-choices" class="pat-choices"></div>
        </div>`;
      const row = document.getElementById('beceri-pattern-row');
      if (p.kind === 'strip') {
        row.appendChild(makeImg(G('6_yas/beceri/' + p.strip + '.jpg'), 'Örüntü', '🔁', 'pat-strip'));
      } else {
        p.seq.forEach(f => {
          const im = makeImg(G('6_yas/beceri/' + f + '.jpg'), 'Fil', '🐘', 'pat-fil');
          im.style.height = FIL_HEIGHT[f] + 'px';
          row.appendChild(im);
        });
      }
      const q = document.createElement('div');
      q.className = 'pat-q';
      q.textContent = '❓';
      row.appendChild(q);

      const choicesBox = document.getElementById('beceri-pattern-choices');
      [p.next, p.wrong].sort(() => Math.random() - 0.5).forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pat-opt';
        const im = makeImg(G('6_yas/beceri/' + opt.f + '.jpg'), 'Seçenek', opt.e, 'pat-opt-img');
        if (p.kind === 'size') im.style.height = Math.round(FIL_HEIGHT[opt.f] * 0.75) + 'px';
        btn.appendChild(im);
        btn.addEventListener('click', () => {
          if (opt === p.next) {
            if (soundEnabled) AudioEngine.playSuccess();
            showVisualFeedback('🎉 Örüntü başarıyla tamamlandı!', 'success');
            gameDone('beceri', 1800);
            setTimeout(() => { if (currentAgeLevel === '6+') initBeceriGame('6+'); }, 1200);
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            btn.classList.add('dnd-shake');
            setTimeout(() => btn.classList.remove('dnd-shake'), 400);
            showVisualFeedback('Örüntüye tekrar bak, sırada ne gelmeli?', 'error');
          }
        });
        choicesBox.appendChild(btn);
      });
    }
  }

  function initRealImagePuzzle(level) {
    const puzzleBoard = document.getElementById('puzzle-board-grid');
    const puzzleBank = document.getElementById('puzzle-piece-bank');
    if (!puzzleBoard || !puzzleBank) return;

    puzzleBoard.innerHTML = '';
    puzzleBank.innerHTML = '';

    // 3 yaş: 2x2 (1 parça eksik) · 4-5 yaş: Kuti 2x2 Yapbozu (2 parça eksik, 4 parçalı tam bulmaca)
    // 6 yaş: Kuti 3x3 Yapbozu (9 parçalı bulmaca, 3 parça eksik)
    let totalCols = level === '6+' ? 3 : 2;
    let totalRows = level === '6+' ? 3 : 2;
    let missingCount = level === '3' ? 1 : (level === '6+' ? 3 : 2);

    puzzleBoard.style.gridTemplateColumns = `repeat(${totalCols}, 1fr)`;
    puzzleBoard.style.gridTemplateRows = `repeat(${totalRows}, 1fr)`;

    const totalSlots = totalCols * totalRows;
    let missingIndices = [];
    while (missingIndices.length < missingCount) {
      let randIdx = Math.floor(Math.random() * totalSlots);
      if (!missingIndices.includes(randIdx)) missingIndices.push(randIdx);
    }

    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < totalCols; c++) {
        const index = r * totalCols + c;
        const slot = document.createElement('div');
        slot.className = 'puzzle-board-slot';
        slot.dataset.slotIndex = index;
        
        const posX = totalCols > 1 ? (c / (totalCols - 1)) * 100 : 0;
        const posY = totalRows > 1 ? (r / (totalRows - 1)) * 100 : 0;
        
        slot.style.backgroundImage = "url('kuti_mascot.jpg')";
        slot.style.backgroundSize = `${totalCols * 100}% ${totalRows * 100}%`;
        slot.style.backgroundPosition = `${posX}% ${posY}%`;

        if (missingIndices.includes(index)) slot.classList.add('empty');
        puzzleBoard.appendChild(slot);
      }
    }

    missingIndices.forEach(idx => {
      const c = idx % totalCols;
      const r = Math.floor(idx / totalCols);
      const posX = totalCols > 1 ? (c / (totalCols - 1)) * 100 : 0;
      const posY = totalRows > 1 ? (r / (totalRows - 1)) * 100 : 0;

      const piece = document.createElement('div');
      piece.className = 'puzzle-cut-piece drag-source';
      piece.draggable = true;
      piece.dataset.targetSlot = idx;
      piece.style.backgroundImage = "url('kuti_mascot.jpg')";
      piece.style.backgroundSize = `${totalCols * 100}% ${totalRows * 100}%`;
      piece.style.backgroundPosition = `${posX}% ${posY}%`;

      piece.addEventListener('click', () => {
        const targetSlot = puzzleBoard.querySelector(`[data-slot-index="${idx}"]`);
        if (targetSlot && targetSlot.classList.contains('empty')) {
          targetSlot.classList.remove('empty');
          piece.remove();
          if (soundEnabled) AudioEngine.playSuccess();
          if (puzzleBank.children.length === 0) {
            setTimeout(() => showVisualFeedback("🎉 Harika! Kuti Yapbozunu Tamamladın!", "success"), 300);
            gameDone('beceri', 2800);
          }
        }
      });
      puzzleBank.appendChild(piece);
    });
  }

  // --- BECERİ KÖŞESİ — OYUN 3 (sadece 6 yaş): Kuti'nin Hafıza Bahçesi ---
  // 12 kapalı kart içinden 6 çifti bulma — görsel hafıza ve eşleştirme.
  function initBeceriExtraGame(level) {
    const wrapper = document.getElementById('beceri-extra-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';
    if (level !== '6+') return;

    const title = document.createElement('p');
    title.style.cssText = 'text-align:center; font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.5rem; ';
    title.textContent = "🧠 Kuti'nin Hafıza Bahçesi";
    wrapper.appendChild(title);
    const grid = document.createElement('div');
    wrapper.appendChild(grid);

    initMemoryMatchGame(grid, [
      { id: 'moon',   icon: '🌙', img: G('6_yas/beceri/ay_oruntu.jpg') },
      { id: 'star',   icon: '⭐', img: G('6_yas/beceri/yildiz_oruntu.jpg') },
      { id: 'cloud',  icon: '☁️', img: G('6_yas/beceri/bulut_oruntu.jpg') },
      { id: 'flower', icon: '🌸', img: G('6_yas/beceri/cicek_oruntu.jpg') },
      { id: 'tulip',  icon: '🌷', img: G('6_yas/beceri/lale_oruntu.jpg') },
      { id: 'sunfl',  icon: '🌻', img: G('6_yas/beceri/aycicegi_oruntu.jpg') }
    ], '🎉 Harika hafıza! Bütün çiftleri buldun!', () => gameDone('beceri', 2800));
  }

  // --- ÖZ BAKIM KÖŞESİ — OYUN 1: TEMİZLİK/RUTİN (her yaş için ayrı gerçek mekanik) ---
  // Not: Kap her seferinde tamamen yeniden kuruluyor, böylece bir yaştan diğerine geçerken
  // önceki DOM elemanları kaybolsa bile fonksiyon her zaman doğru elemanları bulur.
  // --- ÖZ BAKIM — 3 YAŞ: ELLERİ YIKAMA (nesneyi doğru sahneye sürükle-bırak) ---
  // Sıra yok: damla / sabun / havlu nesneleri kendi sahnelerine eşleştirilir.
  // Dokunmatik uyumlu (pointer events) ve sürüklemeyi başaramayan çocuk için "dokun, sonra yere dokun" yolu da var.
  // Görsel dosyası bulunamazsa emojiye düşer.
  // Görsel yolu esnekliği: istenen dosya bulunamazsa aynı adı farklı uzantıyla (.jpg/.png/.jpeg/.webp)
  // ve farklı klasörlerle (kök, gorseller/, images/, img/) dener. Bulduğu yolu hatırlar.
  const IMG_OK = {};
  const IMG_ALIAS = { 'kuti_oyuncagini_kaybediyor': ['kuti_oyuncağını_kaybediyor'] };
  function imgCandidates(src) {
    if (IMG_OK[src]) return [IMG_OK[src]];
    const m = src.match(/^(.*\/)?([^\/]+?)(\.[a-zA-Z0-9]+)?$/);
    const dir = m[1] || '', name = m[2], ext = (m[3] || '').toLowerCase();
    const names = [name].concat(IMG_ALIAS[name] || []);
    const exts = [ext, '.jpg', '.png', '.jpeg', '.webp'].filter((e, i, arr) => e && arr.indexOf(e) === i);
    const dirs = [dir, '', 'gorseller/', 'images/', 'img/'].filter((d, i, arr) => arr.indexOf(d) === i);
    const out = [];
    dirs.forEach(d => names.forEach(n => exts.forEach(e => out.push(d + n + e))));
    return out;
  }

  function setImgWithFallback(img, srcList, onAllFail) {
    const list = [];
    srcList.forEach(s => imgCandidates(s).forEach(c => { if (!list.includes(c)) list.push(c); }));
    let i = 0;
    img.onload = () => { IMG_OK[srcList[0]] = list[i]; };
    img.onerror = () => {
      i++;
      if (i < list.length) { img.src = list[i]; }
      else {
        img.onerror = null;
        console.warn('[Kuti] Görsel bulunamadı: ' + srcList[0] + ' (denenen ilk yollar: ' + list.slice(0, 5).join(', ') + ')');
        if (onAllFail) onAllFail();
      }
    };
    img.src = list[0];
  }

  function initHandWashGame(wrapper) {
    const steps = [
      { id: 'wet',  name: 'Damla',  emoji: '💧', icon: ['ikon_damla.png', 'icon_damla.png'], scene: ['kuti_el_islat.jpg'],  color: '#90CAF9', tint: '#E3F2FD' },
      { id: 'soap', name: 'Sabun',  emoji: '🧼', icon: ['ikon_sabun.png', 'icon_sabun.png'], scene: ['kuti_el_sabun.jpg'],  color: '#F48FB1', tint: '#FCE4EC' },
      { id: 'dry',  name: 'Havlu',  emoji: '🧣', icon: ['icon_havlu.png', 'ikon_havlu.png'], scene: ['kuti_el_kurula.jpg'], color: '#A5D6A7', tint: '#E8F5E9' }
    ];

    const board = document.createElement('div');
    board.className = 'hw-board';
    const bank = document.createElement('div');
    bank.className = 'hw-bank';
    const hint = document.createElement('p');
    hint.className = 'hw-hint';
    hint.textContent = 'İpucu: Aşağıdaki nesneleri ilgili bölgelere sürükleyip bırak!';
    wrapper.appendChild(board);
    wrapper.appendChild(bank);
    wrapper.appendChild(hint);

    function makeIcon(step) {
      const img = document.createElement('img');
      img.className = 'hw-icon';
      img.alt = '';
      img.draggable = false;
      setImgWithFallback(img, step.icon, () => {
        const span = document.createElement('span');
        span.className = 'hw-icon-emoji';
        span.textContent = step.emoji;
        img.replaceWith(span);
      });
      return img;
    }

    // Sahneler (sabit sırada) + bırakma bölgeleri
    steps.forEach(step => {
      const col = document.createElement('div');
      col.className = 'hw-col';
      col.dataset.zone = step.id;
      col.tabIndex = 0;
      col.style.setProperty('--hw-c', step.color);
      col.style.setProperty('--hw-t', step.tint);

      const frame = document.createElement('div');
      frame.className = 'hw-scene-frame';
      const img = document.createElement('img');
      img.className = 'hw-scene';
      img.alt = 'Kuti ellerini yıkıyor';
      img.draggable = false;
      setImgWithFallback(img, step.scene, () => {
        const fb = document.createElement('div');
        fb.className = 'hw-scene-fallback';
        fb.textContent = step.emoji;
        img.replaceWith(fb);
      });
      frame.appendChild(img);

      const zone = document.createElement('div');
      zone.className = 'hw-zone';
      col.appendChild(frame);
      col.appendChild(zone);
      board.appendChild(col);
    });

    // Nesneler (karışık)
    let matched = 0;
    let selected = null;

    function finishIfDone() {
      if (matched === steps.length) {
        setTimeout(() => showVisualFeedback("✨ Harika! Kuti'nin elleri tertemiz oldu!", "success"), 300);
        gameDone('ozbakim', 3200);
        setTimeout(() => {
          if (document.body.contains(board) && currentAgeLevel === '3') initOzbakimOralGame('3');
        }, 5000);
      }
    }

    function tryDrop(tile, col) {
      if (!tile || !col || tile.classList.contains('placed')) return;
      if (tile.dataset.step === col.dataset.zone) {
        const zone = col.querySelector('.hw-zone');
        zone.appendChild(tile);
        tile.classList.remove('hw-selected');
        tile.classList.add('placed');
        zone.classList.add('filled');
        if (soundEnabled) AudioEngine.playSuccess();
        matched++;
        if (matched < steps.length) showVisualFeedback("Harika, doğru yere koydun!", "info");
        finishIfDone();
      } else {
        if (soundEnabled) AudioEngine.playTone(300, 0.2);
        tile.classList.add('hw-shake');
        setTimeout(() => tile.classList.remove('hw-shake'), 400);
        showVisualFeedback("Bu nesne buraya uymuyor, başka yere dene.", "error");
      }
    }

    function colFromPoint(x, y) {
      const el = document.elementFromPoint ? document.elementFromPoint(x, y) : null;
      return el ? el.closest('.hw-col') : null;
    }

    function setSelected(tile) {
      if (selected) selected.classList.remove('hw-selected');
      selected = tile;
      if (selected) selected.classList.add('hw-selected');
    }

    steps.slice().sort(() => Math.random() - 0.5).forEach(step => {
      const tile = document.createElement('div');
      tile.className = 'hw-tile';
      tile.dataset.step = step.id;
      tile.tabIndex = 0;
      tile.setAttribute('role', 'button');
      tile.setAttribute('aria-label', step.name);
      tile.appendChild(makeIcon(step));
      bank.appendChild(tile);

      tile.addEventListener('pointerdown', (e) => {
        if (tile.classList.contains('placed')) return;
        e.preventDefault();
        if (tile.setPointerCapture && e.pointerId !== undefined) { try { tile.setPointerCapture(e.pointerId); } catch (_) {} }
        const startX = e.clientX, startY = e.clientY;
        const rect = tile.getBoundingClientRect();
        const offX = startX - rect.left, offY = startY - rect.top;
        let ghost = null;
        let overCol = null;

        const onMove = (ev) => {
          if (!ghost && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 8) {
            ghost = tile.cloneNode(true);
            ghost.classList.add('hw-ghost');
            ghost.style.width = rect.width + 'px';
            ghost.style.height = rect.height + 'px';
            document.body.appendChild(ghost);
            tile.classList.add('hw-dragging');
            setSelected(null);
          }
          if (ghost) {
            ghost.style.left = Math.round(ev.clientX - offX) + 'px';
            ghost.style.top = Math.round(ev.clientY - offY) + 'px';
            const col = colFromPoint(ev.clientX, ev.clientY);
            if (col !== overCol) {
              if (overCol) overCol.classList.remove('hw-over');
              overCol = col;
              if (overCol) overCol.classList.add('hw-over');
            }
          }
        };
        const onUp = (ev) => {
          tile.removeEventListener('pointermove', onMove);
          tile.removeEventListener('pointerup', onUp);
          tile.removeEventListener('pointercancel', onUp);
          if (overCol) overCol.classList.remove('hw-over');
          if (ghost) {
            const col = colFromPoint(ev.clientX, ev.clientY);
            ghost.remove();
            tile.classList.remove('hw-dragging');
            if (col) tryDrop(tile, col);
          } else if (ev.type === 'pointerup') {
            setSelected(selected === tile ? null : tile); // dokun-seç
          }
        };
        tile.addEventListener('pointermove', onMove);
        tile.addEventListener('pointerup', onUp);
        tile.addEventListener('pointercancel', onUp);
      });

      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(selected === tile ? null : tile); }
      });
    });

    // Seçili nesne varken bir sahneye dokunmak = oraya bırakmak
    board.addEventListener('click', (e) => {
      const col = e.target.closest('.hw-col');
      if (!col || !selected) return;
      const t = selected;
      setSelected(null);
      tryDrop(t, col);
    });
    board.addEventListener('keydown', (e) => {
      const col = e.target.closest ? e.target.closest('.hw-col') : null;
      if (!col || !selected || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      const t = selected;
      setSelected(null);
      tryDrop(t, col);
    });
  }

  function initOzbakimOralGame(level) {
    const wrapper = document.getElementById('ozbakim-oral-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    if (level === '3') {
      // Gerçek mekanik: Elleri doğru sırayla yıkama — Islat → Sabunla → Kurula
      const title = document.createElement('p');
      title.style.cssText = 'text-align:center; font-size:0.85rem; font-weight:700; color:#00796B; margin-bottom:0.5rem;';
      title.textContent = "🧼 Kuti ellerini yıkıyor — nesneleri doğru yere bırak";
      wrapper.appendChild(title);
      initHandWashGame(wrapper);
    } else if (level === '6+') {
      // Kuti'nin Bir Günü — sabah ve gece rutinini 7 adımlık tam gün akışında sırala (görselli kartlar)
      const title = document.createElement('p');
      title.style.cssText = 'text-align:center; font-size:0.85rem; font-weight:700; color:#E65100; margin-bottom:0.5rem;';
      title.textContent = "☀️🌙 Kuti'nin Bir Günü — Rutini Doğru Sıraya Diz";
      wrapper.appendChild(title);
      const row = document.createElement('div');
      wrapper.appendChild(row);
      initTapOrderGame(row, [
        { id: 'wake',   label: 'Uyanma',            emoji: '🌅', img: G('4_5_yas/oz_bakim/kuti_uyaniyor.jpg') },
        { id: 'wash',   label: 'Yüz Yıkama',        emoji: '🚿', img: G('4_5_yas/oz_bakim/kuti_yuz_yikama.jpg') },
        { id: 'brush',  label: 'Diş Fırçalama',     emoji: '🪥', img: G('4_5_yas/oz_bakim/kuti_dis_fircalama.jpg') },
        { id: 'dress',  label: 'Kıyafet Değiştirme', emoji: '👕', img: G('6_yas/oz_bakim/kuti_kiyafet_degistirme.jpg') },
        { id: 'go',     label: 'Dışarı Hazırlanma', emoji: '🎒', img: G('6_yas/oz_bakim/kuti_disari_cikma.jpg') },
        { id: 'pajama', label: 'Pijama',            emoji: '🩳', img: G('6_yas/oz_bakim/kuti_pijama.jpg') },
        { id: 'sleep',  label: 'Uyuma',             emoji: '🌙', img: G('6_yas/oz_bakim/kuti_uyuma.jpg') }
      ], "🎉 Kuti'nin bütün günü doğru sıraya kondu!", () => gameDone('ozbakim', 2800));
    } else {
      // 4-5 Yaş: Kuti'nin Sabah Sırası — görselli kartlarla sabah rutini
      const title = document.createElement('p');
      title.style.cssText = 'text-align:center; font-size:0.85rem; font-weight:700; color:#00796B; margin-bottom:0.5rem;';
      title.textContent = "🌅 Kuti'nin Sabah Sırası";
      wrapper.appendChild(title);
      const row = document.createElement('div');
      wrapper.appendChild(row);
      initTapOrderGame(row, [
        { id: 'wake',  label: 'Uyanma',        emoji: '🌅', img: G('4_5_yas/oz_bakim/kuti_uyaniyor.jpg') },
        { id: 'wash',  label: 'Yüz Yıkama',    emoji: '🚿', img: G('4_5_yas/oz_bakim/kuti_yuz_yikama.jpg') },
        { id: 'brush', label: 'Diş Fırçalama', emoji: '🪥', img: G('4_5_yas/oz_bakim/kuti_dis_fircalama.jpg') },
        { id: 'dress', label: 'Giyinme',       emoji: '👕', img: G('4_5_yas/oz_bakim/kuti_giyinme.jpg') }
      ], "🎉 Sabah rutini doğru sıraya kondu!", () => gameDone('ozbakim', 2800));
    }
  }

  // --- ÖZ BAKIM KÖŞESİ — OYUN 2: HAVA DURUMUNA GÖRE GİYDİRME (gerçek hava/kıyafet eşleşme kontrolü) ---
  const WEATHER_CLOTHING_MAP = {
    sunny: { clue: '☀️ Güneşli bir gün', matchLabel: 'T-shirt' },
    rainy: { clue: '🌧️ Yağmurlu bir gün', matchLabel: 'Yağmurluk' },
    cold: { clue: '❄️ Soğuk bir gün', matchLabel: 'Mont' }
  };

  // Giydirme: tüm yaşlarda Kuti'nin kıyafetli görselleri
  const DRESS_INFO = {
    'T-shirt':   { label: 'T-shirt',   emoji: '👕', msg: 'Kuti T-shirtünü giydi, hava için tam uygun! 🎉' },
    'Yağmurluk': { label: 'Yağmurluk', emoji: '🧥', msg: 'Kuti yağmurluğunu giydi, hava için tam uygun! 🎉' },
    'Mont':      { label: 'Mont',      emoji: '🧥', msg: 'Kuti montunu giydi, hava için tam uygun! 🎉' }
  };
  const DRESS_IMG = {
    '3':   { 'T-shirt': 'kuti_tisort.jpg', 'Yağmurluk': 'kuti_yagmurluk.jpg' },
    '4-5': { 'T-shirt': G('4_5_yas/oz_bakim/kuti_tisortlu.jpg'), 'Yağmurluk': G('4_5_yas/oz_bakim/kuti_yagmurluklu.jpg'), 'Mont': G('4_5_yas/oz_bakim/kuti_montlu.jpg') },
    '6+':  { 'T-shirt': G('4_5_yas/oz_bakim/kuti_tisortlu.jpg'), 'Yağmurluk': G('4_5_yas/oz_bakim/kuti_yagmurluklu.jpg'), 'Mont': G('6_yas/oz_bakim/kuti_mont.jpg') }
  };
  let lastDressWeather = null;

  function initOzbakimDressGame(level, cfg) {
    const clueEl = document.getElementById('ozbakim-weather-clue');
    const dressContainer = document.getElementById('dress-options-grid');
    if (!dressContainer) return;

    const hasMont = cfg.weatherOptions.some(o => o.includes('Mont'));
    const availableWeathers = hasMont ? ['sunny', 'rainy', 'cold'] : ['sunny', 'rainy'];
    let pool = availableWeathers.filter(k => k !== lastDressWeather);
    if (!pool.length) pool = availableWeathers;
    const weatherKey = pool[Math.floor(Math.random() * pool.length)];
    lastDressWeather = weatherKey;
    const weather = WEATHER_CLOTHING_MAP[weatherKey];
    if (clueEl) clueEl.textContent = weather.clue;

    dressContainer.innerHTML = '';
    let locked = false;
    const imgs = DRESS_IMG[level] || DRESS_IMG['4-5'];
    const options = cfg.weatherOptions
      .map(o => Object.keys(DRESS_INFO).find(k => o.includes(k)))
      .filter(Boolean)
      .sort(() => Math.random() - 0.5);

    options.forEach(key => {
      const info = DRESS_INFO[key];
      const card = document.createElement('div');
      card.className = 'dress-card' + (level === '3' ? '' : ' dress-card--white');
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', info.label);
      const frame = document.createElement('div');
      frame.className = 'dress-card-frame';
      frame.appendChild(makeImg(imgs[key], 'Kuti ' + info.label + ' giymiş', info.emoji, 'dress-card-img'));
      const label = document.createElement('div');
      label.className = 'dress-card-label';
      label.textContent = info.label;
      card.appendChild(frame);
      card.appendChild(label);

      const choose = () => {
        if (locked) return;
        if (weather.matchLabel === key) {
          locked = true;
          card.classList.add('correct');
          dressContainer.querySelectorAll('.dress-card').forEach(o => { if (o !== card) o.classList.add('dim'); });
          if (soundEnabled) AudioEngine.playSuccess();
          showVisualFeedback(info.msg, 'success');
          gameDone('ozbakim', 2600);
          setTimeout(() => { if (currentAgeLevel === level) initOzbakimDressGame(level, cfg); }, 3000);
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          card.classList.add('dress-shake');
          setTimeout(() => card.classList.remove('dress-shake'), 400);
          showVisualFeedback('Bu hava için doğru kıyafet değil, tekrar dene.', 'error');
        }
      };
      card.addEventListener('click', choose);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
      dressContainer.appendChild(card);
    });
  }

  // --- DOĞA KÖŞESİ — OYUN 1: MEVSİM/HAVA (gerçek ipucu eşleştirme kontrolü) ---
  const SEASON_CLUE_MAP = {
    '🍂 Sonbahar': ['🍂 Yapraklar dökülüyor', '🌰 Kestaneler olgunlaşıyor'],
    '❄️ Kış': ['❄️ Kar yağıyor', '⛄ Kardan adam yapma zamanı'],
    '🌸 İlkbahar': ['🌸 Çiçekler açıyor', '🐝 Arılar uçuşuyor'],
    '☀️ Yaz': ['☀️ Güneş çok sıcak', '🍉 Karpuz zamanı']
  };

  // 3 yaş: Kuti'nin Hava Durumu — gökyüzü görseline uygun hava ikonunu seç (görsel eşleştirme)
  // 4-5 / 6 yaş: Kuti'nin Mevsimini Bul — hava durumu ipucundan mevsimi tahmin et
  const SEASON_DEFS = [
    { key: '🍂 Sonbahar', label: 'Sonbahar', emoji: '🍂', file: 'kuti_sonbahar.jpg' },
    { key: '❄️ Kış',      label: 'Kış',      emoji: '❄️', file: 'kuti_kis.jpg' },
    { key: '🌸 İlkbahar', label: 'İlkbahar', emoji: '🌸', file: 'kuti_ilkbahar.jpg' },
    { key: '☀️ Yaz',      label: 'Yaz',      emoji: '☀️', file: 'kuti_yaz.jpg' }
  ];
  const SKY_DEFS = [
    { id: 'sunny',  label: 'Güneşli',  emoji: '☀️', icon: G('3_yas/doga/kuti_gunesli.png'),  scene: [G('3_yas/doga/kuti_gunesli_hava.jpg'),  G('3_yas/doga/kuti_gunesli.png')] },
    { id: 'cloudy', label: 'Bulutlu',  emoji: '☁️', icon: G('3_yas/doga/kuti_bulutlu.png'),  scene: [G('3_yas/doga/kuti_bulutlu_hava.jpg'),  G('3_yas/doga/kuti_bulutlu.png')] },
    { id: 'rainy',  label: 'Yağmurlu', emoji: '🌧️', icon: G('3_yas/doga/kuti_yagmurlu.png'), scene: [G('3_yas/doga/kuti_yagmurlu_hava.jpg'), G('3_yas/doga/kuti_yagmurlu.png')] }
  ];
  let lastSky = null;

  function initDogaMevsimGame(level) {
    const clueEl = document.getElementById('doga-mevsim-clue');
    const mevsimBox = document.getElementById('mevsim-options');
    if (!mevsimBox) return;
    mevsimBox.innerHTML = '';
    let locked = false;

    if (level === '3') {
      let pool = SKY_DEFS.filter(s => s.id !== lastSky);
      const target = pool[Math.floor(Math.random() * pool.length)];
      lastSky = target.id;
      if (clueEl) { clueEl.style.fontSize = '0.9rem'; clueEl.style.fontWeight = '700'; clueEl.textContent = 'Gökyüzü böyle — hangisi bu havaya uyuyor?'; }

      const sceneBox = document.createElement('div');
      sceneBox.className = 'weather-scene';
      sceneBox.appendChild(makeImg(target.scene, 'Gökyüzü', target.emoji, 'weather-scene-img'));
      mevsimBox.appendChild(sceneBox);

      const row = document.createElement('div');
      row.className = 'weather-row';
      SKY_DEFS.slice().sort(() => Math.random() - 0.5).forEach(o => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'weather-card';
        btn.setAttribute('aria-label', o.label);
        btn.appendChild(makeImg(o.icon, o.label, o.emoji, 'weather-card-img'));
        const lb = document.createElement('span');
        lb.className = 'weather-card-label';
        lb.textContent = o.label;
        btn.appendChild(lb);
        btn.addEventListener('click', () => {
          if (locked) return;
          if (o.id === target.id) {
            locked = true;
            btn.classList.add('correct');
            if (soundEnabled) AudioEngine.playSuccess();
            showVisualFeedback('🎉 Doğru hava durumunu buldun!', 'success');
            gameDone('doga', 1800);
            setTimeout(() => { if (currentAgeLevel === '3') initDogaMevsimGame('3'); }, 1800);
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            btn.classList.add('dnd-shake');
            setTimeout(() => btn.classList.remove('dnd-shake'), 400);
            showVisualFeedback('Gökyüzüne tekrar bak.', 'error');
          }
        });
        row.appendChild(btn);
      });
      mevsimBox.appendChild(row);
      return;
    }

    // 4-5 ve 6+: ipucundan mevsimi bul — mevsim resimleri seçenek
    const folder = level === '6+' ? '6_yas/doga/' : '4_5_yas/doga/';
    const correct = SEASON_DEFS[Math.floor(Math.random() * SEASON_DEFS.length)];
    const clues = SEASON_CLUE_MAP[correct.key];
    const clue = clues[Math.floor(Math.random() * clues.length)];
    if (clueEl) { clueEl.style.fontSize = '1.9rem'; clueEl.style.fontWeight = ''; clueEl.textContent = clue; }

    const grid = document.createElement('div');
    grid.className = 'season-grid';
    SEASON_DEFS.slice().sort(() => Math.random() - 0.5).forEach(s => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'season-card';
      btn.setAttribute('aria-label', s.label);
      btn.appendChild(makeImg(G(folder + s.file), s.label, s.emoji, 'season-card-img'));
      const lb = document.createElement('span');
      lb.className = 'season-card-label';
      lb.textContent = s.label;
      btn.appendChild(lb);
      btn.addEventListener('click', () => {
        if (locked) return;
        if (s.key === correct.key) {
          locked = true;
          btn.classList.add('correct');
          if (soundEnabled) AudioEngine.playSuccess();
          showVisualFeedback(`${s.emoji} ${s.label} doğru cevap, harikasın!`, 'success');
          gameDone('doga', 2200);
          setTimeout(() => { if (currentAgeLevel === level) initDogaMevsimGame(level); }, 2200);
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          btn.classList.add('dnd-shake');
          setTimeout(() => btn.classList.remove('dnd-shake'), 400);
          showVisualFeedback('İpucuna tekrar bak, hangi mevsim uyuyor?', 'error');
        }
      });
      grid.appendChild(btn);
    });
    mevsimBox.appendChild(grid);
  }

  // --- DOĞA KÖŞESİ — OYUN 2: BAHÇE / BİTKİ BÜYÜTME ---
  function initDogaGardenGame(level) {
    const wrapper = document.getElementById('doga-garden-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    if (level === '6+') {
      wrapper.innerHTML = `
        <div id="doga-lifecycle-block">
          <p style="text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.4rem;">🌿 Bitkinin Yaşam Döngüsünü Sırala</p>
          <div id="doga-lifecycle-row"></div>
        </div>
        <div id="doga-recycle-block">
          <p style="text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.4rem;">🧹 Kuti'nin Bahçesini Temizliyorum</p>
          <div id="doga-recycle-bank" class="zone-item-bank"></div>
          <div id="doga-recycle-zones" class="zone-drop-grid"></div>
        </div>`;

      initTapOrderGame(document.getElementById('doga-lifecycle-row'), [
        { id: 'seed',    label: 'Tohum', emoji: '🌰', img: G('4_5_yas/doga/kuti_tohum.jpg') },
        { id: 'sprout',  label: 'Filiz', emoji: '🌱', img: G('4_5_yas/doga/kuti_filiz.jpg') },
        { id: 'sapling', label: 'Fidan', emoji: '🌿', img: G('6_yas/doga/kuti_fidan.jpg') },
        { id: 'tree',    label: 'Ağaç',  emoji: '🌳', img: G('6_yas/doga/kuti_agac.jpg') }
      ], "🎉 Bitkinin büyüme sırası doğru kuruldu!", () => gameDone('doga', 2800));

      initZoneDragGame(
        document.getElementById('doga-recycle-bank'),
        document.getElementById('doga-recycle-zones'),
        [
          { id: 'leaf',    name: 'Yaprak',     icon: '🍁', img: G('6_yas/doga/cop_yaprak.png'),     zoneId: 'nature' },
          { id: 'stone',   name: 'Taş',        icon: '🪨', img: G('6_yas/doga/cop_tas.png'),        zoneId: 'nature' },
          { id: 'paper',   name: 'Kâğıt',      icon: '📄', img: G('6_yas/doga/cop_kagit.png'),      zoneId: 'trash' },
          { id: 'bottle',  name: 'Şişe',       icon: '🍾', img: G('6_yas/doga/cop_sise.png'),       zoneId: 'trash' },
          { id: 'wrapper', name: 'Meyve suyu', icon: '🧃', img: G('6_yas/doga/cop_meyve_suyu.png'), zoneId: 'trash' }
        ],
        [
          { id: 'nature', icon: '🌳', label: 'Doğa Alanı', img: G('6_yas/doga/bos_bahce.jpg') },
          { id: 'trash',  icon: '🗑️', label: 'Çöp Kutusu', img: G('6_yas/doga/cop_kutusu.png') }
        ],
        '🎉 Bahçe tertemiz oldu, doğa korundu!',
        () => gameDone('doga', 2800)
      );
    } else if (level === '4-5') {
      // Kuti Tohum Yetiştiriyor — görselli kartlarla doğru sırayı bul
      const title = document.createElement('p');
      title.style.cssText = 'text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.5rem;';
      title.textContent = '🌱 Kuti Tohum Yetiştiriyor — Adımları Doğru Sırayla Dokun';
      wrapper.appendChild(title);
      const row = document.createElement('div');
      wrapper.appendChild(row);
      initTapOrderGame(row, [
        { id: 'pot',    label: 'Saksı/Toprak', emoji: '🪴', img: G('4_5_yas/doga/kuti_saksi.jpg') },
        { id: 'seed',   label: 'Tohum',        emoji: '🌰', img: G('4_5_yas/doga/kuti_tohum.jpg') },
        { id: 'water',  label: 'Su',           emoji: '💧', img: G('4_5_yas/doga/kuti_su_damlasi.jpg') },
        { id: 'sun',    label: 'Güneş',        emoji: '☀️', img: G('4_5_yas/doga/kuti_sevimli_gunes.png') },
        { id: 'flower', label: 'Çiçek',        emoji: '🌸', img: G('4_5_yas/doga/kuti_cicek.jpg') }
      ], '🎉 Kuti tohumunu harika bir şekilde yetiştirdi!', () => gameDone('doga', 2800));
    } else {
      // 3 Yaş: suyu, sonra güneşi saksıya sürükle — saksı filiz, sonra çiçek olur
      const title = document.createElement('p');
      title.style.cssText = 'text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.5rem;';
      title.textContent = '🌱 Suyu ve Güneşi Saksıya Sürükle';
      const stage = document.createElement('div');
      stage.className = 'plant-stage';
      stage.dataset.drop = 'pot';
      const hint = document.createElement('p');
      hint.className = 'garden-hint';
      const bank = document.createElement('div');
      bank.className = 'garden-bank';
      wrapper.appendChild(title);
      wrapper.appendChild(stage);
      wrapper.appendChild(hint);
      wrapper.appendChild(bank);

      const stages = ['kuti_saksi.jpg', 'kuti_filiz.jpg', 'kuti_cicek.jpg'];
      const order = ['water', 'sun'];
      const setStage = (i) => { stage.innerHTML = ''; stage.appendChild(makeImg(G('3_yas/doga/' + stages[i]), 'Kuti\'nin bitkisi', '🌱', 'plant-img')); };
      let step = 0;
      setStage(0);
      const setHint = () => { hint.textContent = step === 0 ? '💧 Önce suyu saksıya sürükle!' : step === 1 ? '☀️ Şimdi güneşi saksıya sürükle!' : ''; };
      setHint();

      const dnd = createDnD(wrapper);
      [
        { id: 'water', name: 'Su',    emoji: '💧', img: G('3_yas/doga/kuti_su_damlasi.jpg') },
        { id: 'sun',   name: 'Güneş', emoji: '☀️', img: G('3_yas/doga/kuti_sevimli_gunes.png') }
      ].forEach(it => {
        const tile = document.createElement('div');
        tile.className = 'plant-tile';
        tile.setAttribute('role', 'button');
        tile.setAttribute('aria-label', it.name);
        tile.appendChild(makeImg(it.img, it.name, it.emoji, 'plant-tile-img'));
        dnd.attach(tile, (t) => {
          if (it.id === order[step]) {
            if (soundEnabled) AudioEngine.playSuccess();
            t.classList.add('placed');
            t.style.display = 'none';
            step++;
            setStage(step);
            setHint();
            if (step === order.length) {
              setTimeout(() => showVisualFeedback('🎉 Tebrikler! Bitkini besleyerek koca bir çiçek yaptın!', 'success'), 400);
              gameDone('doga', 3200);
              setTimeout(() => { if (currentAgeLevel === '3') initDogaGardenGame('3'); }, 5000);
            } else {
              showVisualFeedback('Harika, bitki filizlendi!', 'info');
            }
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            t.classList.add('dnd-shake');
            setTimeout(() => t.classList.remove('dnd-shake'), 400);
            showVisualFeedback(step === 0 ? 'Önce su lazım 💧' : 'Şimdi güneş zamanı ☀️', 'error');
          }
        });
        bank.appendChild(tile);
      });
    }
  }

  const ageConfig = {
    '3': {
      badge: '3 Yaş (Minik Keşifçiler)',
      duyguDesc: 'Kuti’nin Duygu Yüzleri — doğru duyguyu seç.',
      beceriDesc: 'Kuti’nin Renk Yolu — söylenen renge dokun.',
      ozbakimDesc: 'Kuti ellerini yıkıyor ve Giyinmeye Hazırlanıyor.',
      dogaDesc: 'Kuti’nin Hava Durumu — gökyüzüne uygun ikonu seç.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'kuti_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'kuti_uzgun.png' },
        { label: 'Kızgın', name: 'Kızgın', image: 'kuti_ofkeli.png' }
      ],
      scenario: 'Kuti dondurmasını yere düşürdü. Hangi duygu balonunu seçmeliyiz?',
      scenarioChoices: [
        { label: '😢 Üzgün Balonu', correct: true },
        { label: '😊 Mutlu Balonu', correct: false }
      ],
      weatherOptions: ['👕 T-shirt', '🧥 Yağmurluk']
    },
    '4-5': {
      badge: '4-5 Yaş (Meraklı Filizler)',
      duyguDesc: 'Kuti’nin Duygu Hikâyesi — hisset ve çözüm bul.',
      beceriDesc: 'Bahçeyi tamamla ve 4 parça yapbozu çöz.',
      ozbakimDesc: 'Kuti’nin Sabah Sırası ve hava durumuna göre giydirme.',
      dogaDesc: 'Kuti’nin Mevsimini Bul ve tohum yetiştir.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'kuti_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'kuti_uzgun.png' },
        { label: 'Öfkeli', name: 'Öfkeli', image: 'kuti_ofkeli.png' },
        { label: 'Meraklı', name: 'Meraklı', image: 'kuti_merakli.png' }
      ],
      scenario: 'Kuti oyuncağını bulamadı. Sence ne hissediyor?',
      scenarioChoices: [
        { label: '🔍 Üzgün, birlikte arayalım', correct: true },
        { label: '🛑 Bekleyelim', correct: false }
      ],
      weatherOptions: ['👕 T-shirt', '🧥 Yağmurluk', '🧥 Mont']
    },
    '6+': {
      badge: '6+ Yaş (Bilge Çiçekler)',
      duyguDesc: "Kuti’nin Duygu Hikâyesini Kur — hikâyeyi tamamla.",
      beceriDesc: "Örüntü bahçesi, 9 parça yapboz ve hafıza oyunu.",
      ozbakimDesc: 'Kuti’nin Bir Günü — sabahtan geceye rutin.',
      dogaDesc: 'Bahçesini Temizliyorum — doğal/çöp ayırt et.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'kuti_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'kuti_uzgun.png' },
        { label: 'Kızgın', name: 'Kızgın', image: 'kuti_ofkeli.png' },
        { label: 'Şaşırmış', name: 'Şaşırmış', image: 'kuti_sasirmis.png' }
      ],
      scenario: 'Kuti sahnede sözleri unuttu. Duygumuzu nasıl yönetebiliriz?',
      scenarioChoices: [
        { label: '❤️ Kendimizi sakinleştirip derin bir nefes alalım', correct: true },
        { label: '🎵 Hemen sahneden kaçalım', correct: false }
      ],
      weatherOptions: ['👕 T-shirt', '🧥 Yağmurluk', '🧥 Mont']
    }
  };

  // ===== OYUN SAYFALARI: köşedeki oyunlar alt alta değil, sırayla ayrı sayfalarda =====
  const PAGE_DEFS = {
    beceri:  (lvl) => lvl === '6+' ? [['#sirala-grid'], ['.puzzle-game-container'], ['#beceri-extra-wrapper']] : [['#sirala-grid'], ['.puzzle-game-container']],
    ozbakim: () => [['#ozbakim-oral-wrapper'], ['#ozbakim-dress-block']],
    doga:    (lvl) => lvl === '6+' ? [['#doga-mevsim-block'], ['#doga-garden-wrapper', '#doga-lifecycle-block'], ['#doga-garden-wrapper', '#doga-recycle-block']] : [['#doga-mevsim-block'], ['#doga-garden-wrapper']]
  };
  const gamePage = { beceri: 0, ozbakim: 0, doga: 0 };
  const gameAdvanceTimer = {};

  function renderGamePages(corner) {
    const stage = document.querySelector('#' + corner + '-game-stage > div');
    if (!stage || !PAGE_DEFS[corner]) return;
    const pages = PAGE_DEFS[corner](currentAgeLevel);
    const all = new Set();
    pages.forEach(p => p.forEach(s => all.add(s)));
    if (corner === 'beceri') all.add('#beceri-extra-wrapper');
    if (corner === 'doga') { all.add('#doga-lifecycle-block'); all.add('#doga-recycle-block'); }
    all.forEach(sel => { const el = stage.querySelector(sel); if (el) el.style.display = 'none'; });
    const cur = Math.min(gamePage[corner], pages.length - 1);
    pages[cur].forEach(sel => { const el = stage.querySelector(sel); if (el) el.style.display = ''; });

    let bar = stage.querySelector('.game-pager');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'game-pager';
      stage.insertBefore(bar, stage.firstChild);
      bar.addEventListener('click', (e) => {
        const d = e.target.closest('.game-pager-dot');
        if (d) { gamePage[corner] = parseInt(d.dataset.i, 10); renderGamePages(corner); }
      });
    }
    bar.innerHTML = `<span class="game-pager-label">Oyun ${cur + 1} / ${pages.length}</span>` +
      pages.map((_, i) => `<button type="button" class="game-pager-dot${i === cur ? ' active' : ''}" data-i="${i}" aria-label="Oyun ${i + 1}"></button>`).join('');
  }

  // Bir oyun bitince kısa bir süre sonra sıradaki oyunun sayfasına geçilir (son oyundan sonra başa döner)
  function gameDone(corner, delay) {
    if (!PAGE_DEFS[corner]) return;
    clearTimeout(gameAdvanceTimer[corner]);
    gameAdvanceTimer[corner] = setTimeout(() => {
      const n = PAGE_DEFS[corner](currentAgeLevel).length;
      gamePage[corner] = (gamePage[corner] + 1) % n;
      renderGamePages(corner);
    }, delay || 2200);
  }

  function resetGamePages() {
    Object.keys(PAGE_DEFS).forEach(k => { clearTimeout(gameAdvanceTimer[k]); gamePage[k] = 0; renderGamePages(k); });
  }

  function updateAgeSystem(level) {
    currentAgeLevel = level;
    const cfg = ageConfig[level];
    if (!cfg) return;

    const activeBadge = document.getElementById('active-age-badge');
    if (activeBadge) activeBadge.textContent = cfg.badge;

    document.getElementById('duygu-desc').textContent = cfg.duyguDesc;
    document.getElementById('beceri-desc').textContent = cfg.beceriDesc;
    document.getElementById('ozbakim-desc').textContent = cfg.ozbakimDesc;
    document.getElementById('doga-desc').textContent = cfg.dogaDesc;

    initDuyguGame(level);
    initBeceriGame(level);
    initRealImagePuzzle(level);
    initBeceriExtraGame(level);
    initOzbakimOralGame(level);
    initOzbakimDressGame(level, cfg);
    initDogaMevsimGame(level);
    initDogaGardenGame(level);
    resetGamePages();
  }

  document.querySelectorAll('input[name="age-group"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateAgeSystem(e.target.value);
      if (soundEnabled) AudioEngine.playSuccess();
    });
  });

  updateAgeSystem('4-5');

  // ===== KÖŞELER ARASI GEÇİŞ (Ana giriş kartları + modal içi yan menü ortak kullanır) =====
  const CORNERS = [
    { key: 'duygu',   modalId: 'modal-duygu-corner',   icon: '❤️', label: 'Duygu' },
    { key: 'doga',    modalId: 'modal-doga-corner',    icon: '🌿', label: 'Doğa' },
    { key: 'ozbakim', modalId: 'modal-ozbakim-corner', icon: '🪥', label: 'Öz Bakım' },
    { key: 'beceri',  modalId: 'modal-beceri-corner',  icon: '🧩', label: 'Beceri' },
  ];

  function switchCorner(targetKey) {
    const target = CORNERS.find(c => c.key === targetKey);
    if (!target) return;

    document.querySelectorAll('.kuti-modal.active').forEach(m => m.classList.remove('active'));

    updateAgeSystem(currentAgeLevel);

    document.getElementById(target.modalId)?.classList.add('active');
    if (soundEnabled) AudioEngine.playTone(600);
  }

  document.addEventListener('click', (e) => {
    const testCompleteBtn = e.target.closest('[data-test-complete-corner]');
    if (testCompleteBtn) completeCornerGame(testCompleteBtn.dataset.testCompleteCorner);
  });

  // ===== KUTİ REHBERLİK / KÖŞELER ARASI GEÇİŞ =====
  // Bir köşenin oyunu tamamlandığında bu fonksiyon çağrılır. Vygotsky'nin
  // "Daha Bilgili Öteki" (MKO) rolüne uygun olarak Kuti bir sonraki köşeyi
  // önerir, ama son adımı (Devam Et / Ana Sayfaya Dön) hep çocuk seçer.
  const transitionOverlay = document.getElementById('kuti-transition-overlay');
  const transitionTitle = document.getElementById('kuti-transition-title');
  const transitionMessage = document.getElementById('kuti-transition-message');
  const transitionNextBtn = document.getElementById('kuti-transition-next-btn');
  const transitionSkipBtn = document.getElementById('kuti-transition-skip-btn');

  const CORNER_TRANSITION_MESSAGES = {
    duygu:   'Şimdi birlikte doğayı keşfetmeye ne dersin? 🌿',
    doga:    'Şimdi ellerini biraz meşgul edelim mi? 🪥',
    ozbakim: 'Şimdi küçük bir bulmaca çözmeye ne dersin? 🧩',
    beceri:  'Şimdi duygularımızı biraz konuşalım mı? ❤️',
  };

  function completeCornerGame(finishedCornerKey) {
    const currentIndex = CORNERS.findIndex(c => c.key === finishedCornerKey);
    const nextCorner = CORNERS[(currentIndex + 1) % CORNERS.length];

    if (transitionMessage) {
      transitionMessage.textContent = CORNER_TRANSITION_MESSAGES[finishedCornerKey] || 'Şimdi başka bir köşeyi keşfetmeye ne dersin?';
    }
    if (transitionNextBtn) {
      transitionNextBtn.dataset.nextCorner = nextCorner.key;
    }

    document.querySelectorAll('.kuti-modal.active').forEach(m => m.classList.remove('active'));
    if (transitionOverlay) transitionOverlay.classList.add('active');
    if (soundEnabled) AudioEngine.playSuccess();
  }

  if (transitionNextBtn) {
    transitionNextBtn.addEventListener('click', () => {
      const nextKey = transitionNextBtn.dataset.nextCorner;
      if (transitionOverlay) transitionOverlay.classList.remove('active');
      if (nextKey) switchCorner(nextKey);
    });
  }

  if (transitionSkipBtn) {
    transitionSkipBtn.addEventListener('click', () => {
      if (transitionOverlay) transitionOverlay.classList.remove('active');
    });
  }

  document.getElementById('card-duygu')?.addEventListener('click', () => switchCorner('duygu'));
  document.getElementById('card-beceri')?.addEventListener('click', () => switchCorner('beceri'));
  document.getElementById('card-ozbakim')?.addEventListener('click', () => switchCorner('ozbakim'));
  document.getElementById('card-doga')?.addEventListener('click', () => switchCorner('doga'));

  const parentBtn = document.getElementById('parent-corner-btn');
  const parentModal = document.getElementById('modal-parent-corner');
  const pinView = document.getElementById('pin-view');
  const parentDashboardView = document.getElementById('parent-dashboard-view');
  const dynamicPinDisplay = document.getElementById('dynamic-pin-display');
  const pinErrorMsg = document.getElementById('pin-error-msg');
  const pinDots = [
    document.getElementById('p-dot-1'),
    document.getElementById('p-dot-2'),
    document.getElementById('p-dot-3'),
    document.getElementById('p-dot-4')
  ];

  let currentDynamicPin = '';
  let enteredPin = '';

  function updatePinDots() {
    pinDots.forEach((dot, idx) => {
      if (dot) dot.style.background = idx < enteredPin.length ? '#FF7043' : '#DDD';
    });
  }

  function generateNewPin() {
    const d1 = Math.floor(Math.random() * 9) + 1;
    const d2 = Math.floor(Math.random() * 9) + 1;
    const d3 = Math.floor(Math.random() * 9) + 1;
    const d4 = Math.floor(Math.random() * 9) + 1;
    currentDynamicPin = `${d1}${d2}${d3}${d4}`;
    if (dynamicPinDisplay) {
      dynamicPinDisplay.textContent = `Güvenlik Kodu: ${d1} - ${d2} - ${d3} - ${d4}`;
    }
  }

  // ===== EBEVEYN KÖŞESİ — PANEL GEÇİŞ MANTIĞI (Ana Panel <-> Süre/Yaş/Makaleler/Kitaplık) =====
  // Görseldeki akış: Panel-Main açılır -> menüye tıklanınca sadece o panel görünür -> Geri ile Panel-Main'e dönülür.
  const parentPanelMain = document.getElementById('parent-panel-main');
  const parentPanelDetails = document.querySelectorAll('.parent-panel-detail');
  const parentPanelTitleEl = document.getElementById('parent-panel-title');
  const parentBackBtn = document.getElementById('parent-back-btn');
  const parentModalBox = document.querySelector('#modal-parent-corner .parent-modal-box');

  // Menüye tıklanınca üst başlıkta görünecek isim burada, tek yerde toplu duruyor
  const PARENT_PANEL_TITLES = {
    main: 'Ebeveyn Köşesi',
    sure: 'Süre',
    yas: 'Yaş',
    makaleler: 'Makaleler',
    kitaplik: 'Kitaplık',
    nasil: 'Nasıl Birlikte Oynanır?'
  };

  function showParentPanel(panelKey) {
    if (parentPanelTitleEl) {
      parentPanelTitleEl.textContent = PARENT_PANEL_TITLES[panelKey] || PARENT_PANEL_TITLES.main;
    }
    if (parentBackBtn) {
      parentBackBtn.style.display = panelKey === 'main' ? 'none' : 'inline-flex';
    }
    if (parentModalBox) {
      parentModalBox.setAttribute('data-active-panel', panelKey || 'main');
    }

    if (panelKey === 'main') {
      if (parentPanelMain) parentPanelMain.classList.remove('parent-panel-hidden');
      parentPanelDetails.forEach(panel => panel.classList.remove('parent-panel-active'));
      return;
    }

    if (parentPanelMain) parentPanelMain.classList.add('parent-panel-hidden');
    parentPanelDetails.forEach(panel => {
      if (panel.dataset.parentPanelDetail === panelKey) {
        panel.classList.add('parent-panel-active');
      } else {
        panel.classList.remove('parent-panel-active');
      }
    });

    if (panelKey === 'kitaplik') renderKutiLibrary();
    if (panelKey === 'nasil') howGoTo(0);
  }

  document.querySelectorAll('.parent-menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
      showParentPanel(btn.dataset.parentPanel);
      if (soundEnabled) AudioEngine.playTone(600, 0.12);
    });
  });

  document.querySelectorAll('[data-parent-back]').forEach(btn => {
    btn.addEventListener('click', () => {
      showParentPanel('main');
      if (soundEnabled) AudioEngine.playTone(500, 0.12);
    });
  });

  if (parentBtn && parentModal) {
    parentBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generateNewPin();
      enteredPin = '';
      updatePinDots();
      if (pinErrorMsg) pinErrorMsg.textContent = '';
      if (pinView) {
        pinView.style.display = 'flex';
        pinView.style.flexDirection = 'column';
      }
      if (parentDashboardView) parentDashboardView.style.display = 'none';
      if (parentModalBox) parentModalBox.classList.remove('parent-dashboard-active'); // PIN ekranı kompakt kalsın
      showParentPanel('main'); // Ebeveyn köşesi her açıldığında ana panelden başla
      parentModal.classList.add('active');
      if (soundEnabled) AudioEngine.playTone(500);
      if (parentPinInput) { parentPinInput.value = ''; setTimeout(() => parentPinInput.focus(), 80); }
    });
  }

  // Ebeveyn güvenlik kodu: rakamlar klavyeden yazılır
  const parentPinInput = document.getElementById('parent-pin-input');
  if (parentPinInput) {
    parentPinInput.addEventListener('input', () => {
      parentPinInput.value = parentPinInput.value.replace(/\D/g, '').slice(0, 4);
      enteredPin = parentPinInput.value;
      updatePinDots();
      if (soundEnabled && enteredPin.length) AudioEngine.playTone(600, 0.1);

      if (enteredPin.length === 4) {
        if (enteredPin === currentDynamicPin) {
          if (soundEnabled) AudioEngine.playSuccess();
          parentPinInput.blur();
          if (pinView) pinView.style.display = 'none';
          if (parentDashboardView) {
            parentDashboardView.style.display = 'flex';
            parentDashboardView.style.flexDirection = 'column';
          }
          if (parentModalBox) parentModalBox.classList.add('parent-dashboard-active'); // tam yükseklik, boşluksuz görünüm
          showParentPanel('main');
          renderKutiLibrary();
        } else {
          if (pinErrorMsg) pinErrorMsg.textContent = 'Hatalı Kod! Lütfen gösterilen 4 rakamı girin.';
          parentPinInput.classList.add('pin-error-shake');
          setTimeout(() => {
            enteredPin = '';
            parentPinInput.value = '';
            parentPinInput.classList.remove('pin-error-shake');
            updatePinDots();
            parentPinInput.focus();
          }, 800);
        }
      }
    });
  }

  // Genel Modal Kapatma Dinamik Dinleyicisi
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-close-modal]') || e.target.closest('[data-close-modal]')) {
      const modal = e.target.closest('.kuti-modal');
      if (modal) modal.classList.remove('active');
    }
  });

  const btnForceSleep = document.getElementById('btn-force-sleep');
  if (btnForceSleep) {
    btnForceSleep.addEventListener('click', () => {
      if (parentModal) parentModal.classList.remove('active');
      sunProgress = 100;
      updateSunPosition();
    });
  }

  document.querySelectorAll('.time-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mins = parseInt(btn.dataset.time, 10);
      sunTimerDuration = mins * 60;
      sunProgress = 10;
      updateSunPosition();
      startSunJourney();
      showVisualFeedback(`Ekran süresi ${mins} dakika ayarlandı.`, "success");
    });
  });

});