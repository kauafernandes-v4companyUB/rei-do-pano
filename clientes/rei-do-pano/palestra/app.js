(function () {
  // Atendentes fictícias do menu do robô (slide da escolha).
  const ATENDENTES = ['Joana', 'Ana', 'Carla'];

  const LABELS = {
    anuncio: { name: 'Anúncio', c: '#2f7de1' },
    retomar: { name: 'Retomar', c: '#f2b705' },
    loja: { name: 'Vem na loja', c: '#1f8a4c' },
    comprou: { name: 'Comprou', c: '#FB2E0A' },
  };

  const stage = document.getElementById('stage');
  const slides = [...stage.querySelectorAll('.slide')];
  const total = slides.length;
  const $ = (id) => document.getElementById(id);
  const notes = $('notes');

  document.querySelectorAll('.bot-options').forEach((el) => {
    el.innerHTML = ATENDENTES.map((n, i) => `<span class="bot-option">${i + 1} · ${n}</span>`).join('');
  });
  document.querySelectorAll('.atendente-escolhida').forEach((el) => { el.textContent = ATENDENTES[0]; });

  // Passos de cada slide: data-order define a ordem; data-last vai para o fim; o resto segue o DOM.
  const stepsOf = slides.map((slide) => {
    const all = [...slide.querySelectorAll('[data-step]')].filter((el) => !el.classList.contains('is-shown'));
    return all
      .map((el, i) => ({ el, key: el.dataset.order ? Number(el.dataset.order) : el.hasAttribute('data-last') ? 1e6 + i : 1000 + i }))
      .sort((a, b) => a.key - b.key)
      .map((s) => s.el);
  });

  // Bolinhas do slide de números
  const dots = $('dots');
  if (dots) for (let i = 0; i < 50; i++) {
    const d = document.createElement('span');
    d.className = 'dot';
    d.style.animationDelay = (i * 28) + 'ms';
    dots.appendChild(d);
  }

  // ---------- Etiquetas ----------
  function setLabel(chatId, key, on) {
    const chat = stage.querySelector(`.chat[data-chat="${chatId}"]`);
    if (!chat) return;
    const box = chat.querySelector('.chat__labels');
    const existing = box.querySelector(`[data-key="${key}"]`);
    if (on && !existing) {
      const l = LABELS[key];
      const chip = document.createElement('span');
      chip.className = 'chat__label';
      chip.dataset.key = key;
      chip.style.setProperty('--c', l.c);
      chip.textContent = l.name;
      box.appendChild(chip);
      chat.classList.remove('is-flash'); void chat.offsetWidth; chat.classList.add('is-flash');
    } else if (!on && existing) {
      existing.remove();
    }
  }

  function closeMenus() { stage.querySelectorAll('.label-menu').forEach((m) => m.remove()); }
  stage.querySelectorAll('.chat').forEach((chat) => {
    chat.addEventListener('click', (e) => {
      if (e.target.closest('.label-menu')) return;
      const open = chat.querySelector('.label-menu');
      closeMenus();
      if (open) return;
      const menu = document.createElement('div');
      menu.className = 'label-menu';
      Object.entries(LABELS).forEach(([key, l]) => {
        const b = document.createElement('button');
        b.style.setProperty('--c', l.c);
        const has = chat.querySelector(`.chat__labels [data-key="${key}"]`);
        b.textContent = (has ? '✓ ' : '') + l.name;
        b.addEventListener('click', () => { setLabel(chat.dataset.chat, key, !has); closeMenus(); });
        menu.appendChild(b);
      });
      chat.appendChild(menu);
    });
  });

  // ---------- Revelar / esconder passos ----------
  let pending = null; // animação em andamento (digitando, toque)

  function finishPending() {
    if (!pending) return false;
    clearTimeout(pending.timer);
    pending.done();
    pending = null;
    return true;
  }

  function show(el, animate) {
    if (el.dataset.label) {
      const [chat, key] = el.dataset.label.split(':');
      setLabel(chat, key, true);
      el.classList.add('is-shown');
      return;
    }
    if (animate && el.dataset.tap) {
      const t = $(el.dataset.tap);
      t.classList.remove('is-tapped'); void t.offsetWidth; t.classList.add('is-tapped');
      const done = () => el.classList.add('is-shown');
      pending = { timer: setTimeout(() => { done(); pending = null; }, 550), done };
      return;
    }
    if (animate && el.classList.contains('msg')) {
      const typing = document.createElement('div');
      typing.className = 'typing' + (el.classList.contains('msg--out') ? ' typing--out' : '');
      typing.innerHTML = '<i></i><i></i><i></i>';
      el.before(typing);
      const done = () => { typing.remove(); el.classList.add('is-shown'); };
      pending = { timer: setTimeout(() => { done(); pending = null; }, 650), done };
      return;
    }
    el.classList.add('is-shown');
  }

  function hide(el) {
    if (el.dataset.label) {
      const [chat, key] = el.dataset.label.split(':');
      setLabel(chat, key, false);
    }
    el.classList.remove('is-shown');
  }

  // ---------- Navegação ----------
  let current = 0;
  let step = 0;

  function setSlide(i, revealAll) {
    finishPending();
    closeMenus();
    slides[current].classList.remove('is-active');
    current = Math.max(0, Math.min(total - 1, i));
    const steps = stepsOf[current];
    steps.forEach((el) => (revealAll ? show(el, false) : hide(el)));
    step = revealAll ? steps.length : 0;
    slides[current].classList.add('is-active');
    render();
  }

  function render() {
    $('counter').textContent = `${current + 1} / ${total}`;
    $('progress').style.width = `${((current + 1) / total) * 100}%`;
    $('prev').disabled = current === 0 && step === 0;
    $('next').disabled = current === total - 1 && step === stepsOf[current].length;
    const n = slides[current].querySelector('.slide-notes');
    notes.innerHTML = `<b>Slide ${current + 1} · fala</b>` + (n ? n.innerHTML : '');
    history.replaceState(null, '', '#' + (current + 1));
  }

  function next() {
    if (finishPending()) return;
    const steps = stepsOf[current];
    if (step < steps.length) { show(steps[step++], true); render(); }
    else if (current < total - 1) setSlide(current + 1, false);
  }

  function prev() {
    finishPending();
    if (step > 0) { hide(stepsOf[current][--step]); render(); }
    else if (current > 0) setSlide(current - 1, true);
  }

  $('next').addEventListener('click', next);
  $('prev').addEventListener('click', prev);
  $('fs').addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  });
  document.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); prev(); }
    else if (k === 'Home') setSlide(0, false);
    else if (k === 'End') setSlide(total - 1, true);
    else if (k === 'f' || k === 'F') $('fs').click();
    else if (k === 'n' || k === 'N') document.body.classList.toggle('show-notes');
    else if (k === 'Escape') closeMenus();
  });
  let tx = 0;
  document.addEventListener('touchstart', (e) => { tx = e.changedTouches[0].screenX; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - tx;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  }, { passive: true });

  // Palco 1920x1080 escalado para caber em qualquer tela
  function fit() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = `scale(${s})`;
  }
  window.addEventListener('resize', fit);
  fit();

  setTimeout(() => $('hint').classList.add('is-hidden'), 5000);

  const fromHash = parseInt(location.hash.slice(1), 10);
  slides[0].classList.add('is-active');
  setSlide(fromHash > 0 ? fromHash - 1 : 0, fromHash > 0 && new URLSearchParams(location.search).has('full'));
})();
