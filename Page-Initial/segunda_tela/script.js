function mostrarFormulario(tipo) {
  const formCliente = document.getElementById("form-cliente");
  const formAdmin = document.getElementById("form-admin");

  if (tipo === "cliente") {
    formCliente.classList.add("show");
    formCliente.classList.remove("hidden");
    formAdmin.classList.remove("show");
    setTimeout(() => formAdmin.classList.add("hidden"), 400);
  }

  else {
    formAdmin.classList.add("show");
    formAdmin.classList.remove("hidden");
    formCliente.classList.remove("show");
    setTimeout(() => formCliente.classList.add("hidden"), 400);
  }
}

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

lucide.createIcons(); // Ativa os ícones

/*
Inicialmente, o formulário de cliente aparece e o de administrador está oculto.

Ao clicar em "Cliente", o formulário de cliente aparece e o de administrador some.

Ao clicar em "Administrador", o formulário de administrador aparece e o de cliente some

Garantia de que a exibição do formulário é mais dinâmica
*/