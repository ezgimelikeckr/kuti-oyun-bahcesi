/* ==========================================================================
   PIKO CHILD EDUCATION DASHBOARD - FINAL PRODUCTION APP LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // PİKO REHBERLİĞİNDE ÜST GÖRSEL GERİ BİLDİRİM VE İPUCU SİSTEMİ
  function showVisualFeedback(message, type = "success") {
    let box = document.getElementById("piko-visual-feedback-card");
    
    if (!box) {
      box = document.createElement("div");
      box.id = "piko-visual-feedback-card";
      box.style.cssText = "position: absolute; top: 12px; left: 50%; transform: translateX(-50%); background: #E0F2F1; border: 2px solid #00796B; color: #004D40; padding: 8px 16px; border-radius: 20px; font-weight: 700; z-index: 99999; opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease; pointer-events: none; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); font-size: 0.85rem;";
      document.body.appendChild(box);
    }

    let pikoIconImg = type === "success" ? "piko_mutlu.png" : "piko_merakli.png";
    let bgColor = type === "success" ? "#E8F5E9" : type === "error" ? "#FFEBEE" : "#E0F2F1";
    let borderColor = type === "success" ? "#4CAF50" : type === "error" ? "#E57373" : "#00796B";
    let textColor = type === "success" ? "#1B5E20" : type === "error" ? "#B71C1C" : "#004D40";

    box.style.background = bgColor;
    box.style.borderColor = borderColor;
    box.style.color = textColor;

    box.innerHTML = `
      <img src="${pikoIconImg}" alt="Piko" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1.5px solid ${borderColor};">
      <span>${message}</span>
    `;

    box.style.opacity = "1";
    box.style.transform = "translateX(-50%) translateY(4px)";

    setTimeout(() => {
      box.style.opacity = "0";
      box.style.transform = "translateX(-50%) translateY(0)";
    }, 2200);
  }

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
          <p style="font-size:0.85rem; font-weight:700; margin-bottom:0.5rem;">Benzer Nesneleri Eşleştir (Görsel Eşleşme)</p>
          <div style="display:flex; gap:1rem; justify-content:center;">
            <button class="btn-icon-pill beceri-match-btn" data-val="apple" style="font-size: 1.2rem;">🍎 ↔ 🍎</button>
            <button class="btn-icon-pill beceri-match-btn" data-val="ball" style="font-size: 1.2rem;">⚽ ↔ ⚽</button>
          </div>
        </div>`;
      beceriContainer.querySelectorAll('.beceri-match-btn').forEach(b => {
        b.addEventListener('click', () => {
          if (soundEnabled) AudioEngine.playSuccess();
          showVisualFeedback("🎉 Harika görsel eşleştirme!", "success");
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
        beceriContainer.innerHTML = '<p style="font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.5rem; text-align:center;">Dokunarak küçükten büyüğe sırala!</p><div id="sirala-flex" style="display:flex; gap:10px; justify-content:center; align-items:flex-end; min-height:70px;"></div>';
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
                showVisualFeedback("🎉 Tebrikler! Elmaları küçükten büyüğe harika sıraladın!", "success");
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
          <p style="font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.4rem;">🧠 Hafıza Kartları (Kartları Eşleştir)</p>
          <div id="memory-cards-grid" style="display:flex; gap:0.4rem; justify-content:center; margin-bottom:0.5rem;">
            <button class="btn-icon-pill memory-card" data-match="1" style="padding:0.4rem 0.6rem;">❓</button>
            <button class="btn-icon-pill memory-card" data-match="2" style="padding:0.4rem 0.6rem;">❓</button>
            <button class="btn-icon-pill memory-card" data-match="1" style="padding:0.4rem 0.6rem;">❓</button>
            <button class="btn-icon-pill memory-card" data-match="2" style="padding:0.4rem 0.6rem;">❓</button>
          </div>
          <p id="memory-result-text" style="font-size:0.8rem; font-weight:600; color:#E65100;"></p>
        </div>`;
      
      let openedCards = [];
      beceriContainer.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', () => {
          if (card.classList.contains('matched') || card.classList.contains('open')) return;
          card.textContent = card.dataset.match === '1' ? '🦊' : '⭐';
          card.classList.add('open');
          openedCards.push(card);

          if (openedCards.length === 2) {
            if (openedCards[0].dataset.match === openedCards[1].dataset.match) {
              openedCards.forEach(c => c.classList.add('matched'));
              openedCards = [];
              if (soundEnabled) AudioEngine.playSuccess();
              showVisualFeedback("🎉 Hafıza kartı eşleşti!", "success");
            } else {
              setTimeout(() => {
                openedCards.forEach(c => {
                  c.textContent = '❓';
                  c.classList.remove('open');
                });
                openedCards = [];
              }, 600);
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
            setTimeout(() => showVisualFeedback("🎉 Harika! Piko Yapbozunu Tamamladın!", "success"), 300);
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
            <p style="font-size:0.85rem; font-weight:700; color:#E65100; margin-bottom:0.4rem;">Piko'nun Sabah Hazırlanma Planını Oluştur:</p>
            <div id="ozbakim-step-1" style="display:flex; gap:4px; justify-content:center; flex-wrap:wrap; margin-bottom:0.5rem;">
              <button class="btn-icon-pill" onclick="showVisualFeedback('Plan tamamlandı: Uyan ➔ Giyin ➔ Kahvaltı', 'success')">📋 Planı Tamamla</button>
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
            showVisualFeedback("Macun fırçaya eklendi. Şimdi fırçayı dişlere götür.", "info");
          } else if (draggedType === 'brush') {
            if (!hasToothpaste) {
              showVisualFeedback("Önce macunu fırçaya eklemelisin!", "error");
            } else {
              if (soundEnabled) AudioEngine.playSuccess();
              if (mouthEmoji) mouthEmoji.textContent = '✨😁✨';
              setTimeout(() => {
                showVisualFeedback("Piko'nun dişleri temizlendi.", "success");
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
              <button class="btn-icon-pill" style="cursor:pointer; position:relative; z-index:15;" onclick="showVisualFeedback('Temel ihtiyaç önce sudur.', 'error')">☀️ Çok güneş aldı</button>
            </div>
            
            <div id="doga-step-2" style="display:none; text-align:center; position:relative; z-index:10;">
              <p style="font-size:0.78rem; font-weight:700; color:#D32F2F;">Peki yaşam döngüsü nasıl devam eder?</p>
              <div style="display:flex; gap:4px; justify-content:center; flex-direction:column; align-items:center;">
                <button class="btn-icon-pill" style="width:90%; cursor:pointer; position:relative; z-index:15;" onclick="if(soundEnabled)AudioEngine.playSuccess(); document.getElementById('plant-state-emoji').innerHTML='🌻'; showVisualFeedback('Bitki yaşam döngüsünü tamamladı!', 'success'); document.getElementById('doga-step-2').innerHTML='<p style=color:#2E7D32;font-weight:bold;>Bitki yeniden açtı!</p>';">🌱 ➔ 🌿 ➔ 🌻 Yaşam Döngüsü</button>
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
                showVisualFeedback("🎉 Tebrikler! Bitkini besleyerek koca bir çiçek yaptın!", "success");
              }, 400);
            }
          }
        });
      }
    }
  }

  function initDogaCornerGame(level) {
    const dogaModalBox = document.getElementById('modal-doga-corner');
    if (!dogaModalBox) return;
    
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
          <p style="font-size: 0.82rem; margin-bottom: 0.5rem;">Ağaçların yaprakları sararıp dökülüyor. Hangi mevsimdeyiz?</p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-icon-pill" onclick="showVisualFeedback('Doğru! Sonbahar.', 'success')">🍂 Sonbahar</button>
            <button class="btn-icon-pill" onclick="showVisualFeedback('Tekrar deneyelim.', 'error')">❄️ Kış</button>
          </div>
        </div>

        <div style="background: #FFF; border: 2px solid #B2DFDB; padding: 0.85rem; border-radius: 16px; text-align: center;">
          <h4 style="color: #004D40; margin-bottom: 0.35rem; font-size: 0.92rem;">🌻 Piko'nun Bahçesi</h4>
          <p style="font-size: 0.8rem; color: #00695C; margin-bottom: 0.5rem;" id="plant-visual-display">🌱</p>
        </div>`;
    }
  }

  const ageConfig = {
    '3': {
      badge: '3 Yaş (Minik Keşifçiler)',
      duyguDesc: 'Duygu yüzünü bul (Mutlu, Üzgün, Kızgın).',
      beceriDesc: 'Aynı nesneleri eşleştir.',
      ozbakimDesc: 'Piko’nun el yıkaması.',
      dogaDesc: 'Hava durumunu bul.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'piko_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'piko_uzgun.png' },
        { label: 'Kızgın', name: 'Kızgın', image: 'piko_ofkeli.png' }
      ],
      scenario: 'Piko dondurmasını yere düşürdü. Ne hissediyor?',
      scenarioChoices: [
        { label: '😢 Üzgün', correct: true },
        { label: '😊 Mutlu', correct: false }
      ],
      weatherOptions: ['👕 T-shirt', '🧥 Yağmurluk']
    },
    '4-5': {
      badge: '4-5 Yaş (Meraklı Filizler)',
      duyguDesc: 'Piko neden üzgün?',
      beceriDesc: 'Küçükten büyüğe sırala.',
      ozbakimDesc: 'Diş fırçalama.',
      dogaDesc: 'Tohumu büyüt.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'piko_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'piko_uzgun.png' },
        { label: 'Kızgın', name: 'Kızgın', image: 'piko_ofkeli.png' },
        { label: 'Meraklı', name: 'Meraklı', image: 'piko_merakli.png' }
      ],
      scenario: 'Piko en sevdiği oyuncağını bulamıyor. Ne yapmalıyız?',
      scenarioChoices: [
        { label: '🔍 Birlikte arayabiliriz', correct: true },
        { label: '🛑 Bekleyelim', correct: false }
      ],
      weatherOptions: ['👕 T-shirt', '🧥 Yağmurluk', '🧥 Mont']
    },
    '6+': {
      badge: '6+ Yaş (Bilge Çiçekler)',
      duyguDesc: "Piko'ya çözüm bul.",
      beceriDesc: "Piko'nun hikâyesi ve Hafıza Kartları.",
      ozbakimDesc: 'Sabah rutinini sırala.',
      dogaDesc: 'Bitkinin yaşam döngüsü.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'piko_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'piko_uzgun.png' },
        { label: 'Kızgın', name: 'Kızgın', image: 'piko_ofkeli.png' },
        { label: 'Şaşırmış', name: 'Şaşırmış', image: 'piko_sasirmis.png' }
      ],
      scenario: 'Piko sahnede şarkı söylerken sözleri unuttu. Kendini nasıl daha iyi hissedebilir?',
      scenarioChoices: [
        { label: '❤️ Kendini güvende hissetmesi ve tekrar deneyebilmesi için', correct: true },
        { label: '🎵 Hemen sahneden inmesi için', correct: false }
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
            showVisualFeedback(`Evet, Piko ${targetEmotion.label.toLowerCase()}`, "success");
            pickRandomTargetEmotion(cfg);
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            showVisualFeedback("Tekrar deneyelim.", "error");
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
            showVisualFeedback("Harika empati!", "success");
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            showVisualFeedback("Farklı bir yol deneyelim.", "error");
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
          showVisualFeedback(`${btn.textContent} keşfedildi!`, "success");
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
          showVisualFeedback(`Piko ${btn.textContent} giydi.`, "success");
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
    initDogaCornerGame(currentAgeLevel);
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
