'use strict';

// Animation controls honor the visitor's system preference and can be paused.
const pauseMotionButton = document.querySelector('#motion-toggle');
let manuallyPaused = false;
try { manuallyPaused = sessionStorage.getItem('usa-motion-paused') === 'true'; } catch {}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function motionIsPaused() { return manuallyPaused || reducedMotion.matches; }
function syncMotion() {
  const paused = motionIsPaused();
  document.body.classList.toggle('motion-paused', paused);
  document.documentElement.style.scrollBehavior = paused ? 'auto' : '';
  pauseMotionButton.setAttribute('aria-pressed', String(paused));
  pauseMotionButton.innerHTML = paused ? `<span aria-hidden="true">▷</span> ${reducedMotion.matches ? 'Motion paused' : 'Resume motion'}` : '<span aria-hidden="true">Ⅱ</span> Pause motion';
  pauseMotionButton.title = reducedMotion.matches ? 'Your device prefers reduced motion.' : (paused ? 'Resume animations' : 'Pause animations');
  if (paused) document.querySelector('.confetti-layer').replaceChildren();
}
pauseMotionButton.addEventListener('click', () => {
  if (reducedMotion.matches) {
    notify('Animations are off to match your device’s reduced-motion setting.');
    return;
  }
  manuallyPaused = !manuallyPaused;
  try { sessionStorage.setItem("usa-motion-paused", String(manuallyPaused)); } catch {}
  syncMotion();
});
reducedMotion.addEventListener('change', syncMotion);
syncMotion();

// Short confetti bursts are decorative and never block buttons or scrolling.
let confettiCleanup;
function celebrateAt(element, count = 24) {
  if (motionIsPaused()) return;
  const box = element.getBoundingClientRect();
  const layer = document.querySelector('.confetti-layer');
  layer.replaceChildren();
  clearTimeout(confettiCleanup);
  const colors = ['#ffdc7a', '#d8c3ea', '#cbe0d1', '#efb6b2', '#fff8e9'];
  for (let i = 0; i < count; i++) {
    const bit = document.createElement('span');
    bit.className = 'confetti-bit';
    const angle = (i / count) * Math.PI * 2;
    const distance = 70 + Math.random() * 140;
    bit.style.setProperty('--x', `${Math.min(innerWidth - 25, Math.max(25, box.left + box.width / 2))}px`);
    bit.style.setProperty('--y', `${box.top + box.height / 2}px`);
    bit.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    bit.style.setProperty('--dy', `${Math.sin(angle) * distance + 100}px`);
    bit.style.setProperty('--spin', `${Math.random() * 540 - 270}deg`);
    bit.style.setProperty('--color', colors[i % colors.length]);
    bit.style.setProperty('--delay', `${Math.random() * .1}s`);
    layer.appendChild(bit);
  }
  confettiCleanup = setTimeout(() => layer.replaceChildren(), 1500);
}

const mascot = document.querySelector('#book-mascot');
const mascotBubble = document.querySelector('#mascot-bubble');
const mascotNotes = ['you belong here!', 'big dreams, tiny steps.', 'your voice has power.', 'let’s open more doors!', 'psst… dream bigger!'];
let mascotNote = 0;
let mascotTimer;
mascot?.addEventListener('click', () => {
  mascotBubble.textContent = mascotNotes[mascotNote % mascotNotes.length];
  mascotNote += 1;
  mascot.classList.remove('celebrating');
  if (!motionIsPaused()) {
    requestAnimationFrame(() => mascot.classList.add('celebrating'));
    clearTimeout(mascotTimer);
    mascotTimer = setTimeout(() => mascot.classList.remove('celebrating'), 700);
  }
  notify(mascotBubble.textContent);
  celebrateAt(mascot, 14);
});

// Six fictional coins demonstrate that funding choices shape a campus.
// State lives only in memory; there are no real payments or collected records.
if (document.querySelector('.campus-game')) {
const budget = 6;
const allocations = { access: 0, resources: 0, support: 0 };
const campusGame = document.querySelector('.campus-game');
const openCampusButton = document.querySelector('#celebrate-campus');
const gameFeedback = document.querySelector('#game-feedback');
const campusCaption = document.querySelector('#campus-caption');
const buildingTimers = new Map();
function totalSpent() { return Object.values(allocations).reduce((sum, value) => sum + value, 0); }
function renderCampus() {
  const left = budget - totalSpent();
  document.querySelector('#coins-left').textContent = String(left);
  document.querySelector('#coin-label').textContent = left === 1 ? 'coin left' : 'coins left';
  for (const [key, value] of Object.entries(allocations)) {
    document.querySelector(`#${key}-count`).value = String(value);
    document.querySelector(`[data-building="${key}"]`).dataset.funded = String(value > 0);
  }
  document.querySelectorAll('[data-coin]').forEach(button => {
    const key = button.dataset.coin;
    button.disabled = Number(button.dataset.change) > 0 ? left === 0 : allocations[key] === 0;
  });
  openCampusButton.disabled = left !== 0;
  campusGame.classList.remove('complete');
  if (left === budget) {
    campusCaption.textContent = 'A blank canvas. A whole lot of potential.';
    gameFeedback.textContent = 'Use all 6 coins to open your campus.';
  } else if (left === 0) {
    campusCaption.textContent = 'Your campus is ready for its first day.';
    gameFeedback.textContent = 'All 6 coins placed. Ready to open the doors?';
  } else {
    campusCaption.textContent = 'Look at those possibilities lighting up.';
    gameFeedback.textContent = `${left} ${left === 1 ? 'coin' : 'coins'} left. Keep building your version of better.`;
  }
}
document.querySelectorAll('[data-coin]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.coin;
  const change = Number(button.dataset.change);
  if (!(key in allocations) || ![-1, 1].includes(change)) return;
  if (change === 1 && totalSpent() >= budget) return;
  if (change === -1 && allocations[key] <= 0) return;
  allocations[key] += change;
  renderCampus();
  const building = document.querySelector(`[data-building="${key}"]`);
  building.classList.remove('pop');
  if (!motionIsPaused()) {
    requestAnimationFrame(() => building.classList.add('pop'));
    clearTimeout(buildingTimers.get(key));
    buildingTimers.set(key, setTimeout(() => building.classList.remove('pop'), 500));
  }
}));
openCampusButton.addEventListener('click', () => {
  if (totalSpent() !== budget) return;
  campusGame.classList.add('complete');
  campusCaption.textContent = 'Welcome to your dream campus!';
  const supported = Object.values(allocations).filter(value => value > 0).length;
  gameFeedback.textContent = supported === 3
    ? 'A little support in every corner. Now imagine what real investment could do.'
    : 'Your priorities are taking shape! Try spreading coins around to light up every building.';
  celebrateAt(openCampusButton, 36);
});
document.querySelector('#reset-campus').addEventListener('click', () => {
  for (const key of Object.keys(allocations)) allocations[key] = 0;
  document.querySelector('.confetti-layer').replaceChildren();
  renderCampus();
});
renderCampus();

}
