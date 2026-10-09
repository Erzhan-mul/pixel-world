(() => {
  'use strict';
  const root = document.documentElement;
  const button = document.getElementById('motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const readPreference = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const storePreference = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let paused = readPreference('blue-world-paused') === 'true' || (reducedMotion.matches && readPreference('blue-world-paused') !== 'false');
  function renderMotion() {
    root.classList.toggle('motion-paused', paused);
    root.classList.toggle('motion-enabled', !paused);
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? 'Возобновить анимацию' : 'Приостановить анимацию');
    document.getElementById('motion-button-text').textContent = paused ? 'Продолжить' : 'Пауза';
    document.getElementById('motion-icon').textContent = paused ? '▷' : 'Ⅱ';
    document.getElementById('motion-label').textContent = paused ? 'НА ПАУЗЕ' : 'ЖИВОЙ МИР';
  }
  button.addEventListener('click', () => { paused = !paused; renderMotion(); storePreference('blue-world-paused', String(paused)); });
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches || readPreference('blue-world-paused') === 'true'; renderMotion(); });
  renderMotion();
  const moodButtons = [...document.querySelectorAll('[data-mood]')];
  function setMood(mood) {
    root.classList.toggle('scene-mode-dawn', mood === 'dawn');
    moodButtons.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.mood === mood)));
    document.getElementById('scene-label').textContent = mood === 'dawn' ? 'РАССВЕТ' : 'НОЧЬ';
  }
  setMood(readPreference('blue-world-mood') === 'dawn' ? 'dawn' : 'night');
  moodButtons.forEach(item => item.addEventListener('click', () => { setMood(item.dataset.mood); storePreference('blue-world-mood', item.dataset.mood); }));
  let toastTimeout;
  const toast = document.getElementById('toast');
  function announce(message) { clearTimeout(toastTimeout); toast.textContent = message; toast.classList.add('show'); toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500); }
  document.getElementById('copy-link').addEventListener('click', async () => {
    const url = new URL(window.location.href); url.hash = '';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('No clipboard');
      await navigator.clipboard.writeText(url.href);
      announce('Ссылка скопирована. Этот мир теперь ближе.');
    } catch {
      const dialog = document.getElementById('copy-dialog');
      const input = document.getElementById('manual-link');
      input.value = url.href; dialog.showModal(); input.focus(); input.select();
    }
  });
  document.getElementById('close-dialog').addEventListener('click', () => document.getElementById('copy-dialog').close());
})();
