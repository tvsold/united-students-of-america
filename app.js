'use strict';

// Navigation and gentle, optional motion.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector('#open-chapters').addEventListener('click', () => document.querySelector('#chapters-dialog').showModal());
document.querySelectorAll('[data-share]').forEach(b => b.addEventListener('click', () => document.querySelector('#share-site').click()));
if ('IntersectionObserver' in window && !motionPreference.matches) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
const progress = document.querySelector('.scroll-progress');
let scrollFrame = false;
function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0})`;
  scrollFrame = false;
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) { scrollFrame = true; window.requestAnimationFrame(updateProgress); }
}, { passive: true });
updateProgress();
// Native dialogs support Escape, keyboard focus, and focus restoration.
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
});

let toastTimeout;
function notify(message) {
  const toast = document.querySelector('.toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3200);
}
async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(value); return true; } catch { /* Use the selectable fallback below. */ }
  }
  const helper = document.createElement('textarea');
  helper.value = value;
  helper.setAttribute('aria-label', 'Text to copy');
  helper.style.cssText = 'position:fixed;left:0;top:0;opacity:0;width:1px;height:1px;';
  (document.querySelector('dialog[open] .dialog-inner') || document.body).appendChild(helper);
  helper.select();
  let success = false;
  try { success = document.execCommand('copy'); } catch { /* Report failure honestly. */ }
  helper.remove();
  return success;
}

// All drafts stay in this page. There are no signups, forms sent, or stored stories.
const topics = {
  access: {
    concern: 'making education more affordable and accessible',
    request: 'Please support education funding and financial aid that reduce cost barriers and help more students continue their education.'
  },
  resources: {
    concern: 'giving students the resources they need to learn',
    request: 'Please support funding for updated classroom materials, accessible tutoring, and the learning resources students need to succeed.'
  },
  support: {
    concern: 'making student support easier to access',
    request: 'Please support funding for school counselors, academic guidance, and accessible student support services.'
  }
};
let selectedTopic = 'access';
const topicSelect = document.querySelector('#message-topic');
const storyInput = document.querySelector('#personal-story');
const draftInput = document.querySelector('#message-draft');
const feedback = document.querySelector('#message-feedback');
const messageDialog = document.querySelector('#message-dialog');
let draftHasManualEdits = false;
let previousStory = '';
let previousConcern = topics.access.concern;
let previousRequest = topics.access.request;

function setTopic(topic) {
  selectedTopic = Object.hasOwn(topics, topic) ? topic : 'access';
  topicSelect.value = selectedTopic;
  document.querySelectorAll('.topic-choice').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === selectedTopic)));
}
function makeDraft() {
  const topic = topics[selectedTopic];
  const personal = storyInput.value.trim();
  return `Dear Education Decision-Maker,\n\nI am writing to ask you to prioritize ${topic.concern}.\n\n${topic.request}${personal ? `\n\n${personal}` : ''}\n\nStudents should have a voice in the decisions that shape our education. What steps will you take to address this priority, and how can students take part?\n\nThank you for your time,\n[Your name]`;
}
function updateDraft() {
  const personal = storyInput.value.trim();
  const topic = topics[selectedTopic];
  if (!draftHasManualEdits) {
    draftInput.value = makeDraft();
  } else {
    // Preserve edits while updating only the original generated passages.
    let current = draftInput.value.replace(previousConcern, topic.concern).replace(previousRequest, topic.request);
    if (previousStory && current.includes(previousStory)) {
      current = current.replace(previousStory, personal);
    } else if (personal && personal !== previousStory) {
      const marker = '\n\nStudents should have a voice';
      current = current.includes(marker) ? current.replace(marker, `\n\n${personal}${marker}`) : `${current}\n\n${personal}`;
    }
    draftInput.value = current;
  }
  previousStory = personal;
  previousConcern = topic.concern;
  previousRequest = topic.request;
  feedback.textContent = '';
}
document.querySelectorAll('.topic-choice').forEach(button => button.addEventListener('click', () => { setTopic(button.dataset.topic); updateDraft(); }));
document.querySelector('#open-message')?.addEventListener('click', () => {
  topicSelect.value = selectedTopic;
  if (!draftInput.value) updateDraft();
  feedback.textContent = '';
  messageDialog.showModal();
});
topicSelect.addEventListener('change', () => { setTopic(topicSelect.value); updateDraft(); });
storyInput.addEventListener('input', updateDraft);
draftInput.addEventListener('input', () => { draftHasManualEdits = true; feedback.textContent = ''; });
document.querySelector('#copy-message').addEventListener('click', async event => {
  const success = await copyText(draftInput.value);
  feedback.textContent = success ? 'Copied! Personalize the greeting and signature before sending.' : 'Select the draft above, then use your device’s Copy command.';
  if (!success) { draftInput.focus(); draftInput.select(); }
  else event.currentTarget?.focus();
});
document.querySelector('#download-message').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([draftInput.value], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'my-education-advocacy-message.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  feedback.textContent = 'Your draft is ready to save. Review it before sending.';
});

const events = {
  run: { title: 'The campus 5K', description: 'A little movement can start a bigger conversation.', format: 'A proposed campus route with a $5 entry fee. Walk, jog, or run at your own pace, with signs along the way highlighting education funding.', help: 'Bring friends, help mark the route, or design signs that connect the event to student needs.' },
  bake: { title: 'Bake a difference', description: 'Bring people together over something sweet.', format: 'A proposed campus bake sale to raise awareness and funds for education-focused causes. Each treat starts a conversation about why school funding matters.', help: 'Bake a favorite recipe, create clear ingredient labels, or help run a table and explain the cause.' },
  gala: { title: 'The education gala', description: 'Dress up for a future we can build together.', format: 'A proposed free-entry campus gala with themed stands explaining education priorities and ways to support them.', help: 'Help organize the evening, make a stand about an issue you care about, or invite campus groups to collaborate.' }
};
const eventDialog = document.querySelector('#event-dialog');
document.querySelectorAll('[data-event]').forEach(button => button.addEventListener('click', () => {
  const data = events[button.dataset.event];
  document.querySelector('#event-title').textContent = data.title;
  document.querySelector('#event-description').textContent = data.description;
  document.querySelector('#event-format').textContent = data.format;
  document.querySelector('#event-help').textContent = data.help;
  eventDialog.showModal();
}));
document.querySelector('#event-to-action').addEventListener('click', () => {
  eventDialog.close();
  window.location.href = 'action-2.html#write';
});

const shareDialog = document.querySelector('#share-dialog');
const shareInput = document.querySelector('#share-url');
document.querySelector('#share-site').addEventListener('click', () => {
  shareInput.value = window.location.protocol === 'file:'
    ? 'https://united-students-golden-hour.sprysnow32.chatgpt.site'
    : new URL('index.html', window.location.href).href;
  document.querySelector('#share-feedback').textContent = '';
  shareDialog.showModal();
});
document.querySelector('#copy-site-url').addEventListener('click', async () => {
  const success = await copyText(shareInput.value);
  document.querySelector('#share-feedback').textContent = success ? 'Project link copied.' : 'Select the link above, then use your device’s Copy command.';
  if (!success) { shareInput.focus(); shareInput.select(); }
});
