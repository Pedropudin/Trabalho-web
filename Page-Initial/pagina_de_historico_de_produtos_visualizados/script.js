// Seleciona o elemento com a classe 'menu-toggle' (geralmente um botão ou ícone de menu em sites responsivos)
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.menu').classList.toggle('show');
    /* Quando o botão é clicado, ele alterna (toggle) a classe 'show' no elemento com a classe 'menu'
    Isso é útil para exibir ou esconder o menu em dispositivos móveis */
});

// Mapeamento de IDs para URLs de destino
const rotas = {
    perfil: "../pagina_de_perfil/index.html",
    carrinho: "../../Page-Products/pagina_do_produto/index.html",
    logout: "../pagina_de_logout/index.html"
};

// Percorre cada par id -> url, a fim de redirecionar a página para outra, devidamente
for (const [id, url] of Object.entries(rotas)) {
    const botao = document.getElementById(id);

    if (botao) {
        botao.addEventListener("click", function () {
            window.location.href = url;
        });
    }
}