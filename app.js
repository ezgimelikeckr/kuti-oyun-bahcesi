/* ==========================================================================
   PIKO CHILD EDUCATION DASHBOARD - COMPLETE REFINED APP LOGIC
   - SIRALA BUL SHUFFLED INITIAL ORDER & INTERACTIVE SORTING MECHANIC
   - Centered PIN Security Modals (Launch Lock & Parent Corner)
   - Instant Rendering for ALL Mini-Games (Sırala Bul, Yapboz, Duygu Aynası, Doğa)
   - Real HTML5 Drag & Drop Mechanics (Diş Fırçalama & Bahçe Sulama)
   - Real Cut Image Jigsaw Puzzle (Yapboz Görsel Bütünlüğü)
   - Fixed Full-Screen No-Scroll Parent Dashboard Tabs
   - ZPD (Vygotsky) Tabanlı 6+ Yaş Gerekçelendirme Soruları (Öz Bakım & Doğa)
   - DÜZELTİLDİ: Rastgele Duygu Aynası ve Doğru/Yanlış Empati Kontrolü
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. INITIAL WELCOME OVERLAY TRANSITION LOGIC
  const welcomeOverlay = document.getElementById('piko-welcome-overlay');
  const btnStartWelcome = document.getElementById('btn-start-welcome');
  if (btnStartWelcome && welcomeOverlay) {
    btnStartWelcome.addEventListener('click', () => {
      welcomeOverlay.classList.add('hidden-welcome');
      if (soundEnabled) AudioEngine.playSuccess();
    });
  }

  // Web Audio Synthesizer with 432 Hz Kalimba Tuning
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

  // State
  let soundEnabled = true;
  let currentAgeLevel = '4-5';
  let sunProgress = 10;
  let sunTimerDuration = 120;
  let sunInterval = null;

  // --- Ebeveyn Güvenlik Doğrulaması (Dinamik Matematik Sorusu Mantığı) ---
  let currentMathAnswer = 0;
  let enteredMathInput = '';
  let plantStageIndex = 0;
  const plantVisualStages = ['🌱', '🌿', '🌻', '🌳'];

  // 2. MANDATORY APP LAUNCH INITIAL ENTRY LOCK OVERLAY LOGIC
  const appLaunchOverlay = document.getElementById('app-launch-overlay');
  const launchPinDisplay = document.getElementById('launch-pin-display');
  const launchPinError = document.getElementById('launch-pin-error');
  const mathInputDisplay = document.getElementById('math-input-display');

  function generateMathSecurityProblem() {
    const num1 = Math.floor(Math.random() * 5) + 1;
    const num2 = Math.floor(Math.random() * 4) + 1;

    currentMathAnswer = num1 + num2;
    enteredMathInput = '';

    if (launchPinDisplay) {
      launchPinDisplay.textContent = `Soru: ${num1} + ${num2} = ?`;
    }
    if (mathInputDisplay) {
      mathInputDisplay.textContent = '_';
    }
  }

  generateMathSecurityProblem();

document.querySelectorAll('#app-launch-overlay .keypad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const digit = btn.textContent.trim();

      if (enteredMathInput.length < 2) {
        enteredMathInput += digit;

        if (mathInputDisplay) {
          mathInputDisplay.textContent = enteredMathInput;
        }

        if (typeof soundEnabled !== 'undefined' && soundEnabled && typeof AudioEngine !== 'undefined') {
          AudioEngine.playTone(432, 0.1);
        }

        const userResult = parseInt(enteredMathInput, 10);

        if (userResult === currentMathAnswer) {
          if (typeof soundEnabled !== 'undefined' && soundEnabled && typeof AudioEngine !== 'undefined') {
            AudioEngine.playSuccess();
          }
          if (appLaunchOverlay) {
            appLaunchOverlay.classList.add('unlocked');
            setTimeout(() => appLaunchOverlay.remove(), 300);
          }
        }
        else if (enteredMathInput.length >= 2 || userResult > currentMathAnswer) {
          if (launchPinError) launchPinError.textContent = 'Hatalı sonuç! Tekrar deneyin.';
          setTimeout(() => {
            enteredMathInput = '';
            if (mathInputDisplay) mathInputDisplay.textContent = '_';
            if (launchPinError) launchPinError.textContent = '';
          }, 800);
        }
      }
    });
  });

  // Sound Toggle Button
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

  // 3. GÜNEŞİN ÇİZGİLİ YOLU (TIME-PROPORTIONAL SUN TRACK)
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
      AudioEngine.playTone(350, 0.5);
      AudioEngine.start432HzKalimba();
    }
  }

  startSunJourney();

  // Unlock sleep mode
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

  // SURPRISE FLIP CARDS IN SLEEP MODE
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      if (soundEnabled) AudioEngine.playTone(648, 0.2);
    });
  });

 // 4. DUYGU AYNASI (PİKO RESİM TABANLI SİSTEM)
  let targetEmotion = { name: 'Mutlu', image: 'piko_mutlu.png', label: 'Mutlu' };

  function setVisualEmotionMirror(emotion) {
    targetEmotion = emotion;
    const mirrorFace = document.getElementById('mirror-face-img');
    const mirrorPrompt = document.getElementById('mirror-prompt-text');

    if (mirrorFace) {
      mirrorFace.style.transform = 'scale(1.15) rotate(3deg)';
      setTimeout(() => mirrorFace.style.transform = 'scale(1)', 300);
      
      // Piko'nun o duyguya ait resim dosyası dinamik olarak yükleniyor
      mirrorFace.src = emotion.image; 
    }
    
    if (mirrorPrompt) {
      mirrorPrompt.textContent = `Piko şu an nasıl hissediyor. Doğru yüz ifadesini seçebilir misin?`;
    }
  }

  function pickRandomTargetEmotion(cfg) {
    const pool = cfg.emotions;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setVisualEmotionMirror(pool[randomIndex]);
  }

  // 5. SIRALA BUL (KÜÇÜKTEN BÜYÜĞE) SHUFFLED INITIAL ORDER & INTERACTIVE REORDERING LOGIC
  let siralaItemsData = [];
  let selectedSiralaItem = null;

  function initSiralaBulGame() {
    const siralaGrid = document.getElementById('sirala-grid');
    if (!siralaGrid) return;

    const baseItems = [
      { id: 1, label: '🍎', sizePx: 26, title: 'En Küçük' },
      { id: 2, label: '🍎', sizePx: 36, title: 'Küçük' },
      { id: 3, label: '🍎', sizePx: 46, title: 'Orta' },
      { id: 4, label: '🍎', sizePx: 58, title: 'En Büyük' }
    ];

    siralaItemsData = [...baseItems].sort(() => Math.random() - 0.5);

    renderSiralaGrid();
  }

  function renderSiralaGrid() {
    const siralaGrid = document.getElementById('sirala-grid');
    if (!siralaGrid) return;

    siralaGrid.innerHTML = '';
    selectedSiralaItem = null;

    siralaItemsData.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'piko-card sirala-item drag-source';
      el.draggable = true;
      el.dataset.index = index;
      el.style.fontSize = `${item.sizePx}px`;
      el.style.padding = '0.4rem 0.8rem';
      el.style.cursor = 'pointer';
      el.style.userSelect = 'none';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.textContent = item.label;
      el.title = "Değiştirmek için tıkla veya sürükle";

      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', index);
        el.classList.add('dragging');
      });

      el.addEventListener('dragend', () => el.classList.remove('dragging'));

      el.addEventListener('dragover', (e) => e.preventDefault());

      el.addEventListener('drop', (e) => {
        e.preventDefault();
        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const toIdx = index;
        if (!isNaN(fromIdx) && fromIdx !== toIdx) {
          const temp = siralaItemsData[fromIdx];
          siralaItemsData[fromIdx] = siralaItemsData[toIdx];
          siralaItemsData[toIdx] = temp;
          if (soundEnabled) AudioEngine.playTone(600);
          renderSiralaGrid();
          checkSiralaSuccess();
        }
      });

      el.addEventListener('click', () => {
        if (selectedSiralaItem === null) {
          selectedSiralaItem = index;
          el.style.border = '3px solid #FF9800';
          el.style.background = '#FFF3E0';
          if (soundEnabled) AudioEngine.playTone(500);
        } else {
          const fromIdx = selectedSiralaItem;
          const toIdx = index;
          if (fromIdx !== toIdx) {
            const temp = siralaItemsData[fromIdx];
            siralaItemsData[fromIdx] = siralaItemsData[toIdx];
            siralaItemsData[toIdx] = temp;
            if (soundEnabled) AudioEngine.playTone(700);
          }
          renderSiralaGrid();
          checkSiralaSuccess();
        }
      });

      siralaGrid.appendChild(el);
    });
  }

  function checkSiralaSuccess() {
    const isSorted = siralaItemsData.every((item, idx) => item.id === idx + 1);
    if (isSorted) {
      if (soundEnabled) AudioEngine.playSuccess();
      const siralaGrid = document.getElementById('sirala-grid');
      if (siralaGrid) siralaGrid.style.borderColor = '#4CAF50';
      setTimeout(() => alert('🎉 Tebrikler! Elmaları küçükten büyüğe harika sıraladın!'), 300);
    }
  }

  // 6. REAL CUT IMAGE JIGSAW PUZZLE SYSTEM (YAPBOZ GÖRSEL BÜTÜNLÜĞÜ)
  function initRealImagePuzzle() {
    const puzzleBoard = document.getElementById('puzzle-board-grid');
    const puzzleBank = document.getElementById('puzzle-piece-bank');
    if (!puzzleBoard || !puzzleBank) return;

    puzzleBoard.innerHTML = '';
    puzzleBank.innerHTML = '';

    const totalCols = 3;
    const totalRows = 2;
    const missingIndices = [2, 5];

    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < totalCols; c++) {
        const index = r * totalCols + c;
        const slot = document.createElement('div');
        slot.className = 'puzzle-board-slot';
        slot.dataset.slotIndex = index;

        const posX = (c / (totalCols - 1)) * 100;
        const posY = (r / (totalRows - 1)) * 100;
        slot.style.backgroundImage = "url('piko_mascot.jpg')";
        slot.style.backgroundPosition = `${posX}% ${posY}%`;

        if (missingIndices.includes(index)) {
          slot.classList.add('empty');
        }

        puzzleBoard.appendChild(slot);
      }
    }

    missingIndices.forEach(idx => {
      const c = idx % totalCols;
      const r = Math.floor(idx / totalCols);
      const posX = (c / (totalCols - 1)) * 100;
      const posY = (r / (totalRows - 1)) * 100;

      const piece = document.createElement('div');
      piece.className = 'puzzle-cut-piece drag-source';
      piece.draggable = true;
      piece.dataset.targetSlot = idx;
      piece.style.backgroundImage = "url('piko_mascot.jpg')";
      piece.style.backgroundPosition = `${posX}% ${posY}%`;
      piece.title = "Parçayı Tahtaya Sürükle veya Tıkla";

      piece.addEventListener('click', () => {
        const targetSlot = puzzleBoard.querySelector(`[data-slot-index="${idx}"]`);
        if (targetSlot) {
          targetSlot.classList.remove('empty');
          piece.remove();
          if (soundEnabled) AudioEngine.playSuccess();
          if (puzzleBank.children.length === 0) {
            setTimeout(() => alert('🎉 Harika! Piko Yapbozunu Tamamladın!'), 300);
          }
        }
      });

      puzzleBank.appendChild(piece);
    });
  }

  // 7. REAL HTML5 DRAG AND DROP MECHANICS
  function initDragAndDropMechanics() {
    const brush = document.getElementById('draggable-brush');
    const teethZone = document.getElementById('teeth-target-zone');
    const mouthEmoji = document.getElementById('mouth-target-emoji');

    if (brush && teethZone) {
      brush.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 'brush');
        brush.classList.add('dragging');
      });

      brush.addEventListener('dragend', () => brush.classList.remove('dragging'));

      teethZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        teethZone.classList.add('drag-over');
      });

      teethZone.addEventListener('dragleave', () => teethZone.classList.remove('drag-over'));

      teethZone.addEventListener('drop', (e) => {
        e.preventDefault();
        teethZone.classList.remove('drag-over');
        if (soundEnabled) AudioEngine.playSuccess();
        if (mouthEmoji) mouthEmoji.textContent = '✨🪥🫧';
        
        const pikoMessageEl = document.getElementById('piko-message');
        if (pikoMessageEl) {
          pikoMessageEl.innerHTML = "Yaşasın! Dişlerimizi fırçaladık ki minik mikroplar kaçsın, dişlerimiz pırıl pırıl parlasın! 🦷✨";
        }

        setTimeout(() => {
          if (mouthEmoji) mouthEmoji.textContent = '😁';
          alert('🧼 Piko pırıl pırıl dişlerle gülümsüyor!');
        }, 600);
      });
    } 

    const water = document.getElementById('draggable-water');
    const sun = document.getElementById('draggable-sun');
    const potZone = document.getElementById('plant-pot-target');
    const plantDisplay = document.getElementById('plant-visual-display');

    if (potZone && plantDisplay) {
      [water, sun].forEach(item => {
        if (!item) return;
        item.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', item.id);
          item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => item.classList.remove('dragging'));
      });

      potZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        potZone.classList.add('drag-over');
      });

      potZone.addEventListener('dragleave', () => potZone.classList.remove('drag-over'));

      potZone.addEventListener('drop', (e) => {
        e.preventDefault();
        potZone.classList.remove('drag-over');
        
        plantStageIndex = (plantStageIndex + 1) % plantVisualStages.length;
        plantDisplay.textContent = plantVisualStages[plantStageIndex];
        plantDisplay.style.transform = 'scale(1.3) rotate(5deg)';
        setTimeout(() => plantDisplay.style.transform = 'scale(1)', 400);

        if (soundEnabled) AudioEngine.playSuccess();
      });
    }
  }

  initDragAndDropMechanics();

  // 7b. ZPD (VYGOTSKY) — ORTAK GEREKÇELENDİRME SORUSU YARDIMCI FONKSİYONU
  function showSimpleWhyQuestion(boxId, optionsId, reasons, finalMessage) {
    const box = document.getElementById(boxId);
    const optionsEl = document.getElementById(optionsId);
    if (!box || !optionsEl) return;

    optionsEl.innerHTML = '';
    reasons.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'btn-icon-pill';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        alert(finalMessage + ' Güzel düşünmüşsün! 🌟');
        box.style.display = 'none';
      });
      optionsEl.appendChild(btn);
    });
    box.style.display = 'block';
  }

  // 8. DYNAMIC AGE LEVEL SYSTEM & INSTANT MINI-GAME RENDERER
  const ageConfig = {
    '3': {
      badge: '3 Yaş (Minik Keşifçiler)',
      duyguDesc: 'Görsel duygu ifadeleri (Mutlu, Üzgün, Şaşırmış) ve jest eşleştirme.',
      beceriDesc: 'Karışık yüklenen Sırala Bul ve gerçek resim parçalı Piko yapbozları.',
      ozbakimDesc: 'Sürükle-bırak Diş Fırçalama ve hava durumuna göre kıyafet eşleştirme.',
      dogaDesc: 'Zıt mevsimler ve sürükle-bırak sulama ile görsel bitki büyütme.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'piko_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'piko_uzgun.png' },
        { label: 'Şaşırmış', name: 'Şaşırmış', image: 'piko_sasirmis.png' },
      ],
      scenario: 'Piko dondurmasını yere düşürdü. Ne hissediyor?',
      scenarioChoices: [
        { label: '😢 Üzüldü (Ona sarılalım)', correct: true },
        { label: '😊 Mutlu oldu', correct: false }
      ],
      weatherOptions: ['☀️ Güneşli (T-shirt)', '🌧️ Yağmurlu (Yağmurluk)']
    },
    '4-5': {
      badge: '4-5 Yaş (Meraklı Filizler)',
      duyguDesc: 'Görsel 4 duygu ifadesi (Mutlu, Üzgün, Kızgın, Heyecanlı) ve empati senaryoları.',
      beceriDesc: 'Karışık Sırala Bul (küçükten büyüğe) ve 6 parçalı gerçek resim yapbozları.',
      ozbakimDesc: 'Sürükle-bırak fırçalama ve 4 mevsim kıyafet giydirme.',
      dogaDesc: '4 mevsim ipucu analizi ve sürükle-bırak sulama-güneş dengesi.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'piko_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'piko_uzgun.png' },
        { label: 'Öfkeli', name: 'Öfkeli', image: 'piko_ofkeli.png' },
        { label: 'Meraklı', name: 'Meraklı', image: 'piko_merakli.png' },
      ],
      scenario: 'Piko en sevdiği oyuncağını bulamıyor. Nasıl hissediyor ve ne yapmalıyız?',
      scenarioChoices: [
        { label: '🔍 Birlikte arayalım (Heyecanlı keşif)', correct: true },
        { label: '😡 Kızıp oyuncağı kıralım', correct: false }
      ],
      weatherOptions: ['☀️ Güneşli (Şapka & T-shirt)', '🌧️ Yağmurlu (Yağmurluk & Çizme)', '❄️ Karlı (Mont & Bere)']
    },
    '6+': {
      badge: '6+ Yaş (Bilge Çiçekler)',
      duyguDesc: 'Görsel 6 zengin duygu ifadesi (Gururlu, Utanmış, Kaygılı, Sakin vb.).',
      beceriDesc: 'Karışık sıralama oyunları ve detaylı zeka yapbozları.',
      ozbakimDesc: 'Sürükle-bırak hijyen ve çoklu mevsim kombinasyon giydirme.',
      dogaDesc: 'Çoklu canlı türü, sulama ve güneş dengesi ekolojisi.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'piko_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'piko_uzgun.png' },
        { label: 'Öfkeli', name: 'Öfkeli', image: 'piko_ofkeli.png' },
        { label: 'Şaşırmış', name: 'Şaşırmış', image: 'piko_saskin.png' },
        { label: 'Utangaç', name: 'Utangaç', image: 'piko_utangac.png' },
        { label: 'Meraklı', name: 'Meraklı', image: 'piko_merakli.png' },
        { label: 'Korkmuş', name: 'Korkmuş', image: 'piko_korkmus.png' },
        { label: 'Gururlu', name: 'Gururlu', image: 'piko_gururlu.png' }
      ],
      scenario: 'Piko sahnede şarkı söylerken sözleri unuttu. Ona nasıl destek oluruz?',
      scenarioChoices: [
        { label: '👏 Alkışlayarak cesaret verelim', correct: true },
        { label: '🙈 Gülüp gidelim', correct: false }
      ],
      weatherOptions: ['☀️ Güneşli (Güneş Gözlüğü & Şapka)', '🌧️ Yağmurlu (Şemsiye & Yağmurluk)', '❄️ Karlı (Mont, Eldiven & Bere)'],
      dressReasons: ['🌡️ Hava sıcaklığına uygun olduğu için', '🎨 Rengini sevdiğim için', '🏃 Rahat hareket edebilmek için'],
      mevsimReasons: ['🍂 Yaprakların rengi değiştiği için', '🌡️ Hava soğuduğu için', '🐦 Kuşlar göç ettiği için']
    }
  };

  function updateAgeSystem(level) {
    currentAgeLevel = level;
    const cfg = ageConfig[level];
    if (!cfg) return;

    // Update active level badge
    const activeBadge = document.getElementById('active-age-badge');
    if (activeBadge) activeBadge.textContent = cfg.badge;

    // Update card descriptions
    document.getElementById('duygu-desc').textContent = cfg.duyguDesc;
    document.getElementById('beceri-desc').textContent = cfg.beceriDesc;
    document.getElementById('ozbakim-desc').textContent = cfg.ozbakimDesc;
    document.getElementById('doga-desc').textContent = cfg.dogaDesc;

    // Set Visual Emotion Mirror target (RASTGELE BAŞLAR)
    pickRandomTargetEmotion(cfg);

    // Render Duygu Aynası options (DÜZELTİLDİ: Doğru/Yanlış Seçenek Kontrolü)
    const emotionBox = document.getElementById('duygu-mirror-options');
    if (emotionBox) {
      const shuffledEmotions = [...cfg.emotions].sort(() => Math.random() - 0.5);
      emotionBox.innerHTML = shuffledEmotions.map(e => 
        `<button class="btn-icon-pill emo-opt-btn" data-name="${e.name}" style="padding: 0.4rem 0.8rem;">${e.label}</button>`
      ).join('');

      emotionBox.querySelectorAll('.emo-opt-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const selectedName = btn.dataset.name;
          const isCorrect = selectedName === targetEmotion.name;

          if (isCorrect) {
            if (soundEnabled) AudioEngine.playSuccess();
            alert(`🎉 Tebrikler! Harika bildin, Piko gerçekten ${targetEmotion.label} hissediyor!`);
            // Doğru bilince yeni bir rastgele duyguya geç
            pickRandomTargetEmotion(cfg);
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            alert(`🤔 Hmm, Piko şu an ${targetEmotion.label} hissediyor. Tekrar bakalım mı?`);
          }
        });
      });
    }

    // Render Piko'nun Günü scenario (DÜZELTİLDİ: Olumsuz yanıtta tebrik etme hatası giderildi)
    const scenarioText = document.getElementById('duygu-scenario-text');
    const scenarioChoices = document.getElementById('duygu-scenario-choices');
    if (scenarioText && scenarioChoices) {
      scenarioText.textContent = cfg.scenario;
      const randomizedChoices = [...cfg.scenarioChoices].sort(() => Math.random() - 0.5);

      scenarioChoices.innerHTML = randomizedChoices.map(c => 
        `<button class="btn-icon-pill scenario-opt-btn" data-correct="${c.correct}" style="justify-content: flex-start; text-align: left; padding: 0.45rem 0.8rem;">${c.label}</button>`
      ).join('');

      scenarioChoices.querySelectorAll('.scenario-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const isCorrect = btn.dataset.correct === 'true';
          if (isCorrect) {
            if (soundEnabled) AudioEngine.playSuccess();
            alert("🎉 Tebrikler! Empatili harika bir çözüm buldun!");
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            alert("❤️ Bu yaklaşım Piko'yu üzebilir veya sorunu çözmeyebilir. Farklı bir empati yolu deneyelim mi?");
          }
        });
      });
    }

    // INITIALIZE SHUFFLED SIRALA BUL GAME
    initSiralaBulGame(level);

    // RENDER HANGİ MEVSİM GAME OPTIONS
    const mevsimBox = document.getElementById('mevsim-options');
    if (mevsimBox) {
      const seasons = level === '3' ? ['🍂 Sonbahar', '☀️ Yaz'] : ['🍂 Sonbahar', '❄️ Kış', '🌸 İlkbahar', '☀️ Yaz'];
      mevsimBox.innerHTML = seasons.map(s => 
        `<button class="btn-icon-pill mevsim-opt-btn">${s}</button>`
      ).join('');

      mevsimBox.querySelectorAll('.mevsim-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (soundEnabled) AudioEngine.playSuccess();
          if (level === '6+' && cfg.mevsimReasons) {
            showSimpleWhyQuestion('doga-why-box', 'doga-why-options', cfg.mevsimReasons,
              `Doğru! ${btn.textContent} mevsimini keşfettin!`);
          } else {
            alert(`Doğru! ${btn.textContent} mevsimini keşfettin!`);
          }
        });
      });
    }

    // Initialize Real Cut Image Puzzle with Age Level
    initRealImagePuzzle(level);

    // Render Hava Durumu Giydirme
    const dressContainer = document.getElementById('dress-options-grid');
    if (dressContainer) {
      dressContainer.innerHTML = cfg.weatherOptions.map(opt => 
        `<button class="btn-icon-pill dress-opt-btn">${opt}</button>`
      ).join('');

      dressContainer.querySelectorAll('.dress-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (soundEnabled) AudioEngine.playSuccess();
          if (level === '6+' && cfg.dressReasons) {
            showSimpleWhyQuestion('ozbakim-why-box', 'ozbakim-why-options', cfg.dressReasons,
              `Piko ${btn.textContent} giydi ve hazır!`);
          } else {
            alert(`Piko ${btn.textContent} giydi ve hazır!`);
          }
        });
      });
    }
  }

  // Radio listener for Age Selection
  document.querySelectorAll('input[name="age-group"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateAgeSystem(e.target.value);
      if (soundEnabled) AudioEngine.playSuccess();
    });
  });

  updateAgeSystem('4-5');

// 9. MODAL TRIGGERS FOR THE 4 CORNERS (Eksik Olan Tıklama Dinleyicileri)
  document.getElementById('card-duygu')?.addEventListener('click', () => {
    updateAgeSystem(currentAgeLevel);
    document.getElementById('modal-duygu-corner')?.classList.add('active');
    if (soundEnabled) AudioEngine.playTone(600);
  });

  document.getElementById('card-beceri')?.addEventListener('click', () => {
    updateAgeSystem(currentAgeLevel);
    initSiralaBulGame();
    document.getElementById('modal-beceri-corner')?.classList.add('active');
    if (soundEnabled) AudioEngine.playTone(600);
  });

  document.getElementById('card-ozbakim')?.addEventListener('click', () => {
    updateAgeSystem(currentAgeLevel);
    document.getElementById('modal-ozbakim-corner')?.classList.add('active');
    if (soundEnabled) AudioEngine.playTone(600);
  });

  document.getElementById('card-doga')?.addEventListener('click', () => {
    updateAgeSystem(currentAgeLevel);
    document.getElementById('modal-doga-corner')?.classList.add('active');
    if (soundEnabled) AudioEngine.playTone(600);
  });
   
// 10. EBEVEYN KÖŞESİ & PIN YÖNETİMİ
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
            const firstTabBtn = document.querySelector('.parent-tabs-nav .tab-btn');
            if (firstTabBtn) firstTabBtn.click();
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

  // GÜVENLİ MODAL KAPATMA
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.piko-modal');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });

  // TABS MANAGEMENT
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) {
        target.classList.add('active');
      }
      if (parentDashboardView) {
        parentDashboardView.scrollTop = 0;
      }
      if (soundEnabled) AudioEngine.playTone(550);
    });
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
      alert(`Güneş Yolu (Ekran Süresi) ${mins} dakika olarak ayarlandı!`);
    });
  });

});
