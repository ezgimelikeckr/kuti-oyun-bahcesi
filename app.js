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

  // --- BECERİ KÖŞESİ — OYUN 1: SIRALA BUL (3 yaş: Küçük→Büyük Sırala, 4-5 yaş: Örüntü, 6 yaş: Gölge Bul) ---
  function initBeceriGame(level) {
    const beceriContainer = document.getElementById('sirala-grid');
    if (!beceriContainer) return;
    beceriContainer.innerHTML = '';

    if (level === '3') {
      // Gerçek mekanik: Kuti'nin 3 farklı boyuttaki halini küçükten büyüğe doğru sırayla tıklama
      const title = document.createElement('p');
      title.style.cssText = 'text-align:center; font-size:0.85rem; font-weight:700; color:#2E7D32; margin-bottom:0.5rem;';
      title.textContent = "📏 Kuti'leri küçükten büyüğe doğru sırayla dokun";
      beceriContainer.appendChild(title);
      const orderRow = document.createElement('div');
      beceriContainer.appendChild(orderRow);
      initTapOrderGame(orderRow, [
        { id: 'small', html: '<img src="kuti_mutlu.png" style="width:34px;height:34px;border-radius:50%;object-fit:cover;">' },
        { id: 'medium', html: '<img src="kuti_mutlu.png" style="width:54px;height:54px;border-radius:50%;object-fit:cover;">' },
        { id: 'big', html: '<img src="kuti_mutlu.png" style="width:76px;height:76px;border-radius:50%;object-fit:cover;">' }
      ], "🎉 Harika! Küçükten büyüğe doğru sıraladın!");
    } else if (level === '4-5') {
      // Gerçek mekanik: Tekrar eden bir örüntü gösterilir, çocuk eksik şekli iki seçenek arasından bulur
      const patterns = [
        { seq: ['⭐', '⭐', '🔵'], next: '⭐', wrong: '🔵' },
        { seq: ['🔺', '🟢', '🔺'], next: '🟢', wrong: '🔺' }
      ];
      const p = patterns[Math.floor(Math.random() * patterns.length)];
      const displaySeq = [...p.seq, ...p.seq, ...p.seq.slice(0, p.seq.length - 1)];
      beceriContainer.innerHTML = `
        <div style="text-align:center;">
          <p style="font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.5rem;">🧩 Örüntüyü Tamamla — Sırada ne gelmeli?</p>
          <div style="font-size:1.8rem; letter-spacing:0.3rem; margin-bottom:0.7rem;">${displaySeq.join(' ')} <span style="opacity:0.4;">❓</span></div>
          <div id="beceri-pattern-choices" style="display:flex; gap:0.6rem; justify-content:center;"></div>
        </div>`;
      const choicesBox = document.getElementById('beceri-pattern-choices');
      const options = [p.next, p.wrong].sort(() => Math.random() - 0.5);
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-icon-pill';
        btn.style.fontSize = '1.4rem';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          if (opt === p.next) {
            if (soundEnabled) AudioEngine.playSuccess();
            showVisualFeedback("🎉 Örüntü başarıyla tamamlandı!", "success");
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            showVisualFeedback("Örüntüye tekrar bak, hangisi uyuyor?", "error");
          }
        });
        choicesBox.appendChild(btn);
      });
    } else {
      // Gerçek mekanik: Hedef hayvan gösterilir, 3 siluet arasından doğru gölge seçilir
      const animals = ['🦊', '🐻', '🐰', '🦁'];
      const correctAnimal = animals[Math.floor(Math.random() * animals.length)];
      const wrongAnimals = animals.filter(a => a !== correctAnimal).sort(() => Math.random() - 0.5).slice(0, 2);
      const choiceAnimals = [correctAnimal, ...wrongAnimals].sort(() => Math.random() - 0.5);
      beceriContainer.innerHTML = `
        <div style="width:100%; text-align:center;">
          <p style="font-size:0.82rem; font-weight:700; color:#2E7D32; margin-bottom:0.4rem;">🔦 Kuti'nin Gölgesini Bul</p>
          <div style="font-size:2.4rem; margin-bottom:0.6rem;">${correctAnimal}</div>
          <div id="beceri-shadow-choices" style="display:flex; gap:0.6rem; justify-content:center;"></div>
        </div>`;
      const shadowBox = document.getElementById('beceri-shadow-choices');
      choiceAnimals.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'btn-icon-pill shadow-choice-btn';
        btn.textContent = a;
        btn.addEventListener('click', () => {
          if (a === correctAnimal) {
            if (soundEnabled) AudioEngine.playSuccess();
            btn.style.filter = 'none';
            showVisualFeedback("🎉 Doğru gölge eşleşti!", "success");
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            showVisualFeedback("Bu gölge Kuti'ye ait değil, tekrar dene.", "error");
          }
        });
        shadowBox.appendChild(btn);
      });
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
      // Gerçek mekanik: Günlük rutini sırala + eşyaları doğru yerlere sürükle
      wrapper.innerHTML = `
        <p style="text-align:center; font-size:0.85rem; font-weight:700; color:#E65100; margin-bottom:0.4rem;">📋 Günlük Rutini Doğru Sıraya Diz</p>
        <div id="ozbakim-routine-row" style="margin-bottom:1rem;"></div>
        <p style="text-align:center; font-size:0.85rem; font-weight:700; color:#E65100; margin-bottom:0.4rem;">🧸 Eşyaları Doğru Yerlere Sürükle</p>
        <div id="ozbakim-room-bank" class="zone-item-bank"></div>
        <div id="ozbakim-room-zones" class="zone-drop-grid"></div>`;

      initTapOrderGame(document.getElementById('ozbakim-routine-row'), [
        { id: 'wake', html: '🌅<br><span style="font-size:0.6rem;">Uyan</span>' },
        { id: 'brush', html: '🪥<br><span style="font-size:0.6rem;">Fırçala</span>' },
        { id: 'dress', html: '👕<br><span style="font-size:0.6rem;">Giyin</span>' },
        { id: 'go', html: '🎒<br><span style="font-size:0.6rem;">Okula Git</span>' }
      ], "🎉 Günlük rutin doğru sıraya kondu!");

      initZoneDragGame(
        document.getElementById('ozbakim-room-bank'),
        document.getElementById('ozbakim-room-zones'),
        [
          { id: 'book', icon: '📚', zoneId: 'shelf' },
          { id: 'toy', icon: '🧸', zoneId: 'box' },
          { id: 'clothes', icon: '👕', zoneId: 'closet' }
        ],
        [
          { id: 'shelf', icon: '📖', label: 'Kitaplık' },
          { id: 'box', icon: '🧺', label: 'Oyuncak Kutusu' },
          { id: 'closet', icon: '🚪', label: 'Dolap' }
        ],
        "🎉 Oda tertemiz ve düzenli oldu!"
      );
    } else {
      // 4-5 Yaş: Gerçek 2 adımlı diş fırçalama (mevcut çalışan sürükle-bırak mekaniği)
      wrapper.innerHTML = `
        <p style="text-align:center; font-size:0.85rem; font-weight:700; color:#00796B; margin-bottom:0.5rem;">🪥 Macunu Fırçaya, Fırçayı Ağza Sürükle</p>
        <div style="text-align:center; font-size:2.6rem; margin-bottom:0.6rem;" id="mouth-target-emoji">🦠🦷🦠</div>
        <div style="display:flex; gap:0.8rem; justify-content:center; align-items:center;">
          <div class="drag-source" id="draggable-toothpaste" draggable="true" style="font-size:2.2rem; background:#E0F7FA; padding:0.3rem 0.6rem; border-radius:12px;" title="Diş Macununu Sürükle">🧴</div>
          <div class="drag-source" id="draggable-brush" draggable="true" style="font-size:2.2rem;" title="Fırçayı Sürükle">🪥</div>
          <div class="drop-target-zone" id="teeth-target-zone" style="width:110px; min-height:80px; font-size:0.72rem; font-weight:700; text-align:center;">Buraya sürükle</div>
        </div>`;

      const brush = document.getElementById('draggable-brush');
      const toothpaste = document.getElementById('draggable-toothpaste');
      const teethZone = document.getElementById('teeth-target-zone');
      const mouthEmoji = document.getElementById('mouth-target-emoji');
      let hasToothpaste = false;

      toothpaste.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', 'toothpaste'));
      brush.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', 'brush'));
      teethZone.addEventListener('dragover', (e) => { e.preventDefault(); teethZone.classList.add('drag-over'); });
      teethZone.addEventListener('dragleave', () => teethZone.classList.remove('drag-over'));
      teethZone.addEventListener('drop', (e) => {
        e.preventDefault();
        teethZone.classList.remove('drag-over');
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
            setTimeout(() => showVisualFeedback("Kuti'nin dişleri temizlendi.", "success"), 400);
          }
        }
      });
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

  function initDogaMevsimGame(level) {
    const clueEl = document.getElementById('doga-mevsim-clue');
    const mevsimBox = document.getElementById('mevsim-options');
    if (!mevsimBox) return;

    const seasons = level === '3' ? ['🍂 Sonbahar', '☀️ Yaz'] : ['🍂 Sonbahar', '❄️ Kış', '🌸 İlkbahar', '☀️ Yaz'];
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
      // Gerçek mekanik: Yaşam döngüsünü sırala + atıkları doğru kutuya sürükle
      wrapper.innerHTML = `
        <p style="text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.4rem;">🌿 Bitkinin Yaşam Döngüsünü Sırala</p>
        <div id="doga-lifecycle-row" style="margin-bottom:1rem;"></div>
        <p style="text-align:center; font-size:0.85rem; font-weight:700; color:#004D40; margin-bottom:0.4rem;">♻️ Atıkları Doğru Kutuya Sürükle</p>
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
          { id: 'peel', icon: '🍌', zoneId: 'organic' },
          { id: 'paper', icon: '📄', zoneId: 'paper' },
          { id: 'bottle', icon: '🍾', zoneId: 'plastic' }
        ],
        [
          { id: 'organic', icon: '🟢', label: 'Organik' },
          { id: 'paper', icon: '🔵', label: 'Kağıt' },
          { id: 'plastic', icon: '🟡', label: 'Plastik' }
        ],
        "🎉 Atıklar doğru geri dönüşüm kutularına ayrıldı!"
      );
    } else {
      // 3 ve 4-5 Yaş: mevcut çalışan sürükle mekaniği (su/güneşi saksıya sürükle, bitki büyür)
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