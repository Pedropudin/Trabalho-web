// Impede o botão "voltar" do navegador
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};

// Contagem regressiva para redirecionar
let countdown = 45;
const timerElement = document.getElementById("timer");
timerElement.textContent = countdown;

const interval = setInterval(() => {
  countdown--;
  timerElement.textContent = countdown;

  if (countdown === 0) {
    clearInterval(interval);
    localStorage.clear(); // Limpa localStorage, garante que os dados do usuário que "deslogou" não fiquem armazenados
    sessionStorage.clear(); // Limpa sessionStorage
    window.location.href = "../../Page-Products/pagina_de_pesquisa/index.html";
  }
}, 1000);

// Redireciona ao clicar no botão
function redirectHome() {
  clearInterval(interval);
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../Page-Products/pagina_de_pesquisa/index.html";
}