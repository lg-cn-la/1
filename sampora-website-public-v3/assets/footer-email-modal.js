(function () {
  const EMAIL = 'contact@getsampora.com';
  const copy = {
    en: {
      title: 'Contact Sampora',
      copyEmail: 'Copy email',
      copied: 'Email copied',
      close: 'Close'
    },
    zh: {
      title: '联系 Sampora',
      copyEmail: '复制邮箱',
      copied: '邮箱已复制',
      close: '关闭'
    }
  };

  let modal;
  let lastFocus;

  function currentLang() {
    const htmlLang = document.documentElement.lang || document.documentElement.dataset.lang || '';
    const stored = window.localStorage && localStorage.getItem('sampora_lang');
    const raw = String(htmlLang || stored || 'en').toLowerCase();
    return raw.startsWith('zh') ? 'zh' : 'en';
  }

  function setModalText(lang) {
    const dict = copy[lang] || copy.en;
    modal.querySelector('[data-footer-email-title]').textContent = dict.title;
    modal.querySelector('.footer-email-copy[data-footer-email-copy]').textContent = dict.copyEmail;
    modal.querySelector('[data-footer-email-close]').setAttribute('aria-label', dict.close);
    modal.querySelector('[data-footer-email-live]').textContent = '';
  }

  function fallbackCopy(value) {
    const input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }

  async function copyEmail() {
    const lang = currentLang();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(EMAIL);
      } else {
        fallbackCopy(EMAIL);
      }
      modal.querySelector('[data-footer-email-live]').textContent = copy[lang].copied;
    } catch (error) {
      fallbackCopy(EMAIL);
      modal.querySelector('[data-footer-email-live]').textContent = copy[lang].copied;
    }
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.classList.remove('open');
    document.documentElement.classList.remove('footer-email-modal-open');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function openModal() {
    ensureModal();
    lastFocus = document.activeElement;
    setModalText(currentLang());
    modal.hidden = false;
    modal.classList.add('open');
    document.documentElement.classList.add('footer-email-modal-open');
    modal.querySelector('.footer-email-copy[data-footer-email-copy]').focus();
  }

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'footer-email-modal-backdrop';
    modal.hidden = true;
    modal.setAttribute('data-footer-email-modal', '');
    modal.innerHTML = `
      <section class="footer-email-card" role="dialog" aria-modal="true" aria-labelledby="footer-email-title">
        <button class="footer-email-close" type="button" data-footer-email-close aria-label="Close">X</button>
        <div class="footer-email-brand" aria-label="Sampora">
          <span class="footer-email-mark" aria-hidden="true">S</span>
          <span class="footer-email-brand-text">Sampora</span>
        </div>
        <h2 class="footer-email-title" id="footer-email-title" data-footer-email-title>Contact Sampora</h2>
        <a class="footer-email-address" href="mailto:${EMAIL}">${EMAIL}</a>
        <button class="footer-email-copy" type="button" data-footer-email-copy>Copy email</button>
        <p class="footer-email-live" data-footer-email-live aria-live="polite"></p>
      </section>`;
    document.body.appendChild(modal);

    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('[data-footer-email-close]')) {
        closeModal();
        return;
      }
      if (event.target.closest('[data-footer-email-copy]')) copyEmail();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });
    return modal;
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-footer-email-open]');
    if (!trigger) return;
    event.preventDefault();
    openModal();
  });
})();
