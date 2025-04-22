// Função para alternar entre os formulários (Cliente e Administrador)
function mostrarFormulario(tipo) {
  const formCliente = document.getElementById("form-cliente");
  const formAdmin = document.getElementById("form-admin");

  if (tipo === "cliente") {
    formCliente.classList.add("show");
    formCliente.classList.remove("hidden");
    formAdmin.classList.remove("show");
    setTimeout(() => formAdmin.classList.add("hidden"), 600); // Tempo de transição mais suave
  } else {
    formAdmin.classList.add("show");
    formAdmin.classList.remove("hidden");
    formCliente.classList.remove("show");
    setTimeout(() => formCliente.classList.add("hidden"), 600); // Tempo de transição mais suave
  }
}

// Função de validação para o login do cliente
function validarCliente() {
  const nome = document.getElementById("nome-cliente").value;
  const email = document.getElementById("email-cliente").value;

  if (!nome || !email) {
    alert("Preencha todos os campos do cliente.");
    return false;
  }

  alert("Login do cliente enviado com sucesso!");
  return true;
}

// Função de validação para o login do administrador
function validarAdmin() {
  const nome = document.getElementById("nome-admin").value;
  const senha = document.getElementById("senha-admin").value;
  const token = document.getElementById("token").value;

  if (!nome || !senha || !token) {
    alert("Preencha todos os campos do administrador.");
    return false;
  }

  alert("Login do administrador enviado com sucesso!");
  return true;
}

// Ativa os ícones do Lucide após o carregamento da página
window.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons(); // Ativa os ícones

  // Adicionando os event listeners para os botões de cliente e administrador
  document.getElementById('btn-cliente').addEventListener('click', () => mostrarFormulario('cliente'));
  document.getElementById('btn-admin').addEventListener('click', () => mostrarFormulario('admin'));

  // Adicionando os event listeners para os formulários
  document.getElementById('form-cliente').addEventListener('submit', (e) => {
    e.preventDefault();
    validarCliente();
  });
  document.getElementById('form-admin').addEventListener('submit', (e) => {
    e.preventDefault();
    validarAdmin();
  });
});

/*
Inicialmente, o formulário de cliente aparece e o de administrador está oculto.

Ao clicar em "Cliente", o formulário de cliente aparece e o de administrador some.

Ao clicar em "Administrador", o formulário de administrador aparece e o de cliente some

Garantia de que a exibição do formulário é mais dinâmica
*/