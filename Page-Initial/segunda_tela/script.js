function mostrarFormulario(tipo) {
    let formCliente = document.getElementById("form-cliente");
    let formAdmin = document.getElementById("form-admin");

    if (tipo === "cliente") {
        formCliente.classList.add("show");
        formCliente.classList.remove("hidden");
        formAdmin.classList.remove("show");
        setTimeout(() => formAdmin.classList.add("hidden"), 500); // Tempo da animação
    } else if (tipo === "admin") {
        formAdmin.classList.add("show");
        formAdmin.classList.remove("hidden");
        formCliente.classList.remove("show");
        setTimeout(() => formCliente.classList.add("hidden"), 500);
    }
}
/*
Inicialmente, o formulário de cliente aparece e o de administrador está oculto.

Ao clicar em "Cliente", o formulário de cliente aparece e o de administrador some.

Ao clicar em "Administrador", o formulário de administrador aparece e o de cliente some

Garantia de que a exibição do formulário é mais dinâmica
*/