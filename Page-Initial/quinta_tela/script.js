// Contagem regressiva para redirecionar
let countdown = 5;
const timerElement = document.getElementById("timer");
const interval = setInterval(() => {
    countdown--;
    timerElement.textContent = countdown;
    
    if (countdown === 0) {
        clearInterval(interval);
        window.location.href = "index.html"; // Redireciona para a home
    }
}, 1000);

// Redireciona ao clicar no botão
function redirectHome() {
    clearInterval(interval);
    window.location.href = "index.html";
}