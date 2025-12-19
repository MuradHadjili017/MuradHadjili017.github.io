// script.js — minimal JS for navigation and small enhancements
(function(){
  'use strict'
  // Toggle mobile nav
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');
  if(btn && nav){
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const isHidden = nav.getAttribute('aria-hidden') === 'false';
      // Use aria-hidden for simple show/hide state
      if(nav.style.display === 'block'){
        nav.style.display = '';
        nav.setAttribute('aria-hidden','true');
      } else {
        nav.style.display = 'block';
        nav.setAttribute('aria-hidden','false');
      }
    });
  }

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  // Smooth in-page links (if any)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
    });
  });

  // Page transition animations (exit before navigate, entrance on load)
  (function(){
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      const cssTime = getComputedStyle(document.documentElement).getPropertyValue('--page-transition-time');
      const transitionTime = Number(cssTime.replace(/[^\d]/g,'')) || 380;

      // Add entry class and remove it after the frame to trigger enter animation
      document.body.classList.add('is-entering');
      window.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(() => { document.body.classList.remove('is-entering'); });
      });

      // Intercept internal link clicks to play exit animation first
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || a.target === '_blank' || a.hasAttribute('download') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return;
        // Same-document hash navigation — allow default
        if (url.pathname === location.pathname && url.search === location.search && url.hash) return;

        e.preventDefault();
        document.body.classList.add('is-exiting');

        const main = document.querySelector('main');
        const finish = () => { window.location.href = url.href; };

        if (main) {
          const onEnd = (ev) => {
            if (ev && ev.target !== main) return;
            main.removeEventListener('transitionend', onEnd);
            finish();
          };
          main.addEventListener('transitionend', onEnd);
          // Fallback timeout in case transitionend doesn't fire
          setTimeout(() => {
            main.removeEventListener('transitionend', onEnd);
            finish();
          }, transitionTime + 80);
        } else {
          setTimeout(finish, transitionTime + 80);
        }
      });

      // Clean up classes on pageshow (bfcache)
      window.addEventListener('pageshow', () => {
        document.body.classList.remove('is-exiting');
        document.body.classList.remove('is-entering');
      });
    }
  })();


})();
