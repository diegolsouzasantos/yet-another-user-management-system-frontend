export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function createEl(tag, props = {}, children = []) {
  const el = Object.assign(document.createElement(tag), props);
  children.forEach((child) => el.append(child));
  return el;
}

export function clear(el) {
  el.replaceChildren();
}
