/* ==========================================================================
   PIKO CHILD EDUCATION DASHBOARD - STABLE ZPD REFINEMENT
   - Ana düzeni ve yapıyı bozmadan sadece oyun senaryolarını ve ZPD akışlarını düzenler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const welcomeOverlay = document.getElementById('piko-welcome-overlay');
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

  let soundEnabled = true;
  let currentAgeLevel = '4-5';
  let sunProgress = 10;
  let sunTimerDuration = 120;
  let sunInterval = null;

  let currentMathAnswer = 0;
  let enteredMathInput = '';
  let plantStageIndex = 0;
  const plantVisualStages = ['🌱', '🌿', '🌻', '🌳'];

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

  function initBeceriGame(level) {
    const beceriContainer = document.getElementById('sirala-grid');
    if (!beceriContainer) return;
    beceriContainer.innerHTML = '';

    if (level === '3') {
      beceriContainer.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.85rem; font-weight:700; margin-bottom:0.5rem;">Benzer Nesneleri Eşleştir (2-4 Parça Yapboz & Renk Örüntüsü)</p>
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
      let selectedIdx = null;

      function renderSirala() {
        beceriContainer.innerHTML = '<p style="font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.5rem; text-align:center;">Nesneleri tıklayarak küçükten büyüğe sırala! (6-9 Parça & Şekil Örüntüsü)</p><div id="sirala-flex" style="display:flex; gap:10px; justify-content:center; align-items:flex-end; min-height:70px;"></div>';
        const flexContainer = document.getElementById('sirala-flex');

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
          flexContainer.appendChild(el);
        });
      }
      renderSirala();

    } else {
      beceriContainer.innerHTML = `
        <div style="width:100%; text-align:center;">
          <p style="font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.5rem;">📖 Piko'nun Hikâyesi (12-16 Parça Yapboz & Örüntü Tamamlama)</p>
          <div id="story-cards-box" style="display:flex; gap:0.4rem; justify-content:center; flex-wrap:wrap; margin-bottom:0.5rem;">
            <button class="btn-icon-pill story-card" data-step="1">1️⃣ Piko uyandı</button>
            <button class="btn-icon-pill story-card" data-step="2">2️⃣ Parka gitti</button>
            <button class="btn-icon-pill story-card" data-step="3">3️⃣ Piko oynadı</button>
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
              document.getElementById('story-result-text').innerHTML = "🎉 Hikâye ve örüntü tamamlandı!";
            }
          }
        });
      });
    }
  }

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

  function initDragAndDropMechanics(level = '4-5') {
    const brush = document.getElementById('draggable-brush');
    const teethZone = document.getElementById('teeth-target-zone');
    const mouthEmoji = document.getElementById('mouth-target-emoji');

    if (brush && teethZone) {
      if (level === '6+') {
        teethZone.parentElement.innerHTML = `
          <div style="width:100%; text-align:center;">
            <p style="font-size:0.85rem; font-weight:700; color:#E65100; margin-bottom:0.4rem;">Piko'nun Sabah Rutini: Eksik adımı bul ve sırala!</p>
            <div id="ozbakim-step-1" style="display:flex; gap:4px; justify-content:center; flex-wrap:wrap; margin-bottom:0.5rem;">
              <button class="btn-icon-pill" onclick="alert('Önce kahvaltı yapılmalı, sonra diş fırçalanmalıdır! 🍳')">1. Diş Fırçala</button>
              <button class="btn-icon-pill" onclick="document.getElementById('ozbakim-step-1').style.display='none'; document.getElementById('ozbakim-step-2').style.display='block'; if(soundEnabled) AudioEngine.playSuccess();">2. Kahvaltı Yap</button>
            </div>
            
            <div id="ozbakim-step-2" style="display:none; text-align:center;">
              <p style="font-size:0.78rem; font-weight:700; color:#D32F2F;">Neden kahvaltıdan sonra diş fırçalamalıyız?</p>
              <div style="display:flex; gap:4px; justify-content:center; flex-direction:column; align-items:center;">
                <button class="btn-icon-pill" style="width:90%;" onclick="alert('🎉 Kesinlikle! Yemek artıklarını temizlemek dişlerimizi mikroplardan korur. 🦷✨'); document.getElementById('ozbakim-step-2').innerHTML='<p style=color:#4CAF50;font-weight:bold;>Piko pırıl pırıl dişlerle gülümsüyor! 😁</p>';">🍎 Yemek artıklarını temizlemek için</button>
              </div>
            </div>
          </div>`;
      } else {
        if (mouthEmoji) mouthEmoji.textContent = '🦠🦷🦠';

        const brushContainer = brush.parentElement;
        if (!document.getElementById('draggable-toothpaste')) {
          const pasteDiv = document.createElement('div');
          pasteDiv.className = 'drag-source';
          pasteDiv.id = 'draggable-toothpaste';
          pasteDiv.draggable = true;
          pasteDiv.style.fontSize = '2.2rem';
          pasteDiv.style.background = '#E0F7FA';
          pasteDiv.style.padding = '0.3rem 0.6rem';
          pasteDiv.style.borderRadius = '12px';
          pasteDiv.title = 'Diş Macununu Sürükle';
          pasteDiv.textContent = '🧴';
          brushContainer.insertBefore(pasteDiv, brush);
        }

        const toothpaste = document.getElementById('draggable-toothpaste');
        let hasToothpaste = false;

        toothpaste.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', 'toothpaste');
        });

        brush.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', 'brush');
        });

        teethZone.addEventListener('dragover', (e) => e.preventDefault());

        teethZone.addEventListener('drop', (e) => {
          e.preventDefault();
          const draggedType = e.dataTransfer.getData('text/plain');

          if (draggedType === 'toothpaste' && !hasToothpaste) {
            hasToothpaste = true;
            if (soundEnabled) AudioEngine.playSuccess();
            brush.textContent = '🪥🧴';
            toothpaste.style.opacity = '0.4';
            alert('✨ Diş macunu fırçaya sürüldü! Şimdi fırçayı macunla birlikte dişlerin üzerine sürükle.');
          } else if (draggedType === 'brush') {
            if (!hasToothpaste) {
              alert('⚠️ Önce diş macununu fırçanın üzerine sürüklemelisin!');
            } else {
              if (soundEnabled) AudioEngine.playSuccess();
              if (mouthEmoji) mouthEmoji.textContent = '✨😁✨';
              setTimeout(() => {
                alert('🎉 Harika! Mikroplar kaçtı ve dişler pırıl pırıl parladı! 🦷✨');
              }, 400);
            }
          }
        });
      }
    } 

    const potZone = document.getElementById('plant-pot-target');
    const plantDisplay = document.getElementById('plant-visual-display');

    if (potZone && plantDisplay) {
      if (level === '6+') {
        potZone.parentElement.innerHTML = `
          <div style="width:100%; text-align:center; position:relative; z-index:5;">
            <div style="font-size: 3.5rem; margin-bottom: 0.2rem;" id="plant-state-emoji">🥀</div>
            <p style="font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.4rem;">Bitkinin yaşam döngüsünü tamamlaması için doğru sırayı kur!</p>
            <div id="doga-step-1" style="display:flex; gap:4px; justify-content:center; margin-bottom:0.5rem; position:relative; z-index:10;">
              <button class="btn-icon-pill" style="cursor:pointer; position:relative; z-index:15;" onclick="document.getElementById('doga-step-1').style.display='none'; document.getElementById('doga-step-2').style.display='block'; if(soundEnabled) AudioEngine.playSuccess();">💧 Susuz kaldı (Su ver)</button>
              <button class="btn-icon-pill" style="cursor:pointer; position:relative; z-index:15;" onclick="alert('Güneş sever ama temel ihtiyaç sudur.')">☀️ Çok güneş aldı</button>
            </div>
            
            <div id="doga-step-2" style="display:none; text-align:center; position:relative; z-index:10;">
              <p style="font-size:0.78rem; font-weight:700; color:#D32F2F;">Peki yaşam döngüsü nasıl devam eder?</p>
              <div style="display:flex; gap:4px; justify-content:center; flex-direction:column; align-items:center;">
                <button class="btn-icon-pill" style="width:90%; cursor:pointer; position:relative; z-index:15;" onclick="if(soundEnabled)AudioEngine.playSuccess(); document.getElementById('plant-state-emoji').innerHTML='🌻'; alert('🌿 Harika sebep-sonuç ilişkisi ve yaşam döngüsü!'); document.getElementById('doga-step-2').innerHTML='<p style=color:#2E7D32;font-weight:bold;>Bitki yaşam döngüsünü tamamladı ve yeniden açtı!</p>';">🌱 ➔ 🌿 ➔ 🌻 Yaşam Döngüsü</button>
              </div>
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
          if (plantStageIndex < plantVisualStages.length - 1) {
            plantStageIndex++;
            plantDisplay.textContent = plantVisualStages[plantStageIndex];
            if (soundEnabled) AudioEngine.playSuccess();

            if (plantStageIndex === plantVisualStages.length - 1) {
              setTimeout(() => {
                alert('🎉 Tebrikler! Bitkini su ve güneşle besleyerek koca bir çiçek yaptın! 🌻🌿');
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
      duyguDesc: 'Duyguları fark eder, tanır ve doğru ifade ile eşleştirir.',
      beceriDesc: '2-4 parça yapboz ve renk örüntüsü.',
      ozbakimDesc: 'Sabunla köpürt, sonra suyla durula ve havluyla kurula.',
      dogaDesc: 'Doğayı tanır, bitkinin ihtiyacı olan nesneyi seç.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'piko_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'piko_uzgun.png' },
        { label: 'Şaşırmış', name: 'Şaşırmış', image: 'piko_sasirmis.png' }
      ],
      scenario: 'Piko dondurmasını yere düşürdü. Ne hissediyor olabilir?',
      scenarioChoices: [
        { label: '😢 Üzüldü (Ona sarılalım)', correct: true },
        { label: '😊 Mutlu oldu', correct: false }
      ],
      weatherOptions: ['👕 T-shirt & Şapka', '🧥 Yağmurluk']
    },
    '4-5': {
      badge: '4-5 Yaş (Meraklı Filizler)',
      duyguDesc: 'Piko’nun yaşadığı olaya bakıp doğru duyguyu seç.',
      beceriDesc: '6-9 parça yapboz ve şekil örüntüsü.',
      ozbakimDesc: 'Tüm adımları doğru sırayla tamamla.',
      dogaDesc: 'Bitkinin büyümesi için gerekli olanları seç.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'piko_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'piko_uzgun.png' },
        { label: 'Öfkeli', name: 'Öfkeli', image: 'piko_ofkeli.png' },
        { label: 'Meraklı', name: 'Meraklı', image: 'piko_merakli.png' }
      ],
      scenario: 'Piko en sevdiği oyuncağını bulamıyor. Sence ne hissediyor ve ne yapmalıyız?',
      scenarioChoices: [
        { label: '🔍 Üzüldü, birlikte arayalım (Heyecanlı keşif)', correct: true },
        { label: '😡 Kızıp oyuncağı kıralım', correct: false }
      ],
      weatherOptions: ['👕 T-shirt & Şapka', '🧥 Yağmurluk', '🧥 Mont & Bere']
    },
    '6+': {
      badge: '6+ Yaş (Bilge Çiçekler)',
      duyguDesc: "Piko'nun neden böyle hissettiğini düşün ve duygusunu seç.",
      beceriDesc: "12-16 parça yapboz ve nesne örüntüsü.",
      ozbakimDesc: 'Eksik adımı bul ve sıraya yerleştir.',
      dogaDesc: 'Bitkinin yaşam döngüsünü doğru sıraya koy.',
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
      scenario: 'Piko sahnede şarkı söylerken sözleri unuttu. Nasıl hissediyor ve ne yapmalıyız?',
      scenarioChoices: [
        { label: '👏 Utandı ama alkışlayarak cesaret verelim', correct: true },
        { label: '🙈 Gülüp gidelim', correct: false }
      ],
      whyQuestion: 'Neden alkışlayarak cesaret vermeliyiz?',
      whyChoices: [
        { label: '❤️ Arkadaşımızın kendini güvende hissetmesi için', correct: true },
        { label: '🎵 Şarkının daha hızlı bitmesi için', correct: false }
      ],
      weatherOptions: ['👕 T-shirt & Şapka', '🧥 Yağmurluk', '🧥 Mont & Bere']
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
            
            if (cfg.whyQuestion) {
              scenarioChoices.innerHTML = `
                <p style="font-size:0.8rem; font-weight:700; color:#D32F2F; margin-top:0.5rem;">${cfg.whyQuestion}</p>
                <div style="display:flex; flex-direction:column; gap:0.35rem; margin-top:0.35rem;">
                  ${cfg.whyChoices.map(wc => `<button class="btn-icon-pill why-opt-btn" data-correct="${wc.correct}" style="justify-content: flex-start; text-align: left; padding: 0.45rem 0.8rem;">${wc.label}</button>`).join('')}
                </div>
              `;
              scenarioChoices.querySelectorAll('.why-opt-btn').forEach(wBtn => {
                 wBtn.addEventListener('click', () => {
                    if(wBtn.dataset.correct === 'true') {
                       if (soundEnabled) AudioEngine.playSuccess();
                       alert("🎉 Harika! Empati kurmanın asıl nedenini çok iyi biliyorsun!");
                    } else {
                       if (soundEnabled) AudioEngine.playTone(300, 0.2);
                       alert("🤔 Bir daha düşünelim. Gerçek neden bu olmayabilir.");
                    }
                 });
              });
            } else {
              alert("🎉 Tebrikler! Empatili harika bir çözüm buldun!");
            }

          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            alert("❤️ Bu yaklaşım Piko'yu üzebilir. Farklı bir empati yolu deneyelim mi?");
          }
        });
      });
    }

    initBeceriGame(level);
    initRealImagePuzzle(level);
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
