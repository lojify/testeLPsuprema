// countdown.js — Contadores regressivos funcionais

function pad(n) {
  return String(Math.max(0, n)).padStart(2, '0');
}

function updateCountdown(el) {
  const deadline = new Date(el.dataset.deadline).getTime();
  const now = Date.now();
  let diff = Math.max(0, deadline - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const setUnit = (unit, value) => {
    const target = el.querySelector(`[data-unit="${unit}"]`);
    if (target) target.textContent = pad(value);
  };

  setUnit('days', days);
  setUnit('hours', hours);
  setUnit('minutes', minutes);
  setUnit('seconds', seconds);

  return diff > 0;
}

export function initCountdowns() {
  const elements = document.querySelectorAll('[data-countdown]');
  if (!elements.length) return;

  elements.forEach((el) => updateCountdown(el));

  const interval = setInterval(() => {
    let anyActive = false;
    elements.forEach((el) => {
      const active = updateCountdown(el);
      if (active) anyActive = true;
    });
    if (!anyActive) clearInterval(interval);
  }, 1000);
}
