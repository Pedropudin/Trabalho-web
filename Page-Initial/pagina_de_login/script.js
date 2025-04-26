// Alterna entre os formulários (Cliente ou Administrador)
function mostrarFormulario(tipo) {
  const formCliente = document.getElementById("form-cliente");
  const formAdmin = document.getElementById("form-admin");

  if (tipo === "cliente") {
    formCliente.classList.add("show");
    formCliente.classList.remove("hidden");
    formAdmin.classList.remove("show");
    limparCampos(formAdmin);
    setTimeout(() => formAdmin.classList.add("hidden"), 600);
  }

  else {
    formAdmin.classList.add("show");
    formAdmin.classList.remove("hidden");
    formCliente.classList.remove("show");
    limparCampos(formCliente);
    setTimeout(() => formCliente.classList.add("hidden"), 600);
  }
}

// Rotas de redirecionamento
const rotas = {
  pesquisa: "../../Page-Products/pagina_de_pesquisa/index.html",
  administrador: "../../Page-Adm/main.html",
};

// Expressão regular para nome com ao menos 6 caracteres e 1 caractere especial
const nomeRegex = /^(?=.*[\W_]).{6,}$/;

// Validação do formulário do cliente
function validarCliente() {
  const nome = document.getElementById("nome-cliente").value.trim();
  const email = document.getElementById("email-cliente").value.trim();

  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (!nomeRegex.test(nome)) {
    exibirMensagemDOM("O nome do cliente deve ter ao menos 6 caracteres e conter ao menos 1 caractere especial.", "erro");
    return false;
  }

  if (!regexEmail.test(email)) {
    exibirMensagemDOM("Por favor, insira um e-mail válido.", "erro");
    return false;
  }

  return true;
}

// Validação do formulário do administrador
function validarAdmin() {
  const nome = document.getElementById("nome-admin").value.trim();
  const senha = document.getElementById("senha-admin").value;
  const token = document.getElementById("token").value;

  const senhaSegura = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!nome || !senha || !token) {
    exibirMensagemDOM("Preencha todos os campos do administrador.", "erro");
    return false;
  }

  if (!nomeRegex.test(nome)) {
    exibirMensagemDOM("O nome do administrador deve ter ao menos 6 caracteres e conter ao menos 1 caractere especial.", "erro");
    return false;
  }

  if (!senhaSegura.test(senha)) {
    exibirMensagemDOM(
      "A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.",
      "erro"
    );
    return false;
  }

  if (!/^\d{6}$/.test(token)) {
    exibirMensagemDOM("O token deve conter exatamente 6 dígitos numéricos.", "erro");
    return false;
  }

  return true;
}

// Exibir mensagem na tela
function exibirMensagemDOM(mensagem, tipo = "info") {
  const msgBox = document.getElementById("mensagem");
  msgBox.textContent = mensagem;
  msgBox.className = `mensagem show ${tipo}`;
  setTimeout(() => {
    msgBox.classList.remove("show");
    msgBox.classList.add("hidden");
  }, 4000);
}

// Limpa todos os campos de input do formulário
function limparCampos(formulario) {
  const inputs = formulario.querySelectorAll("input");
  inputs.forEach(input => input.value = "");
}

// Impede copiar, colar e cortar nos campos de input
function bloquearCopiarColar(formulario) {
  const inputs = formulario.querySelectorAll("input");
  inputs.forEach(input => {
    input.addEventListener("copy", e => e.preventDefault());
    input.addEventListener("cut", e => e.preventDefault());
    input.addEventListener("paste", e => e.preventDefault());
  });
}

// Ações ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // Botões de perfil
  document.getElementById('btn-cliente').addEventListener('click', () => mostrarFormulario('cliente'));
  document.getElementById('btn-admin').addEventListener('click', () => mostrarFormulario('admin'));

  // Bloqueio de copiar/colar
  bloquearCopiarColar(document.getElementById('form-cliente'));
  bloquearCopiarColar(document.getElementById('form-admin'));

  // Submissão do formulário do cliente
  document.getElementById('form-cliente').addEventListener('submit', (e) => {
    e.preventDefault();
    if (validarCliente()) {
      exibirMensagemDOM("Login do cliente enviado com sucesso!", "sucesso");
      setTimeout(() => {
        // Substitui a entrada da página de login no histórico
        history.replaceState(null, null, location.href);
        // Redireciona sem empurrar nova entrada
        window.location.replace(rotas.pesquisa);
      }, 1500);
    }
  });

  // Submissão do formulário do administrador
  document.getElementById('form-admin').addEventListener('submit', (e) => {
    e.preventDefault();
    if (validarAdmin()) {
      exibirMensagemDOM("Login do administrador enviado com sucesso!", "sucesso");
      setTimeout(() => {
        history.replaceState(null, null, location.href);
        window.location.replace(rotas.administrador);
      }, 1500);
    }
  });
});

/*
Inicialmente, o formulário de cliente aparece e o de administrador está oculto.

Ao clicar em "Cliente", o formulário de cliente aparece e o de administrador some.

Ao clicar em "Administrador", o formulário de administrador aparece e o de cliente some

Garantia de que a exibição do formulário é mais dinâmica

Ao final da inserção de dados escolhida, há o redirecionamento para o ambiente escolhido pelo usário do site.
*/