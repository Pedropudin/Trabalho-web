/**
 * Cria um efeito de partículas elétricas no ponto clicado e reproduz som.
 * O efeito só aparece quando o botão de scroll ou o botão de entrar no site é clicado.
 *
 * @param {MouseEvent} e - Evento de clique, usado para posicionar o efeito.
 */
function criarParticulas(e) {
    const particulas = [];

    // Reproduz o som de efeito elétrico
    const som = new Audio('electric_zap_001-6374.mp3');
    som.volume = 0.3;
    som.play().catch(() => {});

    for (let i = 0; i < 6; i++) {
        const efeito = document.createElement('div');
        efeito.classList.add('efeito-eletrico');

        const formatos = ['circulo', 'quadrado', 'faisca'];
        const classeForma = formatos[Math.floor(Math.random() * formatos.length)];
        efeito.classList.add(classeForma);

        const offsetX = Math.random() * 40 - 20;
        const offsetY = Math.random() * 40 - 20;
        const posX = e.pageX + offsetX;
        const posY = e.pageY + offsetY;

        efeito.style.left = `${posX}px`;
        efeito.style.top = `${posY}px`;

        document.body.appendChild(efeito);
        particulas.push({ el: efeito, x: posX, y: posY });
    }

    let startY = window.scrollY;
    function animar() {
        let diffY = startY - window.scrollY;
        particulas.forEach(p => {
            p.el.style.top = `${p.y + diffY}px`;
        });
        if (diffY < startY) {
            requestAnimationFrame(animar);
        }
    }
    animar();

    setTimeout(() => particulas.forEach(p => p.el.remove()), 500);
}

/**
 * Rola suavemente a página para o topo e gera o efeito elétrico.
 * @param {MouseEvent} e - Evento de clique usado para posicionar partículas.
 */
function scrollToTop(e) {
    criarParticulas(e);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    // Scroll para o topo
    const btnTopo = document.getElementById('btn-topo');
    if (btnTopo) {
        btnTopo.addEventListener('click', scrollToTop);
    }

    // Botão 'Entre no site' apenas com efeito elétrico
    const entrada = document.querySelector('.cadastro');
    if (entrada) {
        entrada.addEventListener('click', function (e) {
            e.preventDefault();
            criarParticulas(e);
        });
    }
});
