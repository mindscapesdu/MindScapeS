/* ==========================================================================
   MindScapeS Frontier Talk Series 2026 - Scripts
   1. Mobile Menu Toggle
   2. Abstract Popup Modal (Loads .txt file into centered popup card)
   3. Registration Popup Modal (Pre-selects talk, editable, syncs to Supabase & CSV)
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Supabase & Backend Configuration
     Replace SUPABASE_URL and SUPABASE_ANON_KEY with your project credentials.
     -------------------------------------------------------------------------- */
  var SUPABASE_CONFIG = {
    url: 'https://aicypxqetxjhofluwdwf.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpY3lweHFldHhqaG9mbHV3ZHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NjE3NDQsImV4cCI6MjEwODMzNzc0NH0.AJaqqkMCb3apx5gG8UaEDu0feeC2DKo6dU6tdzb-Aeo',
    table: 'registrations'
  };

  /* --------------------------------------------------------------------------
     Google Forms Auto-Sync Configuration
     Extracted from your Google Form: https://forms.gle/bE62CDwjEAXxFpKB6
     -------------------------------------------------------------------------- */
  var GOOGLE_FORM_CONFIG = {
    actionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc9GHa7LaAngXlcaXEmzhS1PrPtv2-zagMveQ4TSSEp_ddL7g/formResponse',
    fields: {
      name: 'entry.1928414796',
      email: 'entry.995403077',
      affiliation: 'entry.722565591',
      academic_status: 'entry.1906996205',
      sessions: 'entry.970231916',
      remarks: 'entry.189452490'
    }
  };

  /* --------------------------------------------------------------------------
     1. Mobile Menu Toggle
     -------------------------------------------------------------------------- */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('is-open');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        navToggle.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     Helper Utilities
     -------------------------------------------------------------------------- */
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  function formatAbstract(text) {
    var clean = (text || '').trim();
    if (!clean) return '<p class="subtext">Abstract to be announced.</p>';
    var paragraphs = clean.split(/\n\s*\n/);
    return paragraphs.map(function (p) {
      return '<p>' + escapeHtml(p.trim()).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Setup modal backdrop and close triggers
  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
    var closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeModal(overlay);
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var activeModal = document.querySelector('.modal-overlay.is-active');
      if (activeModal) closeModal(activeModal);
    }
  });

  /* --------------------------------------------------------------------------
     2. Abstract Popup Modal
     -------------------------------------------------------------------------- */
  var abstractModal = document.getElementById('abstract-modal');
  var absModalTitle = document.getElementById('modal-abs-title');
  var absModalSpeaker = document.getElementById('modal-abs-speaker');
  var absModalDate = document.getElementById('modal-abs-date');
  var absModalBody = document.getElementById('modal-abs-body');
  var absModalRegBtn = document.getElementById('modal-abs-reg-btn');

  var abstractCache = {};

  document.querySelectorAll('.btn-view-abs').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var file = btn.getAttribute('data-abstract-file');
      var title = btn.getAttribute('data-talk-title') || 'Colloquium Abstract';
      var speaker = btn.getAttribute('data-talk-speaker') || '';
      var date = btn.getAttribute('data-talk-date') || '';
      var sessionCode = btn.getAttribute('data-session-target') || '';

      if (absModalTitle) absModalTitle.textContent = title;
      if (absModalSpeaker) absModalSpeaker.textContent = speaker;
      if (absModalDate) absModalDate.textContent = date;
      if (absModalRegBtn && sessionCode) {
        absModalRegBtn.setAttribute('data-session-target', sessionCode);
      }

      if (!file) return;

      if (abstractCache[file]) {
        if (absModalBody) absModalBody.innerHTML = abstractCache[file];
        openModal(abstractModal);
      } else {
        if (absModalBody) absModalBody.innerHTML = '<p class="subtext">Loading abstract from ' + escapeHtml(file) + '...</p>';
        openModal(abstractModal);

        fetch(file)
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.text();
          })
          .then(function (text) {
            var formatted = formatAbstract(text);
            abstractCache[file] = formatted;
            if (absModalBody) absModalBody.innerHTML = formatted;
          })
          .catch(function (err) {
            if (absModalBody) {
              absModalBody.innerHTML =
                '<p class="subtext">Could not load preview directly. You can inspect the text file directly at: ' +
                '<a href="' + encodeURI(file) + '" target="_blank">' + escapeHtml(file) + '</a></p>';
            }
          });
      }
    });
  });

  /* --------------------------------------------------------------------------
     3. Registration Popup Modal & Editable Sync
     -------------------------------------------------------------------------- */
  var regModal = document.getElementById('registration-modal');
  var regForm = document.getElementById('talk-reg-form');
  var regFormWrap = document.getElementById('reg-form-wrap');
  var regConfirmWrap = document.getElementById('reg-confirm-wrap');
  var regConfirmDetails = document.getElementById('reg-confirm-details');
  var btnEditReg = document.getElementById('btn-edit-reg');
  var regModalSubtitle = document.getElementById('reg-modal-subtitle');

  // Open Registration Modal from any talk button
  function handleOpenRegistration(sessionTarget) {
    if (!regModal) return;
    // If abstract modal is open, close it
    if (abstractModal && abstractModal.classList.contains('is-active')) {
      closeModal(abstractModal);
    }

    // Check target session box if specified
    if (sessionTarget) {
      var checkboxes = regModal.querySelectorAll('input[name="sessions"]');
      checkboxes.forEach(function (cb) {
        if (cb.value === sessionTarget) {
          cb.checked = true;
        }
      });
      if (regModalSubtitle) {
        regModalSubtitle.textContent = 'Registering for: ' + sessionTarget;
      }
    } else {
      if (regModalSubtitle) {
        regModalSubtitle.textContent = 'Select all talks you plan to attend.';
      }
    }

    // Populate existing registration from localStorage if available
    var savedReg = localStorage.getItem('mindscapes_registration');
    if (savedReg) {
      try {
        var data = JSON.parse(savedReg);
        populateForm(data);
      } catch (e) {}
    }

    // Ensure form is visible
    if (regFormWrap) regFormWrap.style.display = 'block';
    if (regConfirmWrap) regConfirmWrap.style.display = 'none';

    openModal(regModal);
  }

  document.querySelectorAll('.btn-reg-talk').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var target = btn.getAttribute('data-session-target');
      handleOpenRegistration(target);
    });
  });

  if (absModalRegBtn) {
    absModalRegBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var target = absModalRegBtn.getAttribute('data-session-target');
      handleOpenRegistration(target);
    });
  }

  function populateForm(data) {
    if (!regForm) return;
    if (data.name) regForm.querySelector('#reg-name').value = data.name;
    if (data.email) regForm.querySelector('#reg-email').value = data.email;
    if (data.affiliation) regForm.querySelector('#reg-affiliation').value = data.affiliation;
    if (data.academic_status) regForm.querySelector('#reg-status').value = data.academic_status;
    if (data.remarks) regForm.querySelector('#reg-remarks').value = data.remarks;
    if (data.sessions) {
      var list = data.sessions.split('; ');
      regForm.querySelectorAll('input[name="sessions"]').forEach(function (cb) {
        cb.checked = list.indexOf(cb.value) !== -1;
      });
    }
  }

  // Handle Form Submission
  if (regForm) {
    regForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var checkedSessions = [];
      regForm.querySelectorAll('input[name="sessions"]:checked').forEach(function (cb) {
        checkedSessions.push(cb.value);
      });

      var existingId = localStorage.getItem('mindscapes_reg_id') || ('reg_' + Date.now());

      var regData = {
        id: existingId,
        name: regForm.querySelector('#reg-name').value.trim(),
        email: regForm.querySelector('#reg-email').value.trim(),
        affiliation: regForm.querySelector('#reg-affiliation').value.trim(),
        academic_status: regForm.querySelector('#reg-status').value,
        sessions: checkedSessions.join('; '),
        remarks: regForm.querySelector('#reg-remarks').value.trim()
      };

      // 1. Save to local storage for immediate offline resilience and editing
      localStorage.setItem('mindscapes_reg_id', regData.id);
      localStorage.setItem('mindscapes_registration', JSON.stringify(regData));

      // 2. Sync to local backend CSV endpoint (POST /api/register -> CSV/registrations.csv)
      fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      }).catch(function (err) {
        console.log('Local CSV sync endpoint skipped or unavailable in static preview mode:', err);
      });

      // 3. Sync to Supabase Database (configured with user's project)
      if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.url.indexOf('YOUR_SUPABASE') === -1) {
        var supabaseEndpoint = SUPABASE_CONFIG.url.replace(/\/$/, '') + '/rest/v1/' + SUPABASE_CONFIG.table + '?on_conflict=email';
        fetch(supabaseEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_CONFIG.anonKey,
            'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(regData)
        }).then(function(res) {
          console.log('Supabase sync status:', res.status);
        }).catch(function (sErr) {
          console.log('Supabase sync note:', sErr);
        });
      }

      // 4. Silent Background Sync to Google Forms & Google Sheets
      if (GOOGLE_FORM_CONFIG.actionUrl) {
        var gFormData = new URLSearchParams();
        gFormData.append(GOOGLE_FORM_CONFIG.fields.name, regData.name);
        gFormData.append(GOOGLE_FORM_CONFIG.fields.email, regData.email);
        gFormData.append(GOOGLE_FORM_CONFIG.fields.affiliation, regData.affiliation || '');
        gFormData.append(GOOGLE_FORM_CONFIG.fields.academic_status, regData.academic_status || '');
        gFormData.append(GOOGLE_FORM_CONFIG.fields.sessions, regData.sessions || '');
        gFormData.append(GOOGLE_FORM_CONFIG.fields.remarks, regData.remarks || '');

        fetch(GOOGLE_FORM_CONFIG.actionUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: gFormData.toString()
        }).then(function () {
          console.log('Google Form silent sync dispatched');
        }).catch(function (gErr) {
          console.log('Google Form sync note:', gErr);
        });
      }

      // Show confirmation & enable in-place edit
      if (regConfirmDetails) {
        regConfirmDetails.innerHTML =
          '<p><strong>Name:</strong> ' + escapeHtml(regData.name) + '</p>' +
          '<p><strong>Email ID:</strong> ' + escapeHtml(regData.email) + '</p>' +
          '<p><strong>Affiliation:</strong> ' + escapeHtml(regData.affiliation || '(Not specified)') + '</p>' +
          '<p><strong>Academic Status:</strong> ' + escapeHtml(regData.academic_status || '(Not specified)') + '</p>' +
          '<p><strong>Sessions:</strong> ' + escapeHtml(regData.sessions || 'None selected') + '</p>' +
          (regData.remarks ? '<p><strong>Remarks:</strong> ' + escapeHtml(regData.remarks) + '</p>' : '');
      }

      if (regFormWrap) regFormWrap.style.display = 'none';
      if (regConfirmWrap) regConfirmWrap.style.display = 'block';
    });
  }

  // Handle Edit Registration Button Click
  if (btnEditReg) {
    btnEditReg.addEventListener('click', function () {
      if (regConfirmWrap) regConfirmWrap.style.display = 'none';
      if (regFormWrap) regFormWrap.style.display = 'block';
    });
  }
})();
