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

  /* ================================
     Typewriter Effect — Hero Title
     + AMAZE Font Cycling Animation
       ================================ */
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    const fullText = heroTitle.dataset.typewriter || '';
    heroTitle.innerHTML = '<span class="typewriter-cursor"></span>';

    // Font styles to cycle through for "AMAZE"
    const amazeFontStyles = [
      { weight: 300, style: 'normal', spacing: '0.04em' },    // Light
      { weight: 700, style: 'normal', spacing: '0em' },       // Bold
      { weight: 900, style: 'italic', spacing: '0em' },       // Black italic
      { weight: 400, style: 'normal', spacing: '0.04em' },    // Regular spaced
      { weight: 800, style: 'normal', spacing: '-0.02em' },   // ExtraBold
    ];
    let fontIndex = 0;

    // Wait for preloader to finish before starting typewriter
    const startTypewriter = () => {
      let i = 0;
      const speed = 55;

      const type = () => {
        if (i < fullText.length) {
          const currentText = fullText.substring(0, i + 1);
          // Highlight "AMAZE" in mint color
          const highlighted = currentText.replace(/AMAZE/g, '<span class="text-mint amaze-morph">AMAZE</span>');
          heroTitle.innerHTML = highlighted + '<span class="typewriter-cursor"></span>';
          i++;
          setTimeout(type, speed);
        } else {
          // After typing finishes, start AMAZE cycling after a brief pause
          setTimeout(startAmazeCycle, 2500);
        }
      };

      setTimeout(type, 600); // Small delay after preloader
    };

    // AMAZE delete-and-retype cycling
    function startAmazeCycle() {
      const amazeWord = 'AMAZE';
      let charCount = amazeWord.length;

      // Delete phase
      function deleteChar() {
        if (charCount > 0) {
          charCount--;
          const partial = amazeWord.substring(0, charCount);
          updateAmazeText(partial, amazeFontStyles[fontIndex]);
          setTimeout(deleteChar, 190);
        } else {
          // Switch font style
          fontIndex = (fontIndex + 1) % amazeFontStyles.length;
          // Brief pause then retype
          setTimeout(retypeChar, 600);
        }
      }

      // Retype phase with new font
      function retypeChar() {
        if (charCount < amazeWord.length) {
          charCount++;
          const partial = amazeWord.substring(0, charCount);
          updateAmazeText(partial, amazeFontStyles[fontIndex]);
          setTimeout(retypeChar, 200);
        } else {
          // Fully retyped, pause then start delete again
          setTimeout(deleteChar, 2000);
        }
      }

      function updateAmazeText(text, fontStyle) {
        const prefix = fullText.substring(0, fullText.indexOf('AMAZE'));
        const suffix = fullText.substring(fullText.indexOf('AMAZE') + 5);

        const styleStr = `font-weight:${fontStyle.weight};font-style:${fontStyle.style};letter-spacing:${fontStyle.spacing}`;
        const amazeSpan = text
          ? `<span class="text-mint amaze-morph" style="${styleStr}">${text}</span>`
          : '';

        heroTitle.innerHTML = prefix + amazeSpan + suffix + '<span class="typewriter-cursor"></span>';

        // Keep cursor blinking
        const cursor = heroTitle.querySelector('.typewriter-cursor');
        if (cursor) cursor.style.opacity = '1';
      }

      // Start the first delete cycle
      deleteChar();
    }

    // Start after preloader hides
    if (preloader) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          if (m.target.classList.contains('hidden')) {
            startTypewriter();
            observer.disconnect();
          }
        });
      });
      observer.observe(preloader, { attributes: true, attributeFilter: ['class'] });
    } else {
      startTypewriter();
    }
  }


  /* ================================
     Scroll Progress Indicator
     ================================ */
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    }, { passive: true });
  }


  /* ================================
     About Section — Split-screen Slide
     ================================ */
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('split-revealed');
            aboutObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    aboutObserver.observe(aboutSection);
  }

  /* ================================
     Text Highlight Scroll Trigger
     ================================ */
  const highlightElements = document.querySelectorAll('.text-highlight');
  if (highlightElements.length > 0) {
    const highlightObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active-highlight');
            highlightObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 1, rootMargin: '0px 0px -50px 0px' }
    );
    highlightElements.forEach((el) => highlightObserver.observe(el));
  }


  /* ================================
     Service Cards — 3D Tilt Effect
     ================================ */
  const serviceItems = document.querySelectorAll('.service-item');
  serviceItems.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('tilt-active');
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 24px rgba(0, 0, 0, 0.3)`;
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilt-active');
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });


  /* ================================
     Improved Curtain Reveal — Staggered
     ================================ */
  const galleryItems = document.querySelectorAll('.project-gallery .slider-reveal');
  galleryItems.forEach((item, index) => {
    // Add staggered delay based on position in the grid
    const row = Math.floor(index / 3);
    const col = index % 3;
    const delay = (row * 0.15) + (col * 0.1);
    item.style.transitionDelay = `${delay}s`;
    const beforeEl = item;
    beforeEl.style.setProperty('--curtain-delay', `${delay}s`);
  });

  /* ================================
     Interactive Particle Network — Hero Section
     ================================ */
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const mouse = { x: null, y: null };

    // Config
    const config = {
      particleColor: 'rgba(120, 189, 149, 0.6)', // #78BD95 with opacity
      lineColor: 'rgba(120, 189, 149, 0.2)',
      particleCount: window.innerWidth > 768 ? 80 : 40,
      linkDistance: 150,
      mouseDist: 200
    };

    function resize() {
      width = window.innerWidth;
      height = document.getElementById('hero').offsetHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (push away gently)
        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x;
          // Compensate for scroll when checking Y if hero takes full screen but scrolled
          const rect = canvas.getBoundingClientRect();
          const dy = (mouse.y - rect.top) - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.mouseDist) {
            const forceDirectionX = dx / dist;
            const forceDirectionY = dy / dist;
            const force = (config.mouseDist - dist) / config.mouseDist;

            this.x -= forceDirectionX * force * 2;
            this.y -= forceDirectionY * force * 2;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = config.particleColor;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Check links
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.linkDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = 1 - (dist / config.linkDistance);
            ctx.strokeStyle = config.lineColor.replace('0.2)', `${opacity * 0.4})`);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }

    // Event listeners
    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Start
    resize();
    initParticles();
    animateParticles();
  }

})();
