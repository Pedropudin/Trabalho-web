document.addEventListener("DOMContentLoaded", function () {
    // Alterna a visibilidade do menu (responsivo)
    document.querySelector('.menu-toggle').addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelector('.menu').classList.toggle('show');
    });

    // Atualizando a data de compra dinâmica
    const compras = document.querySelector('.compras p');
    if (compras) {
        const data = new Date();
        const opcoes = { day: '2-digit', month: 'long' };
        const dataFormatada = data.toLocaleDateString('pt-BR', opcoes);
        compras.textContent = `Compra realizada em ${dataFormatada}`;
    }

    // Atualizando contador de produtos aguardando avaliação
    const qtd = document.querySelectorAll('.produtos .produto').length;
    const produtosAguardando = document.querySelector('.avaliacao p');
    if (produtosAguardando) {
        produtosAguardando.innerHTML = `${qtd} produto${qtd > 1 ? 's' : ''} esperam sua opinião/avaliação`;
    }

    // Mapeamento de IDs para URLs de destino
    const rotas = {
        perfil: "../pagina_de_perfil/index.html",
        carrinho: "../../Page-Products/pagina_do_produto/index.html",
        logout: "../pagina_de_logout/index.html"
    };

    // Percorre cada par id -> url, a fim de redirecionar a página para outra
    for (const [id, url] of Object.entries(rotas)) {
        const botao = document.getElementById(id);
        if (!botao) continue;

        botao.addEventListener("click", function () {
            if (id === 'logout') {
                // Redirecionamento sem chance de voltar
                location.replace(url);
            } else {
                // Redirecionamento normal
                window.location.href = url;
            }
        });
    }

    // Fechar menu ao clicar fora
    document.addEventListener('click', function (event) {
        const menu = document.querySelector('.menu');
        const toggle = document.querySelector('.menu-toggle');
        if (menu && !menu.contains(event.target) && !toggle.contains(event.target)) {
            menu.classList.remove('show');
        }
    });

    // Adicionar feedback visual nos botões de dentro do menu
    function animarClique(botao) {
        botao.classList.add('clicado');
        setTimeout(() => botao.classList.remove('clicado'), 150);
    }
    const botoesMenu = document.querySelectorAll('.menu .buttons button');
    botoesMenu.forEach(botao => {
        botao.addEventListener('click', function () {
            animarClique(botao);
            // após animação, redireciona se for perfil
            if (botao.id === 'perfil') {
                setTimeout(() => window.location.href = rotas.perfil, 150);
            }
        });
    });

    // Atualiza dinamicamente o número de itens no carrinho (exemplo fictício)
    const carrinhoBtn = document.getElementById('carrinho');
    if (carrinhoBtn) {
        const itensNoCarrinho = sessionStorage.getItem('itensCarrinho') || 0;
        carrinhoBtn.textContent = `${itensNoCarrinho} ${itensNoCarrinho == 1 ? 'item' : 'itens'} • Carrinho`;
    }

    // Ativa/desativa dark mode ao pressionar 'D' no teclado
    document.addEventListener('keydown', function (e) {
        if (e.key.toLowerCase() === 'd') {
            document.body.classList.toggle('dark-mode');
        }
    });

    // Exibe/oculta um modal genérico (se presente)
    function abrirModal() {
        const modal = document.getElementById('modal');
        if (modal) modal.style.display = 'block';
    }
    function fecharModal() {
        const modal = document.getElementById('modal');
        if (modal) modal.style.display = 'none';
    }
    const abrirBtn = document.querySelector('.open-modal');
    const fecharBtn = document.querySelector('.close-modal');
    if (abrirBtn)  abrirBtn.addEventListener('click', abrirModal);
    if (fecharBtn) fecharBtn.addEventListener('click', fecharModal);

    // Fecha o modal ao clicar fora da área de conteúdo
    document.addEventListener('click', function (e) {
        const modal = document.getElementById('modal');
        if (modal && modal.style.display === 'block' && !modal.querySelector('.modal-content').contains(e.target)) {
            fecharModal();
        }
    });
});