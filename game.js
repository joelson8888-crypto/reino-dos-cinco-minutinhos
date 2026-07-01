const telaInicial = document.getElementById("telaInicial");
const botaoJogar = document.getElementById("botaoJogar");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 600;


botaoJogar.addEventListener("click", () => {

    musicaTema.play();
    musicaTema.volume = 0.4;

    telaInicial.style.display = "none";
    canvas.style.display = "block";

    iniciarFase1();
});
function iniciarFase1() {
    desenharFase();
}

function desenharFase() {

    // Céu
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, 1200, 600);

    // Montanhas
    ctx.fillStyle = "#9A7FD1";

    ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.lineTo(250, 180);
    ctx.lineTo(500, 400);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(350, 400);
    ctx.lineTo(700, 150);
    ctx.lineTo(1000, 400);
    ctx.fill();

    // Chão
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(0, 520, 1200, 80);

    // Castelo
    ctx.fillStyle = "#FFB6C1";
    ctx.fillRect(1000, 250, 150, 270);

    // Princesa
    ctx.fillStyle = "#FFE4E1";
    ctx.beginPath();
    ctx.arc(1075, 220, 30, 0, Math.PI * 2);
    ctx.fill();

    // Joelson (temporário)
    ctx.fillStyle = "#2E8B57";
    ctx.fillRect(100, 430, 60, 90);

    // Despertador Chefão
    ctx.fillStyle = "#5B3A8E";
    ctx.beginPath();
    ctx.arc(650, 450, 50, 0, Math.PI * 2);
    ctx.fill();

    // Olhos
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(635, 440, 6, 0, Math.PI * 2);
    ctx.arc(665, 440, 6, 0, Math.PI * 2);
    ctx.fill();

    // Relógio
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("08:55", 30, 50);

    ctx.font = "22px Arial";
    ctx.fillText("Salve a princesa antes das 9h!", 400, 50);
}
