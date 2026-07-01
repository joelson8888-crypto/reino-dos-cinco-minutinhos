const telaInicial = document.getElementById("telaInicial");
const telaVitoria = document.getElementById("telaVitoria");
const botaoJogar = document.getElementById("botaoJogar");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1536;
canvas.height = 1024;

const fundo = new Image();
fundo.src = "assets/fase1.png";

let jogoAtivo = false;
let teclas = {};
let minutinhos = 0;
let chefeVida = 5;

const joelson = {
  x: 250,
  y: 670,
  w: 55,
  h: 75,
  vx: 0,
  vy: 0,
  speed: 6,
  pulando: false,
  vida: 3
};

const moedas = [
  { x: 385, y: 510, ativa: true },
  { x: 560, y: 370, ativa: true },
  { x: 700, y: 520, ativa: true },
  { x: 835, y: 420, ativa: true }
];

const espinhos = [
  { x: 560, y: 720, w: 220, h: 45 },
  { x: 1210, y: 720, w: 85, h: 45 }
];

const chefe = {
  x: 970,
  y: 420,
  w: 220,
  h: 300
};

const princesa = {
  x: 1320,
  y: 430,
  w: 130,
  h: 240
};

botaoJogar.onclick = () => {
  telaInicial.style.display = "none";
  canvas.style.display = "block";
  jogoAtivo = true;
  loop();
};

document.addEventListener("keydown", e => teclas[e.key] = true);
document.addEventListener("keyup", e => teclas[e.key] = false);

document.getElementById("esquerda").ontouchstart = () => teclas["ArrowLeft"] = true;
document.getElementById("esquerda").ontouchend = () => teclas["ArrowLeft"] = false;

document.getElementById("direita").ontouchstart = () => teclas["ArrowRight"] = true;
document.getElementById("direita").ontouchend = () => teclas["ArrowRight"] = false;

document.getElementById("pular").ontouchstart = () => teclas[" "] = true;
document.getElementById("pular").ontouchend = () => teclas[" "] = false;

function atualizar() {
  joelson.vx = 0;

  if (teclas["ArrowRight"]) joelson.vx = joelson.speed;
  if (teclas["ArrowLeft"]) joelson.vx = -joelson.speed;

  if ((teclas[" "] || teclas["ArrowUp"]) && !joelson.pulando) {
    joelson.vy = -18;
    joelson.pulando = true;
  }

  joelson.x += joelson.vx;
  joelson.y += joelson.vy;
  joelson.vy += 0.9;

  if (joelson.y >= 670) {
    joelson.y = 670;
    joelson.vy = 0;
    joelson.pulando = false;
  }

  moedas.forEach(m => {
    if (m.ativa && colisao(joelson, { x: m.x, y: m.y, w: 60, h: 60 })) {
      m.ativa = false;
      minutinhos++;
    }
  });

  espinhos.forEach(e => {
    if (colisao(joelson, e)) {
      perderVida();
    }
  });

  if (chefeVida > 0 && colisao(joelson, chefe)) {
    if (minutinhos > 0) {
      chefeVida--;
      minutinhos--;
      joelson.x -= 120;
    } else {
      perderVida();
    }
  }

  if (chefeVida <= 0 && colisao(joelson, princesa)) {
    vencer();
  }

  if (joelson.x < 0) joelson.x = 0;
  if (joelson.x > canvas.width - joelson.w) joelson.x = canvas.width - joelson.w;
}

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height);

  desenharJoelson();
  desenharHUD();

  if (chefeVida <= 0) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 34px Arial";
    ctx.fillText("O Despertador foi derrotado! Vá salvar Rayaninha!", 420, 170);
  }
}

function desenharJoelson() {
  ctx.fillStyle = "#f4c2a0";
  ctx.fillRect(joelson.x + 12, joelson.y, 32, 32);

  ctx.fillStyle = "#5a3825";
  ctx.fillRect(joelson.x + 5, joelson.y - 12, 48, 20);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(joelson.x + 8, joelson.y + 32, 40, 35);

  ctx.fillStyle = "#1d3f75";
  ctx.fillRect(joelson.x + 10, joelson.y + 65, 14, 24);
  ctx.fillRect(joelson.x + 32, joelson.y + 65, 14, 24);

  ctx.fillStyle = "#000";
  ctx.fillRect(joelson.x + 20, joelson.y + 12, 4, 4);
  ctx.fillRect(joelson.x + 34, joelson.y + 12, 4, 4);
}

function desenharHUD() {
  ctx.fillStyle = "#ff4f93";
  ctx.font = "bold 32px Arial";

  let coracoes = "";
  for (let i = 0; i < joelson.vida; i++) coracoes += "❤ ";

  ctx.fillText(coracoes, 320, 75);

  ctx.fillStyle = "#ffd86b";
  ctx.fillText("+5 MIN x " + minutinhos, 770, 78);

  ctx.fillStyle = "#ff3333";
  ctx.fillRect(1030, 78, chefeVida * 60, 18);
}

function perderVida() {
  joelson.vida--;
  joelson.x = 250;
  joelson.y = 670;
  joelson.vy = 0;

  if (joelson.vida <= 0) {
    location.reload();
  }
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
  jogoAtivo = false;
  canvas.style.display = "none";
  telaVitoria.style.display = "flex";
}

function loop() {
  if (!jogoAtivo) return;

  atualizar();
  desenhar();

  requestAnimationFrame(loop);
}
