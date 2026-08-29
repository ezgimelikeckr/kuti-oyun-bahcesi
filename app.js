/* ==========================================================================
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

  let targetEmotion = { name: 'Mutlu', image: 'kuti_mutlu.png', label: 'Mutlu' };

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
      mirrorPrompt.textContent = `Kuti şu an nasıl hissediyor? Doğru yüz ifadesini seçebilir misin?`;
    }
  }

  function pickRandomTargetEmotion(cfg) {
    const pool = cfg.emotions;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setVisualEmotionMirror(pool[randomIndex]);
  }

  // --- BECERİ KÖŞESİ (Şemaya Uygun: Renk Eşleştirme / Büyük-Küçük / Örüntü / Gölge / Yapboz) ---
  function initBeceriGame(level) {
    const beceriContainer = document.getElementById('sirala-grid');
    if (!beceriContainer) return;
    beceriContainer.innerHTML = '';

    if (level === '3') {
      beceriContainer.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.85rem; font-weight:700; margin-bottom:0.4rem;">🎨 Renkleri Eşleştir & Büyük-Küçük Seçimi</p>
          <div style="display:flex; gap:0.6rem; justify-content:center; flex-wrap:wrap;">
            <button class="btn-icon-pill beceri-match-btn" data-val="red" style="background:#FFCDD2;">🔴 Kırmızı</button>
            <button class="btn-icon-pill beceri-match-btn" data-val="blue" style="background:#BBDEFB;">🔵 Mavi</button>
            <button class="btn-icon-pill beceri-match-btn" data-val="big" style="background:#C8E6C9;">🍎 Büyük Elma</button>
          </div>
        </div>`;
      beceriContainer.querySelectorAll('.beceri-match-btn').forEach(b => {
        b.addEventListener('click', () => {
          if (soundEnabled) AudioEngine.playSuccess();
          showVisualFeedback("🎉 Harika eşleştirme!", "success");
        });
      });
    } else if (level === '4-5') {
      beceriContainer.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.4rem;">🧩 Örüntüyü Tamamla (Eksik Şekli Bul)</p>
          <div style="display:flex; gap:0.6rem; justify-content:center;">
            <button class="btn-icon-pill" onclick="if(soundEnabled)AudioEngine.playSuccess();showVisualFeedback('🎉 Örüntü başarıyla tamamlandı!', 'success')">⭐ Yıldız Örüntüsü</button>
            <button class="btn-icon-pill" onclick="if(soundEnabled)AudioEngine.playSuccess();showVisualFeedback('🎉 Çember örüntüsü tamamlandı!', 'success')">⭕ Çember Örüntüsü</button>
          </div>
        </div>`;
    } else {
      beceriContainer.innerHTML = `
        <div style="width:100%; text-align:center;">
          <p style="font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.4rem;">🦊 Kuti'nin Gölgesini Bul</p>
          <div style="display:flex; gap:0.6rem; justify-content:center;">
            <button class="btn-icon-pill" onclick="if(soundEnabled)AudioEngine.playSuccess();showVisualFeedback('🎉 Doğru gölge eşleşti!', 'success')">👥 Doğru Gölge</button>
          </div>
        </div>`;
    }
  }

  function initRealImagePuzzle(level) {
    const puzzleBoard = document.getElementById('puzzle-board-grid');
    const puzzleBank = document.getElementById('puzzle-piece-bank');
    if (!puzzleBoard || !puzzleBank) return;

    puzzleBoard.innerHTML = '';
    puzzleBank.innerHTML = '';

    let totalCols = level === '3' ? 2 : 3;
    let totalRows = level === '3' ? 2 : (level === '6+' ? 3 : 2);
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

  // --- ÖZ BAKIM & DOĞA KÖŞESİ ŞEMAYA UYUK RENDER ---
  function initDragAndDropMechanics(level = '4-5') {
    const brush = document.getElementById('draggable-brush');
    const teethZone = document.getElementById('teeth-target-zone');
    const mouthEmoji = document.getElementById('mouth-target-emoji');

    if (brush && teethZone) {
      if (level === '3') {
        // 3 Yaş: Kuti Ellerini Yıkıyor (Sabunla, durula, kurula)
        teethZone.parentElement.innerHTML = `
          <div style="width:100%; text-align:center;">
            <p style="font-size:0.85rem; font-weight:700; color:#00796B; margin-bottom:0.4rem;">🧼 Kuti Ellerini Yıkıyor (Sabunla, durula, kurula)</p>
            <button class="btn-icon-pill" onclick="showVisualFeedback('Sabunlandı, durulandı ve eller tertemiz oldu! 💧', 'success')">✨ Elleri Yıka</button>
          </div>`;
      } else if (level === '6+') {
        // 6 Yaş: Günlük Rutini Sıralıyorum & Odamı Düzenliyorum
        teethZone.parentElement.innerHTML = `
          <div style="width:100%; text-align:center;">
            <p style="font-size:0.85rem; font-weight:700; color:#E65100; margin-bottom:0.4rem;">📋 Günlük Rutini Sırala ve Odanı Düzenle:</p>
            <div style="display:flex; gap:6px; justify-content:center;">
              <button class="btn-icon-pill" onclick="showVisualFeedback('Günlük rutin doğru sıraya kondu!', 'success')">1️⃣ Rutin Sırala</button>
              <button class="btn-icon-pill" onclick="showVisualFeedback('Eşyalar odada doğru yerlere yerleşti!', 'success')">🧸 Odayı Düzenle</button>
            </div>
          </div>`;
      } else {
        // 4-5 Yaş: Diş Fırçalama & Sağlıklı Besinler
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
                showVisualFeedback("Kuti'nin dişleri temizlendi.", "success");
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
        // 6 Yaş Doğa: Bitkinin Yaşam Döngüsü & Geri Dönüşüm
        potZone.parentElement.innerHTML = `
          <div style="width:100%; text-align:center; position:relative; z-index:5;">
            <div style="font-size: 3.5rem; margin-bottom: 0.2rem;" id="plant-state-emoji">🌱</div>
            <p style="font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.4rem;">Bitkinin Yaşam Döngüsü ve Geri Dönüşüm Kutusu:</p>
            <div style="display:flex; gap:6px; justify-content:center;">
              <button class="btn-icon-pill" onclick="showVisualFeedback('Bitkinin büyüme sırası doğru kuruldu!', 'success')">🌿 Yaşam Döngüsü</button>
              <button class="btn-icon-pill" onclick="showVisualFeedback('Atıklar doğru geri dönüşüm kutusuna atıldı!', 'success')">♻️ Geri Dönüşüm</button>
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

  const ageConfig = {
    '3': {
      badge: '3 Yaş (Minik Keşifçiler)',
      duyguDesc: 'Kuti’nin duygusunu ve duygulu balonları seç.',
      beceriDesc: 'Renkleri eşleştir ve büyük-küçüğü seç.',
      ozbakimDesc: 'Kuti ellerini yıkıyor (Sabunla, durula).',
      dogaDesc: 'Bitkiyi bul ve doğada olanı seç.',
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
      duyguDesc: 'Kuti ne hissediyor ve neden?',
      beceriDesc: '6 parça yapboz ve örüntüyü tamamla.',
      ozbakimDesc: 'Hava durumuna göre giydir ve sağlıklı besinleri seç.',
      dogaDesc: 'Mevsimi seç ve doğayı koruyan resmi bul.',
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
      duyguDesc: "Duygumu seçiyorum ve yönetiyorum.",
      beceriDesc: "12 parça yapboz ve gölgeyi bul.",
      ozbakimDesc: 'Günlük rutini sırala ve odanı düzenle.',
      dogaDesc: 'Bitkinin yaşam döngüsü ve geri dönüşüm.',
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
            showVisualFeedback(`Evet, Kuti ${targetEmotion.label.toLowerCase()}`, "success");
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
            showVisualFeedback("Harika empati ve yönetim!", "success");
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
          showVisualFeedback(`Kuti ${btn.textContent} giydi ve hazır!`, "success");
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

  // ===== KÖŞELER ARASI GEÇİŞ (Ana giriş kartları + modal içi yan menü ortak kullanır) =====
  const CORNERS = [
    { key: 'duygu',   modalId: 'modal-duygu-corner',   label: '❤️ Duygu Köşesi' },
    { key: 'doga',    modalId: 'modal-doga-corner',    label: '🌿 Doğa Köşesi' },
    { key: 'ozbakim', modalId: 'modal-ozbakim-corner', label: '🪥 Öz Bakım' },
    { key: 'beceri',  modalId: 'modal-beceri-corner',  label: '🧩 Beceri' },
  ];

  function switchCorner(targetKey) {
    const target = CORNERS.find(c => c.key === targetKey);
    if (!target) return;

    document.querySelectorAll('.kuti-modal.active').forEach(m => m.classList.remove('active'));

    updateAgeSystem(currentAgeLevel);

    document.getElementById(target.modalId)?.classList.add('active');
    renderCornerNav(targetKey);
    if (soundEnabled) AudioEngine.playTone(600);
  }

  function renderCornerNav(activeKey) {
    document.querySelectorAll('[data-corner-nav]').forEach(nav => {
      nav.innerHTML = CORNERS.map(c =>
        `<button class="side-nav-item${c.key === activeKey ? ' active' : ''}" data-goto-corner="${c.key}">${c.label}</button>`
      ).join('');
    });
  }

  document.addEventListener('click', (e) => {
    const gotoBtn = e.target.closest('[data-goto-corner]');
    if (gotoBtn) switchCorner(gotoBtn.dataset.gotoCorner);
  });

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

  // Genel Modal Kapatma Dinamik Dinleyicisi
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-close-modal]') || e.target.closest('[data-close-modal]')) {
      const modal = e.target.closest('.kuti-modal');
      if (modal) modal.classList.remove('active');
    }
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