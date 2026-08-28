import { createEl } from '../utils/dom.js';

let pending = 0;
let barEl;

function bar() {
  if (!barEl) {
    barEl = createEl('div', { className: 'loading-bar' });
    document.body.append(barEl);
  }
  return barEl;
}

export async function withLoading(promise) {
  pending += 1;
  bar().classList.add('loading-bar--active');
  try {
    return await promise;
  } finally {
    pending -= 1;
    if (pending === 0) bar().classList.remove('loading-bar--active');
  }
}
