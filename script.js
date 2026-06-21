console.log("SebastIAn cargado correctamente");

// AI CHAT
(function () {
  const toggle = document.getElementById('chatToggle');
  const modal = document.getElementById('chatModal');
  const closeBtn = document.getElementById('chatClose');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const messages = document.getElementById('chatMessages');

  if (!toggle) return;

  let history = [];
  let isOpen = false;

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    modal.classList.toggle('open', isOpen);
    if (isOpen && input) setTimeout(() => input.focus(), 300);
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    modal.classList.remove('open');
  });

  function addMsg(text, type) {
    const div = document.createElement('div');
    div.className = 'msg ' + type;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMsg(text, 'user');
    history.push({ role: 'user', content: text });
    input.value = '';
    sendBtn.disabled = true;

    const typing = addMsg('...', 'bot typing');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(-10) }),
      });

      if (!res.ok) throw new Error('Error');
      const data = await res.json();

      typing.textContent = data.reply;
      typing.classList.remove('typing');
      history.push({ role: 'assistant', content: data.reply });
    } catch (e) {
      typing.textContent = 'Hubo un error al conectar con la IA. Por favor intenta de nuevo.';
      typing.classList.remove('typing');
    }

    sendBtn.disabled = false;
    messages.scrollTop = messages.scrollHeight;
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
})();

// SMOOTH NAV ACTIVE
(function () {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = [];

  navLinks.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    const sec = document.getElementById(id);
    if (sec) sections.push({ el: sec, link });
  });

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const match = sections.find(s => s.el === entry.target);
        if (match) match.link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s.el));
})();

// CARD ENTRANCE ANIMATIONS
(function () {
  const cards = document.querySelectorAll('.card, .review-card, .proyecto-card, .apunte-card');
  if (!cards.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity .4s ease ${i * 0.06}s, transform .4s ease ${i * 0.06}s, border-color .3s, box-shadow .3s`;
    obs.observe(card);
  });
})();
