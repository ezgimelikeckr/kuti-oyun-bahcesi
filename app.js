/* ==========================================================================
   PIKO CHILD EDUCATION DASHBOARD - COMPLETE PEDAGOGICAL REFINEMENT
   - 3 Yaş: Ses yok, Saf Görsel/Dokunma tabanlı mini oyunlar
   - 4-5 Yaş: Sıralama, Neden-Sonuç ve Storyboard Görsel Akışlar
   - 6 Yaş: Planlama, Çözüm Üretme, Kategorizasyon ve Yol/Problem Çözme
   - Yaşlara Göre Ölçekli Dinamik Yapboz ve İnteraktif Sırala Bul
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

  // --- YAŞ GRUPLARINA ÖZEL PEDAGOJİK OYUN RENDER MOTORU ---
  const ageConfig = {
    '3': {
      badge: '3 Yaş (Minik Keşifçiler)',
      duyguTitle: 'Piko’nun Duygu Yüzleri',
      duyguDesc: 'Piko sırayla mutlu, üzgün, kızgın yüz ifadeleri gösterir. Doğru yüze dokun!',
      ozbakimTitle: 'Piko Ellerini Yıkıyor',
      ozbakimDesc: 'Sabunu, musluğu ve havluyu sırayla Piko’ya uygula.',
      dogaTitle: 'Piko Hava Durumunu Buluyor',
      dogaDesc: 'Alttaki hava durumu ikonuna dokun, gökyüzünün ve Piko’nun yüzünün değişimini izle.',
      beceriTitle: 'Piko’nun Renk Balonları',
      beceriDesc: 'Aynı renk balonları yan yana getir.'
    },
    '4-5': {
      badge: '4-5 Yaş (Meraklı Filizler)',
      duyguTitle: 'Piko Neden Böyle Hissediyor?',
      duyguDesc: 'Piko’nun üzgün olma nedenini durum kartlarından seç.',
      ozbakimTitle: 'Piko’nun Sabah Rutini',
      ozbakimDesc: 'Sabah hazırlanırken adımları 1-2-3 sırasına diz, storyboard oluştur.',
      dogaTitle: 'Piko Tohum Yetiştiriyor',
      dogaDesc: 'Tohumun büyümesi için gerekli olan doğru unsurları seç.',
      beceriTitle: 'Piko’nun Hikâye Sırası',
      beceriDesc: 'Resimleri baştan sona zaman çizelgesine diz.'
    },
    '6+': {
      badge: '6+ Yaş (Bilge Çiçekler)',
      duyguTitle: 'Piko Bir Çözüm Buluyor',
      duyguDesc: 'Dağınık oda ve oyun karmaşası için en doğru çözüm kartını seç.',
      ozbakimTitle: 'Piko’nun Günlük Planı',
      ozbakimDesc: 'Kartları günün uygun kısmına yerleştirerek günlük plan barını tamamla.',
      dogaTitle: 'Piko’nun Doğa Problemi',
      dogaDesc: 'Parktaki çöpleri ve doğal nesneleri doğru alanlara (çöp kutusu / doğa köşesi) ayır.',
      beceriTitle: 'Piko’nun Yol Planı',
      beceriDesc: 'Basit haritada Piko’nun ev, park ve market rotasını yön kartlarıyla çiz.'
    }
  };

  function renderAgeSpecificGames(level) {
    const cfg = ageConfig[level];
    if (!cfg) return;

    // 1. DUYGU KÖŞESİ RENDER
    const duyguContainer = document.getElementById('modal-duygu-corner');
    if (duyguContainer) {
      const box = duyguContainer.querySelector('.modal-content-box');
      if (box) {
        box.innerHTML = `
          <button class="modal-close-btn" data-close-modal>✕</button>
          <h3 style="color: var(--pastel-red-main); margin-bottom: 0.35rem;">❤️ Duygu Köşesi — ${cfg.duyguTitle}</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.75rem;">${cfg.duyguDesc}</p>
          <div style="background: #FFF; border: 2px solid #FFCDD2; padding: 1rem; border-radius: 16px; text-align:center;">
            ${level === '3' ? `
              <div style="font-size:3.5rem; margin-bottom:0.5rem;" id="piko-face-3">😊</div>
              <p style="font-weight:700; color:#5D4037; margin-bottom:0.75rem;">Piko nasıl hissediyor?</p>
              <div style="display:flex; gap:1rem; justify-content:center;">
                <button class="btn-icon-pill" onclick="document.getElementById('piko-face-3').textContent='😊'; document.getElementById('piko-face-3').style.transform='scale(1.2)';">😊 Mutlu</button>
                <button class="btn-icon-pill" onclick="document.getElementById('piko-face-3').textContent='😢'; document.getElementById('piko-face-3').style.transform='scale(1.2)';">😢 Üzgün</button>
                <button class="btn-icon-pill" onclick="document.getElementById('piko-face-3').textContent='😡'; document.getElementById('piko-face-3').style.transform='scale(1.2)';">😡 Kızgın</button>
              </div>
            ` : level === '4-5' ? `
              <div style="font-size:3rem; margin-bottom:0.5rem;">😢</div>
              <p style="font-weight:700; color:#5D4037; margin-bottom:0.75rem;">Piko neden üzgün olabilir?</p>
              <div style="display:flex; flex-direction:column; gap:0.5rem;">
                <button class="btn-icon-pill" onclick="alert('🎉 Doğru! Oyuncağını kaybettiği için üzgün olabilir.')">📦 Oyuncağını kaybetti</button>
                <button class="btn-icon-pill" onclick="alert('Tekrar deneyelim!')">🎈 Balonu patladı</button>
              </div>
            ` : `
              <p style="font-weight:700; color:#5D4037; margin-bottom:0.75rem;">Piko odası dağınık ve oynamak istiyor. Ne yapabilir?</p>
              <div style="display:flex; flex-direction:column; gap:0.5rem;">
                <button class="btn-icon-pill" onclick="alert('✅ Harika plan! Önce toplamak, sonra oynamak en iyisidir.')">🧹 Oyuncakları toparla, sonra oyna (✓)</button>
                <button class="btn-icon-pill" onclick="alert('Dağınıklık oyun alanını daraltır.')">❌ Dağınık hâlde bırak</button>
              </div>
            `}
          </div>`;
      }
    }

    // 2. ÖZ BAKIM KÖŞESİ RENDER
    const ozbakimContainer = document.getElementById('modal-ozbakim-corner');
    if (ozbakimContainer) {
      const box = ozbakimContainer.querySelector('.modal-content-box');
      if (box) {
        box.innerHTML = `
          <button class="modal-close-btn" data-close-modal>✕</button>
          <h3 style="color: var(--pastel-orange-main); margin-bottom: 0.35rem;">🪥 Öz Bakım Köşesi — ${cfg.ozbakimTitle}</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.75rem;">${cfg.ozbakimDesc}</p>
          <div style="background: #FFF3E0; padding: 1rem; border-radius: 16px; text-align:center;">
            ${level === '3' ? `
              <div style="font-size:3rem; margin-bottom:0.5rem;" id="oz-3-img">🤲</div>
              <p style="font-weight:700; color:#E65100; margin-bottom:0.75rem;">Önce hangisini kullanmalıyım?</p>
              <div style="display:flex; gap:0.75rem; justify-content:center;">
                <button class="btn-icon-pill" onclick="document.getElementById('oz-3-img').textContent='🧼 Köpüklü eller'">🧼 Sabun</button>
                <button class="btn-icon-pill" onclick="document.getElementById('oz-3-img').textContent='🚿 Yıkanıyor'">🚿 Musluk</button>
                <button class="btn-icon-pill" onclick="document.getElementById('oz-3-img').textContent='✨ Tertemiz eller!'">タオル Havlu</button>
              </div>
            ` : level === '4-5' ? `
              <p style="font-weight:700; color:#E65100; margin-bottom:0.75rem;">Sabah hazırlanırken sıralama nasıl olmalı?</p>
              <div style="display:flex; gap:0.5rem; justify-content:center;">
                <button class="btn-icon-pill" onclick="alert('1. Diş Fırçalama seçildi!')">🪥 1. Diş Fırçala</button>
                <button class="btn-icon-pill" onclick="alert('2. Yüz Yıkama seçildi!')">💧 2. Yüz Yıka</button>
                <button class="btn-icon-pill" onclick="alert('🎉 Harika storyboard sıralaması!')">👕 3. Giyin</button>
              </div>
            ` : `
              <p style="font-weight:700; color:#E65100; margin-bottom:0.75rem;">Günlük plan barına kartları yerleştir:</p>
              <div style="display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap;">
                <button class="btn-icon-pill" onclick="alert('🌅 Sabah: Kahvaltı eklendi!')">🍳 Kahvaltı</button>
                <button class="btn-icon-pill" onclick="alert('☀️ Öğle: Öğle yemeği ve oyun eklendi!')">⚽ Oyun</button>
                <button class="btn-icon-pill" onclick="alert('🌙 Akşam: Banyo ve uyku eklendi! Günlük plan tamamlandı.')">🌙 Uyku</button>
              </div>
            `}
          </div>`;
      }
    }

    // 3. DOĞA KÖŞESİ RENDER
    const dogaContainer = document.getElementById('modal-doga-corner');
    if (dogaContainer) {
      const box = dogaContainer.querySelector('.modal-content-box');
      if (box) {
        box.innerHTML = `
          <button class="modal-close-btn" data-close-modal>✕</button>
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
            <span style="font-size: 1.8rem;">🌿</span>
            <div>
              <h3 style="font-size: 1.2rem; font-weight: 700; color: #00796B;">Doğa Köşesi — ${cfg.dogaTitle}</h3>
              <span style="font-size: 0.78rem; color: #004D40; font-weight: 700;">${cfg.dogaDesc}</span>
            </div>
          </div>
          <div style="background: #E0F2F1; padding: 1rem; border-radius: 16px; text-align:center;">
            ${level === '3' ? `
              <div style="font-size:3rem; margin-bottom:0.5rem;" id="doga-sky">🌤️</div>
              <p style="font-weight:700; color:#004D40; margin-bottom:0.75rem;">Bugün gökyüzünde hangisi var?</p>
              <div style="display:flex; gap:1rem; justify-content:center;">
                <button class="btn-icon-pill" onclick="document.getElementById('doga-sky').textContent='☀️ Gülümseyen Güneş'">☀️ Güneş</button>
                <button class="btn-icon-pill" onclick="document.getElementById('doga-sky').textContent='☁️ Bulutlu'">☁️ Bulut</button>
                <button class="btn-icon-pill" onclick="document.getElementById('doga-sky').textContent='🌧️ Şemsiyeli Piko'">🌧️ Yağmur</button>
              </div>
            ` : level === '4-5' ? `
              <div style="font-size:3rem; margin-bottom:0.5rem;" id="seed-plant">🌱</div>
              <p style="font-weight:700; color:#004D40; margin-bottom:0.75rem;">Tohumun büyümesi için hangilerini seçmeliyim?</p>
              <div style="display:flex; gap:0.75rem; justify-content:center;">
                <button class="btn-icon-pill" onclick="document.getElementById('seed-plant').textContent='🌻 Filizlendi!'">💧 Su + ☀️ Güneş</button>
                <button class="btn-icon-pill" onclick="alert('Araba ile tohum büyümez.')">🚗 Oyuncak Araba</button>
              </div>
            ` : `
              <p style="font-weight:700; color:#004D40; margin-bottom:0.75rem;">Parktaki çöpleri ve doğal nesneleri doğru alanlara ayır:</p>
              <div style="display:flex; gap:1rem; justify-content:center;">
                <button class="btn-icon-pill" onclick="alert('🗑️ Plastik şişe ve kâğıt çöp kutusuna atıldı! Park temizlendi.')">🗑️ Çöpleri Temizle</button>
                <button class="btn-icon-pill" onclick="alert('🍂 Yaprak ve taşlar doğa köşesinde bırakıldı.')">🍃 Doğal Nesneleri Koru</button>
              </div>
            `}
          </div>`;
      }
    }

    // 4. BECERİ KÖŞESİ RENDER
    const beceriContainer = document.getElementById('modal-beceri-corner');
    if (beceriContainer) {
      const box = beceriContainer.querySelector('.modal-content-box');
      if (box) {
        box.innerHTML = `
          <button class="modal-close-btn" data-close-modal>✕</button>
          <h3 style="color: var(--pastel-green-main); margin-bottom: 0.35rem;">🧩 Beceri Köşesi — ${cfg.beceriTitle}</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.75rem;">${cfg.beceriDesc}</p>
          <div style="background: #E8F5E9; padding: 1rem; border-radius: 16px; text-align:center;">
            ${level === '3' ? `
              <p style="font-weight:700; color:#2E7D32; margin-bottom:0.75rem;">Kırmızı balonları yan yana getir:</p>
              <div style="display:flex; gap:0.75rem; justify-content:center;">
                <button class="btn-icon-pill" style="background:#FFCDD2;" onclick="alert('🎈 Kırmızı balon eşleşti!')">🎈 Kırmızı</button>
                <button class="btn-icon-pill" style="background:#FFF9C4;">🎈 Sarı</button>
                <button class="btn-icon-pill" style="background:#B3E5FC;">🎈 Mavi</button>
              </div>
            ` : level === '4-5' ? `
              <p style="font-weight:700; color:#2E7D32; margin-bottom:0.75rem;">Resimleri baştan sona zaman çizelgesine diz:</p>
              <div style="display:flex; gap:0.5rem; justify-content:center;">
                <button class="btn-icon-pill" onclick="alert('1. Parka gidiyor')">parka gidiyor</button>
                <button class="btn-icon-pill" onclick="alert('2. Parkta oynuyor')">oynuyor</button>
                <button class="btn-icon-pill" onclick="alert('🎉 Harika hikaye akışı!')">eve dönüyor</button>
              </div>
            ` : `
              <p style="font-weight:700; color:#2E7D32; margin-bottom:0.75rem;">Piko'nun Yol Planı (Ev → Park → Market):</p>
              <div style="display:flex; gap:0.5rem; justify-content:center;">
                <button class="btn-icon-pill" onclick="alert('🏡 ➔ 🌳 Evden Parka rota çizildi!')">🏡 ➔ 🌳 Park</button>
                <button class="btn-icon-pill" onclick="alert('🌳 ➔ 🛒 Parktan Markete rota çizildi! Yol tamamlandı.')">🌳 ➔ 🛒 Market</button>
              </div>
            `}
          </div>`;
      }
    }
  }

  // Yaş Değiştiğinde Oyunları Güncelle
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

    renderAgeSpecificGames(level);
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
