document.addEventListener("DOMContentLoaded", function () {
    // Alterna a visibilidade dos botões (responsivo)
    document.querySelector('.menu-toggle').addEventListener('click', function () {
        document.querySelector('.buttons').classList.toggle('show');
        /* Quando o botão é clicado, ele alterna (toggle) a classe 'show' no elemento com a classe 'buttons'
        Isso é útil para exibir ou esconder os botões de perfil em dispositivos móveis */
    });

    // Atualizando a data de compra dinâmica
    const compras = document.querySelector('.compras p');
    const data = new Date();
    const opcoes = { day: '2-digit', month: 'long' };
    const dataFormatada = data.toLocaleDateString('pt-BR', opcoes);
    compras.textContent = `Compra realizada em ${dataFormatada}`;

    // Atualizando contador de produtos aguardando avaliação
    const qtd = document.querySelectorAll('.produtos .produto').length;
    const produtosAguardando = document.querySelector('.avaliacao p');
    produtosAguardando.innerHTML = `${qtd} produto${qtd > 1 ? 's' : ''} esperam sua opinião/avaliação`;

    // Mapeamento de IDs para URLs de destino
    const rotas = {
        //perfil: "../pagina_de_perfil/index.html", --> em desenvolvimento
        //carrinho: "../../Page-Products/pagina_do_carrinho/index.html", --> em desenvolvimento
        logout: "../pagina_de_logout/index.html"
    };

    // Adiciona feedback visual e redirecionamento
    function animarClique(botao) {
        botao.classList.add('clicado');
        setTimeout(() => botao.classList.remove('clicado'), 150);
    }

    for (const [id, url] of Object.entries(rotas)) {
        const botao = document.getElementById(id);
        if (!botao) continue;

        botao.addEventListener("click", function () {
            animarClique(botao);

            if (id === 'logout') {
                location.replace(url);
            }

            else {
                window.location.href = url;
            }
        });
    }

    // Fecha o toggle ao clicar fora
    document.addEventListener('click', function (event) {
        const buttons = document.querySelector('.buttons');
        const toggle = document.querySelector('.menu-toggle');
        if (!buttons.contains(event.target) && !toggle.contains(event.target)) {
            buttons.classList.remove('show');
        }
    });

    // Exibe o modal
    function abrirModal() {
        document.getElementById('modal').style.display = 'block';
    }

    // Oculta o modal
    function fecharModal() {
        document.getElementById('modal').style.display = 'none';
    }

    const openBtn = document.querySelector('.open-modal');
    const closeBtn = document.querySelector('.close-modal');

    if (openBtn)
        openBtn.addEventListener('click', abrirModal);

    if (closeBtn)
        closeBtn.addEventListener('click', fecharModal);
});