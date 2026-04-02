/**
 * script.js — Strive Agency
 * Handles:
 *   1. Mobile hamburger navigation toggle
 *   2. Close mobile menu when a nav link is clicked
 *   3. Sticky header shrink effect on scroll
 *   4. Contact form client-side validation
 *   5. Footer copyright year auto-update
 */

/* ================================================================
   1. MOBILE NAVIGATION TOGGLE
   ================================================================ */

const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');

if (hamburgerBtn && mobileMenu) {

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.toggle('open');

    // Toggle visibility
    if (isOpen) {
      mobileMenu.removeAttribute('hidden');
    } else {
      mobileMenu.setAttribute('hidden', '');
    }

    // Update ARIA for screen readers
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  /* ── 2. Close menu when any mobile link is clicked ── */
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('open');
      mobileMenu.setAttribute('hidden', '');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ================================================================
   3. STICKY HEADER — subtle shadow intensifies on scroll
   ================================================================ */

const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader.style.boxShadow = '0 4px 20px rgba(11,29,58,.14)';
    } else {
      siteHeader.style.boxShadow = '0 2px 12px rgba(11,29,58,.06)';
    }
  }, { passive: true });
}


/* ================================================================
   4. CONTACT FORM VALIDATION
   ================================================================ */

const contactForm   = document.getElementById('contactForm');
const formFeedback  = document.getElementById('formFeedback');

/** Helper: show an error message beneath a field */
function showError(errorElementId, inputElement, message) {
  const errorEl = document.getElementById(errorElementId);
  if (errorEl) errorEl.textContent = message;
  if (inputElement) inputElement.classList.add('error');
}

/** Helper: clear any existing error on a field */
function clearError(errorElementId, inputElement) {
  const errorEl = document.getElementById(errorElementId);
  if (errorEl) errorEl.textContent = '';
  if (inputElement) inputElement.classList.remove('error');
}

/** Helper: very basic e-mail format check */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Run all validation rules; returns true when the form is valid */
function validateForm() {
  const nameInput     = document.getElementById('name');
  const emailInput    = document.getElementById('email');
  const enquiryInput  = document.getElementById('enquiryType');
  const messageInput  = document.getElementById('message');

  let valid = true;

  // ── Name ──────────────────────────────────────────────────────
  clearError('nameError', nameInput);
  if (!nameInput.value.trim()) {
    showError('nameError', nameInput, 'Please enter your full name.');
    valid = false;
  } else if (nameInput.value.trim().length < 2) {
    showError('nameError', nameInput, 'Name must be at least 2 characters.');
    valid = false;
  }

  // ── Email ─────────────────────────────────────────────────────
  clearError('emailError', emailInput);
  if (!emailInput.value.trim()) {
    showError('emailError', emailInput, 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(emailInput.value)) {
    showError('emailError', emailInput, 'Please enter a valid email address.');
    valid = false;
  }

  // ── Enquiry type ──────────────────────────────────────────────
  clearError('enquiryError', enquiryInput);
  if (!enquiryInput.value) {
    showError('enquiryError', enquiryInput, 'Please select an enquiry type.');
    valid = false;
  }

  // ── Message ───────────────────────────────────────────────────
  clearError('messageError', messageInput);
  if (!messageInput.value.trim()) {
    showError('messageError', messageInput, 'Please enter a message.');
    valid = false;
  } else if (messageInput.value.trim().length < 20) {
    showError('messageError', messageInput, 'Your message must be at least 20 characters.');
    valid = false;
  }

  return valid;
}

/** Clear individual field errors as soon as the user starts correcting them */
function attachLiveValidation() {
  const fields = [
    { id: 'name',        errorId: 'nameError' },
    { id: 'email',       errorId: 'emailError' },
    { id: 'enquiryType', errorId: 'enquiryError' },
    { id: 'message',     errorId: 'messageError' },
  ];

  fields.forEach(({ id, errorId }) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', () => clearError(errorId, el));
    el.addEventListener('change', () => clearError(errorId, el)); // for <select>
  });
}

if (contactForm) {
  attachLiveValidation();

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload — form currently has no backend

    // Hide previous feedback
    formFeedback.removeAttribute('hidden');
    formFeedback.className    = 'form-feedback';
    formFeedback.textContent  = '';

    const isValid = validateForm();

    if (!isValid) {
      // Focus the first invalid field to help keyboard/screen-reader users
      const firstError = contactForm.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    /*
     * ── SUBMISSION ────────────────────────────────────────────────
     * The form is currently front-end only.
     * To connect a back-end, replace the block below with a fetch()
     * call to your API endpoint, e.g.:
     *
     *   fetch('/api/contact', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
     *   })
     *   .then(res => res.ok ? showSuccess() : showFailure())
     *   .catch(() => showFailure());
     */

    // For now, show a success message and reset the form
    formFeedback.classList.add('success');
    formFeedback.textContent =
      'Thank you for reaching out! A member of the Strive Agency team will be in touch shortly.';

    contactForm.reset();
  });
}


/* ================================================================
   5. FOOTER — AUTO-UPDATE COPYRIGHT YEAR
   ================================================================ */

const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
