/* =============================================
   Main JS — Navigation, Scroll Reveals, 
   Slider Revelation, and Form Validation
   ============================================= */
(function () {
  'use strict';

  /* ================================
     Preloader
     ================================ */
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  if (preloader && preloaderBar) {
    // Prevent scroll while loading
    document.body.style.overflow = 'hidden';
    // Animate the bar slowly for a premium feel
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5 + 3;
      if (progress > 85) progress = 85;
      preloaderBar.style.width = progress + '%';
    }, 350);

    window.addEventListener('load', () => {
      clearInterval(interval);
      // Smooth finish
      preloaderBar.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 800);
    });
  }

  /* ---- DOM Cache ---- */
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav__link[data-nav]');
  const mobileLinks = document.querySelectorAll('[data-mobile-nav]');
  const contactForm = document.getElementById('contact-form');

  /* ================================
     Navigation — scroll glass effect
     ================================ */
  let lastScrollY = 0;
  const scrollThreshold = 60;

  function handleNavScroll() {
    const sy = window.scrollY;
    if (sy > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = sy;
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ================================
     Active nav link highlighting
     ================================ */
  const sections = document.querySelectorAll('section[id], .projects-header[id], footer[id]');

  function highlightActiveLink() {
    let current = '';
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 200) {
        current = sec.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.nav === current);
    });
  }
  window.addEventListener('scroll', highlightActiveLink, { passive: true });

  /* ================================
     Hamburger menu
     ================================ */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ================================
     Scroll Reveal with IntersectionObserver
     ================================ */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('revealed');

          // Stagger children if applicable
          if (el.classList.contains('reveal--stagger')) {
            const children = el.children;
            Array.from(children).forEach((child, i) => {
              child.style.transitionDelay = `${i * 120}ms`;
              child.classList.add('revealed-child');
            });
          }

          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  /* ================================
     Smooth scroll for anchor links
     ================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ================================
     Slider Revelation Effect
     Horizontal wipe-in reveal on scroll
     ================================ */
  const sliderElements = document.querySelectorAll('.slider-reveal');

  if (sliderElements.length) {
    const sliderObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('slider-revealed');
            sliderObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    sliderElements.forEach((el) => sliderObserver.observe(el));
  }

  /* ================================
     Contact Form — Basic Validation
     ================================ */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('form-name');
      const email = document.getElementById('form-email');
      const message = document.getElementById('form-message');

      let valid = true;

      [name, email, message].forEach((input) => {
        if (!input.value.trim()) {
          input.style.borderColor = 'var(--clr-coral-red)';
          valid = false;
        } else {
          input.style.borderColor = 'rgba(255,255,255,0.15)';
        }
      });

      // Email format check
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = 'var(--clr-coral-red)';
        valid = false;
      }

      if (valid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.textContent = 'Message Sent ✓';
        btn.style.background = 'var(--clr-mint)';
        btn.style.color = 'var(--clr-near-black)';
        contactForm.reset();
        setTimeout(() => {
          btn.innerHTML = 'Send Message <svg class="btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
          btn.style.background = '';
          btn.style.color = '';
        }, 3000);
      }
    });
  }

})();
