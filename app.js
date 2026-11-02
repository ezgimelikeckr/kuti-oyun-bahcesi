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
      title: "💭 Kuti Ne Hissediyor?",
      scenes: [
        { img: G('kuti_oyuncagini_kaybediyor.jpg'), answer: 'Üzgün',  others: ['Mutlu', 'Kızgın'] },
        { img: G('kuti_kule_dusuyor.jpg'),          answer: 'Şaşırmış', others: ['Mutlu', 'Kızgın'] }
      ]
    },
    '6+': {
      title: "💭 Kuti'nin Duygu Hikâyesi",
      feelScenes: [
        { img: G('kuti_yagmur.jpg'),    answer: 'Üzgün', others: ['Mutlu', 'Şaşırmış'] },
        { img: G('kuti_unutuyor.jpg'),  answer: 'Üzgün', others: ['Mutlu', 'Kızgın'] }
      ],
      // Hikâye sıralama: resimler doğru sıraya dizilir (başlangıç → sorun → fikir → son)
      story: [
        { img: G('kuti_dondurma_aliyor.jpg'),  label: 'Başlangıç' },
        { img: G('kuti_dondurma_dusuyor.jpg'), label: 'Sorun' },
        { img: G('kuti_fikir_geliyor.jpg'),    label: 'Fikir' },
        { img: G('kuti_dondurma_yiyor.jpg'),   label: 'Son' }
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
  let lastDuygu6Type = 'feel';
  function pickScene(level, scenes) {
    let i = Math.floor(Math.random() * scenes.length);
    if (scenes.length > 1 && i === lastDuyguScene[level]) i = (i + 1) % scenes.length;
    lastDuyguScene[level] = i;
    return scenes[i];
  }

  // Resimdeki Kuti ne hissediyor? Seçenekler Kuti'nin duygu yüzleri (yazı/emoji yok)
  function renderFeelRound(wrapper, title, scene, level) {
    wrapper.innerHTML = `
      <div style="text-align:center;">
        <p style="font-size:0.85rem; font-weight:700; color:var(--corner-color); margin-bottom:0.5rem;">${title}</p>
        <div id="duygu-pic" class="story-pic"></div>
        <p style="font-size:0.8rem; font-weight:700; color:#B71C1C; margin-bottom:0.5rem;">Kuti ne hissediyor?</p>
        <div id="duygu-feel-options" style="display:flex; flex-wrap:wrap; gap:0.6rem; justify-content:center;"></div>
      </div>`;
    document.getElementById('duygu-pic').appendChild(makeImg(scene.img, 'Kuti', '🦊', 'story-pic-img'));
    const options = [{ face: scene.answer, correct: true }].concat(scene.others.map(f => ({ face: f, correct: false })));
    renderDuyguChoiceRow(document.getElementById('duygu-feel-options'), options, () => {
      showVisualFeedback('Evet, Kuti ' + scene.answer.toLowerCase() + '! 🎉', 'success');
      setTimeout(() => { if (currentAgeLevel === level) initDuyguGame(level); }, 2000);
    });
  }

  // Hikâye sıralama: karışık resimler doğru sıraya dokunularak dizilir
  function renderStoryOrderRound(wrapper, title, story) {
    wrapper.innerHTML = `
      <div style="text-align:center;">
        <p style="font-size:0.85rem; font-weight:700; color:var(--corner-color); margin-bottom:0.3rem;">${title}</p>
        <p style="font-size:0.78rem; font-weight:700; color:#B71C1C; margin-bottom:0.5rem;">Hikâyeyi doğru sıraya diz!</p>
        <div id="story-order-slots" class="story-order-slots"></div>
        <div id="story-order-cards" class="story-order-cards"></div>
      </div>`;
    const slotsEl = document.getElementById('story-order-slots');
    const cardsEl = document.getElementById('story-order-cards');
    story.forEach((s, i) => {
      const slot = document.createElement('div');
      slot.className = 'story-order-slot';
      slot.dataset.i = i;
      slot.innerHTML = `<span class="story-order-num">${i + 1}</span>`;
      slotsEl.appendChild(slot);
    });
    let next = 0;
    story.slice().sort(() => Math.random() - 0.5).forEach(s => {
      const idx = story.indexOf(s);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'story-order-card';
      btn.setAttribute('aria-label', 'Hikâye resmi');
      btn.appendChild(makeImg(s.img, 'Hikâye', '🖼️', 'story-order-img'));
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        if (idx === next) {
          btn.disabled = true;
          btn.classList.add('used');
          if (soundEnabled) AudioEngine.playSuccess();
          const slot = slotsEl.querySelector(`[data-i="${idx}"]`);
          slot.innerHTML = '';
          slot.classList.add('filled');
          slot.appendChild(makeImg(s.img, s.label, '🖼️', 'story-order-img'));
          next++;
          if (next === story.length) {
            showVisualFeedback('🎉 Hikâyeyi doğru sıraya dizdin!', 'success');
            setTimeout(() => { if (currentAgeLevel === '6+') initDuyguGame('6+'); }, 2600);
          } else {
            showVisualFeedback('Harika, sıradaki hangisi?', 'info');
          }
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          btn.classList.add('dnd-shake');
          setTimeout(() => btn.classList.remove('dnd-shake'), 400);
          showVisualFeedback('Hikâyede önce ne oldu? Tekrar düşün.', 'error');
        }
      });
      cardsEl.appendChild(btn);
    });
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
          <div class="duygu3-face-frame" id="duygu3-face-frame"></div>
          <p style="font-size:0.8rem; font-weight:700; color:#B71C1C; margin:0.5rem 0;">${data.instruction}</p>
          <div id="duygu3-options" class="emo-emoji-row"></div>
        </div>`;
      document.getElementById('duygu3-face-frame').appendChild(makeImg(target.image, 'Kuti', (EMO_FACES[target.name] || {}).emoji, 'duygu3-face-img'));
      const optBox = document.getElementById('duygu3-options');
      data.pool.slice().sort(() => Math.random() - 0.5).forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'emo-emoji-btn';
        btn.setAttribute('aria-label', opt.name);
        btn.textContent = (EMO_FACES[opt.name] || {}).emoji || opt.label;
        btn.addEventListener('click', () => {
          if (opt.name === target.name) {
            if (soundEnabled) AudioEngine.playSuccess();
            showVisualFeedback(`Evet, Kuti ${opt.name.toLowerCase()}! 🎉`, 'success');
            setTimeout(() => { if (currentAgeLevel === '3') initDuyguGame('3'); }, 900);
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            btn.classList.add('dnd-shake');
            setTimeout(() => btn.classList.remove('dnd-shake'), 400);
            showVisualFeedback('Tekrar deneyelim.', 'error');
          }
        });
        optBox.appendChild(btn);
      });
    } else if (level === '4-5') {
      renderFeelRound(wrapper, data.title, pickScene('4-5', data.scenes), '4-5');
    } else {
      // 6+: bir tur "Kuti ne hissediyor?", bir tur "hikâyeyi sırala"
      lastDuygu6Type = lastDuygu6Type === 'feel' ? 'order' : 'feel';
      if (lastDuygu6Type === 'order') renderStoryOrderRound(wrapper, data.title, data.story);
      else renderFeelRound(wrapper, data.title, pickScene('6+', data.feelScenes), '6+');
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
    { id: 'sun',    icon: '☀️', name: 'Güneş', scene: 'gunesli_bahce', img: G('kuti_sevimli_gunes.png') },
    { id: 'tree',   icon: '🌳', name: 'Ağaç',  scene: 'agacli_bahce',  img: G('kuti_agac.png') },
    { id: 'bench',  icon: '🪑', name: 'Bank',  scene: 'bankli_bahce',  img: G('kuti_bank.png') },
    { id: 'grass',  icon: '🌱', name: 'Çimen', scene: 'cimenli_bahce', img: G('kuti_cimen.png') },
    { id: 'flower', icon: '🌸', name: 'Çiçek', scene: 'cicekli_bahce', img: G('kuti_cicek.jpg') }
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
    const progress = document.createElement('div');
    progress.className = 'garden-progress';
    const hint = document.createElement('p');
    hint.className = 'garden-hint';
    const bank = document.createElement('div');
    bank.className = 'garden-bank';
    container.appendChild(title);
    container.appendChild(stage);
    container.appendChild(progress);
    container.appendChild(hint);
    container.appendChild(bank);

    const sceneImg = (file) => makeImg(G(file + '.jpg'), 'Kuti\'nin bahçesi', '🏡', 'garden-img');
    stage.appendChild(sceneImg('bulutlu_bahce'));
    let step = 0;
    const refresh = () => {
      progress.innerHTML = GARDEN_STEPS.map((s, i) => `<span class="garden-dot${i < step ? ' done' : (i === step ? ' next' : '')}">${s.icon}</span>`).join('');
      hint.textContent = step < GARDEN_STEPS.length ? `Sıradaki: ${GARDEN_STEPS[step].name} — bahçeye sürükle!` : '';
    };
    refresh();

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
          refresh();
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
          showVisualFeedback(`Önce ${GARDEN_STEPS[step].name} lazım, onu dene.`, 'error');
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
        { id: 'red', name: 'Kırmızı', hex: '#E53935', swatch: '🔴', img: G('kuti_kirmizi_alan.jpg') },
        { id: 'yellow', name: 'Sarı', hex: '#FDD835', swatch: '🟡', img: G('kuti_sari_alan.jpg') },
        { id: 'blue', name: 'Mavi', hex: '#1E88E5', swatch: '🔵', img: G('kuti_mavi_alan.jpg') }
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
        btn.style.background = c.hex;
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
      initSizeSortGame(beceriContainer);
    }
  }

  // 6 yaş: fillerini küçükten büyüğe ya da büyükten küçüğe sırala
  const FIL_ORDER = ['en_kucuk_fil', 'kucuk_fil', 'ortanca_fil', 'buyuk_fil', 'en_buyuk_fil'];
  function initSizeSortGame(container) {
    const asc = Math.random() < 0.5;
    const target = asc ? FIL_ORDER.slice() : FIL_ORDER.slice().reverse();
    container.innerHTML = `
      <div style="text-align:center;">
        <p style="font-size:0.85rem; font-weight:700; color:#2E7D32; margin-bottom:0.3rem;">🐘 Kuti'nin Filleri</p>
        <p style="font-size:0.8rem; font-weight:700; color:#1B5E20; margin-bottom:0.5rem;">${asc ? 'Küçükten büyüğe doğru sırala!' : 'Büyükten küçüğe doğru sırala!'}</p>
        <div id="size-slots" class="size-slots"></div>
        <div id="size-cards" class="size-cards"></div>
      </div>`;
    const slotsEl = document.getElementById('size-slots');
    const cardsEl = document.getElementById('size-cards');
    target.forEach((f, i) => {
      const slot = document.createElement('div');
      slot.className = 'size-slot';
      slot.dataset.i = i;
      slot.innerHTML = `<span class="size-slot-num">${i + 1}</span>`;
      slotsEl.appendChild(slot);
    });
    let next = 0;
    const sized = (f, scale) => { const im = makeImg(G(f + '.jpg'), 'Fil', '🐘', 'size-img'); im.style.height = Math.round(FIL_HEIGHT[f] * scale) + 'px'; return im; };
    FIL_ORDER.slice().sort(() => Math.random() - 0.5).forEach(f => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'size-card';
      btn.setAttribute('aria-label', 'Fil');
      btn.appendChild(sized(f, 0.8));
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        if (f === target[next]) {
          btn.disabled = true;
          btn.classList.add('used');
          if (soundEnabled) AudioEngine.playSuccess();
          const slot = slotsEl.querySelector(`[data-i="${next}"]`);
          slot.innerHTML = '';
          slot.classList.add('filled');
          slot.appendChild(sized(f, 0.8));
          next++;
          if (next === target.length) {
            showVisualFeedback('🎉 Filleri doğru sıraya dizdin!', 'success');
            gameDone('beceri', 2200);
            setTimeout(() => { if (currentAgeLevel === '6+') initBeceriGame('6+'); }, 3200);
          } else {
            showVisualFeedback('Harika, sıradaki hangisi?', 'info');
          }
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          btn.classList.add('dnd-shake');
          setTimeout(() => btn.classList.remove('dnd-shake'), 400);
          showVisualFeedback(asc ? 'Önce en küçük olanı bul.' : 'Önce en büyük olanı bul.', 'error');
        }
      });
      cardsEl.appendChild(btn);
    });
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
      { id: 'moon',   icon: '🌙', img: G('ay_oruntu.jpg') },
      { id: 'star',   icon: '⭐', img: G('yildiz_oruntu.jpg') },
      { id: 'cloud',  icon: '☁️', img: G('bulut_oruntu.jpg') },
      { id: 'flower', icon: '🌸', img: G('cicek_oruntu.jpg') },
      { id: 'tulip',  icon: '🌷', img: G('lale_oruntu.jpg') },
      { id: 'sunfl',  icon: '🌻', img: G('aycicegi_oruntu.jpg') }
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
  const IMG_EXTRA_DIRS = ['gorseller/', '', 'images/', 'img/'];
  ['3_yas', '4_5_yas', '6_yas'].forEach(a => ['beceri', 'doga', 'duygu', 'oz_bakim'].forEach(c => IMG_EXTRA_DIRS.push('gorseller/' + a + '/' + c + '/')));
  // zip'ten çıkan ham klasör adları (kuti_oyun/3 yas_grubu/beceri_kosesi/ ...)
  ['3 yas_grubu', '4_5_yas_grubu', '6_yas_grubu'].forEach(a => ['beceri_kosesi', 'doga_kosesi', 'duygu_kosesi', 'oz_bakim_kosesi'].forEach(c => { IMG_EXTRA_DIRS.push(a + '/' + c + '/'); IMG_EXTRA_DIRS.push('kuti_oyun/' + a + '/' + c + '/'); }));

  // Dosya adı anahtarı: küçük harf, Türkçe karakter ve uzantı yok (gorsel_tara.py ile aynı kural)
  function imgKey(name) {
    return name.replace(/\.[a-zA-Z0-9]+$/, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i').replace(/İ/g, 'i').toLowerCase().replace(/\s+/g, '_');
  }

  function imgCandidates(src) {
    if (IMG_OK[src]) return [IMG_OK[src]];
    const m = src.match(/^(.*\/)?([^\/]+?)(\.[a-zA-Z0-9]+)?$/);
    const dir = m[1] || '', name = m[2], ext = (m[3] || '').toLowerCase();
    // gorsel_listesi.js varsa (python gorsel_tara.py), dosyanın projedeki gerçek yeri önce oradan denenir
    const list = (typeof window !== 'undefined' && window.GORSEL_LISTESI) || null;
    const listed = list ? (list[imgKey(name)] || (IMG_ALIAS[name] || []).map(a => list[imgKey(a)]).filter(Boolean)[0] || []) : [];
    const names = [name].concat(IMG_ALIAS[name] || []);
    const dirs = [dir].concat(IMG_EXTRA_DIRS).filter((d, i, arr) => arr.indexOf(d) === i);
    const exts = [ext, '.jpg', '.png', '.jpeg', '.webp'].filter((e, i, arr) => e && arr.indexOf(e) === i);
    const out = [];
    exts.forEach(e => dirs.forEach(d => names.forEach(n => out.push(d + n + e))));
    return listed.concat(out.filter(p => !listed.includes(p)));
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
        { id: 'wake',   label: 'Uyanma',            emoji: '🌅', img: G('kuti_uyaniyor.jpg') },
        { id: 'wash',   label: 'Yüz Yıkama',        emoji: '🚿', img: G('kuti_yuz_yikama.jpg') },
        { id: 'brush',  label: 'Diş Fırçalama',     emoji: '🪥', img: G('kuti_dis_fircalama.jpg') },
        { id: 'dress',  label: 'Kıyafet Değiştirme', emoji: '👕', img: G('kuti_kiyafet_degistirme.jpg') },
        { id: 'go',     label: 'Dışarı Hazırlanma', emoji: '🎒', img: G('kuti_disari_cikma.jpg') },
        { id: 'pajama', label: 'Pijama',            emoji: '🩳', img: G('kuti_pijama.jpg') },
        { id: 'sleep',  label: 'Uyuma',             emoji: '🌙', img: G('kuti_uyuma.jpg') }
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
        { id: 'wake',  label: 'Uyanma',        emoji: '🌅', img: G('kuti_uyaniyor.jpg') },
        { id: 'wash',  label: 'Yüz Yıkama',    emoji: '🚿', img: G('kuti_yuz_yikama.jpg') },
        { id: 'brush', label: 'Diş Fırçalama', emoji: '🪥', img: G('kuti_dis_fircalama.jpg') },
        { id: 'dress', label: 'Giyinme',       emoji: '👕', img: G('kuti_giyinme.jpg') }
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
    '4-5': { 'T-shirt': G('kuti_tisortlu.jpg'), 'Yağmurluk': G('kuti_yagmurluklu.jpg'), 'Mont': G('kuti_montlu.jpg') },
    '6+':  { 'T-shirt': G('kuti_tisortlu.jpg'), 'Yağmurluk': G('kuti_yagmurluklu.jpg'), 'Mont': G('kuti_mont.jpg') }
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
    { id: 'sunny',  label: 'Güneşli',  emoji: '☀️', icon: G('kuti_gunesli.png'),  scene: [G('kuti_gunesli_hava.jpg'),  G('kuti_gunesli.png')] },
    { id: 'cloudy', label: 'Bulutlu',  emoji: '☁️', icon: G('kuti_bulutlu.png'),  scene: [G('kuti_bulutlu_hava.jpg'),  G('kuti_bulutlu.png')] },
    { id: 'rainy',  label: 'Yağmurlu', emoji: '🌧️', icon: G('kuti_yagmurlu.png'), scene: [G('kuti_yagmurlu_hava.jpg'), G('kuti_yagmurlu.png')] }
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
      btn.appendChild(makeImg(G(s.file), s.label, s.emoji, 'season-card-img'));
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

  // 6+ Doğa: bahçede duran çöpler çöp kutusuna sürüklenir
  const LITTER_ITEMS = [
    { id: 'paper',  name: 'Kâğıt',      icon: '📄', img: 'cop_kagit.png',      left: 14, top: 58 },
    { id: 'juice',  name: 'Meyve suyu', icon: '🧃', img: 'cop_meyve_suyu.png', left: 42, top: 38 },
    { id: 'bottle', name: 'Şişe',       icon: '🍾', img: 'cop_sise.png',       left: 68, top: 60 }
  ];
  function initLitterGame(container) {
    if (!container) return;
    container.innerHTML = '';
    const stage = document.createElement('div');
    stage.className = 'litter-stage';
    stage.appendChild(makeImg(G('bos_bahce.jpg'), 'Kuti\'nin bahçesi', '🌳', 'litter-bg'));
    const bin = document.createElement('div');
    bin.className = 'litter-bin';
    bin.dataset.drop = 'bin';
    bin.tabIndex = 0;
    bin.setAttribute('aria-label', 'Çöp kutusu');
    bin.appendChild(makeImg(G('cop_kutusu.png'), 'Çöp kutusu', '🗑️', 'litter-bin-img'));
    const bl = document.createElement('span');
    bl.className = 'litter-bin-label';
    bl.textContent = 'Çöp Kutusu';
    bin.appendChild(bl);
    container.appendChild(stage);
    container.appendChild(bin);

    const dnd = createDnD(container);
    let remaining = LITTER_ITEMS.length;
    LITTER_ITEMS.forEach(it => {
      const tile = document.createElement('div');
      tile.className = 'litter-item';
      tile.style.left = it.left + '%';
      tile.style.top = it.top + '%';
      tile.setAttribute('role', 'button');
      tile.setAttribute('aria-label', it.name);
      tile.appendChild(makeImg(G(it.img), it.name, it.icon, 'litter-item-img'));
      dnd.attach(tile, (t) => {
        if (soundEnabled) AudioEngine.playSuccess();
        t.classList.add('placed');
        t.style.display = 'none';
        remaining--;
        bin.classList.add('litter-bin-pop');
        setTimeout(() => bin.classList.remove('litter-bin-pop'), 300);
        if (remaining === 0) {
          setTimeout(() => showVisualFeedback('🎉 Bahçe tertemiz oldu, doğa korundu!', 'success'), 250);
          gameDone('doga', 2800);
          setTimeout(() => { if (currentAgeLevel === '6+') initLitterGame(container); }, 3500);
        } else {
          showVisualFeedback('Aferin, çöp kutusuna attın!', 'success');
        }
      });
      stage.appendChild(tile);
    });
  }

  // Bitki büyütme: 3 yaşta 1 su + 1 güneş, 4-5 yaşta tohum + 2 su + 2 güneş (aynı oyun, farklı sayılar)
  const PLANT_ITEMS = {
    seed:  { name: 'Tohum', emoji: '🌰', img: G('kuti_tohum.jpg') },
    water: { name: 'Su',    emoji: '💧', img: G('kuti_su_damlasi.jpg') },
    sun:   { name: 'Güneş', emoji: '☀️', img: G('kuti_sevimli_gunes.png') }
  };
  const PLANT_CFG = {
    '3':   { title: '🌱 Suyu ve Güneşi Saksıya Sürükle', sequence: ['water', 'sun'],
             stages: ['kuti_saksi.jpg', 'kuti_filiz.jpg', 'kuti_cicek.jpg'],
             done: '🎉 Tebrikler! Bitkini besleyerek koca bir çiçek yaptın!' },
    '4-5': { title: '🌱 Kuti Tohum Yetiştiriyor', sequence: ['seed', 'water', 'sun', 'water', 'sun'],
             stages: ['kuti_saksi.jpg', 'kuti_saksi.jpg', 'kuti_saksi.jpg', 'kuti_filiz.jpg', 'kuti_filiz.jpg', 'kuti_cicek.jpg'],
             done: '🎉 Kuti tohumunu harika bir şekilde yetiştirdi!' }
  };

  function initPlantGrowGame(wrapper, cfg, level) {
    wrapper.innerHTML = '';
    const title = document.createElement('p');
    title.style.cssText = 'text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.5rem;';
    title.textContent = cfg.title;
    const stage = document.createElement('div');
    stage.className = 'plant-stage';
    stage.dataset.drop = 'pot';
    const progress = document.createElement('div');
    progress.className = 'plant-progress';
    const hint = document.createElement('p');
    hint.className = 'garden-hint';
    const bank = document.createElement('div');
    bank.className = 'garden-bank';
    [title, stage, progress, hint, bank].forEach(el => wrapper.appendChild(el));

    const seq = cfg.sequence;
    let step = 0;
    const setStage = () => { stage.innerHTML = ''; stage.appendChild(makeImg(G(cfg.stages[step]), 'Kuti\'nin bitkisi', '🌱', 'plant-img')); };
    const refresh = () => {
      setStage();
      progress.innerHTML = '';
      seq.forEach((id, i) => {
        const dot = document.createElement('span');
        dot.className = 'plant-dot' + (i < step ? ' done' : (i === step ? ' next' : ''));
        dot.appendChild(makeImg(PLANT_ITEMS[id].img, PLANT_ITEMS[id].name, PLANT_ITEMS[id].emoji, 'plant-dot-img'));
        progress.appendChild(dot);
      });
      hint.textContent = step < seq.length ? `Sıradaki: ${PLANT_ITEMS[seq[step]].name} — saksıya sürükle! (${step + 1}/${seq.length})` : '';
    };
    refresh();

    const dnd = createDnD(wrapper);
    seq.map((id, i) => ({ id, i })).sort(() => Math.random() - 0.5).forEach(({ id }) => {
      const it = PLANT_ITEMS[id];
      const tile = document.createElement('div');
      tile.className = 'plant-tile';
      tile.dataset.item = id;
      tile.setAttribute('role', 'button');
      tile.setAttribute('aria-label', it.name);
      tile.appendChild(makeImg(it.img, it.name, it.emoji, 'plant-tile-img'));
      dnd.attach(tile, (t) => {
        if (id === seq[step]) {
          if (soundEnabled) AudioEngine.playSuccess();
          t.classList.add('placed');
          t.style.display = 'none';
          step++;
          refresh();
          if (step === seq.length) {
            setTimeout(() => showVisualFeedback(cfg.done, 'success'), 400);
            gameDone('doga', 3200);
            setTimeout(() => { if (currentAgeLevel === level) initDogaGardenGame(level); }, 5000);
          } else {
            showVisualFeedback('Harika, devam edelim!', 'info');
          }
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          t.classList.add('dnd-shake');
          setTimeout(() => t.classList.remove('dnd-shake'), 400);
          showVisualFeedback(`Şimdi ${PLANT_ITEMS[seq[step]].name} zamanı!`, 'error');
        }
      });
      bank.appendChild(tile);
    });
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
          <p style="text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.4rem;">🧹 Bahçedeki Çöpleri Çöp Kutusuna At</p>
          <div id="doga-litter-area"></div>
        </div>`;

      initTapOrderGame(document.getElementById('doga-lifecycle-row'), [
        { id: 'seed',    label: 'Tohum', emoji: '🌰', img: G('kuti_tohum.jpg') },
        { id: 'sprout',  label: 'Filiz', emoji: '🌱', img: G('kuti_filiz.jpg') },
        { id: 'sapling', label: 'Fidan', emoji: '🌿', img: G('kuti_fidan.jpg') },
        { id: 'tree',    label: 'Ağaç',  emoji: '🌳', img: G('kuti_agac.jpg') }
      ], "🎉 Bitkinin büyüme sırası doğru kuruldu!", () => gameDone('doga', 2800));

      initLitterGame(document.getElementById('doga-litter-area'));
    } else if (level === '4-5') {
      initPlantGrowGame(wrapper, PLANT_CFG['4-5'], '4-5');
    } else {
      initPlantGrowGame(wrapper, PLANT_CFG['3'], '3');
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