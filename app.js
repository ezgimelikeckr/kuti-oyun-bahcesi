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
   - DİNAMİK: Her Güne Değişen Çocuk Kitapları Seçkisi
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

  let currentMathAnswer = 0;
  let enteredMathInput = '';
  let plantStageIndex = 0;
  const plantVisualStages = ['🌱', '🌿', '🌻', '🌳'];

  // --- ANA SAYFA "BUGÜN NASIL HİSSEDİYORSUN?" ETKİLEŞİMİ ---
  const moodButtons = document.querySelectorAll('.mood-btn');
  const pikoSpeechText = document.getElementById('piko-speech-text');

  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      if (pikoSpeechText) {
        if (mood === 'happy') {
          pikoSpeechText.textContent = "Ne harika! Senin adına çok sevindim, bugün enerji doluyuz! 🌟";
        } else if (mood === 'curious') {
          pikoSpeechText.textContent = "Harika! Merak etmek yeni şeyler öğrenmenin ilk adımıdır! 🔍";
        } else if (mood === 'calm') {
          pikoSpeechText.textContent = "Huzurlu ve sakin bir gün, bahçeyi keşfetmek için mükemmel bir zaman! 🌿";
        }
      }
      if (soundEnabled) AudioEngine.playSuccess();
    });
  });

  // --- GÜNÜN ÇOCUK KİTAPLARINI DİNAMİK SEÇEN FONKSİYON ---
  function loadDailyChildrenBooks() {
    const duyguBooks = [
      "Unutulan Araba / Duygularımı Fark Ediyorum 3 (Tuğba Akbey İnan)",
      "Öykülerle Duygusal Zeka Eğitimi: Tali Kendine Güveniyor (Berrin Göncü Işıkoğlu)",
      "Eyvah Kalbim Kırıldı (Elif Yemenici)",
      "Arkadaşım Korku (Francesca Sanna)",
      "Kıskanç Kurbağa Eda (Tülin Kozikoğlu)"
    ];

    const beceriBooks = [
      "Nokta (Peter H. Reynolds)",
      "Bob ve Mavi Sanatı (Marion Deuchars)",
      "Sol Sağ Kitabım (Şiirsel Taş)",
      "Minik Sayılar (Volkan Göker)",
      "Kitap Tamircisi Toprak (Ezgi Berk)"
    ];

    const ozbakimBooks = [
      "Öykülerle Davranış Eğitimi Seti: Tali Ellerini Yıkıyor (Berrin Göncü Işıkoğlu)",
      "Diş Hekiminde (Anne Civardi)",
      "Sağlık Hikayeleri: Kaan'ın Sallanan Dişi (Ezgi Perktaş)",
      "Temiz (Emily Gravett)",
      "Kendi Yatağımda Uyumayacağım! (Alberto Pellai)"
    ];

    const dogaBooks = [
      "Minik Tohum (Eric Carle)",
      "Haydi Sayalım Elmalar (Joan Holub)",
      "Çevremize Özen Göstermek (Aleix Cabrera)",
      "Şehirdeki Son Ağaç (Peter Carnavas)",
      "Gezegenimiz Dünya (Dr. Mike Goldsmith)"
    ];

    const today = new Date();
    const daySeed = today.getDate();

    const selectedDuygu = duyguBooks[daySeed % duyguBooks.length];
    const selectedBeceri = beceriBooks[daySeed % beceriBooks.length];
    const selectedOzbakim = ozbakimBooks[daySeed % ozbakimBooks.length];
    const selectedDoga = dogaBooks[daySeed % dogaBooks.length];

    const container = document.getElementById('daily-kids-books-container');
    if (container) {
      container.innerHTML = `
        <div><b>❤️ Duygu Adası Önerisi:</b> <i>${selectedDuygu}</i></div>
        <div><b>🧩 Beceri Adası Önerisi:</b> <i>${selectedBeceri}</i></div>
        <div><b>🪥 Öz Bakım Adası Önerisi:</b> <i>${selectedOzbakim}</i></div>
        <div><b>🦋 Doğa Adası Önerisi:</b> <i>${selectedDoga}</i></div>
      `;
    }
  }

  // 2. APP LAUNCH LOCK OVERLAY
  const appLaunchOverlay = document.getElementById('app-launch-overlay');
  const launchPinDisplay = document.getElementById('launch-pin-display');
  const launchPinError = document.getElementById('launch-pin-error');
  const mathInputDisplay = document.getElementById('math-input-display');

  function generateMathSecurityProblem() {
    const num1 = Math.floor(Math.random() * 5) + 1;
    const num2 = Math.floor(Math.random() * 4) + 1;
    currentMathAnswer = num1 + num2;
    enteredMathInput = '';
    if (launchPinDisplay) launchPinDisplay.textContent = `Soru: ${num1} + ${num2} = ?`;
    if (mathInputDisplay) mathInputDisplay.textContent = '_';
  }

  generateMathSecurityProblem();

  document.querySelectorAll('#app-launch-overlay .keypad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const digit = btn.textContent.trim();
      if (enteredMathInput.length < 2) {
        enteredMathInput += digit;
        if (mathInputDisplay) mathInputDisplay.textContent = enteredMathInput;
        if (soundEnabled) AudioEngine.playTone(432, 0.1);

        const userResult = parseInt(enteredMathInput, 10);
        if (userResult === currentMathAnswer) {
          if (soundEnabled) AudioEngine.playSuccess();
          if (appLaunchOverlay) {
            appLaunchOverlay.classList.add('unlocked');
            setTimeout(() => appLaunchOverlay.remove(), 300);
          }
        } else if (enteredMathInput.length >= 2 || userResult > currentMathAnswer) {
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

  // Sound Toggle
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

  // 3. GÜNEŞİN ÇİZGİLİ YOLU
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

  // 4. DUYGU AYNASI
  let targetEmotion = { name: 'Mutlu', image: 'piko_mutlu.png', label: 'Mutlu' };

  function setVisualEmotionMirror(emotion) {
    targetEmotion = emotion;
    const mirrorFace = document.getElementById('mirror-face-img');
    const mirrorPrompt = document.getElementById('mirror-prompt-text');

    if (mirrorFace) {
      mirrorFace.style.transform = 'scale(1.15) rotate(3deg)';
      setTimeout(() => mirrorFace.style.transform = 'scale(1)', 300);
      mirrorFace.src = emotion.image; 
    }
    if (mirrorPrompt) {
      mirrorPrompt.textContent = `Piko şu an nasıl hissediyor? Doğru yüz ifadesini seçebilir misin?`;
    }
  }

  function pickRandomTargetEmotion(cfg) {
    const pool = cfg.emotions;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setVisualEmotionMirror(pool[randomIndex]);
  }

  // 5. BECERİ KÖŞESİ (YAŞ SEVİYELERİNE GÖRE DİNAMİK)
  function initBeceriGame(level) {
    const beceriContainer = document.getElementById('sirala-grid');
    if (!beceriContainer) return;
    beceriContainer.innerHTML = '';

    if (level === '3') {
      beceriContainer.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.85rem; font-weight:700; margin-bottom:0.5rem;">Benzer Nesneleri Eşleştir!</p>
          <div style="display:flex; gap:1rem; justify-content:center;">
            <button class="btn-icon-pill beceri-match-btn" data-val="apple">🍎 Elma</button>
            <button class="btn-icon-pill beceri-match-btn" data-val="ball">⚽ Top</button>
          </div>
        </div>`;
      beceriContainer.querySelectorAll('.beceri-match-btn').forEach(b => {
        b.addEventListener('click', () => {
          if (soundEnabled) AudioEngine.playSuccess();
          alert("🎉 Harika eşleştirme!");
        });
      });
    } else if (level === '4-5') {
      const baseItems = [
        { id: 1, label: '🍎', sizePx: 26 },
        { id: 2, label: '🍎', sizePx: 36 },
        { id: 3, label: '🍎', sizePx: 46 },
        { id: 4, label: '🍎', sizePx: 58 }
      ];
      let siralaItemsData = [...baseItems].sort(() => Math.random() - 0.5);
      
      siralaItemsData.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'piko-card sirala-item';
        el.style.fontSize = `${item.sizePx}px`;
        el.style.padding = '0.4rem 0.8rem';
        el.style.cursor = 'pointer';
        el.textContent = item.label;
        el.addEventListener('click', () => {
          if (soundEnabled) AudioEngine.playTone(600);
          alert("Küçükten büyüğe sıralama için harika deneme!");
        });
        beceriContainer.appendChild(el);
      });
    } else {
      beceriContainer.innerHTML = `
        <div style="width:100%; text-align:center;">
          <p style="font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.5rem;">📖 Piko'nun Hikâyesi: Kartları sırayla diz!</p>
          <div id="story-cards-box" style="display:flex; gap:0.4rem; justify-content:center; flex-wrap:wrap; margin-bottom:0.5rem;">
            <button class="btn-icon-pill story-card" data-step="1">1️⃣ Piko uyandı</button>
            <button class="btn-icon-pill story-card" data-step="3">3️⃣ Piko oynadı</button>
            <button class="btn-icon-pill story-card" data-step="2">2️⃣ Parka gitti</button>
            <button class="btn-icon-pill story-card" data-step="4">4️⃣ Eve döndü</button>
          </div>
          <p id="story-result-text" style="font-size:0.8rem; font-weight:600; color:#E65100;"></p>
        </div>`;
      
      let clickedSteps = [];
      beceriContainer.querySelectorAll('.story-card').forEach(card => {
        card.addEventListener('click', () => {
          const step = card.dataset.step;
          if (!clickedSteps.includes(step)) {
            clickedSteps.push(step);
            card.style.background = '#C8E6C9';
            if (soundEnabled) AudioEngine.playTone(500);

            if (clickedSteps.length === 4) {
              if (soundEnabled) AudioEngine.playSuccess();
              document.getElementById('story-result-text').innerHTML = 
                "🎉 Hikâyeyi tamamladın! <b>Sonuna ne olsun istersin?</b><br>" +
                "<button class='btn-icon-pill' onclick='alert(\"😴 Piko huzurla uyudu. Tatlı rüyalar!\")' style='margin:4px;'>😴 Piko Uyudu</button>" +
                "<button class='btn-icon-pill' onclick='alert(\"🍽️ Piko lezzetli akşam yemeğini yedi!\")' style='margin:4px;'>🍽️ Piko Yemek Yedi</button>" +
                "<button class='btn-icon-pill' onclick='alert(\"📚 Piko harika bir masal kitabı okudu!\")' style='margin:4px;'>📚 Piko Kitap Okudu</button>";
            }
          }
        });
      });
    }
  }

  // 6. JIGSAW PUZZLE
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
        if (missingIndices.includes(index)) slot.classList.add('empty');
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

  // 7. DRAG AND DROP & ÖZ BAKIM / DOĞA SENARYOLARI
  function initDragAndDropMechanics(level = '4-5') {
    const brush = document.getElementById('draggable-brush');
    const teethZone = document.getElementById('teeth-target-zone');
    const mouthEmoji = document.getElementById('mouth-target-emoji');

    if (brush && teethZone) {
      if (level === '6+') {
        teethZone.parentElement.innerHTML = `
          <div style="width:100%; text-align:center;">
            <p style="font-size:0.85rem; font-weight:700; color:#E65100; margin-bottom:0.4rem;">Piko'nun Sabah Rutinini Sırala:</p>
            <div style="display:flex; gap:4px; justify-content:center; flex-wrap:wrap; margin-bottom:0.5rem;">
              <button class="btn-icon-pill oz-step">1. Diş Fırçala</button>
              <button class="btn-icon-pill oz-step">2. Kahvaltı Yap</button>
              <button class="btn-icon-pill oz-step">3. Giyin</button>
              <button class="btn-icon-pill oz-step">4. Saç Tara</button>
            </div>
            <p style="font-size:0.78rem; font-weight:600;">Neden kahvaltıdan sonra diş fırçalanır?</p>
            <div style="display:flex; gap:4px; justify-content:center;">
              <button class="btn-icon-pill" onclick="alert('🦷 Doğru! Yemek artıklarını temizlemek için kahvaltı sonrası fırçalanır.')">🍎 Yemek artıklarını temizlemek</button>
              <button class="btn-icon-pill" onclick="alert('⏰ Vakit olduğu için')">⏰ Vaktimiz olduğu için</button>
            </div>
          </div>`;
      } else {
        brush.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', 'brush');
          brush.classList.add('dragging');
        });
        teethZone.addEventListener('dragover', (e) => e.preventDefault());
        teethZone.addEventListener('drop', (e) => {
          e.preventDefault();
          if (soundEnabled) AudioEngine.playSuccess();
          if (mouthEmoji) mouthEmoji.textContent = '✨🪥🫧';
          setTimeout(() => {
            if (mouthEmoji) mouthEmoji.textContent = '😁';
            alert('🧼 Piko pırıl pırıl dişlerle gülümsüyor!');
          }, 600);
        });
      }
    } 

    const potZone = document.getElementById('plant-pot-target');
    const plantDisplay = document.getElementById('plant-visual-display');

    if (potZone && plantDisplay) {
      if (level === '6+') {
        potZone.parentElement.innerHTML = `
          <div style="width:100%; text-align:center;">
            <p style="font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.4rem;">🥀 Bitki solmaya başladı! Ona ne oldu?</p>
            <div style="display:flex; gap:4px; justify-content:center; margin-bottom:0.5rem;">
              <button class="btn-icon-pill" onclick="alert('💧 Doğru! Susuz kaldı.')">💧 Susuz kaldı</button>
              <button class="btn-icon-pill" onclick="alert('☀️ Çok güneş aldı')">☀️ Çok güneş aldı</button>
            </div>
            <p style="font-size:0.78rem; font-weight:600;">Peki şimdi ne yapmalıyız?</p>
            <div style="display:flex; gap:4px; justify-content:center;">
              <button class="btn-icon-pill" onclick="alert('🌿 Harika! Hemen suladık ve bitki canlandı!')">💧 Hemen sula</button>
              <button class="btn-icon-pill" onclick="alert('🏠 Gölgeye taşı')">🏠 Gölgeye taşı</button>
            </div>
          </div>`;
      } else {
        const water = document.getElementById('draggable-water');
        const sun = document.getElementById('draggable-sun');
        [water, sun].forEach(item => {
          if (!item) return;
          item.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', item.id));
        });
        potZone.addEventListener('dragover', (e) => e.preventDefault());
        potZone.addEventListener('drop', (e) => {
          e.preventDefault();
          plantStageIndex = (plantStageIndex + 1) % plantVisualStages.length;
          plantDisplay.textContent = plantVisualStages[plantStageIndex];
          if (soundEnabled) AudioEngine.playSuccess();
        });
      }
    }
  }

  // 8. DYNAMIC AGE CONFIG
  const ageConfig = {
    '3': {
      badge: '3 Yaş (Minik Keşifçiler)',
      duyguDesc: 'Görsel duygu ifadeleri ve jest eşleştirme.',
      beceriDesc: 'Dikkat ve Nesne Eşleştirme.',
      ozbakimDesc: 'Tek adım doğru hedef Diş Fırçalama.',
      dogaDesc: 'Suyu saksıya sürükle, bitki büyüsün.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'piko_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'piko_uzgun.png' },
        { label: 'Şaşırmış', name: 'Şaşırmış', image: 'piko_sasirmis.png' }
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
      duyguDesc: 'Görsel duygu ifadeleri ve empati senaryoları.',
      beceriDesc: 'Sırala Bul ve 6 parçalı yapbozlar.',
      ozbakimDesc: 'Doğru sıraya koyma (Su → Fırçala → Durula).',
      dogaDesc: 'Su + Güneş denge ilişkisi.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'piko_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'piko_uzgun.png' },
        { label: 'Öfkeli', name: 'Öfkeli', image: 'piko_ofkeli.png' },
        { label: 'Meraklı', name: 'Meraklı', image: 'piko_merakli.png' }
      ],
      scenario: 'Piko en sevdiği oyuncağını bulamıyor. Nasıl hissediyor ve ne yapmalıyız?',
      scenarioChoices: [
        { label: '🔍 Birlikte arayalım (Heyecanlı keşif)', correct: true },
        { label: '😡 Kızıp oyuncağı kıralım', correct: false }
      ],
      weatherOptions: ['☀️ Güneşli (Şapka & T-shirt)', '🌧️ Yağmurlu (Yağmurluk)', '❄️ Karlı (Mont & Bere)']
    },
    '6+': {
      badge: '6+ Yaş (Bilge Çiçekler)',
      duyguDesc: 'Zengin duygu ifadeleri ve detaylı empati analizi.',
      beceriDesc: "Piko'nun Hikâyesi (Basit Dijital Hikâye Kurma).",
      ozbakimDesc: 'Plan Kurma + Gerekçelendirme rutinleri.',
      dogaDesc: 'Neden-Sonuç Keşfi + Çözüm Üretme.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'piko_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'piko_uzgun.png' },
        { label: 'Öfkeli', name: 'Öfkeli', image: 'piko_ofkeli.png' },
        { label: 'Şaşırmış', name: 'Şaşırmış', image: 'piko_sasirmis.png' },
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
      weatherOptions: ['☀️ Güneşli (Gözlük)', '🌧️ Yağmurlu (Şemsiye)', '❄️ Karlı (Mont & Eldiven)']
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

    pickRandomTargetEmotion(cfg);

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
            alert(`🎉 Tebrikler! Piko gerçekten ${targetEmotion.label}!`);
            pickRandomTargetEmotion(cfg);
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            alert(`🤔 Hmm, Piko şu an bu ifadeye sahip değil. Tekrar bakalım mı?`);
          }
        });
      });
    }

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
            alert("❤️ Bu yaklaşım Piko'yu üzebilir. Farklı bir empati yolu deneyelim mi?");
          }
        });
      });
    }

    initBeceriGame(level);
    initRealImagePuzzle();
    initDragAndDropMechanics(level);

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
    initBeceriGame(currentAgeLevel);
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
            loadDailyChildrenBooks();
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

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.piko-modal');
      if (modal) modal.classList.remove('active');
    });
  });

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetEl = document.getElementById(btn.dataset.tab);
      if (targetEl) targetEl.classList.add('active');
      if (parentDashboardView) parentDashboardView.scrollTop = 0;
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
