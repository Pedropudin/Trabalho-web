// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Alterna a visibilidade dos botões (responsivo)
      document.querySelector('.menu-toggle').addEventListener('click', function () {
          document.querySelector('.buttons').classList.toggle('show');
          /* Quando o botão é clicado, ele alterna (toggle) a classe 'show' no elemento com a classe 'buttons'
          Isso é útil para exibir ou esconder os botões de perfil em dispositivos móveis */
      });

  // Preenchimento dinâmico (futuro backend)
  const nomeUsuario  = "João Silva";

  document.getElementById("nome-usuario").textContent  = nomeUsuario;

  // Torna cada .card clicável usando data-href
  document.querySelectorAll('.card').forEach(card => {
    const url = card.dataset.href;
    if (!url) return;
    card.addEventListener('click', () => {
      window.location.href = url;
    });
    // Acessibilidade: teclado
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        window.location.href = url;
      }
    });
  });
});