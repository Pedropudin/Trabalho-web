// Alterna a visibilidade do menu (responsivo)
document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('.menu').classList.toggle('show');
});

// Exibe o modal
function abrirModal() {
    document.getElementById('modal').style.display = 'block';
}

// Oculta o modal
function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}