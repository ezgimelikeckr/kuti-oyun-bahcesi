/* ==========================================================================
   KUTI CHILD EDUCATION DASHBOARD - FINAL GAME MATRIX & LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
      } catch (e) {}
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
      } catch (e) {}
    }
  };

  let soundEnabled = true;
  let currentAgeLevel = '4-5';
  let targetEmotion = { name: 'Mutlu', image: 'kuti_mutlu.png', label: 'Mutlu' };

  // Yaş Gruplarına Göre Eğitim Matrisi
  const ageConfig = {
    '3': {
      badge: '3 Yaş (Minik Keşifçiler)',
      duyguDesc: 'Temel duyguları tanı ve Kuti’nin yüz ifadesini eşleştir.',
      beceriDesc: 'Renkleri eşleştir ve 4 parçalı kolay yapbozu çöz.',
      ozbakimDesc: 'Kuti ellerini yıkıyor, dişlerini fırçalıyor.',
      dogaDesc: 'Yağmurlu hava için doğru kıyafeti seç.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'kuti_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'kuti_uzgun.png' },
        { label: 'Kızgın', name: 'Kızgın', image: 'kuti_ofkeli.png' }
      ]
    },
    '4-5': {
      badge: '4-5 Yaş (Meraklı Filizler)',
      duyguDesc: 'Duygu aynası, empati senaryoları ve Kuti’nin günlük olayları.',
      beceriDesc: '6 parça gerçek resim yapbozu ve şekil örüntüsü.',
      ozbakimDesc: 'Diş fırçalama adımları ve hava durumuna göre giyinme.',
      dogaDesc: 'Mevsim geçişleri ve sulama dengesi.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'kuti_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'kuti_uzgun.png' },
        { label: 'Öfkeli', name: 'Öfkeli', image: 'kuti_ofkeli.png' },
        { label: 'Meraklı', name: 'Meraklı', image: 'kuti_merakli.png' }
      ]
    },
    '6+': {
      badge: '6+ Yaş (Bilge Çiçekler)',
      duyguDesc: 'Zengin duygu yönetimi ve problem çözme.',
      beceriDesc: '9-12 parça detaylı yapboz ve gölge eşleştirme.',
      ozbakimDesc: 'Günlük yaşam becerileri rutini sıralama.',
      dogaDesc: 'Bitkinin yaşam döngüsü ve geri dönüşüm.',
      emotions: [
        { label: 'Mutlu', name: 'Mutlu', image: 'kuti_mutlu.png' },
        { label: 'Üzgün', name: 'Üzgün', image: 'kuti_uzgun.png' },
        { label: 'Kızgın', name: 'Kızgın', image: 'kuti_ofkeli.png' },
        { label: 'Şaşırmış', name: 'Şaşırmış', image: 'kuti_sasirmis.png' }
      ]
    }
  };

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
      mirrorPrompt.textContent = `${emotion.label} Kuti 🌟`;
    }
  }

  function pickRandomTargetEmotion(cfg) {
    const pool = cfg.emotions;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setVisualEmotionMirror(pool[randomIndex]);
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

    pickRandomTargetEmotion(cfg);

    const emotionBox = document.getElementById('duygu-mirror-options');
    if (emotionBox) {
      const shuffledEmotions = [...cfg.emotions].sort(() => Math.random() - 0.5);
      emotionBox.innerHTML = shuffledEmotions.map(e => 
        `<button class="btn-icon-pill emo-opt-btn" data-name="${e.name}" style="padding: 0.5rem 1rem;">${e.label}</button>`
      ).join('');

      emotionBox.querySelectorAll('.emo-opt-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const selectedName = btn.dataset.name;
          const isCorrect = selectedName === targetEmotion.name;
          if (isCorrect) {
            if (soundEnabled) AudioEngine.playSuccess();
            showVisualFeedback(`Harika! Kuti şimdi ${targetEmotion.label.toLowerCase()}`, "success");
            pickRandomTargetEmotion(cfg);
          } else {
            if (soundEnabled) AudioEngine.playTone(300, 0.2);
            showVisualFeedback("Tekrar denesen mi?", "error");
          }
        });
      });
    }
  }

  // Öz Bakım Buton Etkileşimleri (Diş Fırçalama & Yüz Yıkama)
  const btnBrush = document.getElementById('btn-brush-action');
  const btnBubble = document.getElementById('btn-bubble-action');
  const ozbakimStatus = document.getElementById('ozbakim-status-text');

  if (btnBrush) {
    btnBrush.addEventListener('click', () => {
      if (soundEnabled) AudioEngine.playSuccess();
      if (ozbakimStatus) ozbakimStatus.textContent = "🦷 Dişler macunla pırıl pırıl fırçalandı!";
      showVisualFeedback("Dişler tertemiz oldu! ✨", "success");
    });
  }

  if (btnBubble) {
    btnBubble.addEventListener('click', () => {
      if (soundEnabled) AudioEngine.playSuccess();
      if (ozbakimStatus) ozbakimStatus.textContent = "🧼 Yüz sabun köpükleriyle tertemiz yıkandı!";
      showVisualFeedback("Mis gibi köpüklerle yıkandı! 💧", "success");
    });
  }

  // Doğa Kıyafet Değiştirme Etkileşimi
  const btnRainOutfit = document.getElementById('btn-outfit-rain');
  const btnWinterOutfit = document.getElementById('btn-outfit-winter');
  const dogaKutiImg = document.getElementById('doga-kuti-outfit-img');
  const dogaOutfitLabel = document.getElementById('doga-outfit-label');

  if (btnRainOutfit) {
    btnRainOutfit.addEventListener('click', () => {
      if (soundEnabled) AudioEngine.playSuccess();
      if (dogaKutiImg) dogaKutiImg.src = "Tilkiye aynen kıyafet kartındaki gibi pastel sarı kapüşonlu yağmurluk ve pastel mor yağmur çizmeleri giydirin.jpg";
      if (dogaOutfitLabel) dogaOutfitLabel.textContent = "Sarı Yağmurluk & Mor Çizmeler 🌧️";
      showVisualFeedback("Yağmurlu hava için doğru kıyafet seçildi!", "success");
    });
  }

  if (btnWinterOutfit) {
    btnWinterOutfit.addEventListener('click', () => {
      if (soundEnabled) AudioEngine.playSuccess();
      if (dogaKutiImg) dogaKutiImg.src = "Tilkiye aynen kıyafet kartındaki gibi pastel pembe ponponlu bere, pastel mor atkı, pastel mavi kapüşonlu mont ve beyaz eldiven giydirin.jpg";
      if (dogaOutfitLabel) dogaOutfitLabel.textContent = "Kışlık Mont, Bere & Atkı ❄️";
      showVisualFeedback("Soğuk kış günü için harika seçim!", "success");
    });
  }

  document.querySelectorAll('input[name="age-group"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateAgeSystem(e.target.value);
      if (soundEnabled) AudioEngine.playSuccess();
    });
  });

  updateAgeSystem('4-5');

  // Köşeler Arası Geçişler
  const CORNERS = [
    { key: 'duygu',   modalId: 'modal-duygu-corner' },
    { key: 'doga',    modalId: 'modal-doga-corner' },
    { key: 'ozbakim', modalId: 'modal-ozbakim-corner' },
    { key: 'beceri',  modalId: 'modal-beceri-corner' },
  ];

  function switchCorner(targetKey) {
    document.querySelectorAll('.kuti-modal.active').forEach(m => m.classList.remove('active'));
    const target = CORNERS.find(c => c.key === targetKey);
    if (target) {
      document.getElementById(target.modalId)?.classList.add('active');
      if (soundEnabled) AudioEngine.playTone(600);
    }
  }

  document.getElementById('card-duygu')?.addEventListener('click', () => switchCorner('duygu'));
  document.getElementById('card-beceri')?.addEventListener('click', () => switchCorner('beceri'));
  document.getElementById('card-ozbakim')?.addEventListener('click', () => switchCorner('ozbakim'));
  document.getElementById('card-doga')?.addEventListener('click', () => switchCorner('doga'));

});