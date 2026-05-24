/**
 * ================================================================
 * REHANI DJUMA — DATA ANALYST PORTFOLIO
 * script.js | Vanilla JavaScript — No Framework
 * ================================================================
 */

'use strict';

/* ================================================================
   1. PRELOADER
   ================================================================ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Hide after 2.1s (slightly after CSS fill animation ends)
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Kick off entrance animations
      document.body.style.overflow = '';
    }, 2100);
  });

  // Safety: also hide on DOMContentLoaded if load takes too long
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => preloader.classList.add('hidden'), 3500);
  });
})();

/* ================================================================
   2. CUSTOM CURSOR (desktop only)
   ================================================================ */
(function initCursor() {
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  if (!cursor || !cursorFollower) return;

  // Only on pointer devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower via RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Enlarge on interactive elements
  const hoverTargets = 'a, button, .skill-card, .project-card, .service-card, .filter-btn, input, textarea';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      cursorFollower.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      cursorFollower.classList.remove('cursor--hover');
    });
  });
})();

/* ================================================================
   3. NAVIGATION — Sticky, Scroll Highlight, Mobile Menu
   ================================================================ */
(function initNavigation() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = document.querySelectorAll('.nav__link');

  if (!navbar) return;

  // --- Sticky on scroll ---
  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // --- Mobile hamburger ---
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Active link on scroll ---
  const sections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    allLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
})();

/* ================================================================
   4. THEME TOGGLE — Dark / Light
   ================================================================ */
(function initThemeToggle() {
  const toggle    = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html      = document.documentElement;
  if (!toggle) return;

  // Persist preference
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
})();

/* ================================================================
   5. TYPING EFFECT — Hero Subtitle
   ================================================================ */
(function initTypingEffect() {
  const target = document.getElementById('typingText');
  if (!target) return;

  const phrases = [
    'décisions stratégiques',
    'insights actionnables',
    'visualisations claires',
    'dashboards percutants',
    'valeur pour votre business',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  const TYPING_SPEED   = 65;
  const DELETING_SPEED = 35;
  const PAUSE_BETWEEN  = 1800;

  function type() {
    const phrase = phrases[phraseIndex];

    if (!isDeleting) {
      target.textContent = phrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === phrase.length) {
        // Pause then start deleting
        setTimeout(() => { isDeleting = true; type(); }, PAUSE_BETWEEN);
        return;
      }
    } else {
      target.textContent = phrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(type, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  // Start after preloader
  setTimeout(type, 2500);
})();

/* ================================================================
   6. SCROLL ANIMATIONS (Lightweight AOS replacement)
   ================================================================ */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.aosDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
          // Animate once
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ================================================================
   7. SKILL BARS — Animate on Scroll
   ================================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-card__fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const width = bar.dataset.width || 0;
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 300);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
})();

/* ================================================================
   8. PROJECT FILTER
   ================================================================ */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        const match    = filter === 'all' || category === filter;

        if (match) {
          card.style.display = '';
          card.classList.remove('hidden');
          // Re-trigger entrance animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ================================================================
   9. BACK TO TOP BUTTON
   ================================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ================================================================
   10. CONTACT FORM — Validation + Feedback
   ================================================================ */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.querySelector('#contactName');
    const email   = form.querySelector('#contactEmail');
    const message = form.querySelector('#contactMessage');
    const btn     = form.querySelector('button[type="submit"]');

    // Simple validation
    let valid = true;

    [name, email, message].forEach(field => {
      if (!field.value.trim()) {
        shakeField(field);
        valid = false;
      }
    });

    if (email && !isValidEmail(email.value)) {
      shakeField(email);
      valid = false;
    }

    if (!valid) return;

    // Simulate sending
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours…';
    btn.disabled  = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Envoyer le message';
      btn.disabled  = false;
      form.reset();
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }
    }, 1800);
  });

  function shakeField(field) {
    field.style.borderColor = '#ff6b8a';
    field.style.animation   = 'none';
    // Force reflow
    void field.offsetWidth;
    field.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
      field.style.borderColor = '';
      field.style.animation   = '';
    }, 1000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();

/* ================================================================
   11. SMOOTH SCROLL for anchor links
   ================================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const top       = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ================================================================
   12. HERO PARALLAX (subtle)
   ================================================================ */
(function initParallax() {
  const orbs = document.querySelectorAll('.hero__orb');
  if (!orbs.length) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = 0.08 + i * 0.04;
          orb.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ================================================================
   13. COUNTER ANIMATION for Hero Stats
   ================================================================ */
(function initCounters() {
  const statNums = document.querySelectorAll('.hero__stat-num');
  if (!statNums.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el      = entry.target;
        const endVal  = parseInt(el.textContent) || 0;
        const suffix  = el.textContent.replace(/[0-9]/g, '');

        let current = 0;
        const increment = endVal / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= endVal) {
            el.textContent = endVal + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + suffix;
          }
        }, 30);

        observer.unobserve(el);
      });
    },
    { threshold: 0.8 }
  );

  statNums.forEach(el => observer.observe(el));
})();

/* ================================================================
   14. CSS Shake animation (injected dynamically)
   ================================================================ */
(function injectShakeAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ================================================================
   15. CARD TILT EFFECT (subtle 3D tilt on hover)
   ================================================================ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.skill-card, .service-card');
  if (!window.matchMedia('(pointer: fine)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) *  6;

      card.style.transform   = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.transition  = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
})();

/* ================================================================
   END OF SCRIPT
   ================================================================ */
