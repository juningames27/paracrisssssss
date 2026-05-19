const questions = [
  {
    title: "Adivinha o quanto eu te amo 🍓",
    sub: "escolhe com a alma",
    type: "choice",
    emoji: "🐱",
    options: [
      "pouco(beta)",
      "Nha(chata)",
      "Muito",
      "Ate o infino atravessando todo o universo te amo gatinha linda"
    ],
    correctIndex: 3
  },
  {
    title: "Quando eu penso em você, o que acontece?",
    sub: "Acontece toda hora",
    type: "choice",
    emoji: "💭",
    options: [
      "Fico chato",
      "Fico com fome",
      "Esqueço como respira pq nn vale respirar um ar que não seja do mesmo ambiente que vc(não é essa)",
      "Esqueço de andar"
    ],
    correctIndex: 2
  },
  {
    title: "Qual a senha secreta do meu coração? 🔐",
    sub: "Dica: É a pessoa mais linda desse mundo inteirinho.",
    type: "text",
    emoji: "🧸",
    placeholder: "Escreva aqui quem é...",
    accepted: ["voce", "você", "meu amor", "amor", "te amo", "linda", "Cris", "Cristina", "cris", "cristina", "ana", "Ana"]
  },
  {
    title: "Se eu pudesse ir pra qualquer lugar agr?",
    sub: "Pensa bem",
    type: "choice",
    emoji: "🌍",
    options: [
      "Pra uma praia",
      "Pra sua cama nesse minuto ficar abraçadinho com você",
      "Pra festa",
      "Pra raparigagem"
    ],
    correctIndex: 1
  },
  {
    title: "Última pergunta importante: Eu posso te dar um beijão e te cheirar linda, amor, gatinha?",
    sub: "Cuidado com o botão vermelho, hein!",
    type: "special",
    emoji: "💖",
    options: ["Sim, com certeza", "Não ❌"]
  }
];

const surprises = [
  {
    emoji: "💌",
    title: "Cartinha Secreta",
    message: "Você é como um sol ardente, brilha mais que tudo, eu te amo do fundo do coração você é incrível, te amo do fundo da alma, linda, amor, perfeita, te amo"
  },
  {
    emoji: "🎟️",
    title: "Vale-Presente",
    message: "PARABÉNS! Você ativou o cupom oficial: um único pedido que eu não posso recusar(se for possível ser feito) e possui 1 semana de validade! 🎟️"
  },
  {
    emoji: "☁️",
    title: "Nosso Destino",
    message: "Olhar pro futuro é a minha parte favorita porque eu sei que você tá nele. Mal posso esperar pela proxima  vez que a gente vai se ver, nossos dramas, e quando a gente fica só de love, te amo amor 🔮❤️"
  }
];

let current = 0;
let alreadyChose = false;

const audio = document.getElementById("loveAudio");

function togglePlay() {
  if (audio.paused) {
    audio.play().catch(() => {});
    document.getElementById("musicTxt").textContent = "Mutar Som";
  } else {
    audio.pause();
    document.getElementById("musicTxt").textContent = "Ligar Musiquinha";
  }
}

function render() {
  const q = questions[current];
  const total = questions.length;
  const pct = (current / total) * 100;

  document.getElementById("fillBar").style.width = `${pct}%`;
  document.getElementById("movingHeart").style.left = `${pct}%`;
  document.getElementById("displayTitle").textContent = q.title;
  document.getElementById("displaySub").textContent = q.sub;
  document.getElementById("displayEmoji").textContent = q.emoji;
  document.getElementById("errorMsg").style.display = "none";

  const area = document.getElementById("interactiveArea");
  area.innerHTML = "";

  if (q.type === "choice") {
    renderChoiceQuestion(q, area);
  } else if (q.type === "text") {
    renderTextQuestion(q, area);
  } else if (q.type === "special") {
    renderSpecialQuestion(q, area);
  }
}

function renderChoiceQuestion(q, area) {
  const grid = document.createElement("div");
  grid.className = "options-grid";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "btn-cute";
    btn.textContent = opt;
    btn.onclick = () => verify(idx);
    grid.appendChild(btn);
  });

  area.appendChild(grid);
}

function renderTextQuestion(q, area) {
  const wrap = document.createElement("div");
  wrap.className = "input-container";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = q.placeholder;
  input.id = "txtAnswer";
  input.autocomplete = "off";
  input.onkeydown = (e) => {
    if (e.key === "Enter") verify(input.value);
  };

  const subBtn = document.createElement("button");
  subBtn.className = "btn-submit";
  subBtn.textContent = "Responder com Amor 💕";
  subBtn.onclick = () => verify(input.value);

  wrap.appendChild(input);
  wrap.appendChild(subBtn);
  area.appendChild(wrap);

  setTimeout(() => input.focus(), 150);
}

function renderSpecialQuestion(q, area) {
  const grid = document.createElement("div");
  grid.className = "options-grid";

  const btnSim = document.createElement("button");
  btnSim.className = "btn-cute";
  btnSim.style.borderColor = "#ff4d6d";
  btnSim.textContent = q.options[0];
  btnSim.onclick = () => {
    confetti({ particleCount: 150, spread: 80 });
    completeQuiz();
  };

  const btnNao = document.createElement("button");
  btnNao.className = "btn-cute";
  btnNao.style.backgroundColor = "#ffccd5";
  btnNao.style.borderColor = "#ff758f";
  btnNao.style.boxShadow = "0 8px 0 #ff758f";
  btnNao.textContent = q.options[1];
  btnNao.style.position = "relative";

  const flee = () => {
    btnNao.style.position = "fixed";
    btnNao.style.left = `${20 + Math.random() * Math.max(120, window.innerWidth - 220)}px`;
    btnNao.style.top = `${20 + Math.random() * Math.max(120, window.innerHeight - 120)}px`;
  };

  btnNao.onmouseover = flee;
  btnNao.ontouchstart = (e) => {
    e.preventDefault();
    flee();
  };

  grid.appendChild(btnSim);
  grid.appendChild(btnNao);
  area.appendChild(grid);
}

function verify(answer) {
  const q = questions[current];
  let right = false;

  if (q.type === "choice") {
    right = answer === q.correctIndex;
  } else if (q.type === "text") {
    const clean = normalize(answer || "");
    right = q.accepted.some((text) => normalize(text) === clean);
  }

  if (!right) {
    showWrongAnswer();
    return;
  }

  confetti({
    particleCount: 40,
    spread: 50,
    colors: ["#ff4d6d", "#ff758f", "#ffccd5"]
  });

  current++;
  setTimeout(render, 500);
}

function normalize(value) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function showWrongAnswer() {
  const card = document.getElementById("quizCard");
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");

  const err = document.getElementById("errorMsg");
  err.textContent = "Poxa amor, resposta errada! Pensa direitinho... 🥺❤️";
  err.style.display = "block";
}

function completeQuiz() {
  document.getElementById("fillBar").style.width = "100%";
  document.getElementById("movingHeart").style.left = "100%";
  document.getElementById("quizScreen").style.display = "none";
  document.getElementById("victoryScreen").style.display = "block";

  const end = Date.now() + 2500;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff4d6d", "#ffb3c1"]
    });

    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ff4d6d", "#ffb3c1"]
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

async function chooseSurprise(idx) {
  if (alreadyChose) return;

  alreadyChose = true;

  const choice = surprises[idx];
  const giftButtons = document.querySelectorAll(".gift-box");
  const resultBox = document.getElementById("saveResult");

  giftButtons.forEach((button, index) => {
    button.disabled = true;
    if (index === idx) button.classList.add("selected");
  });

  resultBox.className = "save-result show";
  resultBox.textContent = "Salvando sua escolha no banco de dados... 💾💕";

  try {
    const response = await fetch("/api/escolhas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        escolha: choice.title,
        indice: idx
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao salvar escolha.");
    }

    resultBox.innerHTML = `
      Escolha salva com sucesso! 💖<br>
      ID: <strong>${data.id}</strong><br>
      Escolha: <strong>${data.escolha}</strong>
    `;

    openSurprise(idx, data.id);
  } catch (error) {
    alreadyChose = false;
    giftButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove("selected");
    });

    resultBox.className = "save-result show";
    resultBox.textContent = "Não consegui salvar no banco. Confira se o servidor Node está rodando.";
    console.error(error);
  }
}

function openSurprise(idx, savedChoiceId) {
  const choice = surprises[idx];

  document.getElementById("modalEmoji").textContent = choice.emoji;
  document.getElementById("modalContent").textContent = choice.message;

  const savedId = document.getElementById("savedId");
  if (savedChoiceId) {
    savedId.textContent = `ID salvo no banco: ${savedChoiceId}`;
    savedId.classList.add("show");
  } else {
    savedId.textContent = "";
    savedId.classList.remove("show");
  }

  document.getElementById("modalOverlay").style.display = "flex";
  confetti({ particleCount: 35, spread: 45 });
}

function closeSurprise() {
  document.getElementById("modalOverlay").style.display = "none";
}

function makeBackground() {
  const container = document.getElementById("decorations");
  const icons = ["♥", "🌸", "⭐", "☁️"];

  for (let i = 0; i < 25; i++) {
    const span = document.createElement("span");
    span.className = "bubble";
    span.textContent = icons[Math.floor(Math.random() * icons.length)];
    span.style.left = `${Math.random() * 100}%`;
    span.style.animationDuration = `${6 + Math.random() * 8}s`;
    span.style.animationDelay = `${Math.random() * 5}s`;
    span.style.fontSize = `${16 + Math.random() * 20}px`;
    span.style.color = Math.random() > 0.5 ? "#ff758f" : "#ffccd5";
    container.appendChild(span);
  }
}

makeBackground();
render();
