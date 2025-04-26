// BLOQUEIO DO BOTÃO “VOLTAR”
// Empurra duas entradas idênticas no histórico e “trava” o back
history.pushState(null, null, location.href);
history.pushState(null, null, location.href);
window.addEventListener('popstate', () => {
  history.go(1);
});

/**
 * Cria um efeito de partículas elétricas no ponto clicado e reproduz som.
 * O efeito só aparece quando o botão de scroll ou o botão de entrar no site é clicado.
 *
 * @param {MouseEvent} e - Evento de clique, usado para posicionar o efeito.
 */
function criarParticulas(e) {
    const particulas = []; // Armazena as partículas criadas

    // Reproduz o som de efeito elétrico
    const som = new Audio('electric_zap_001-6374.mp3');
    som.volume = 0.3;
    som.play().catch(() => {}); // Evita erro se o navegador bloquear autoplay

    for (let i = 0; i < 6; i++) {
        // Cria uma <div> para representar a partícula
        const efeito = document.createElement('div');
        efeito.classList.add('efeito-eletrico');

        // Adiciona uma classe aleatória para o estilo visual da partícula
        const formatos = ['circulo', 'quadrado', 'faísca'];
        const classeForma = formatos[Math.floor(Math.random() * formatos.length)];
        efeito.classList.add(classeForma);

        // Gera posição aleatória ao redor do clique
        const offsetX = Math.random() * 40 - 20;
        const offsetY = Math.random() * 40 - 20;
        const posX = e.pageX + offsetX;
        const posY = e.pageY + offsetY;

        // Define a posição da partícula
        efeito.style.left = `${posX}px`;
        efeito.style.top = `${posY}px`;

        // Adiciona a partícula ao DOM
        document.body.appendChild(efeito);

        // Armazena referência para animação posterior
        particulas.push({ el: efeito, x: posX, y: posY });
    }

    // Anima as partículas conforme a rolagem da página
    let startY = window.scrollY;
    function animar() {
        let diffY = startY - window.scrollY;
        particulas.forEach(p => {
            p.el.style.top = `${p.y + diffY}px`;
        });

        // Continua a animação enquanto houver rolagem
        if (diffY < startY) {
            requestAnimationFrame(animar);
        }
    }
    animar();

    // Remove as partículas após 0.5 segundos
    setTimeout(() => {
        particulas.forEach(p => p.el.remove());
    }, 500);
}

/**
 * Rola suavemente a página para o topo e gera o efeito elétrico.
 * @param {MouseEvent} e - Evento de clique usado para posicionar partículas.
 */
function scrollToTop(e) {
    criarParticulas(e); // Ativa o efeito visual
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo
}

// Aguarda o carregamento completo do DOM para adicionar eventos
document.addEventListener('DOMContentLoaded', () => {
    // Botão de scroll para o topo com efeito elétrico
    const btnTopo = document.getElementById('btn-topo');
    if (btnTopo) {
        btnTopo.addEventListener('click', scrollToTop);
    }

    // Botão "Entre no site" com efeito e redirecionamento irreversível
    const entrada = document.querySelector(".cadastro");
    if (entrada) {
        entrada.addEventListener('click', function (e) {
            e.preventDefault(); // Impede o comportamento padrão do botão

            criarParticulas(e); // Gera efeito no clique

            const som = new Audio('electric_zap_001-6374.mp3');
            som.volume = 0.3;

            // Toca o som e aguarda o fim antes de redirecionar
            som.play().then(() => {
                som.addEventListener('ended', () => {
                     // Substitui a entrada de histórico atual
                     history.replaceState(null, null, location.href);
                    // Redirecionamento sem possibilidade de voltar (replace)
                    window.location.replace("../pagina_de_login/index.html");
                });
            }).catch(() => {
                 // Substitui a entrada de histórico atual
                 history.replaceState(null, null, location.href);
                // Se não conseguir tocar o som, espera um pouco antes de redirecionar
                setTimeout(() => {
                    window.location.replace("../pagina_de_login/index.html");
                }, 500);
            });
        });
    }
});