/**
 * Main JS — GSAP animations, navigation, FAQ accordion
 */
(function () {
  'use strict';

  // Wait for GSAP
  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return setTimeout(init, 50);
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Scroll progress bar ---
    var progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      gsap.to(progressBar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3
        }
      });
    }

    // --- Header scroll effect ---
    var header = document.getElementById('header');
    if (header) {
      ScrollTrigger.create({
        start: 'top -80',
        onUpdate: function (self) {
          if (self.scroll() > 80) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }
      });
    }

    // --- Reveal animations ---
    var reveals = gsap.utils.toArray('.reveal');
    reveals.forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    // Reveal left
    gsap.utils.toArray('.reveal-left').forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    // Reveal right
    gsap.utils.toArray('.reveal-right').forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    // Reveal scale
    gsap.utils.toArray('.reveal-scale').forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    // Stagger product cards
    var cardGrids = gsap.utils.toArray('.card-grid');
    cardGrids.forEach(function (grid) {
      var cards = grid.querySelectorAll('.product-card, .feature-card');
      if (cards.length) {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            once: true
          }
        });
      }
    });

    // Stagger icon boxes
    var iconGrids = gsap.utils.toArray('.icon-box-grid');
    iconGrids.forEach(function (grid) {
      var boxes = grid.querySelectorAll('.icon-box');
      if (boxes.length) {
        gsap.to(boxes, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 88%',
            once: true
          }
        });
      }
    });

    // Stagger trust items
    var trustItems = gsap.utils.toArray('.trust-items');
    trustItems.forEach(function (bar) {
      var items = bar.querySelectorAll('.trust-item');
      if (items.length) {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 90%',
            once: true
          }
        });
      }
    });

    // Hero sequence
    var heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      var heroEls = heroContent.querySelectorAll('.reveal');
      gsap.to(heroEls, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: false
      });
    }
  }

  // --- Mobile nav ---
  document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('open');
      });

      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
        });
      });
    }

    // --- FAQ accordion ---
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = this.parentElement;
        var answer = item.querySelector('.faq-answer');
        var isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item').forEach(function (i) {
          i.classList.remove('open');
          i.querySelector('.faq-answer').style.maxHeight = null;
        });

        // Open clicked
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });

    // --- Product filter ---
    var filterBtns = document.querySelectorAll('.filter-btn');
    var productCards = document.querySelectorAll('.product-card[data-category]');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = this.dataset.filter;

        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        productCards.forEach(function (card) {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    init();
  });
})();
