/* ==========================================================================
   PIKO CHILD EDUCATION DASHBOARD - COMPLETE REFINED APP LOGIC
   - SIRALA BUL SHUFFLED INITIAL ORDER & INTERACTIVE SORTING MECHANIC
   - Centered PIN Security Modals (Launch Lock & Parent Corner)
   - Instant Rendering for ALL Mini-Games (Sırala Bul, Yapboz, Duygu Aynası, Doğa)
   - Real HTML5 Drag & Drop Mechanics (Diş Fırçalama & Bahçe Sulama)
   - Real Cut Image Jigsaw Puzzle (Yapboz Görsel Bütünlüğü)
   - Fixed Full-Screen No-Scroll Parent Dashboard Tabs
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
        [432, 540, 648].forEach((f, i) => { // 432 Hz pentatonic tuning
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
  let enteredMathInput = ''; // Artık pin yerine girilen matematiksel metni tutuyoruz
  let plantStageIndex = 0;
  const plantVisualStages = ['🌱', '🌿', '🌻', '🌳'];

  // 2. MANDATORY APP LAUNCH INITIAL ENTRY LOCK OVERLAY LOGIC
  const appLaunchOverlay = document.getElementById('app-launch-overlay');
  const launchPinDisplay = document.getElementById('launch-pin-display');
  const launchPinError = document.getElementById('launch-pin-error');
  const mathInputDisplay = document.getElementById('math-input-display'); // Yeni eklediğimiz ekran alanı

  // Her girişte rastgele matematik sorusu üreten güvenli fonksiyon
  function generateMathSecurityProblem() {
    const num1 = Math.floor(Math.random() * 5) + 1; // 1 ile 5 arası
    const num2 = Math.floor(Math.random() * 4) + 1; // 1 ile 4 arası
    
    currentMathAnswer = num1 + num2; // Doğru sonuç
    enteredMathInput = '';
    
    if (launchPinDisplay) {
      launchPinDisplay.textContent = `Soru: ${num1} + ${num2} = ?`;
    }
    if (mathInputDisplay) {
      mathInputDisplay.textContent = '_';
    }
  }

  // İlk açılışta soruyu üret
  generateMathSecurityProblem();

// Tuş takımı kontrolü ve ekran güncellemesi
  document.querySelectorAll('.launch-key-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const digit = btn.textContent.trim();
      
      // 2 haneden uzun olmasını engelleyelim (toplama sonucu en fazla iki hanelidir)
      if (enteredMathInput.length < 2) {
        enteredMathInput += digit;
        
        // Ekranda girilen rakamı göster
        if (mathInputDisplay) {
          mathInputDisplay.textContent = enteredMathInput;
        }

        if (soundEnabled) AudioEngine.playTone(432, 0.1);

        const userResult = parseInt(enteredMathInput, 10);

        // Kullanıcının girdiği sonuç doğru cevapla eşleşirse
        if (userResult === currentMathAnswer) {
          if (soundEnabled) AudioEngine.playSuccess();
          if (appLaunchOverlay) appLaunchOverlay.classList.add('unlocked');
        } 
        // Yanlış bir değer girildiyse veya sonuç aşıldıysa
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

  // 4. DUYGU AYNASI VISUAL CHARACTER MIRROR SYSTEM
  let targetEmotion = { name: 'Mutlu', emoji: '😊' };

  function setVisualEmotionMirror(emotion) {
    targetEmotion = emotion;
    const mirrorFace = document.getElementById('mirror-face-img');
    const mirrorEmoji = document.getElementById('mirror-expression-emoji');
    const mirrorPrompt = document.getElementById('mirror-prompt-text');

    if (mirrorFace) {
      mirrorFace.style.transform = 'scale(1.15) rotate(3deg)';
      setTimeout(() => mirrorFace.style.transform = 'scale(1)', 300);
    }
    if (mirrorEmoji) mirrorEmoji.textContent = emotion.emoji;
    if (mirrorPrompt) mirrorPrompt.textContent = `Piko'nun ${emotion.emoji} yüz ifadesini aşağıdaki butonlarla eşleştir!`;
  }

  // 5. SIRALA BUL (KÜÇÜKTEN BÜYÜĞE) SHUFFLED INITIAL ORDER & INTERACTIVE REORDERING LOGIC
  let siralaItemsData = [];
  let selectedSiralaItem = null;

  function initSiralaBulGame() {
    const siralaGrid = document.getElementById('sirala-grid');
    if (!siralaGrid) return;

    // Define 4 items with distinct sizes
    const baseItems = [
      { id: 1, label: '🍎', sizePx: 26, title: 'En Küçük' },
      { id: 2, label: '🍎', sizePx: 36, title: 'Küçük' },
      { id: 3, label: '🍎', sizePx: 46, title: 'Orta' },
      { id: 4, label: '🍎', sizePx: 58, title: 'En Büyük' }
    ];

    // SHUFFLE the items randomly every time so they NEVER load pre-sorted!
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

      // Drag and Drop Swap
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
          // Swap positions in array
          const temp = siralaItemsData[fromIdx];
          siralaItemsData[fromIdx] = siralaItemsData[toIdx];
          siralaItemsData[toIdx] = temp;
          if (soundEnabled) AudioEngine.playTone(600);
          renderSiralaGrid();
          checkSiralaSuccess();
        }
      });

      // Click to Swap fallback
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
    // Check if ids are strictly sorted 1, 2, 3, 4
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
    const missingIndices = [2, 5]; // Right-most pieces missing

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
        
        // Piko'nun somut neden açıklaması (Pedagojik katman)
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

  // 8. DYNAMIC AGE LEVEL SYSTEM & INSTANT MINI-GAME RENDERER
  const ageConfig = {
    '3': {
      badge: '3 Yaş (Minik Keşifçiler)',
      duyguDesc: 'Görsel duygu ifadeleri (Mutlu, Üzgün, Şaşırmış) ve jest eşleştirme.',
      beceriDesc: 'Karışık yüklenen Sırala Bul ve gerçek resim parçalı Piko yapbozları.',
      ozbakimDesc: 'Sürükle-bırak Diş Fırçalama ve hava durumuna göre kıyafet eşleştirme.',
      dogaDesc: 'Zıt mevsimler ve sürükle-bırak sulama ile görsel bitki büyütme.',
      emotions: [
        { label: '😊 Mutlu', name: 'Mutlu', emoji: '😊' },
        { label: '😢 Üzgün', name: 'Üzgün', emoji: '😢' },
        { label: '😲 Şaşırmış', name: 'Şaşırmış', emoji: '😲' }
      ],
      scenario: 'Piko dondurmasını yere düşürdü. Ne hissediyor?',
      scenarioChoices: ['😢 Üzüldü (Ona sarılalım)', '😊 Mutlu oldu'],
      weatherOptions: ['☀️ Güneşli (T-shirt)', '🌧️ Yağmurlu (Yağmurluk)']
    },
    '4-5': {
      badge: '4-5 Yaş (Meraklı Filizler)',
      duyguDesc: 'Görsel 4 duygu ifadesi (Mutlu, Üzgün, Kızgın, Heyecanlı) ve empati senaryoları.',
      beceriDesc: 'Karışık Sırala Bul (küçükten büyüğe) ve 6 parçalı gerçek resim yapbozları.',
      ozbakimDesc: 'Sürükle-bırak fırçalama ve 4 mevsim kıyafet giydirme.',
      dogaDesc: '4 mevsim ipucu analizi ve sürükle-bırak sulama-güneş dengesi.',
      emotions: [
        { label: '😊 Mutlu', name: 'Mutlu', emoji: '😊' },
        { label: '😢 Üzgün', name: 'Üzgün', emoji: '😢' },
        { label: '😡 Kızgın', name: 'Kızgın', emoji: '😡' },
        { label: '🤩 Heyecanlı', name: 'Heyecanlı', emoji: '🤩' }
      ],
      scenario: 'Piko en sevdiği oyuncağını bulamıyor. Nasıl hissediyor ve ne yapmalıyız?',
      scenarioChoices: ['🔍 Birlikte arayalım (Heyecanlı keşif)', '😡 Kızıp oyuncağı kıralım'],
      weatherOptions: ['☀️ Güneşli (Şapka & T-shirt)', '🌧️ Yağmurlu (Yağmurluk & Çizme)', '❄️ Karlı (Mont & Bere)']
    },
    '6+': {
      badge: '6+ Yaş (Bilge Çiçekler)',
      duyguDesc: 'Görsel 6 zengin duygu ifadesi (Gururlu, Utanmış, Kaygılı, Sakin vb.).',
      beceriDesc: 'Karışık sıralama oyunları ve detaylı zeka yapbozları.',
      ozbakimDesc: 'Sürükle-bırak hijyen ve çoklu mevsim kombinasyon giydirme.',
      dogaDesc: 'Çoklu canlı türü, sulama ve güneş dengesi ekolojisi.',
      emotions: [
        { label: '😊 Mutlu', name: 'Mutlu', emoji: '😊' },
        { label: '😢 Üzgün', name: 'Üzgün', emoji: '😢' },
        { label: '😎 Gururlu', name: 'Gururlu', emoji: '😎' },
        { label: '😰 Kaygılı', name: 'Kaygılı', emoji: '😰' },
        { label: '😌 Sakin', name: 'Sakin', emoji: '😌' },
        { label: '😳 Utanmış', name: 'Utanmış', emoji: '😳' }
      ],
      scenario: 'Piko sahnede şarkı söylerken sözleri unuttu. Ona nasıl destek oluruz?',
      scenarioChoices: ['👏 Alkışlayarak cesaret verelim', '🙈 Gülüp gidelim'],
      weatherOptions: ['☀️ Güneşli (Güneş Gözlüğü & Şapka)', '🌧️ Yağmurlu (Şemsiye & Yağmurluk)', '❄️ Karlı (Mont, Eldiven & Bere)']
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

    // Set Visual Emotion Mirror target
    setVisualEmotionMirror(cfg.emotions[0]);

    // Render Duygu Aynası options (Yaşa göre duygu sayısı değişir)
    const emotionBox = document.getElementById('duygu-mirror-options');
    if (emotionBox) {
      emotionBox.innerHTML = cfg.emotions.map(e => 
        `<button class="btn-icon-pill emo-opt-btn" style="padding: 0.4rem 0.8rem;">${e.label}</button>`
      ).join('');

      emotionBox.querySelectorAll('.emo-opt-btn').forEach((btn, i) => {
        btn.addEventListener('click', () => {
          const selectedEmotion = cfg.emotions[i];
          setVisualEmotionMirror(selectedEmotion);
          if (soundEnabled) AudioEngine.playSuccess();

          if (selectedEmotion.label.toLowerCase().includes('kızgın') || 
              selectedEmotion.label.toLowerCase().includes('üzgün') || 
              selectedEmotion.label.toLowerCase().includes('korku')) {
            alert(`🌱 Piko şu an ${selectedEmotion.label} hissediyor. Gel birlikte derin bir nefes alıp çiçek koklayalım ve yavaşça üfleyelim, minik kalbimiz sakinleşsin.`);
          } else {
            alert(`Harika! Piko da şu an ${selectedEmotion.label} hissediyor!`);
          }
        });
      });
    }

    // Render Piko'nun Günü scenario
    const scenarioText = document.getElementById('duygu-scenario-text');
    const scenarioChoices = document.getElementById('duygu-scenario-choices');
    if (scenarioText && scenarioChoices) {
      scenarioText.textContent = cfg.scenario;
      scenarioChoices.innerHTML = cfg.scenarioChoices.map(c => 
        `<button class="btn-icon-pill" style="justify-content: flex-start; text-align: left; padding: 0.45rem 0.8rem;">${c}</button>`
      ).join('');

      scenarioChoices.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          if (soundEnabled) AudioEngine.playSuccess();
          alert("Tebrikler! Empatili harika bir çözüm buldun!");
        });
      });
    }

    // INITIALIZE SHUFFLED SIRALA BUL GAME (Yaşa göre eleman sayısı uyarlanabilir)
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
          alert(`Doğru! ${btn.textContent} mevsimini keşfettin!`);
        });
      });
    }

    // Initialize Real Cut Image Puzzle with Age Level
    initRealImagePuzzle(level);

    // Render Hava Durumu Giydirme (Yaşa göre seçenek sayısı değişir)
    const dressContainer = document.getElementById('dress-options-grid');
    if (dressContainer) {
      dressContainer.innerHTML = cfg.weatherOptions.map(opt => 
        `<button class="btn-icon-pill dress-opt-btn">${opt}</button>`
      ).join('');

      dressContainer.querySelectorAll('.dress-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (soundEnabled) AudioEngine.playSuccess();
          alert(`Piko ${btn.textContent} giydi ve hazır!`);
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

  // 9. MODAL TRIGGERS FOR THE 4 CORNERS
  document.getElementById('card-duygu')?.addEventListener('click', () => {
    updateAgeSystem(currentAgeLevel);
    document.getElementById('modal-duygu-corner')?.classList.add('active');
    if (soundEnabled) AudioEngine.playTone(600);
  });

  document.getElementById('card-beceri')?.addEventListener('click', () => {
    updateAgeSystem(currentAgeLevel);
    initSiralaBulGame(); // Ensure shuffled reload
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

  // 10. DYNAMIC SECURITY PIN GENERATOR FOR PARENT CORNER
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

  if (parentBtn) {
    parentBtn.addEventListener('click', () => {
      generateNewPin();
      enteredPin = '';
      updatePinDots();
      if (pinErrorMsg) pinErrorMsg.textContent = '';
      if (pinView) pinView.style.display = 'flex';
      if (parentDashboardView) parentDashboardView.style.display = 'none';
      if (parentModal) parentModal.classList.add('active');
      if (soundEnabled) AudioEngine.playTone(500);
    });
  }

  function updatePinDots() {
    pinDots.forEach((dot, idx) => {
      if (dot) dot.style.background = idx < enteredPin.length ? '#FF7043' : '#DDD';
    });
  }

  document.querySelectorAll('.keypad-btn:not(.launch-key-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
      if (enteredPin.length < 4) {
        enteredPin += btn.textContent.trim();
        updatePinDots();
        if (soundEnabled) AudioEngine.playTone(600, 0.1);

        if (enteredPin.length === 4) {
          if (enteredPin === currentDynamicPin) {
            if (soundEnabled) AudioEngine.playSuccess();
            if (pinView) pinView.style.display = 'none';
            if (parentDashboardView) parentDashboardView.style.display = 'flex';
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

  // Modal Close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.piko-modal');
      if (modal) modal.classList.remove('active');
    });
  });

// --- EBEVEYN PANELİ SEKMELERİNİN KUSURSUZ YÖNETİMİ ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Tüm butonlardan ve panellerden active sınıfını kaldır
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      // Tıklanan sekmeyi ve ilgili paneli aktif yap
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) {
        target.classList.add('active');
      }
      
      if (soundEnabled) AudioEngine.playTone(550);
    });
  });

  // Sayfa açıldığında ilk sekmenin aktif olduğundan emin ol
  if (tabPanes.length > 0 && !document.querySelector('.tab-pane.active')) {
    tabPanes[0].classList.add('active');
  }

  // Force Sleep Test Button in Parent Panel
  const btnForceSleep = document.getElementById('btn-force-sleep');
  if (btnForceSleep) {
    btnForceSleep.addEventListener('click', () => {
      if (parentModal) parentModal.classList.remove('active');
      sunProgress = 100;
      updateSunPosition();
    });
  }

  // Sayfa açıldığında ilk sekmenin aktif olduğundan emin ol
  if (tabPanes.length > 0 && !document.querySelector('.tab-pane.active')) {
    tabPanes[0].classList.add('active');
  }

 // Time Option Buttons in Parent Panel
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
});
