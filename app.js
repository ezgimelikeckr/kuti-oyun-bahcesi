/* ==========================================================================
   PIKO CHILD EDUCATION DASHBOARD - COMPLETE PEDAGOGICAL REFINEMENT
   - 3 Yaş: Ses yok, Saf Görsel/Dokunma tabanlı mini oyunlar ve reaksiyonlar
   - 4-5 Yaş: Sıralama, Neden-Sonuç, Hikâye Sırası ve Storyboard Akışları
   - 6 Yaş: Planlama, Çözüm Üretme, Sebep-Sonuç İlişkisi ve Gerekçelendirme Soruları
   - DİNAMİK & RASTGELE: Her Girişte Değişen Doğa/Mevsim ve Günlük Çocuk Kitapları Seçkisi
   - DİNAMİK YAPI: Yaşlara Göre Ölçekli Dinamik Jigsaw Yapboz ve İnteraktif Sırala Bul
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

  // --- BECERİ KÖŞESİ MOTORU (YAŞA GÖRE DİNAMİK) ---
  function initBeceriGame(level) {
    const siralaContainer = document.getElementById('sirala-grid');
    const siralaPrompt = document.getElementById('sirala-prompt');
    const puzzleContainer = document.getElementById('puzzle-board-grid')?.closest('div');

    if (!siralaContainer) return;

    if (level === '3') {
      if (siralaPrompt) siralaPrompt.textContent = "Aynı renk balonları yan yana getir:";
      if (puzzleContainer) puzzleContainer.style.display = 'none';
      siralaContainer.innerHTML = `
        <div style="display:flex; gap:0.75rem; justify-content:center; width:100%;">
          <button class="btn-icon-pill" style="background:#FFCDD2;" onclick="if(soundEnabled)AudioEngine.playSuccess();alert('🎈 Kırmızı balon eşleşti!')">🎈 Kırmızı</button>
          <button class="btn-icon-pill" style="background:#FFF9C4;" onclick="if(soundEnabled)AudioEngine.playSuccess();alert('🎈 Sarı balon eşleşti!')">🎈 Sarı</button>
          <button class="btn-icon-pill" style="background:#B3E5FC;" onclick="if(soundEnabled)AudioEngine.playSuccess();alert('🎈 Mavi balon eşleşti!')">🎈 Mavi</button>
        </div>`;
    } else if (level === '4-5') {
      if (puzzleContainer) puzzleContainer.style.display = 'block';
      if (siralaPrompt) siralaPrompt.textContent = "Nesneleri küçükten büyüğe sırala!";
      
      const baseItems = [
        { id: 1, label: '🍎', sizePx: 26 },
        { id: 2, label: '🍎', sizePx: 36 },
        { id: 3, label: '🍎', sizePx: 46 },
        { id: 4, label: '🍎', sizePx: 58 }
      ];
      let siralaItemsData = [...baseItems].sort(() => Math.random() - 0.5);
      let selectedIdx = null;

      function renderSirala() {
        siralaContainer.innerHTML = '';
        siralaItemsData.forEach((item, index) => {
          const el = document.createElement('div');
          el.className = 'piko-card sirala-item';
          el.style.fontSize = `${item.sizePx}px`;
          el.style.padding = '0.4rem 0.8rem';
          el.style.cursor = 'pointer';
          el.style.border = selectedIdx === index ? '3px solid #FF9800' : '2px solid transparent';
          el.textContent = item.label;

          el.addEventListener('click', () => {
            if (selectedIdx === null) {
              selectedIdx = index;
              if (soundEnabled) AudioEngine.playTone(500);
              renderSirala();
            } else {
              const temp = siralaItemsData[selectedIdx];
              siralaItemsData[selectedIdx] = siralaItemsData[index];
              siralaItemsData[index] = temp;
              selectedIdx = null;
              if (soundEnabled) AudioEngine.playTone(700);
              renderSirala();
              
              if (siralaItemsData.every((itm, idx) => itm.id === idx + 1)) {
                if (soundEnabled) AudioEngine.playSuccess();
                setTimeout(() => alert("🎉 Tebrikler! Elmaları küçükten büyüğe harika sıraladın!"), 100);
              }
            }
          });
          siralaContainer.appendChild(el);
        });
      }
      renderSirala();
      initRealImagePuzzle('4-5');

    } else {
      if (puzzleContainer) puzzleContainer.style.display = 'block';
      if (siralaPrompt) siralaPrompt.textContent = "Piko'nun Hikâyesi: Kartları sırayla diz!";
      
      siralaContainer.innerHTML = `
        <div style="width:100%; text-align:center;">
          <div id="story-cards-box" style="display:flex; gap:0.4rem; justify-content:center; flex-wrap:wrap; margin-bottom:0.5rem;">
            <button class="btn-icon-pill story-card" data-step="1">1️⃣ Piko uyandı</button>
            <button class="btn-icon-pill story-card" data-step="3">3️⃣ Piko oynadı</button>
            <button class="btn-icon-pill story-card" data-step="2">2️⃣ Parka gitti</button>
            <button class="btn-icon-pill story-card" data-step="4">4️⃣ Eve döndü</button>
          </div>
          <p id="story-result-text" style="font-size:0.8rem; font-weight:600; color:#E65100;"></p>
        </div>`;
      
      let clickedSteps = [];
      siralaContainer.querySelectorAll('.story-card').forEach(card => {
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
                "<button class='btn-icon-pill' onclick='alert(\"🍽️ Piko lezzetli akşam yemeğini yedi!\")' style='margin:4px;'>🍽️ Piko Yemek Yedi</button>";
            }
          }
        });
      });
      initRealImagePuzzle('6+');
    }
  }

  // JIGSAW PUZZLE (DİNAMİK VE HATASIZ ızgara yükseklik ayarlı)
  function initRealImagePuzzle(level) {
    const puzzleBoard = document.getElementById('puzzle-board-grid');
    const puzzleBank = document.getElementById('puzzle-piece-bank');
    if (!puzzleBoard || !puzzleBank) return;

    puzzleBoard.innerHTML = '';
    puzzleBank.innerHTML = '';

    let totalCols = 3;
    let totalRows = 2;
    let missingCount = 2;

    if (level === '3') {
      totalCols = 2;
      totalRows = 2;
      missingCount = 1;
      puzzleBoard.style.gridTemplateColumns = 'repeat(2, 1fr)';
      puzzleBoard.style.gridTemplateRows = 'repeat(2, 1fr)';
    } else if (level === '6+') {
      totalCols = 3;
      totalRows = 3;
      missingCount = 3;
      puzzleBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
      puzzleBoard.style.gridTemplateRows = 'repeat(3, 1fr)';
    } else {
      totalCols = 3;
      totalRows = 2;
      missingCount = 2;
      puzzleBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
      puzzleBoard.style.gridTemplateRows = 'repeat(2, 1fr)';
    }

    const totalSlots = totalCols * totalRows;
    let missingIndices = [];
    while (missingIndices.length < missingCount) {
      let randIdx = Math.floor(Math.random() * totalSlots);
      if (!missingIndices.includes(randIdx)) {
        missingIndices.push(randIdx);
      }
    }

    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < totalCols; c++) {
        const index = r * totalCols + c;
        const slot = document.createElement('div');
        slot.className = 'puzzle-board-slot';
        slot.dataset.slotIndex = index;
        
        const posX = totalCols > 1 ? (c / (totalCols - 1)) * 100 : 0;
        const posY = totalRows > 1 ? (r / (totalRows - 1)) * 100 : 0;
        
        slot.style.backgroundImage = "url('piko_mascot.jpg')";
        slot.style.backgroundSize = `${totalCols * 100}% ${totalRows * 100}%`;
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
      const posX = totalCols > 1 ? (c / (totalCols - 1)) * 100 : 0;
      const posY = totalRows > 1 ? (r / (totalRows - 1)) * 100 : 0;

      const piece = document.createElement('div');
      piece.className = 'puzzle-cut-piece drag-source';
      piece.draggable = true;
      piece.dataset.targetSlot = idx;
      piece.style.backgroundImage = "url('piko_mascot.jpg')";
      piece.style.backgroundSize = `${totalCols * 100}% ${totalRows * 100}%`;
      piece.style.backgroundPosition = `${posX}% ${posY}%`;

      piece.addEventListener('click', () => {
        const targetSlot = puzzleBoard.querySelector(`[data-slot-index="${idx}"]`);
        if (targetSlot && targetSlot.classList.contains('empty')) {
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

  // --- DOĞA KÖŞESİ DİNAMİK MEVSİM VE 6 YAŞ SEBEP-SONUÇ MOTORU ---
  function initDogaCornerGame(level) {
    const dogaModalBox = document.getElementById('modal-doga-corner');
    if (!dogaModalBox) return;

    const seasonsPool = [
      { season: "Sonbahar", prompt: "Ağaçların yaprakları sararıp dökülüyor. Hangi mevsimdeyiz?", weather: "🌧️ Serin ve Yağmurlu", emoji: "🍂" },
      { season: "Kış", prompt: "Hava çok soğudu, dışarıda kar yağıyor. Hangi mevsimdeyiz?", weather: "❄️ Karlı ve Soğuk", emoji: "⛄" },
      { season: "İlkbahar", prompt: "Her yer yeşerdi, çiçekler açmaya başladı. Hangi mevsimdeyiz?", weather: "🌸 Ilık ve Yağmurlu", emoji: "🌷" },
      { season: "Yaz", prompt: "Güneş pırıl pırıl parlıyor, hava çok sıcak. Hangi mevsimdeyiz?", weather: "☀️ Sıcak ve Güneşli", emoji: "🏖️" }
    ];

    const currentSeasonObj = seasonsPool[Math.floor(Math.random() * seasonsPool.length)];

    const innerBox = dogaModalBox.querySelector('.modal-content-box');
    if (innerBox) {
      innerBox.innerHTML = `
        <button class="modal-close-btn" data-close-modal>✕</button>
        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
          <span style="font-size: 1.8rem;">🌿</span>
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: #00796B;">Doğa Köşesi - Keşif Alanı</h3>
            <span style="font-size: 0.78rem; color: #004D40; font-weight: 700;">Mevsimler ve Bitki Bakımı</span>
          </div>
        </div>

        <div style="background: #E0F2F1; padding: 0.85rem; border-radius: 16px; margin-bottom: 0.75rem;">
          <h4 style="color: #004D40; margin-bottom: 0.35rem; font-size: 0.9rem;">🍂 Hangi Mevsim?</h4>
          <p style="font-size: 0.82rem; margin-bottom: 0.5rem;" id="mevsim-prompt">
            ${currentSeasonObj.emoji} ${currentSeasonObj.prompt}
          </p>
          <div id="mevsim-options" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
            <button class="btn-icon-pill mevsim-btn" data-s="Sonbahar">🍂 Sonbahar</button>
            <button class="btn-icon-pill mevsim-btn" data-s="Kış">❄️ Kış</button>
            <button class="btn-icon-pill mevsim-btn" data-s="İlkbahar">🌸 İlkbahar</button>
            <button class="btn-icon-pill mevsim-btn" data-s="Yaz">☀️ Yaz</button>
          </div>
          <div id="weather-followup-box" style="display:none; margin-top:0.5rem; padding:0.5rem; background:#FFF; border-radius:10px;">
            <p style="font-size:0.8rem; font-weight:700; color:#00796B; margin-bottom:0.3rem;">Mevsimi bildin! Peki bu mevsimde hava genellikle nasıldır?</p>
            <p style="font-size:0.82rem; font-weight:600; color:#E65100;">Doğru Hava: ${currentSeasonObj.weather}</p>
          </div>
        </div>

        <div style="background: #FFF; border: 2px solid #B2DFDB; padding: 0.85rem; border-radius: 16px; text-align: center;">
          <h4 style="color: #004D40; margin-bottom: 0.35rem; font-size: 0.92rem;">🌻 Piko'nun Bahçesi (Sebep-Sonuç İlişkisi)</h4>
          
          ${level === '6+' ? `
            <div id="doga-problem-area">
              <div style="font-size: 3.5rem; margin-bottom: 0.2rem;" id="plant-state-emoji">🥀</div>
              <p style="font-size: 0.82rem; font-weight: 700; color: #D32F2F; margin-bottom: 0.4rem;">Bitki solmaya başladı! Sebep sizce ne olabilir?</p>
              <div id="doga-step-1" style="display:flex; gap:6px; justify-content:center; margin-bottom:0.5rem;">
                <button class="btn-icon-pill" onclick="document.getElementById('doga-step-1').style.display='none'; document.getElementById('doga-step-2').style.display='block'; if(soundEnabled) AudioEngine.playSuccess();">💧 Susuz kaldı</button>
                <button class="btn-icon-pill" onclick="alert('Güneş sever ama temel ihtiyaç sudur.')">☀️ Çok güneş aldı</button>
              </div>
              
              <div id="doga-step-2" style="display:none; text-align:center;">
                <p style="font-size:0.78rem; font-weight:700; color:#00796B;">Doğru! Çözüm olarak ne yapmalıyız?</p>
                <div style="display:flex; gap:4px; justify-content:center; flex-direction:column; align-items:center;">
                  <button class="btn-icon-pill" style="width:90%;" onclick="if(soundEnabled)AudioEngine.playSuccess(); document.getElementById('doga-problem-area').innerHTML='<span style=font-size:3.5rem;>🌻</span><p style=color:#2E7D32;font-weight:bold;margin-top:0.5rem;>Harika sebep-sonuç ilişkisi! Su verdik, bitki canlandı ve yeniden açtı! 🎉</p>';">💧 Hemen sula ve canlandır</button>
                  <button class="btn-icon-pill" style="width:90%;" onclick="alert('Beklemek çiçeğin kurumasına yol açar.')">⏳ Bekle, kendi düzelir</button>
                </div>
              </div>
            </div>
          ` : `
            <p style="font-size: 0.8rem; color: #00695C; margin-bottom: 0.5rem;">Damlayı 💧 veya Güneşi ☀️ saksının üzerine bırak, bitkinin büyümesini izle!</p>
            <div style="font-size: 3rem;" id="plant-visual-display">🌱</div>
          `}
        </div>`;

      innerBox.querySelectorAll('.mevsim-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedSeason = btn.dataset.s;
          if (selectedSeason === currentSeasonObj.season) {
            if (soundEnabled) AudioEngine.playSuccess();
            alert(`🎉 Tebrikler! Doğru mevsim: ${currentSeasonObj.season}`);
            document.getElementById('weather-followup-box').style.display = 'block';
            btn.style.background = '#C8E6C9';
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            alert(`🤔 Tekrar düşünelim, ipucuna dikkat edelim.`);
          }
        });
      });
    }
  }

  // --- ÖZ BAKIM 6 YAŞ SEBEP-SONUÇ MOTORU ---
  function initDragAndDropMechanics(level = '4-5') {
    const teethZone = document.getElementById('teeth-target-zone');
    if (teethZone) {
      if (level === '6+') {
        teethZone.parentElement.innerHTML = `
          <div style="width:100%; text-align:center;">
            <p style="font-size:0.85rem; font-weight:700; color:#E65100; margin-bottom:0.4rem;">Piko'nun Sabah Rutini Sırala:</p>
            <div id="ozbakim-step-1" style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap; margin-bottom:0.5rem;">
              <button class="btn-icon-pill" onclick="alert('Önce karnımızı doyurmalıyız, kahvaltıdan sonra diş fırçalayalım! 🍳')">1. Diş Fırçala</button>
              <button class="btn-icon-pill" onclick="document.getElementById('ozbakim-step-1').style.display='none'; document.getElementById('ozbakim-step-2').style.display='block'; if(soundEnabled) AudioEngine.playSuccess();">2. Kahvaltı Yap</button>
            </div>
            
            <div id="ozbakim-step-2" style="display:none; text-align:center;">
              <p style="font-size:0.78rem; font-weight:700; color:#D32F2F;">Harika! Şimdi kahvaltı bitti. Neden hemen ardından diş fırçalamalıyız?</p>
              <div style="display:flex; gap:4px; justify-content:center; flex-direction:column; align-items:center;">
                <button class="btn-icon-pill" style="width:90%;" onclick="alert('🎉 Kesinlikle! Yemek artıklarını temizlemek dişlerimizi mikroplardan korur. 🦷✨'); document.getElementById('ozbakim-step-2').innerHTML='<p style=color:#4CAF50;font-weight:bold;>Piko pırıl pırıl dişlerle gülümsüyor! 😁</p>';">🍎 Yemek artıklarını temizlemek için</button>
                <button class="btn-icon-pill" style="width:90%;" onclick="alert('Vaktimiz olsa da asıl sebep diş sağlığıdır.')">⏰ Vaktimiz olduğu için</button>
              </div>
            </div>
          </div>`;
      }
    }
  }

  // DYNAMIC AGE CONFIG
  const ageConfig = {
    '3': { badge: '3 Yaş (Minik Keşifçiler)', duyguTitle: 'Piko’nun Duygu Yüzleri', ozbakimTitle: 'Piko Ellerini Yıkıyor', dogaTitle: 'Piko Hava Durumunu Buluyor', beceriTitle: 'Piko’nun Renk Balonları' },
    '4-5': { badge: '4-5 Yaş (Meraklı Filizler)', duyguTitle: 'Piko Neden Böyle Hissediyor?', ozbakimTitle: 'Piko’nun Sabah Rutini', dogaTitle: 'Piko Tohum Yetiştiriyor', beceriTitle: 'Piko’nun Hikâye Sırası' },
    '6+': { badge: '6+ Yaş (Bilge Çiçekler)', duyguTitle: 'Piko Bir Çözüm Buluyor', ozbakimTitle: 'Piko’nun Günlük Planı', dogaTitle: 'Piko’nun Doğa Problemi', beceriTitle: 'Piko’nun Yol Planı' }
  };

  function updateAgeSystem(level) {
    currentAgeLevel = level;
    const cfg = ageConfig[level];
    if (!cfg) return;

    const activeBadge = document.getElementById('active-age-badge');
    if (activeBadge) activeBadge.textContent = cfg.badge;

    document.getElementById('duygu-desc').textContent = cfg.duyguTitle;
    document.getElementById('beceri-desc').textContent = cfg.beceriTitle;
    document.getElementById('ozbakim-desc').textContent = cfg.ozbakimTitle;
    document.getElementById('doga-desc').textContent = cfg.dogaTitle;

    initBeceriGame(level);
    initDragAndDropMechanics(level);
  }

  document.querySelectorAll('input[name="age-group"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateAgeSystem(e.target.value);
      if (soundEnabled) AudioEngine.playSuccess();
    });
  });

  updateAgeSystem('4-5');

  // Modal Tetikleyiciler
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
    initDogaCornerGame(currentAgeLevel);
    document.getElementById('modal-doga-corner')?.classList.add('active');
    if (soundEnabled) AudioEngine.playTone(600);
  });

  // Ebeveyn Köşesi & PIN
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

  let currentDynamicIdentifier = '';
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
    currentDynamicIdentifier = `${d1}${d2}${d3}${d4}`;
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
          if (enteredPin === currentDynamicIdentifier) {
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
