function el(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  children.forEach((child) => child != null && node.append(child));
  return node;
}

export function openModal({
  title, message, content, confirmLabel = 'OK', cancelLabel = 'Cancel', variant = 'primary', wide = false,
}) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      dialog.close();
      dialog.remove();
      resolve(result);
    };

    const cancelBtn = el('button', { type: 'button', className: 'btn btn--sm', textContent: cancelLabel });
    const confirmBtn = el('button', {
      type: 'button', className: `btn btn--sm btn--${variant}`, textContent: confirmLabel,
    });
    cancelBtn.addEventListener('click', () => finish(false));
    confirmBtn.addEventListener('click', () => finish(true));

    const dialog = el('dialog', { className: `ds-modal${wide ? ' ds-modal--wide' : ''}` }, [
      el('div', { className: 'ds-modal__body' }, [
        title ? el('h2', { className: 'ds-modal__title', textContent: title }) : null,
        message ? el('p', { className: 'ds-modal__message', textContent: message }) : null,
        content || null,
      ]),
      el('div', { className: 'ds-modal__actions' }, [cancelBtn, confirmBtn]),
    ]);

    dialog.addEventListener('cancel', (event) => { event.preventDefault(); finish(false); });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) finish(false);
    });

    document.body.append(dialog);
    dialog.showModal();
    (content ? content.querySelector('input, select, textarea') || confirmBtn : confirmBtn).focus();
  });
}

export function confirmModal(options) {
  return openModal(options);
}
