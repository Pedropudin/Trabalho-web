/**
 * Cria um efeito visual de partículas elétricas animadas no clique,
 * que acompanham a rolagem da página. Adiciona também um som leve de clique.
 *
 * @param {MouseEvent} e - Evento de clique usado para capturar a posição do mouse.
 */
function criarParticulas(e) {
    const particulas = [];

    // Reproduz som ao clicar
    const som = new Audio('clic-eletrico.mp3'); // Coloque esse arquivo na pasta do projeto
    som.volume = 0.3; // Volume moderado
    som.play().catch(() => {}); // Em alguns navegadores, a reprodução pode exigir interação prévia

    for (let i = 0; i < 6; i++) {
        // Cria um elemento <div> para a partícula
        const efeito = document.createElement('div');
        efeito.classList.add('efeito-eletrico');

        // Formato aleatório da partícula
        const formatos = ['circulo', 'quadrado', 'faísca'];
        const classeForma = formatos[Math.floor(Math.random() * formatos.length)];
        efeito.classList.add(classeForma);

        // Gera deslocamento aleatório em torno do clique
        const offsetX = Math.random() * 40 - 20;
        const offsetY = Math.random() * 40 - 20;

        // Calcula posição inicial
        const posX = e.pageX + offsetX;
        const posY = e.pageY + offsetY;

        // Aplica posição ao estilo
        efeito.style.left = `${posX}px`;
        efeito.style.top = `${posY}px`;

        // Adiciona ao DOM
        document.body.appendChild(efeito);

        // Guarda referência e posição
        particulas.push({ el: efeito, x: posX, y: posY });
    }

    // Anima as partículas durante a rolagem para o topo
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

    // Remove partículas após 0.5 segundos
    setTimeout(() => {
        particulas.forEach(p => p.el.remove());
    }, 500);
}

/* Rola suavemente a página de volta ao topo quando chamado. */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Adiciona os eventos após o carregamento da página
document.addEventListener('DOMContentLoaded', () => {
    // Evento global para clique na página — gera partículas
    document.addEventListener('click', criarParticulas);

    // Evento no botão de retorno ao topo
    const btnTopo = document.getElementById('btn-topo');
    if (btnTopo) {
        btnTopo.addEventListener('click', scrollToTop);
    }
});

const entrada = document.querySelector(".cadastro");

// Redirecionamento simples entre diferentes páginas da aplicação web
if (entrada) {
    entrada.addEventListener('click', function () {
        window.location.href = "../../Page-Products/pagina_de_pesquisa/index.html";
    });
}