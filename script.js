// ============================================================
// Sri Shanmuga Earth Movers – script.js
// Features: Navbar, Mobile Menu, Scroll Reveal, Gallery
//           Lightbox, Form Validation, WhatsApp Submit,
//           Scroll-to-Top
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     1. NAVBAR – Scroll Effect
  ============================================= */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  /* =============================================
     2. HAMBURGER / MOBILE MENU
  ============================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });


  /* =============================================
     3. SMOOTH SCROLLING for anchor links
  ============================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* =============================================
     4. SCROLL REVEAL ANIMATION
  ============================================= */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation for sibling cards
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let delay = 0;
          siblings.forEach((el, i) => {
            if (el === entry.target) delay = i * 80;
          });
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* =============================================
     5. GALLERY LIGHTBOX
  ============================================= */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxCap  = document.getElementById('lightboxCaption');
  const closeBtn     = document.getElementById('lightboxClose');
  const prevBtn      = document.getElementById('lightboxPrev');
  const nextBtn      = document.getElementById('lightboxNext');
  let currentIndex   = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item  = galleryItems[index];
    const img   = item.querySelector('img');
    const title = item.getAttribute('data-title') || '';
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCap.textContent = title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });


  /* =============================================
     6. ENQUIRY FORM – Validation + WhatsApp Submit
  ============================================= */
  const form = document.getElementById('enquiryForm');

  function getField(id) { return document.getElementById(id); }
  function getError(id) { return document.getElementById(id + 'Error'); }

  function showError(id, msg) {
    const el = getError(id);
    if (el) el.textContent = msg;
    const field = getField(id);
    if (field) field.style.borderColor = '#FF6B6B';
  }

  function clearError(id) {
    const el = getError(id);
    if (el) el.textContent = '';
    const field = getField(id);
    if (field) field.style.borderColor = '';
  }

  function validateForm() {
    let valid = true;

    // Name
    const name = getField('name').value.trim();
    if (!name) {
      showError('name', 'Please enter your full name.');
      valid = false;
    } else if (name.length < 2) {
      showError('name', 'Name must be at least 2 characters.');
      valid = false;
    } else {
      clearError('name');
    }

    // Mobile
    const mobile = getField('mobile').value.trim();
    if (!mobile) {
      showError('mobile', 'Please enter your mobile number.');
      valid = false;
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      showError('mobile', 'Enter a valid 10-digit Indian mobile number.');
      valid = false;
    } else {
      clearError('mobile');
    }

    // Email (optional but validate format if given)
    const email = getField('email').value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('email', 'Enter a valid email address.');
      valid = false;
    } else {
      clearError('email');
    }

    // Service
    const service = getField('service').value;
    if (!service) {
      showError('service', 'Please select a service.');
      valid = false;
    } else {
      clearError('service');
    }

    // Message
    const message = getField('message').value.trim();
    if (!message) {
      showError('message', 'Please enter your message or project location.');
      valid = false;
    } else if (message.length < 10) {
      showError('message', 'Please provide a little more detail (min. 10 characters).');
      valid = false;
    } else {
      clearError('message');
    }

    return valid;
  }

  // Real-time inline validation
  ['name', 'mobile', 'email', 'service', 'message'].forEach(id => {
    const el = getField(id);
    if (el) el.addEventListener('input', () => validateForm());
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const name    = getField('name').value.trim();
    const mobile  = getField('mobile').value.trim();
    const email   = getField('email').value.trim();
    const service = getField('service').value;
    const message = getField('message').value.trim();

    // Build WhatsApp message
    const waNumber = '916383850757'; // +91 prefix
    const text = [
      '🏗️ *New Enquiry – Sri Shanmuga Earth Movers*',
      '',
      `👤 *Name:* ${name}`,
      `📱 *Mobile:* ${mobile}`,
      email ? `📧 *Email:* ${email}` : null,
      `🔧 *Service Required:* ${service}`,
      `📝 *Message:* ${message}`,
      '',
      '_Sent from the website enquiry form._'
    ].filter(line => line !== null).join('\n');

    const waURL = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waURL, '_blank');

    // Show success message
    form.innerHTML = `
      <div style="text-align:center; padding: 48px 24px;">
        <div style="width:64px;height:64px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:2rem;color:#fff;">
          <i class="fab fa-whatsapp"></i>
        </div>
        <h3 style="color:#fff;font-size:1.5rem;margin-bottom:12px;">Enquiry Sent!</h3>
        <p style="color:rgba(255,255,255,0.65);font-size:0.95rem;">Your enquiry has been opened in WhatsApp. We'll respond as soon as possible.</p>
        <a href="#home" style="display:inline-block;margin-top:24px;background:#F5C400;color:#000;padding:12px 28px;border-radius:8px;font-weight:700;text-decoration:none;">Back to Home</a>
      </div>
    `;
  });


  /* =============================================
     7. SCROLL TO TOP BUTTON
  ============================================= */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* =============================================
     8. ACTIVE NAV LINK ON SCROLL
  ============================================= */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active-link');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));

  // Active nav style
  const style = document.createElement('style');
  style.textContent = `.nav-link.active-link { color: var(--yellow) !important; }`;
  document.head.appendChild(style);

}); // END DOMContentLoaded
