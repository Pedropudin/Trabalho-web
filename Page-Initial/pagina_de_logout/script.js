// Impede o botão "voltar" do navegador
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};

// Contagem regressiva para redirecionar
let countdown = 45;
const timerElement = document.getElementById("timer");
if (timerElement) {
  timerElement.textContent = countdown;

  const interval = setInterval(() => {
    countdown--;
    timerElement.textContent = countdown;

    if (countdown === 0) {
      clearInterval(interval);
      limparStorageERedirecionar();
    }
  }, 1000);

  // Redireciona ao clicar no botão
  const homeButton = document.getElementById("homeRedirect");
  if (homeButton) {
    homeButton.addEventListener("pointerdown", () => {
      clearInterval(interval);
      limparStorageERedirecionar();
    });
  }
}

// Função para limpar storage e redirecionar
function limparStorageERedirecionar() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../pagina_de_apresentacao/index.html";
}
