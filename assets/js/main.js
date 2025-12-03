/**
 * Vidun Jayakody Portfolio - Main JavaScript
 * Handles navigation, scroll animations, typing effect, and interactions
 */

(function() {
  'use strict';

  // ============================================
  // Utility Functions
  // ============================================
  
  /**
   * Check if user prefers reduced motion
   */
  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /**
   * Debounce function for performance
   */
  const debounce = (func, wait = 10) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // ============================================
  // Navigation
  // ============================================
  
  const initNavigation = () => {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
      });

      // Close menu when clicking a link
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    // Header scroll effect
    const handleScroll = debounce(() => {
      if (window.scrollY > 100) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }, 5);

    window.addEventListener('scroll', handleScroll);

    // Active section highlighting
    const highlightActiveSection = () => {
      const scrollY = window.scrollY;

      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', debounce(highlightActiveSection, 10));
  };

  // ============================================
  // Back to Top Button
  // ============================================
  
  const initBackToTop = () => {
    const backToTop = document.getElementById('back-to-top');
    
    if (!backToTop) return;

    const toggleVisibility = debounce(() => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, 10);

    window.addEventListener('scroll', toggleVisibility);
  };

  // ============================================
  // Scroll Reveal Animations
  // ============================================
  
  const initScrollReveal = () => {
    if (prefersReducedMotion()) {
      // If user prefers reduced motion, show all elements immediately
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  };

  // ============================================
  // Typing Effect
  // ============================================
  
  const initTypingEffect = () => {
    const typedElement = document.getElementById('typed-text');
    
    if (!typedElement) return;

    const phrases = [
      'Site Reliability Engineer',
      'Cybersecurity Enthusiast',
      'Cloud Infrastructure',
      'Photographer'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    const typeSpeed = 80;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const type = () => {
      if (prefersReducedMotion()) {
        // If reduced motion, just show the first phrase
        typedElement.textContent = phrases[0];
        return;
      }

      const currentPhrase = phrases[phraseIndex];

      if (isPaused) {
        setTimeout(type, pauseTime);
        isPaused = false;
        isDeleting = true;
        return;
      }

      if (isDeleting) {
        typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      } else {
        typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
          isPaused = true;
        }
      }

      const speed = isDeleting ? deleteSpeed : typeSpeed;
      setTimeout(type, speed);
    };

    // Start typing after a short delay
    setTimeout(type, 1000);
  };

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const headerHeight = document.getElementById('header').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          
          if (prefersReducedMotion()) {
            window.scrollTo(0, targetPosition);
          } else {
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  };

  // ============================================
  // Form Enhancement
  // ============================================
  
  const initFormEnhancements = () => {
    const form = document.querySelector('.contact__form');
    
    if (!form) return;

    // Add focus styling to form groups
    const inputs = form.querySelectorAll('.form__input, .form__textarea');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
      });
    });

    // Form submission feedback
    form.addEventListener('submit', function(e) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<span>Sending...</span><i class="bx bx-loader-alt bx-spin"></i>';
      submitBtn.disabled = true;
      
      // Note: The form will naturally submit to Formspree
      // This is just visual feedback
      
      // Re-enable after a timeout (Formspree will redirect anyway)
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 5000);
    });
  };

  // ============================================
  // Skill Tags Hover Effect
  // ============================================
  
  const initSkillTagsEffect = () => {
    if (prefersReducedMotion()) return;

    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
      tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
      });
      
      tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    });
  };

  // ============================================
  // Project Cards Tilt Effect (Subtle)
  // ============================================
  
  const initCardEffects = () => {
    if (prefersReducedMotion()) return;

    const cards = document.querySelectorAll('.project-card, .article-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
      });
    });
  };

  // ============================================
  // Keyboard Navigation Enhancement
  // ============================================
  
  const initKeyboardNav = () => {
    // Add visible focus states when using keyboard
    let isUsingKeyboard = false;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        isUsingKeyboard = true;
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      isUsingKeyboard = false;
      document.body.classList.remove('keyboard-nav');
    });

    // Escape key closes mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    });
  };

  // ============================================
  // Lazy Loading for Images
  // ============================================
  
  const initLazyLoading = () => {
    // Native lazy loading is already in HTML via loading="lazy"
    // This adds a fade-in effect when images load
    
    if (prefersReducedMotion()) return;

    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
      
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', function() {
          this.style.opacity = '1';
        });
      }
    });
  };

  // ============================================
  // Initialize Everything
  // ============================================
  
  const init = () => {
    initNavigation();
    initBackToTop();
    initScrollReveal();
    initTypingEffect();
    initSmoothScroll();
    initFormEnhancements();
    initSkillTagsEffect();
    initCardEffects();
    initKeyboardNav();
    initLazyLoading();

    // Add loaded class to body for any initial animations
    document.body.classList.add('loaded');
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

