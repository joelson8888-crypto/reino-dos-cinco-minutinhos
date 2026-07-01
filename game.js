const telaInicial = document.getElementById("telaInicial");
const telaVitoria = document.getElementById("telaVitoria");
const botaoJogar = document.getElementById("botaoJogar");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 600;

let teclas = {};
let jogoAtivo = false;
let tempo = 8 * 60 + 55;
let cincoMinutinhos = 0;
let chefeVida = 5;
let venceu = false;

const joelson = {
  x: 80,
  y: 430,
  w: 45,
  h: 70,
  vx: 0,
  vy: 0,
  speed: 5,
  pulando: false,
  vida: 3
};

const chefe = {
  x: 850,
  y: 395,
  w: 120,
  h: 120
};

const princesa = {
  x: 1070,
  y: 415,
  w: 70,
  h: 85,
  dormindo: true
};

const moedas = [
  { x: 260, y: 410, ativa: true },
  { x: 430, y: 350, ativa: true },
  { x: 580, y: 410, ativa: true },
  { x: 720, y: 335, ativa: true }
];

const espinhos = [
  { x: 520, y: 500, w: 120, h: 30 },
  { x: 980, y: 500, w: 80, h: 30 }
];

const plataformas = [
  { x: 245, y: 455, w: 110, h: 25 },
  { x: 410, y: 395, w: 110, h: 25 },
  { x: 560, y: 455, w: 110, h: 25 },
  { x: 700, y: 380, w: 110, h: 25 }
];

botaoJogar.onclick = () => {
  telaInicial.style.display = "none";
  canvas.style.display = "block";
  jogoAtivo = true;
  loop();
};

document.addEventListener("keydown", e => {
  teclas[e.key] = true;
});

document.addEventListener("keyup", e => {
  teclas[e.key] = false;
});

function atualizar() {
  if (!jogoAtivo || venceu) return;

  joelson.vx = 0;

  if (teclas["ArrowRight"]) joelson.vx = joelson.speed;
  if (teclas["ArrowLeft"]) joelson.vx = -joelson.speed;

  if ((teclas[" "] || teclas["ArrowUp"]) && !joelson.pulando) {
    joelson.vy = -16;
    joelson.pulando = true;
  }

  joelson.x += joelson.vx;
  joelson.y += joelson.vy;
  joelson.vy += 0.8;

  if (joelson.y + joelson.h >= 520) {
    joelson.y = 520 - joelson.h;
    joelson.vy = 0;
    joelson.pulando = false;
  }

  plataformas.forEach(p => {
    if (
      joelson.x < p.x + p.w &&
      joelson.x + joelson.w > p.x &&
      joelson.y + joelson.h < p.y + 20 &&
      joelson.y + joelson.h + joelson.vy >= p.y
    ) {
      joelson.y = p.y - joelson.h;
      joelson.vy = 0;
      joelson.pulando = false;
    }
  });

  moedas.forEach(m => {
    if (m.ativa && colisao(joelson, { x: m.x, y: m.y, w: 40, h: 40 })) {
      m.ativa = false;
      cincoMinutinhos++;
      tempo -= 5;
    }
  });

  espinhos.forEach(e => {
    if (colisao(joelson, e)) {
      joelson.x = 80;
      joelson.y = 430;
      joelson.vida--;
      if (joelson.vida <= 0) location.reload();
    }
  });

  if (colisao(joelson, chefe)) {
    if (cincoMinutinhos > 0) {
      chefeVida--;
      cincoMinutinhos--;
      joelson.x -= 120;
    } else {
      joelson.x = 80;
      joelson.vida--;
    }
  }

  if (chefeVida <= 0) {
    princesa.dormindo = false;
  }

  if (!princesa.dormindo && colisao(joelson, princesa)) {
    vencer();
  }

  if (joelson.x < 0) joelson.x = 0;
  if (joelson.x > canvas.width - joelson.w) joelson.x = canvas.width - joelson.w;
}

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fundo();
  hud();
  plataformas.forEach(desenharPlataforma);
  desenharEspinhos();
  desenharMoedas();
  desenharJoelson();
  desenharChefe();
  desenharCastelo();
  desenharPrincesa();
  instrucoes();
}

function fundo() {
  let grad = ctx.createLinearGradient(0, 0, 0, 600);
  grad.addColorStop(0, "#63b7ff");
  grad.addColorStop(1, "#2f5d74");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 600);

  ctx.fillStyle = "#7bbf7a";
  ctx.beginPath();
  ctx.moveTo(0, 430);
  ctx.lineTo(250, 220);
  ctx.lineTo(500, 430);
  ctx.fill();

  ctx.fillStyle = "#5ca866";
  ctx.beginPath();
  ctx.moveTo(350, 430);
  ctx.lineTo(700, 190);
  ctx.lineTo(1050, 430);
  ctx.fill();

  ctx.fillStyle = "#2c8f45";
  ctx.fillRect(0, 520, 1200, 80);

  ctx.fillStyle = "#5b3520";
  ctx.fillRect(0, 545, 1200, 55);
}

function hud() {
  ctx.fillStyle = "#1b1630";
  ctx.fillRect(0, 0, 1200, 70);

  ctx.fillStyle = "white";
  ctx.font = "bold 24px Arial";
  ctx.fillText("JOELSON", 85, 28);

  ctx.fillStyle = "#ff4f93";
  for (let i = 0; i < joelson.vida; i++) {
    ctx.fillText("❤", 220 + i * 35, 30);
  }

  ctx.fillStyle = "#ffd86b";
  ctx.font = "bold 30px Arial";
  ctx.fillText("⏰ 08:" + String(tempo - 8 * 60).padStart(2, "0"), 500, 43);

  ctx.fillText("+5 MIN x " + cincoMinutinhos, 700, 43);

  ctx.fillStyle = "white";
  ctx.font = "bold 20px Arial";
  ctx.fillText("DESPERTADOR MALIGNO", 850, 25);

  ctx.fillStyle = "#550000";
  ctx.fillRect(850, 35, 250, 18);

  ctx.fillStyle = "#ff3333";
  ctx.fillRect(850, 35, 50 * chefeVida, 18);
}

function desenharJoelson() {
  ctx.fillStyle = "#f7c6a3";
  ctx.fillRect(joelson.x + 10, joelson.y, 25, 25);

  ctx.fillStyle = "#5b3825";
  ctx.fillRect(joelson.x + 5, joelson.y - 8, 35, 18);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(joelson.x + 5, joelson.y + 25, 35, 30);

  ctx.fillStyle = "#1b355c";
  ctx.fillRect(joelson.x + 8, joelson.y + 55, 12, 18);
  ctx.fillRect(joelson.x + 25, joelson.y + 55, 12, 18);

  ctx.fillStyle = "#000";
  ctx.fillRect(joelson.x + 16, joelson.y + 10, 4, 4);
  ctx.fillRect(joelson.x + 28, joelson.y + 10, 4, 4);
}

function desenharPrincesa() {
  ctx.fillStyle = "#ff6fae";
  ctx.fillRect(princesa.x, princesa.y + 45, 75, 30);

  ctx.fillStyle = "#f7c6a3";
  ctx.fillRect(princesa.x + 20, princesa.y + 5, 35, 35);

  ctx.fillStyle = "#8b5a44";
  ctx.fillRect(princesa.x + 10, princesa.y, 55, 30);

  ctx.fillStyle = "#ffd700";
  ctx.fillRect(princesa.x + 25, princesa.y - 12, 25, 12);

  ctx.fillStyle = "white";
  ctx.font = "bold 24px Arial";
  if (princesa.dormindo) {
    ctx.fillText("Zzz", princesa.x - 20, princesa.y);
  } else {
    ctx.fillText("❤", princesa.x - 20, princesa.y + 10);
  }
}

function desenharChefe() {
  if (chefeVida <= 0) return;

  ctx.fillStyle = "#4b356d";
  ctx.beginPath();
  ctx.arc(chefe.x + 60, chefe.y + 60, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ff3333";
  ctx.beginPath();
  ctx.arc(chefe.x + 35, chefe.y + 50, 8, 0, Math.PI * 2);
  ctx.arc(chefe.x + 85, chefe.y + 50, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ff6cff";
  ctx.lineWidth = 4;
  ctx.strokeRect(chefe.x - 5, chefe.y - 5, chefe.w + 10, chefe.h + 10);

  ctx.fillStyle = "#000";
  ctx.font = "bold 40px Arial";
  ctx.fillText("⏰", chefe.x + 28, chefe.y + 78);
}

function desenharCastelo() {
  ctx.fillStyle = "#7b7b8f";
  ctx.fillRect(1035, 330, 125, 190);

  ctx.fillStyle = "#55556a";
  ctx.fillRect(1025, 300, 45, 220);
  ctx.fillRect(1125, 300, 45, 220);

  ctx.fillStyle = "#ff4f93";
  ctx.fillRect(1070, 290, 70, 25);

  ctx.fillStyle = "#201520";
  ctx.fillRect(1070, 395, 55, 125);
}

function desenharMoedas() {
  moedas.forEach(m => {
    if (!m.ativa) return;

    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.arc(m.x + 20, m.y + 20, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1b1630";
    ctx.font = "bold 16px Arial";
    ctx.fillText("+5", m.x + 7, m.y + 20);
    ctx.fillText("MIN", m.x + 5, m.y + 36);
  });
}

function desenharEspinhos() {
  ctx.fillStyle = "#dddddd";
  espinhos.forEach(e => {
    for (let i = 0; i < e.w; i += 20) {
      ctx.beginPath();
      ctx.moveTo(e.x + i, e.y + e.h);
      ctx.lineTo(e.x + i + 10, e.y);
      ctx.lineTo(e.x + i + 20, e.y + e.h);
      ctx.fill();
    }
  });
}

function desenharPlataforma(p) {
  ctx.fillStyle = "#2c8f45";
  ctx.fillRect(p.x, p.y, p.w, p.h);

  ctx.fillStyle = "#5b3520";
  ctx.fillRect(p.x, p.y + 20, p.w, 30);
}

function instrucoes() {
  ctx.fillStyle = "#1b1630";
  ctx.fillRect(330, 555, 540, 35);

  ctx.fillStyle = "white";
  ctx.font = "bold 18px Arial";
  ctx.fillText("USE AS SETAS PARA MOVER E ESPAÇO PARA PULAR", 385, 579);

  ctx.fillStyle = "#6b3a22";
  ctx.fillRect(25, 400, 160, 90);

  ctx.fillStyle = "white";
  ctx.font = "bold 18px Arial";
  ctx.fillText("OBJETIVO:", 55, 430);
  ctx.font = "15px Arial";
  ctx.fillText("Colete +5 minutinhos", 42, 455);
  ctx.fillText("Derrote o chefão", 55, 475);
}

function colisao(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function vencer() {
  venceu = true;
  jogoAtivo = false;
  canvas.style.display = "none";
  telaVitoria.style.display = "flex";
}

function loop() {
  atualizar();
  desenhar();
  if (jogoAtivo) requestAnimationFrame(loop);
}
