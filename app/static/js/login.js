document.getElementById("form-login").addEventListener("submit", async function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = {
        usuarioLogin: form.usuarioLogin.value.trim(),
        senhaLogin: form.senhaLogin.value.trim()
    };

    const mensagemErro = document.getElementById("mensagem-erro");
    const senhaInput = document.getElementById("senhaLogin");

    // Resetar estados
    mensagemErro.classList.add("d-none");
    senhaInput.classList.remove("is-invalid");

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok || data.status === "error") {
            if (data.error_type === "wrong_password") {
                mensagemErro.textContent = "Senha incorreta";
                senhaInput.classList.add("is-invalid");
                senhaInput.focus();
            } else {
                mensagemErro.textContent = data.detail || "Erro ao fazer login";
            }
            mensagemErro.classList.remove("d-none");
            return;
        }

        // Redirecionamento após login bem-sucedido
        if (data.redirect) {
            window.location.href = data.redirect;
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        mensagemErro.textContent = "Erro ao conectar com o servidor";
        mensagemErro.classList.remove("d-none");
    }
});

// Limpa o erro quando o usuário começa a digitar
document.getElementById("senhaLogin").addEventListener("input", function() {
    this.classList.remove("is-invalid");
});
