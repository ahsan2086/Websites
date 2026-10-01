/**
 * Redox - Creative Agency & Portfolio Theme Clone
 * Interactive Scripts: Preloader, Custom Cursor, Sticky Header,
 * Mobile Menu, Back to Top, Number Counters, and Hover Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Preloader Dismissal ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 400);
    });
    // Fallback if load already triggered
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 1200);
  }

  // --- 2. Custom Cursor Follower ---
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const renderCursor = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Hover interactive items
    const hoverTargets = document.querySelectorAll('[data-cursor-text], a, button, .portfolio-card');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        const text = target.getAttribute('data-cursor-text');
        if (text) {
          cursor.classList.add('active');
          cursor.textContent = text;
        } else {
          cursor.style.transform += ' scale(1.5)';
        }
      });
      target.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursor.textContent = '';
      });
    });
  }

  // --- 3. Sticky Header on Scroll ---
  const header = document.querySelector('.header-area');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // --- 4. Back to Top with Circular Scroll Progress ---
  const progressWrap = document.querySelector('.progress-wrap');
  const progressPath = document.querySelector('.progress-wrap path');
  if (progressWrap && progressPath) {
    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

    const updateProgress = () => {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength) / height;
      progressPath.style.strokeDashoffset = progress;

      if (scroll > 250) {
        progressWrap.classList.add('active-progress');
      } else {
        progressWrap.classList.remove('active-progress');
      }
    };

    window.addEventListener('scroll', updateProgress);
    progressWrap.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 5. Mobile Drawer Toggle ---
  const sideToggleBtn = document.querySelector('.side-toggle-btn');
  const sideDrawer = document.querySelector('.side-drawer');
  const sideDrawerClose = document.querySelector('.side-drawer-close');
  const offcanvasOverlay = document.querySelector('.offcanvas-overlay');

  const openDrawer = () => {
    sideDrawer.classList.add('open');
    offcanvasOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    sideDrawer.classList.remove('open');
    offcanvasOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (sideToggleBtn) sideToggleBtn.addEventListener('click', openDrawer);
  if (sideDrawerClose) sideDrawerClose.addEventListener('click', closeDrawer);
  if (offcanvasOverlay) offcanvasOverlay.addEventListener('click', closeDrawer);

  // --- 6. Number Counter Animation for Perfect Activity Stats ---
  const statNumbers = document.querySelectorAll('.stat-item-block .number, .hero-metric-item .stat-number');
  const animateCounter = (el) => {
    const rawText = el.getAttribute('data-target') || el.innerText.trim();
    const match = rawText.match(/([0-9.]+)(.*)/);
    if (!match) return;

    const targetVal = parseFloat(match[1]);
    const suffix = match[2] || '';
    const isDecimal = rawText.includes('.');
    const duration = 1800;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = targetVal * eased;

      el.innerText = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = rawText;
      }
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach((num) => {
    num.setAttribute('data-target', num.innerText.trim());
    counterObserver.observe(num);
  });

  // --- 7. Newsletter Form Feedback ---
  const newsletterForm = document.querySelector('.footer-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value) {
        const originalText = input.placeholder;
        input.value = '';
        input.placeholder = 'Thank you for subscribing!';
        setTimeout(() => {
          input.placeholder = originalText;
        }, 3000);
      }
    });
  }
});
