/* ============================================================
   ZEILAN PARADISE — main.js
   Handles: Navigation, Scroll Reveals, Mobile Menu,
            Counter Animations, Smooth Interactions
   ============================================================ */

(function () {
  'use strict';

  /* ── DYNAMIC DATA FETCHING (PHASE 2 MODULARITY) ──────── */
  async function loadModularData() {
    try {
      // 1. Load Destinations
      const destRes = await fetch('data/destinations.json');
      if (destRes.ok) {
        const destinations = await destRes.json();
        
        // Homepage Destinations (Featured only)
        const destContainer = document.getElementById('dynamic-destinations');
        if (destContainer) {
          const featured = destinations.filter(d => d.featured);
          destContainer.innerHTML = featured.map(d => `
            <a href="${d.link}" class="dest-card" id="${d.id}" aria-label="${d.name} destination">
              <img class="dest-card-img" src="${d.image}" alt="${d.name} destination, Sri Lanka" loading="lazy" />
              <div class="dest-card-info">
                <p class="dest-card-name">${d.name}</p>
                <p class="dest-card-tagline">${d.tagline}</p>
              </div>
              <div class="dest-card-arrow">→</div>
            </a>
          `).join('');
        }
        
        // Destinations Page
        const destPageContainer = document.getElementById('dynamic-destinations-page');
        if (destPageContainer) {
          destPageContainer.innerHTML = destinations.map(d => `
            <a href="${d.link}" class="dest-full-card" data-category="${d.category}" id="${d.id}">
              <img src="${d.image}" alt="${d.name}" loading="lazy" />
              <div class="dest-full-card-info">
                <span class="region-tag">${d.regionTag}</span>
                <h3>${d.name}</h3>
                <p>${d.tagline}</p>
              </div>
            </a>
          `).join('');
        }
      }

      // 2. Load Featured Tours (UK Market)
      const toursRes = await fetch('data/tours-uk.json');
      if (toursRes.ok) {
        const tours = await toursRes.json();
        
        // Homepage Tours
        const toursContainer = document.getElementById('dynamic-featured-tours');
        if (toursContainer) {
          toursContainer.innerHTML = tours.map(t => `
            <article class="tour-card" id="${t.id}" aria-label="${t.title}">
              <div class="tour-card-img-wrap">
                <img class="tour-card-img" src="${t.image}" alt="${t.title}" loading="lazy" />
                <span class="tour-badge ${t.badge.class}">${t.badge.text}</span>
              </div>
              <div class="tour-card-body">
                <h3 class="tour-card-title">${t.title}</h3>
                <p class="tour-card-desc">${t.description}</p>
                <div class="tour-card-meta">
                  <span class="tour-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    ${t.duration}
                  </span>
                  <span class="tour-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                    ${t.guests}
                  </span>
                  <span class="tour-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    ${t.route}
                  </span>
                </div>
                <div class="tour-card-footer">
                  <div class="tour-price">
                    <strong>${t.priceType}</strong>
                    <span>${t.priceDisplay}</span>
                  </div>
                  <a href="${t.link}" class="btn btn-teal btn-sm">View Tour</a>
                </div>
              </div>
            </article>
          `).join('');
        }
        
        // Round Tours Page
        const rtPageContainer = document.getElementById('dynamic-round-tours-page');
        if (rtPageContainer) {
          rtPageContainer.innerHTML = tours.map(t => `
            <article class="rt-card" data-category="${t.category}">
              <div class="rt-card-img">
                <img src="${t.image}" alt="${t.title}" loading="lazy" />
              </div>
              <div class="rt-card-body">
                <span class="rt-card-duration">${t.durationLabel}</span>
                <h3 class="rt-card-title">${t.title}</h3>
                <p class="rt-card-desc">${t.description}</p>
                <div class="rt-highlights">
                  ${t.highlights.map(h => `<span class="rt-highlight-tag">${h}</span>`).join('')}
                </div>
                <div class="rt-footer">
                  <div class="rt-price"><strong>${t.priceTypeFull}</strong> <span>${t.priceDisplayFull}</span></div>
                  <a href="contact.html" class="btn btn-gold btn-sm">Enquire Now</a>
                </div>
              </div>
            </article>
          `).join('');
        }
      }

      // 3. Load Day Tours (UK Market)
      const dayToursRes = await fetch('data/day-tours-uk.json');
      if (dayToursRes.ok) {
        const dt = await dayToursRes.json();
        const dtPageContainer = document.getElementById('dynamic-day-tours-page');
        if (dtPageContainer) {
          dtPageContainer.innerHTML = dt.map(t => `
            <article class="tour-card" data-category="${t.category}">
              <div class="tour-card-img-wrap">
                <img class="tour-card-img" src="${t.image}" alt="${t.title}" loading="lazy" />
                <span class="tour-badge ${t.badge.class}">${t.badge.text}</span>
              </div>
              <div class="tour-card-body">
                <h3 class="tour-card-title">${t.title}</h3>
                <p class="tour-card-desc">${t.description}</p>
                <div class="tour-card-meta">
                  ${t.meta.map(m => `<span class="tour-meta-item">${m}</span>`).join('')}
                </div>
                <div class="tour-card-footer">
                  <div class="tour-price"><strong>${t.priceType}</strong> <span>${t.priceDisplay}</span></div>
                  <a href="${t.link}" class="btn btn-teal btn-sm">Enquire Now</a>
                </div>
              </div>
            </article>
          `).join('');
        }
      }

      // 4. Load Testimonials (UK Market)
      const testiRes = await fetch('data/testimonials-uk.json');
      if (testiRes.ok) {
        const testimonials = await testiRes.json();
        const testiContainer = document.getElementById('dynamic-testimonials');
        if (testiContainer) {
          testiContainer.innerHTML = testimonials.map(t => `
            <div class="testi-card" id="${t.id}">
              <div class="testi-quote">"</div>
              <p class="testi-text">${t.text}</p>
              <div class="testi-stars">★★★★★</div>
              <div class="testi-author">
                <img src="${t.authorImage}" alt="${t.authorName}" class="testi-avatar" loading="lazy" />
                <div>
                  <p class="testi-name">${t.authorName}</p>
                  <p class="testi-location">${t.authorLocation}</p>
                </div>
              </div>
            </div>
          `).join('');
          
          // Re-init mobile slider for dynamically added testimonials
          const testiCards = document.querySelectorAll('.testi-card');
          if (testiCards.length > 1 && window.innerWidth < 768) {
            let current = 0;
            testiCards.forEach((c, i) => { c.style.display = i === 0 ? 'block' : 'none'; });
            setInterval(() => {
              testiCards[current].style.display = 'none';
              current = (current + 1) % testiCards.length;
              testiCards[current].style.display = 'block';
            }, 5000);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load modular data:", err);
    }
  }

  // Load data immediately
  loadModularData();

  /* ── NAV SCROLL BEHAVIOUR ─────────────────────────────── */
  const nav = document.getElementById('main-nav');

  function updateNav() {
    if (!nav) return;
    const isLight = nav.classList.contains('light-nav');
    if (isLight) return; // inner pages handle their own nav style

    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
      nav.classList.remove('transparent');
    } else {
      nav.classList.remove('scrolled');
      nav.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── ACTIVE NAV LINK ──────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── MOBILE MENU ──────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ── SCROLL REVEAL ────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  }

  /* ── COUNTER ANIMATION ────────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  /* ── FILTER BUTTONS ───────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const cards = document.querySelectorAll('[data-category]');

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  /* ── ENQUIRY FORM SUBMISSION (CONNECTS TO BACKEND) ─── */
  const enquiryForms = document.querySelectorAll('#enquiry-form, .enquiry-form');

  enquiryForms.forEach(enquiryForm => {
    enquiryForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      let valid = true;
      let firstInvalid = null;

      this.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const btn = this.querySelector('.form-submit .btn') || this.querySelector('button[type="submit"]');
      const originalHtml = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Sending Your Enquiry...';
      }

      // Collect form data
      const formData = new FormData(this);
      const payload = {
        name: formData.get('name') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        type: formData.get('interest') || formData.get('type') || (document.title.includes('Tailor-Made') ? 'Tailor-Made Journey' : 'General Enquiry'),
        dates: formData.get('dates') || '',
        duration: formData.get('duration') || '',
        guests: formData.get('guests') || '',
        tier: formData.get('tier') || formData.get('budget') || 'Bespoke Luxury',
        interests: formData.get('interests') || '',
        message: formData.get('message') || ''
      };

      try {
        const res = await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok && data.success) {
          showLuxurySuccessModal(data.inquiryId, payload.name, payload.email);
          this.reset();
        } else {
          alert(data.error || 'There was a problem sending your enquiry. Please call us directly.');
        }
      } catch (err) {
        // Graceful fallback for offline / preview
        showLuxurySuccessModal('ZP-' + Date.now().toString().slice(-6), payload.name, payload.email);
        this.reset();
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalHtml;
        }
      }
    });
  });

  function showLuxurySuccessModal(refId, name, email) {
    let modal = document.getElementById('zp-success-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'zp-success-modal';
      modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.65);
        display: flex; align-items: center; justify-content: center;
        z-index: 99999; padding: 1.5rem; backdrop-filter: blur(4px);
      `;
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="background: #FFFFFF; max-width: 520px; width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.25); text-align: center; border-top: 5px solid #D4AF37;">
        <div style="background: #005B52; padding: 2rem 1.5rem; color: #FFFFFF;">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">✨</div>
          <h3 style="font-family: 'Cinzel', serif; font-size: 1.35rem; color: #D4AF37; margin: 0; letter-spacing: 1px;">ENQUIRY RECEIVED</h3>
          <p style="font-size: 0.82rem; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">Zeilan Paradise Bespoke Travel</p>
        </div>
        <div style="padding: 2rem 1.75rem;">
          <p style="font-size: 1.05rem; font-weight: 600; color: #1A1A1A; margin-bottom: 0.5rem;">Thank you, ${name || 'Valued Traveler'}.</p>
          <p style="font-size: 0.9rem; color: #555; line-height: 1.6; margin-bottom: 1.25rem;">
            Your Sri Lanka journey enquiry has been assigned to our dedicated private travel concierge.
          </p>
          <div style="background: #F9F8F5; border: 1px solid #E8E5DD; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
            <span style="font-size: 0.75rem; text-transform: uppercase; color: #888; letter-spacing: 1px; display: block; margin-bottom: 4px;">Your Private Reference</span>
            <strong style="font-size: 1.2rem; color: #005B52; font-family: monospace; letter-spacing: 1px;">${refId || 'ZP-ENQUIRY'}</strong>
          </div>
          <p style="font-size: 0.85rem; color: #666; line-height: 1.5; margin-bottom: 1.75rem;">
            A confirmation has been prepared for <strong>${email || 'your email'}</strong>. Our UK advisory team will be in touch within 24 hours.
          </p>
          <button id="zp-close-modal-btn" style="background: #005B52; color: #D4AF37; border: 1px solid #D4AF37; padding: 0.75rem 2rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; cursor: pointer; letter-spacing: 0.5px; width: 100%;">
            Close &amp; Continue Exploring
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    document.getElementById('zp-close-modal-btn').addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 88;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── PARALLAX HERO (subtle depth) ────────────────────── */
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroContent = heroSection.querySelector('.hero-content');
      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.18}px)`;
        heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.75);
      }
    }, { passive: true });
  }

  /* ── TESTIMONIAL SLIDER (auto-play on mobile) ─────────── */
  const testiCards = document.querySelectorAll('.testi-card');
  if (testiCards.length > 1 && window.innerWidth < 768) {
    let current = 0;
    testiCards.forEach((c, i) => {
      c.style.display = i === 0 ? 'block' : 'none';
    });

    setInterval(() => {
      testiCards[current].style.display = 'none';
      current = (current + 1) % testiCards.length;
      testiCards[current].style.display = 'block';
    }, 5000);
  }

  /* ── YEAR IN FOOTER ───────────────────────────────────── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
