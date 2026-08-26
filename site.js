/* Khatib Laboratory — shared site behavior
   Keep common interaction and auto-updating logic here. */

(() => {
  'use strict';

  // Navigation: shrink on scroll, accessible mobile menu, close on Escape/link click.
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (nav) {
    const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  if (toggle && links) {
    const setMenu = (open) => {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  }

  // Reveal animations, with graceful fallback and reduced-motion support.
  const revealEls = [...document.querySelectorAll('.reveal')];
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  }

  // Security hardening for every link that opens a new tab.
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    const rel = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    a.setAttribute('rel', [...rel].join(' '));
  });

  // Publications page: derive counts and numbering from the actual publication rows.
  const pubItems = [...document.querySelectorAll('.pub-item')];
  if (pubItems.length) {
    const total = pubItems.length;
    pubItems.forEach((item, index) => {
      const num = item.querySelector('.pub-item__num');
      if (num) num.textContent = String(total - index);
    });

    document.querySelectorAll('[data-publication-count]').forEach(el => {
      el.textContent = String(total);
    });
    const banner = document.querySelector('.pub-banner');
    if (banner) banner.dataset.count = String(total);

    const allTags = [...document.querySelectorAll('.pub-tag')].map(el => el.textContent.trim().toLowerCase());
    const editorHighlights = allTags.filter(t => t.includes('editor highlight')).length;
    const coverFeatures = allTags.filter(t => t.includes('cover feature')).length;
    const years = pubItems.flatMap(item => [...item.textContent.matchAll(/\b(?:19|20)\d{2}\b/g)].map(m => Number(m[0])));
    const earliestYear = years.length ? Math.min(...years) : null;

    const editorEl = document.querySelector('[data-stat="editor-highlights"]');
    const coverEl = document.querySelector('[data-stat="cover-features"]');
    const sinceEl = document.querySelector('[data-stat="research-since"]');
    if (editorEl) editorEl.textContent = String(editorHighlights);
    if (coverEl) coverEl.textContent = String(coverFeatures);
    if (sinceEl && earliestYear) sinceEl.textContent = String(earliestYear);
  }

  // Homepage: keep the publication count and four-item preview synchronized with publications.html.
  // Static markup remains as a fallback when the site is opened directly from a local file.
  const homePreview = document.querySelector('.pub-preview__list');
  if (homePreview) {
    fetch('publications.html')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const items = [...doc.querySelectorAll('.pub-item')];
        if (!items.length) return;

        const total = items.length;
        document.querySelectorAll('[data-publication-count]').forEach(el => {
          el.textContent = String(total);
        });

        homePreview.innerHTML = '';
        items.slice(0, 4).forEach((item, index) => {
          const row = document.createElement('div');
          row.className = 'pub-row reveal visible';

          const num = document.createElement('span');
          num.className = 'pub-row__num';
          num.textContent = String(total - index);

          const body = document.createElement('div');
          body.className = 'pub-row__body';
          body.innerHTML = item.querySelector('.pub-item__body')?.innerHTML
            .replaceAll('pub-title', 'title')
            .replaceAll('pub-journal', 'journal') || '';

          const badges = document.createElement('div');
          badges.className = 'pub-row__badge';
          const sourceBadges = item.querySelector('.pub-item__badges');
          if (sourceBadges) {
            badges.innerHTML = sourceBadges.innerHTML
              .replaceAll('pub-tag', 'tag')
              .replaceAll('tag--gold', 'tag--gold')
              .replaceAll('tag--teal', 'tag--teal')
              .replaceAll('tag--rust', 'tag--rust');
          }

          row.append(num, body, badges);
          homePreview.appendChild(row);
        });
      })
      .catch(() => {
        // Local file:// viewing blocks fetch in many browsers; the embedded fallback remains usable.
      });
  }
})();
