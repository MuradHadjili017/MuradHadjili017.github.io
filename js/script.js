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
})();
