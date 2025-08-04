// ================================
// 🎯 VIEWPORT-BASED SCALING SİSTEMİ - Tüm ekranlarda orantılı görünüm
// ================================
function scaleViewport() {
  const container = document.getElementById('viewport-container');
  if (!container) return;
  
  // Artık scale etmeye gerek yok, site zaten ekranın tamamını kaplıyor
  // Sadece içeriği ekran boyutuna göre ayarlayalım
  const ww = window.innerWidth;
  const wh = window.innerHeight;
  
  // İçeriği ekran boyutuna göre ayarla
  container.style.width = `${ww}px`;
  container.style.height = `${wh}px`;
}

// Viewport boyutu değiştiğinde ve sayfa yüklendiğinde güncelle
window.addEventListener('resize', scaleViewport);
window.addEventListener('DOMContentLoaded', scaleViewport);

document.addEventListener("DOMContentLoaded", function () {
  // ================================
  // 📦 SLIDER (Ana Sayfa) Bölümü
  // ================================
  const slides = document.querySelectorAll(".slide"); // Tüm slaytlar
  const dots = document.querySelectorAll(".dot");     // Alttaki nokta navigasyonları
  const leftArrow = document.querySelector(".arrow.left");   // Sol ok
  const rightArrow = document.querySelector(".arrow.right"); // Sağ ok

  if (slides.length > 0 && leftArrow && rightArrow && dots.length > 0) {
    let currentSlide = 0;                // Başlangıç slaytı
    let slideInterval;                   // Otomatik geçiş için zamanlayıcı
    const animationTypes = ['fade'];     // Şu anda sadece fade animasyonu kullanılıyor
    let currentAnimation = 0;

    const sliderTexts = [
      {
        title: "Hoş Geldiniz",
        desc: "İç mimaride estetiğin ve işlevselliğin buluşma noktası."
      },
      {
        title: "Ofis Tasarımları",
        desc: "Modern ve fonksiyonel çalışma alanları."
      },
      {
        title: "Mutfak Projeleri",
        desc: "Şıklık ve pratiklik bir arada."
      }
    ];

    function updateHeroText(index) {
      const heroText = document.querySelector('.hero-text');
      if (!heroText) return;
      heroText.classList.remove('slide-in');
      void heroText.offsetWidth; // Reflow, animasyonu tekrar başlatmak için
      heroText.querySelector('h1').textContent = sliderTexts[index].title;
      heroText.querySelector('p').textContent = sliderTexts[index].desc;
      heroText.classList.add('slide-in');
    }

    // Belirli bir slaytı gösterir
    function showSlide(index, direction = 'next') {
      // Eski slayttan "active" sınıfı çıkarılır
      slides[currentSlide].classList.remove('active');

      // Yeni slayttan önceki animasyon sınıfları temizlenir
      slides[index].classList.remove('prev', 'next', 'fade');

      // Animasyon tipi belirlenir
      const animType = animationTypes[currentAnimation % animationTypes.length];
      if (animType === 'slide') {
        slides[index].classList.add(direction === 'next' ? 'next' : 'prev');
      } else {
        slides[index].classList.add(animType);
      }

      // Yeni slayta "active" sınıfı eklenir
      setTimeout(() => {
        slides[index].classList.add('active');
      }, 10);

      // Noktalardaki aktif sınıf güncellenir
      dots.forEach(dot => dot.classList.remove("active"));
      dots[index].classList.add("active");

      currentSlide = index;
      currentAnimation++;
      updateHeroText(index); // <-- Metni güncelle
    }

    // Otomatik slayt geçişini başlatır
    function startSlideShow() {
      clearInterval(slideInterval); // Önceki intervali temizle
      slideInterval = setInterval(() => {
        const nextIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
        showSlide(nextIndex, 'next');
      }, 7000); // 7 saniyede bir geçiş
    }

    // Slider başlatıcı fonksiyon
    function initSlider() {
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      updateHeroText(currentSlide); // İlk metni ayarla
      startSlideShow();

      const slider = document.querySelector('.hero-slider');
      if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval)); // Üzerine gelince durdur
        slider.addEventListener('mouseleave', startSlideShow); // Ayrılınca devam ettir
      }
    }

    // Sol ok tıklama
    leftArrow.addEventListener("click", () => {
      clearInterval(slideInterval);
      const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
      showSlide(prevIndex, 'prev');
      startSlideShow();
    });

    // Sağ ok tıklama
    rightArrow.addEventListener("click", () => {
      clearInterval(slideInterval);
      const nextIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
      showSlide(nextIndex, 'next');
      startSlideShow();
    });

    // Noktalara tıklama ile slayt değiştirme
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        clearInterval(slideInterval);
        const direction = index > currentSlide ? 'next' : 'prev';
        showSlide(index, direction);
        startSlideShow();
      });
    });

    initSlider(); // Slider'ı başlat
  }

  // ================================
  // 🧠 PROJELER SAYFASI: PLAN-RENDER GÖRSEL GEÇİŞ
  // ================================

  // Mouse ile render-karakalem oranını kontrol et
  function setupPlanRenderHover(wrapperSelector) {
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;

    const renderDiv = wrapper.querySelector(".img-wrapper.render");
    const karakalemDiv = wrapper.querySelector(".img-wrapper.karakalem");
    if (!renderDiv || !karakalemDiv) return;

    let latestPercent = 50;  // Başlangıçta yarı yarıya görünür
    let animating = true;

    // Oranlara göre width ayarla
    function updateWidths() {
      renderDiv.style.width = `${latestPercent}%`;
      karakalemDiv.style.width = `${100 - latestPercent}%`;
      animating = false;
    }

    // Mouse hareketine göre width güncelle
    wrapper.addEventListener("mousemove", function (e) {
      const bounds = wrapper.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      latestPercent = Math.max(0, Math.min(100, (mouseX / bounds.width) * 100));

      if (!animating) {
        animating = true;
        requestAnimationFrame(updateWidths);
      }
    });

    // Mouse çıkınca %50'ye geri döner
    wrapper.addEventListener("mouseleave", function () {
      latestPercent = 50;
      if (!animating) {
        animating = true;
        requestAnimationFrame(updateWidths);
      }
    });
  }

  // Tüm .plan-render-wrapper öğelerine fonksiyonu uygula
  document.querySelectorAll(".plan-render-wrapper").forEach((wrapper, index) => {
    setupPlanRenderHover(`.plan-render-wrapper:nth-of-type(${index + 1})`);
  });

  // ================================
  // 🔽 HEADER Scroll Shrink Efekti (Sadece Ana Sayfa)
  // ================================
  window.addEventListener("scroll", function () {
    const header = document.getElementById("site-header");
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("shrink");
      } else {
        header.classList.remove("shrink");
      }
    }
  });

  // ================================
  // 📧 İLETİŞİM FORMU - Mailto Fonksiyonu
  // ================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Mailto linki oluştur
      const subject = encodeURIComponent('KK Design - İletişim Formu');
      const body = encodeURIComponent(`Ad Soyad: ${name}\n\nE-posta: ${email}\n\nMesaj:\n${message}`);
      const mailtoLink = `mailto:kadirkalelidesign@gmail.com?subject=${subject}&body=${body}`;
      
      // Mail uygulamasını aç
      window.location.href = mailtoLink;
    });
  }
});
