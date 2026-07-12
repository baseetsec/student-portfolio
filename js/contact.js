/* ==========================================================================
   contact.js — Contact form validation.
   Loaded only on contact.html.

   Rules enforced (per assignment spec):
   1. No empty fields (name, email, phone, message)
   2. Email must match a valid email format
   3. Phone must contain digits only
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return; // guard: only run on contact.html

  const fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    phone: form.querySelector('#phone'),
    message: form.querySelector('#message'),
  };

  const successBanner = document.querySelector('[data-form-success]');

  form.addEventListener('submit', (event) => {
    const errors = validateForm(fields);
    clearErrors(fields);

    if (Object.keys(errors).length > 0) {
      event.preventDefault(); // stop submission until every rule passes
      showErrors(errors);
      // Move focus to the first invalid field — helps keyboard and
      // screen-reader users find the problem immediately.
      const firstInvalidKey = Object.keys(errors)[0];
      fields[firstInvalidKey].focus();
      return;
    }

    // All fields valid. If a real Formspree endpoint is wired up (see
    // README), the browser will submit normally to the action attribute.
    // Otherwise, this fallback simulates a successful send for local testing.
    if (form.action.includes('your-form-id')) {
      event.preventDefault();
      form.reset();
      if (successBanner) {
        successBanner.hidden = false;
        successBanner.textContent =
          'Form validated successfully. Connect a real Formspree endpoint in contact.html to enable live delivery.';
      }
    }
  });

  // Live re-validation: clear a field's error the moment it becomes valid,
  // so the person isn't stuck staring at a stale error message.
  Object.entries(fields).forEach(([key, el]) => {
    el.addEventListener('input', () => {
      const errors = validateForm(fields);
      if (!errors[key]) {
        setFieldError(key, '');
      }
    });
  });
});

/* ---------- Validation logic ---------- */
function validateForm(fields) {
  const errors = {};

  if (!fields.name.value.trim()) {
    errors.name = 'Name is required.';
  }

  const emailValue = fields.email.value.trim();
  if (!emailValue) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(emailValue)) {
    errors.email = 'Enter a valid email address (e.g. name@example.com).';
  }

  const phoneValue = fields.phone.value.trim();
  if (!phoneValue) {
    errors.phone = 'Phone number is required.';
  } else if (!isDigitsOnly(phoneValue)) {
    errors.phone = 'Phone number must contain digits only, no spaces or symbols.';
  }

  if (!fields.message.value.trim()) {
    errors.message = 'Message is required.';
  }

  return errors;
}

function isValidEmail(value) {
  // Standard, readable email pattern — not exhaustive RFC 5322, but
  // catches the realistic cases a contact form needs to catch.
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value);
}

function isDigitsOnly(value) {
  return /^\d+$/.test(value);
}

/* ---------- Error display ---------- */
function showErrors(errors) {
  Object.entries(errors).forEach(([key, message]) => {
    setFieldError(key, message);
  });
}

function clearErrors(fields) {
  Object.keys(fields).forEach((key) => setFieldError(key, ''));
}

function setFieldError(key, message) {
  const field = document.querySelector(`#${key}`);
  const errorEl = document.querySelector(`[data-error-for="${key}"]`);
  if (!field || !errorEl) return;

  errorEl.textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  field.classList.toggle('has-error', Boolean(message));
}