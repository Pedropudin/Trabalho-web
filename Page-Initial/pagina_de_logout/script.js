// Contagem regressiva para redirecionar para a página inicial de produtos
let countdown = 45;
const timerElement = document.getElementById("timer");
timerElement.textContent = countdown;

const interval = setInterval(() => {
    countdown--;
    timerElement.textContent = countdown;
    
    if (countdown === 0) {
        clearInterval(interval);
        window.location.href = "../../Page-Products/pagina_de_pesquisa/index.html";
    }
}, 1000);

// Redireciona ao clicar no botão
function redirectHome() {
    clearInterval(interval);
    window.location.href = "../../Page-Products/pagina_de_pesquisa/index.html";
}