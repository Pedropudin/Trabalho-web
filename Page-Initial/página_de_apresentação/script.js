// Função responsável por criar partículas com efeito elétrico ao redor do clique
function criarParticulas(e) {
    // Cria 6 partículas para cada clique
    for (let i = 0; i < 6; i++) {
        // Cria um novo elemento <div> que representará uma partícula
        const efeito = document.createElement('div');

        // Adiciona a classe CSS que define o estilo e animação da partícula
        efeito.classList.add('efeito-eletrico');

        // Gera posições aleatórias ao redor do ponto de clique
        const offsetX = Math.random() * 40 - 20; // Valor entre -20 e 20
        const offsetY = Math.random() * 40 - 20;

        // Define a posição absoluta da partícula na tela
        efeito.style.left = `${e.clientX + offsetX}px`;
        efeito.style.top = `${e.clientY + offsetY}px`;

        // Adiciona a partícula ao corpo do documento (visível na tela)
        document.body.appendChild(efeito);

        // Remove a partícula após 0.5 segundos para evitar acúmulo na memória
        setTimeout(() => {
            efeito.remove();
        }, 500);
    }
}

// Seleciona o botão de retorno ao topo pelo ID
const btnTopo = document.getElementById('btn-topo');

// Adiciona um ouvinte de evento para o clique no botão
btnTopo.addEventListener('click', (e) => {
    // Chama a função que cria as partículas com efeito elétrico
    criarParticulas(e);

    // Faz a rolagem suave da página até o topo
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});