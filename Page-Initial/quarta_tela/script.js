// Seleciona o elemento com a classe 'menu-toggle' (geralmente um botão ou ícone de menu em sites responsivos)
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.menu').classList.toggle('show');
    /* Quando o botão é clicado, ele alterna (toggle) a classe 'show' no elemento com a classe 'menu'
    Isso é útil para exibir ou esconder o menu em dispositivos móveis */
});