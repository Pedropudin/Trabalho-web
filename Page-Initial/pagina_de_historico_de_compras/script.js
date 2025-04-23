document.addEventListener("DOMContentLoaded", function () {
    // Alterna a visibilidade do menu (responsivo)
    document.querySelector('.menu-toggle').addEventListener('click', function () {
        document.querySelector('.menu').classList.toggle('show');
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
        perfil: "../pagina_de_perfil/index.html",
        carrinho: "../../Page-Products/pagina_do_produto/index.html",
        logout: "../pagina_de_logout/index.html"
    };

    // Percorre cada par id -> url, a fim de redirecionar a página para outra
    for (const [id, url] of Object.entries(rotas)) {
        const botao = document.getElementById(id);

        if (botao) {
            botao.addEventListener("click", function () {
                if (id === 'logout') {
                    // Redirecionamento sem chance de voltar
                    location.replace(url);
                }

                else {
                    // Redirecionamento normal
                    window.location.href = url;
                }
            });
        }
    }

    // Fechar menu ao clicar fora
    document.addEventListener('click', function (event) {
        const menu = document.querySelector('.menu');
        const toggle = document.querySelector('.menu-toggle');
        if (!menu.contains(event.target) && !toggle.contains(event.target)) {
            menu.classList.remove('show');
        }
    });

    // Adicionar feedback visual nos botões
    function animarClique(botao) {
        botao.classList.add('clicado');
        setTimeout(() => botao.classList.remove('clicado'), 150);
    }

    const botoes = document.querySelectorAll('.buttons button');
    botoes.forEach(botao => {
        botao.addEventListener('click', function () {
            animarClique(botao);
            if (botao.id === 'perfil') {
                setTimeout(() => window.location.href = 'perfil.html', 150);
            }
        });
    });

    // Exibe o modal
    function abrirModal() {
        document.getElementById('modal').style.display = 'block';
    }

    // Oculta o modal
    function fecharModal() {
        document.getElementById('modal').style.display = 'none';
    }

    // Funcionalidade de abrir/fechar modal
    document.querySelector('.open-modal').addEventListener('click', abrirModal);
    document.querySelector('.close-modal').addEventListener('click', fecharModal);
});