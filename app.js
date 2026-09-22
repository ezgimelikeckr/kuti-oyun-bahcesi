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

  function loadDailyChildrenBooks() {
    const duyguBooks = [
      "Unutulan Araba / Duygularımı Fark Ediyorum 3 (Tuğba Akbey İnan)",
      "Öykülerle Duygusal Zeka Eğitimi: Tali Kendine Güveniyor (Berrin Göncü Işıkoğlu)",
      "Eyvah Kalbim Kırıldı (Elif Yemenici)"
    ];
    const beceriBooks = [
      "Nokta (Peter H. Reynolds)",
      "Bob ve Mavi Sanatı (Marion Deuchars)",
      "Sol Sağ Kitabım (Şiirsel Taş)"
    ];
    const ozbakimBooks = [
      "Öykülerle Davranış Eğitimi Seti: Tali Ellerini Yıkıyor (Berrin Göncü Işıkoğlu)",
      "Diş Hekiminde (Anne Civardi)"
    ];
    const dogaBooks = [
      "Minik Tohum (Eric Carle)",
      "Haydi Sayalım Elmalar (Joan Holub)"
    ];

    const today = new Date();
    const daySeed = today.getDate();

    const container = document.getElementById('daily-kids-books-container');
    if (container) {
      container.innerHTML = `
        <div><b>❤️ Duygu Adası Önerisi:</b> <i>${duyguBooks[daySeed % duyguBooks.length]}</i></div>
        <div><b>🧩 Beceri Adası Önerisi:</b> <i>${beceriBooks[daySeed % beceriBooks.length]}</i></div>
        <div><b>🪥 Öz Bakım Adası Önerisi:</b> <i>${ozbakimBooks[daySeed % ozbakimBooks.length]}</i></div>
        <div><b>🦋 Doğa Adası Önerisi:</b> <i>${dogaBooks[daySeed % dogaBooks.length]}</i></div>
      `;
    }
  }

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
          emotionOptions: [
            { label: '😨 Endişeli', correct: true },
            { label: '😴 Uykulu', correct: false },
            { label: '😊 Mutlu', correct: false }
          ],
          solutionOptions: [
            { label: '❤️ Sakinleşip derin bir nefes alalım', correct: true },
            { label: '🏃 Sahneden kaçalım', correct: false }
          ]
        }
      ]
    }
  };

  function renderDuyguChoiceRow(container, options, onPick) {
    container.innerHTML = '';
    options.slice().sort(() => Math.random() - 0.5).forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'btn-icon-pill scenario-opt-btn';
      btn.style.cssText = 'justify-content:flex-start; text-align:left; padding:0.45rem 0.8rem;';
      btn.textContent = opt.label;
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
        btn.className = 'btn-icon-pill emo-opt-btn';
        btn.textContent = opt.label;
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
      const scene = data.scenes[Math.floor(Math.random() * data.scenes.length)];
      wrapper.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.85rem; font-weight:700; color:var(--corner-color); margin-bottom:0.5rem;">${data.title}</p>
          <p style="font-size:0.82rem; font-weight:700; color:#B71C1C; margin-bottom:0.55rem;">${scene.text}</p>
          <p style="font-size:0.72rem; color:var(--text-muted); margin-bottom:0.3rem;">1️⃣ Kuti ne hissediyor?</p>
          <div id="duygu45-step1" style="display:flex; flex-direction:column; gap:0.4rem; align-items:center; margin-bottom:0.6rem;"></div>
          <div id="duygu45-step2" style="display:flex; flex-direction:column; gap:0.4rem; align-items:center;"></div>
        </div>`;
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
          setTimeout(() => initDuyguGame('4-5'), 900);
        });
      });
    } else {
      const scene = data.scenes[Math.floor(Math.random() * data.scenes.length)];
      wrapper.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.85rem; font-weight:700; color:var(--corner-color); margin-bottom:0.5rem;">${data.title}</p>
          <div style="display:flex; gap:0.5rem; justify-content:center; margin-bottom:0.7rem;">
            <div class="story-slot" id="story-slot-1" data-label="Başlangıç">🎬</div>
            <div class="story-slot" id="story-slot-2" data-label="Orta">❓</div>
            <div class="story-slot" id="story-slot-3" data-label="Son">❓</div>
          </div>
          <p style="font-size:0.72rem; color:var(--text-muted); margin-bottom:0.3rem;">1️⃣ Kuti bunu hissediyor olabilir mi?</p>
          <div id="duygu6-step1" style="display:flex; flex-direction:column; gap:0.4rem; align-items:center; margin-bottom:0.6rem;"></div>
          <div id="duygu6-step2" style="display:flex; flex-direction:column; gap:0.4rem; align-items:center;"></div>
        </div>`;
      document.getElementById('story-slot-1').textContent = scene.eventLabel.split(' ')[0];
      const step1 = document.getElementById('duygu6-step1');
      const step2 = document.getElementById('duygu6-step2');
      const p0 = document.createElement('p');
      p0.style.cssText = 'font-size:0.8rem; font-weight:700; color:#B71C1C; margin-bottom:0.4rem;';
      p0.textContent = scene.eventLabel;
      step1.parentElement.insertBefore(p0, step1);
      renderDuyguChoiceRow(step1, scene.emotionOptions, (picked) => {
        document.getElementById('story-slot-2').textContent = picked.label.split(' ')[0];
        const p = document.createElement('p');
        p.style.cssText = 'font-size:0.72rem; color:var(--text-muted); margin:0.3rem 0;';
        p.textContent = '2️⃣ Hikâyeyi nasıl bitirelim?';
        step2.appendChild(p);
        const choiceRow = document.createElement('div');
        choiceRow.style.cssText = 'display:flex; flex-direction:column; gap:0.4rem; align-items:center;';
        step2.appendChild(choiceRow);
        renderDuyguChoiceRow(choiceRow, scene.solutionOptions, (picked2) => {
          document.getElementById('story-slot-3').textContent = picked2.label.split(' ')[0];
          showVisualFeedback('🎉 Hikâyeni harika bir şekilde kurdun!', 'success');
          setTimeout(() => initDuyguGame('6+'), 1200);
        });
      });
    }
  }

  // --- GENEL YENİDEN KULLANILABİLİR: HAFIZA/EŞLEŞTİRME OYUNU ---
  // pairs: [{id, icon}] — her biri 2 kart olarak karışık dizilir, çocuk aynı ikona sahip
  // 2 kartı art arda bulmalıdır. Kuti'nin Hafıza Bahçesi gibi oyunlarda kullanılır.
  function initMemoryMatchGame(container, pairs, successMsg) {
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
        btn.textContent = card.icon;
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
  function initTapOrderGame(container, items, successMsg) {
    if (!container) return;
    container.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'tap-order-row';
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    let nextIndex = 0;

    shuffled.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'btn-icon-pill tap-order-btn';
      btn.innerHTML = item.html;
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        if (item.id === items[nextIndex].id) {
          btn.disabled = true;
          btn.classList.add('tap-order-correct');
          if (soundEnabled) AudioEngine.playSuccess();
          nextIndex++;
          if (nextIndex === items.length) {
            setTimeout(() => showVisualFeedback(successMsg, "success"), 250);
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

  // "Bölgeye Sürükle": items bir zoneId'ye sahiptir, zones hedef kutulardır.
  // Doğru kutuya bırakılan eleman kaybolur; yanlış kutuya bırakılırsa hata verir ve eleman kalır.
  function initZoneDragGame(bankEl, zonesEl, items, zones, successMsg) {
    if (!bankEl || !zonesEl) return;
    bankEl.innerHTML = '';
    zonesEl.innerHTML = '';
    let remaining = items.length;

    zones.forEach(zone => {
      const zoneDiv = document.createElement('div');
      zoneDiv.className = 'btn-icon-pill drop-target-zone zone-drop-target';
      zoneDiv.dataset.zoneId = zone.id;
      zoneDiv.innerHTML = `<span class="zone-icon">${zone.icon}</span><span>${zone.label}</span>`;
      zoneDiv.addEventListener('dragover', (e) => { e.preventDefault(); zoneDiv.classList.add('drag-over'); });
      zoneDiv.addEventListener('dragleave', () => zoneDiv.classList.remove('drag-over'));
      zoneDiv.addEventListener('drop', (e) => {
        e.preventDefault();
        zoneDiv.classList.remove('drag-over');
        const draggedId = e.dataTransfer.getData('text/plain');
        const item = items.find(it => it.id === draggedId);
        const itemEl = bankEl.querySelector(`[data-item-id="${draggedId}"]`);
        if (!item || !itemEl) return;

        if (item.zoneId === zone.id) {
          if (soundEnabled) AudioEngine.playSuccess();
          itemEl.remove();
          remaining--;
          if (remaining === 0) {
            setTimeout(() => showVisualFeedback(successMsg, "success"), 250);
          } else {
            showVisualFeedback("Doğru yere yerleşti!", "success");
          }
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          showVisualFeedback("Burası doğru yer değil, tekrar dene.", "error");
        }
      });
      zonesEl.appendChild(zoneDiv);
    });

    items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'drag-source';
      itemEl.draggable = true;
      itemEl.dataset.itemId = item.id;
      itemEl.innerHTML = item.icon;
      itemEl.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', item.id));
      bankEl.appendChild(itemEl);
    });
  }

  // --- BECERİ KÖŞESİ — OYUN 1 ---
  // 3 yaş: Kuti'nin Renk Yolu (söylenen renkteki alana dokun)
  // 4-5 yaş: Kuti'nin Bahçesini Tamamlıyorum (bahçeye uygun nesneleri yerleştir - sürükle-bırak)
  // 6 yaş: Kuti'nin Örüntü Bahçesi (renk/şekil/boyut örüntüsünü tamamla - çoklu kriter)
  function initBeceriGame(level) {
    const beceriContainer = document.getElementById('sirala-grid');
    if (!beceriContainer) return;
    beceriContainer.innerHTML = '';

    if (level === '3') {
      // Gerçek mekanik: Söylenen renk seslendirilir/gösterilir, çocuk o renkteki alana dokunur
      const colors = [
        { id: 'red', name: 'Kırmızı', swatch: '🔴' },
        { id: 'yellow', name: 'Sarı', swatch: '🟡' },
        { id: 'blue', name: 'Mavi', swatch: '🔵' }
      ];
      const target = colors[Math.floor(Math.random() * colors.length)];
      beceriContainer.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.85rem; font-weight:700; color:#2E7D32; margin-bottom:0.4rem;">🎨 Kuti'nin Renk Yolu</p>
          <p style="font-size:0.8rem; font-weight:700; color:#1B5E20; margin-bottom:0.6rem;">"${target.name}" renkteki alana dokun!</p>
          <div id="beceri-color-choices" style="display:flex; gap:0.7rem; justify-content:center;"></div>
        </div>`;
      const box = document.getElementById('beceri-color-choices');
      colors.slice().sort(() => Math.random() - 0.5).forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'btn-icon-pill';
        btn.style.fontSize = '2rem';
        btn.textContent = c.swatch;
        btn.addEventListener('click', () => {
          if (c.id === target.id) {
            if (soundEnabled) AudioEngine.playSuccess();
            showVisualFeedback('🎉 Doğru renge dokundun!', 'success');
            initBeceriGame('3');
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            showVisualFeedback('Tekrar bak, hangi renk söylendi?', 'error');
          }
        });
        box.appendChild(btn);
      });
    } else if (level === '4-5') {
      // Gerçek mekanik: Bahçe nesnelerini (güneş, ağaç, çiçek, bank) doğru bahçe alanına sürükle
      beceriContainer.innerHTML = `
        <p style="text-align:center; font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.5rem;">🌻 Kuti'nin Bahçesini Tamamlıyorum</p>
        <div id="beceri-garden-bank" class="zone-item-bank"></div>
        <div id="beceri-garden-zones" class="zone-drop-grid"></div>`;
      initZoneDragGame(
        document.getElementById('beceri-garden-bank'),
        document.getElementById('beceri-garden-zones'),
        [
          { id: 'sun', icon: '☀️', zoneId: 'sky' },
          { id: 'tree', icon: '🌳', zoneId: 'ground' },
          { id: 'flower', icon: '🌸', zoneId: 'ground' },
          { id: 'bench', icon: '🪑', zoneId: 'ground' }
        ],
        [
          { id: 'sky', icon: '☁️', label: 'Gökyüzü' },
          { id: 'ground', icon: '🟩', label: 'Bahçe Zemini' }
        ],
        '🎉 Bahçeyi harika bir şekilde tamamladın!'
      );
    } else {
      // Gerçek mekanik: Renk + şekil + boyut kriterli örüntü — eksik öğeyi bul
      const patterns = [
        { seq: ['🔴 küçük', '🔴 büyük', '🔵 küçük'], next: '🔵 büyük', wrong: '🔴 küçük', label: 'renk + boyut' },
        { seq: ['🟢▲', '🟡●', '🟢▲'], next: '🟡●', wrong: '🟢●', label: 'renk + şekil' }
      ];
      const p = patterns[Math.floor(Math.random() * patterns.length)];
      const displaySeq = [...p.seq, ...p.seq];
      beceriContainer.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.3rem;">🪴 Kuti'nin Örüntü Bahçesi</p>
          <p style="font-size:0.68rem; color:var(--text-muted); margin-bottom:0.5rem;">Çoklu kriter: ${p.label}</p>
          <div style="font-size:1.3rem; letter-spacing:0.4rem; margin-bottom:0.7rem;">${displaySeq.join(' · ')} · <span style="opacity:0.4;">❓</span></div>
          <div id="beceri-pattern-choices" style="display:flex; gap:0.6rem; justify-content:center; flex-wrap:wrap;"></div>
        </div>`;
      const choicesBox = document.getElementById('beceri-pattern-choices');
      const options = [p.next, p.wrong].sort(() => Math.random() - 0.5);
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-icon-pill';
        btn.style.fontSize = '1.1rem';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          if (opt === p.next) {
            if (soundEnabled) AudioEngine.playSuccess();
            showVisualFeedback('🎉 Örüntü başarıyla tamamlandı!', 'success');
            initBeceriGame('6+');
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            showVisualFeedback('Örüntüye tekrar bak, kriterler neydi?', 'error');
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
    title.style.cssText = 'text-align:center; font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.5rem; border-top:2px dashed #C8E6C9; padding-top:0.8rem;';
    title.textContent = "🧠 Kuti'nin Hafıza Bahçesi";
    wrapper.appendChild(title);
    const grid = document.createElement('div');
    wrapper.appendChild(grid);

    initMemoryMatchGame(grid, [
      { id: 'sun', icon: '☀️' },
      { id: 'leaf', icon: '🍃' },
      { id: 'flower', icon: '🌸' },
      { id: 'book', icon: '📖' },
      { id: 'drop', icon: '💧' },
      { id: 'kuti', icon: '🦊' }
    ], '🎉 Harika hafıza! Bütün çiftleri buldun!');
  }

  // --- ÖZ BAKIM KÖŞESİ — OYUN 1: TEMİZLİK/RUTİN (her yaş için ayrı gerçek mekanik) ---
  // Not: Kap her seferinde tamamen yeniden kuruluyor, böylece bir yaştan diğerine geçerken
  // önceki DOM elemanları kaybolsa bile fonksiyon her zaman doğru elemanları bulur.
  function initOzbakimOralGame(level) {
    const wrapper = document.getElementById('ozbakim-oral-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    if (level === '3') {
      // Gerçek mekanik: Elleri doğru sırayla yıkama — Islat → Sabunla → Kurula
      const title = document.createElement('p');
      title.style.cssText = 'text-align:center; font-size:0.85rem; font-weight:700; color:#00796B; margin-bottom:0.5rem;';
      title.textContent = "🧼 Kuti'nin ellerini doğru sırayla yıka";
      wrapper.appendChild(title);
      const row = document.createElement('div');
      wrapper.appendChild(row);
      initTapOrderGame(row, [
        { id: 'wet', html: '💧<br><span style="font-size:0.62rem;">Islat</span>' },
        { id: 'soap', html: '🧼<br><span style="font-size:0.62rem;">Sabunla</span>' },
        { id: 'dry', html: '🌬️<br><span style="font-size:0.62rem;">Kurula</span>' }
      ], "✨ Eller sabunlandı, durulandı ve tertemiz oldu!");
    } else if (level === '6+') {
      // Gerçek mekanik: Kuti'nin Bir Günü — sabah ve gece rutinini 7 adımlık tam gün akışında sırala
      const title = document.createElement('p');
      title.style.cssText = 'text-align:center; font-size:0.85rem; font-weight:700; color:#E65100; margin-bottom:0.5rem;';
      title.textContent = "☀️🌙 Kuti'nin Bir Günü — Rutini Doğru Sıraya Diz";
      wrapper.appendChild(title);
      const row = document.createElement('div');
      wrapper.appendChild(row);
      initTapOrderGame(row, [
        { id: 'wake', html: '🌅<br><span style="font-size:0.6rem;">Uyanma</span>' },
        { id: 'wash', html: '🚿<br><span style="font-size:0.6rem;">Yüz Yıkama</span>' },
        { id: 'brush', html: '🪥<br><span style="font-size:0.6rem;">Diş Fırçalama</span>' },
        { id: 'dress', html: '👕<br><span style="font-size:0.6rem;">Kıyafet Değiştirme</span>' },
        { id: 'go', html: '🎒<br><span style="font-size:0.6rem;">Dışarı Hazırlanma</span>' },
        { id: 'pajama', html: '🩳<br><span style="font-size:0.6rem;">Pijama</span>' },
        { id: 'sleep', html: '🌙<br><span style="font-size:0.6rem;">Uyuma</span>' }
      ], "🎉 Kuti'nin bütün günü doğru sıraya kondu!");
    } else {
      // 4-5 Yaş: Kuti'nin Sabah Sırası — sabah rutinini gerçek sıralı dokunma ile doğru sıraya koy
      const title = document.createElement('p');
      title.style.cssText = 'text-align:center; font-size:0.85rem; font-weight:700; color:#00796B; margin-bottom:0.5rem;';
      title.textContent = "🌅 Kuti'nin Sabah Sırası";
      wrapper.appendChild(title);
      const row = document.createElement('div');
      wrapper.appendChild(row);
      initTapOrderGame(row, [
        { id: 'wake', html: '🌅<br><span style="font-size:0.62rem;">Uyanma</span>' },
        { id: 'wash', html: '🚿<br><span style="font-size:0.62rem;">Yüz Yıkama</span>' },
        { id: 'brush', html: '🪥<br><span style="font-size:0.62rem;">Diş Fırçalama</span>' },
        { id: 'dress', html: '👕<br><span style="font-size:0.62rem;">Giyinme</span>' }
      ], "🎉 Sabah rutini doğru sıraya kondu!");
    }
  }

  // --- ÖZ BAKIM KÖŞESİ — OYUN 2: HAVA DURUMUNA GÖRE GİYDİRME (gerçek hava/kıyafet eşleşme kontrolü) ---
  const WEATHER_CLOTHING_MAP = {
    sunny: { clue: '☀️ Güneşli bir gün', matchLabel: 'T-shirt' },
    rainy: { clue: '🌧️ Yağmurlu bir gün', matchLabel: 'Yağmurluk' },
    cold: { clue: '❄️ Soğuk bir gün', matchLabel: 'Mont' }
  };

  function initOzbakimDressGame(level, cfg) {
    const clueEl = document.getElementById('ozbakim-weather-clue');
    const dressContainer = document.getElementById('dress-options-grid');
    if (!dressContainer) return;

    const hasMont = cfg.weatherOptions.some(o => o.includes('Mont'));
    const availableWeathers = hasMont ? ['sunny', 'rainy', 'cold'] : ['sunny', 'rainy'];
    const weatherKey = availableWeathers[Math.floor(Math.random() * availableWeathers.length)];
    const weather = WEATHER_CLOTHING_MAP[weatherKey];

    if (clueEl) clueEl.textContent = weather.clue;

    dressContainer.innerHTML = cfg.weatherOptions.map(opt =>
      `<button class="btn-icon-pill dress-opt-btn" data-match="${opt.includes(weather.matchLabel)}">${opt}</button>`
    ).join('');

    dressContainer.querySelectorAll('.dress-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isMatch = btn.dataset.match === 'true';
        if (isMatch) {
          if (soundEnabled) AudioEngine.playSuccess();
          showVisualFeedback(`Kuti ${btn.textContent.trim()} giydi, hava için tam uygun! 🎉`, "success");
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          showVisualFeedback("Bu hava için doğru kıyafet değil, tekrar dene.", "error");
        }
      });
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
  function initDogaMevsimGame(level) {
    const clueEl = document.getElementById('doga-mevsim-clue');
    const mevsimBox = document.getElementById('mevsim-options');
    if (!mevsimBox) return;

    if (level === '3') {
      const skyOptions = [
        { icon: '☀️', label: 'Güneşli' },
        { icon: '☁️', label: 'Bulutlu' },
        { icon: '🌧️', label: 'Yağmurlu' }
      ];
      const target = skyOptions[Math.floor(Math.random() * skyOptions.length)];
      if (clueEl) clueEl.textContent = `Gökyüzü şöyle: ${target.icon} — hangisi bu havaya uyuyor?`;
      mevsimBox.innerHTML = skyOptions.map(o =>
        `<button class="btn-icon-pill mevsim-opt-btn" data-correct="${o.icon === target.icon}" style="font-size:1.6rem;">${o.icon}</button>`
      ).join('');
      mevsimBox.querySelectorAll('.mevsim-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.dataset.correct === 'true') {
            if (soundEnabled) AudioEngine.playSuccess();
            showVisualFeedback('🎉 Doğru hava durumunu buldun!', 'success');
            initDogaMevsimGame('3');
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            showVisualFeedback('Gökyüzüne tekrar bak.', 'error');
          }
        });
      });
      return;
    }

    const seasons = ['🍂 Sonbahar', '❄️ Kış', '🌸 İlkbahar', '☀️ Yaz'];
    const correctSeason = seasons[Math.floor(Math.random() * seasons.length)];
    const clues = SEASON_CLUE_MAP[correctSeason];
    const clue = clues[Math.floor(Math.random() * clues.length)];
    if (clueEl) clueEl.textContent = clue;

    mevsimBox.innerHTML = seasons.map(s =>
      `<button class="btn-icon-pill mevsim-opt-btn" data-correct="${s === correctSeason}">${s}</button>`
    ).join('');

    mevsimBox.querySelectorAll('.mevsim-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.correct === 'true';
        if (isCorrect) {
          if (soundEnabled) AudioEngine.playSuccess();
          showVisualFeedback(`${btn.textContent} doğru cevap, harikasın!`, "success");
        } else {
          if (soundEnabled) AudioEngine.playTone(300, 0.2);
          showVisualFeedback("İpucuna tekrar bak, hangi mevsim uyuyor?", "error");
        }
      });
    });
  }

  // --- DOĞA KÖŞESİ — OYUN 2: BAHÇE / BİTKİ BÜYÜTME (3, 4-5 yaş gerçek; 6 yaş yeni gerçek mekanik) ---
  function initDogaGardenGame(level) {
    const wrapper = document.getElementById('doga-garden-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    if (level === '6+') {
      // Gerçek mekanik: Kuti'nin Bahçesini Temizliyorum — yaşam döngüsünü sırala +
      // doğal nesneleri ve çöpleri ayırarak bahçeyi temizle (sınıflama, çevre farkındalığı)
      wrapper.innerHTML = `
        <p style="text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.4rem;">🌿 Bitkinin Yaşam Döngüsünü Sırala</p>
        <div id="doga-lifecycle-row" style="margin-bottom:1rem;"></div>
        <p style="text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.4rem;">🧹 Kuti'nin Bahçesini Temizliyorum</p>
        <div id="doga-recycle-bank" class="zone-item-bank"></div>
        <div id="doga-recycle-zones" class="zone-drop-grid"></div>`;

      initTapOrderGame(document.getElementById('doga-lifecycle-row'), [
        { id: 'seed', html: '🌰<br><span style="font-size:0.6rem;">Tohum</span>' },
        { id: 'sprout', html: '🌱<br><span style="font-size:0.6rem;">Filiz</span>' },
        { id: 'sapling', html: '🌿<br><span style="font-size:0.6rem;">Fidan</span>' },
        { id: 'tree', html: '🌳<br><span style="font-size:0.6rem;">Ağaç</span>' }
      ], "🎉 Bitkinin büyüme sırası doğru kuruldu!");

      initZoneDragGame(
        document.getElementById('doga-recycle-bank'),
        document.getElementById('doga-recycle-zones'),
        [
          { id: 'leaf', icon: '🍁', zoneId: 'nature' },
          { id: 'stone', icon: '🪨', zoneId: 'nature' },
          { id: 'paper', icon: '📄', zoneId: 'trash' },
          { id: 'bottle', icon: '🍾', zoneId: 'trash' },
          { id: 'wrapper', icon: '🧃', zoneId: 'trash' }
        ],
        [
          { id: 'nature', icon: '🌳', label: 'Doğa Alanı' },
          { id: 'trash', icon: '🗑️', label: 'Çöp Kutusu' }
        ],
        '🎉 Bahçe tertemiz oldu, doğa korundu!'
      );
    } else if (level === '4-5') {
      // Gerçek mekanik: Kuti Tohum Yetiştiriyor — tohumun büyümesi için gerekli adımları sırayla seç
      const title = document.createElement('p');
      title.style.cssText = 'text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.5rem;';
      title.textContent = '🌱 Kuti Tohum Yetiştiriyor — Adımları Doğru Sırayla Dokun';
      wrapper.appendChild(title);
      const row = document.createElement('div');
      wrapper.appendChild(row);
      initTapOrderGame(row, [
        { id: 'pot', html: '🪴<br><span style="font-size:0.6rem;">Saksı/Toprak</span>' },
        { id: 'seed', html: '🌰<br><span style="font-size:0.6rem;">Tohum</span>' },
        { id: 'water', html: '💧<br><span style="font-size:0.6rem;">Su</span>' },
        { id: 'sun', html: '☀️<br><span style="font-size:0.6rem;">Güneş</span>' },
        { id: 'flower', html: '🌸<br><span style="font-size:0.6rem;">Çiçek</span>' }
      ], '🎉 Kuti tohumunu harika bir şekilde yetiştirdi!');
    } else {
      // 3 Yaş: mevcut çalışan sürükle mekaniği (su/güneşi saksıya sürükle, bitki büyür)
      wrapper.innerHTML = `
        <p style="text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.5rem;">🌱 Suyu ve Güneşi Saksıya Sürükle</p>
        <div style="display:flex; gap:1.2rem; justify-content:center; align-items:center;">
          <div class="drag-source" id="draggable-water" draggable="true" style="font-size:2.2rem;">💧</div>
          <div class="drag-source" id="draggable-sun" draggable="true" style="font-size:2.2rem;">☀️</div>
          <div class="drop-target-zone" id="plant-pot-target" style="width:110px; min-height:90px; font-size:2.4rem;">
            <span id="plant-visual-display">🌱</span>
          </div>
        </div>`;

      plantStageIndex = 0;
      const water = document.getElementById('draggable-water');
      const sun = document.getElementById('draggable-sun');
      const potZone = document.getElementById('plant-pot-target');
      const plantDisplay = document.getElementById('plant-visual-display');

      [water, sun].forEach(item => {
        if (!item) return;
        item.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', item.id));
      });

      if (potZone) {
        potZone.addEventListener('dragover', (e) => { e.preventDefault(); potZone.classList.add('drag-over'); });
        potZone.addEventListener('dragleave', () => potZone.classList.remove('drag-over'));
        potZone.addEventListener('drop', (e) => {
          e.preventDefault();
          potZone.classList.remove('drag-over');
          if (plantStageIndex < plantVisualStages.length - 1) {
            plantStageIndex++;
            plantDisplay.textContent = plantVisualStages[plantStageIndex];
            if (soundEnabled) AudioEngine.playSuccess();

            if (plantStageIndex === plantVisualStages.length - 1) {
              setTimeout(() => {
                showVisualFeedback("🎉 Tebrikler! Bitkini besleyerek koca bir çiçek yaptın!", "success");
              }, 400);
            }
          }
        });
      }
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
    kitaplik: 'Kitaplık'
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

    if (panelKey === 'kitaplik') loadDailyChildrenBooks();
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
    });
  }

  document.querySelectorAll('#modal-parent-corner .keypad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (enteredPin.length < 4) {
        enteredPin += btn.textContent.trim();
        updatePinDots();
        if (soundEnabled) AudioEngine.playTone(600, 0.1);

        if (enteredPin.length === 4) {
          if (enteredPin === currentDynamicPin) {
            if (soundEnabled) AudioEngine.playSuccess();
            if (pinView) pinView.style.display = 'none';
            if (parentDashboardView) {
              parentDashboardView.style.display = 'flex';
              parentDashboardView.style.flexDirection = 'column';
            }
            if (parentModalBox) parentModalBox.classList.add('parent-dashboard-active'); // tam yükseklik, boşluksuz görünüm
            showParentPanel('main');
            loadDailyChildrenBooks();
          } else {
            if (pinErrorMsg) pinErrorMsg.textContent = 'Hatalı Kod! Lütfen gösterilen 4 rakamı girin.';
            setTimeout(() => {
              enteredPin = '';
              updatePinDots();
            }, 800);
          }
        }
      }
    });
  });

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