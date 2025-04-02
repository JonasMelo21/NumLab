document.getElementById("form-login").addEventListener("submit", async function(event) {
    event.preventDefault();

    const usuarioInput = document.getElementById("usuarioLogin");
    const senhaInput = document.getElementById("senhaLogin");
    const usuario = usuarioInput.value.trim();
    const senha = senhaInput.value.trim();

    const mensagemSucesso = document.getElementById("mensagem-sucesso");
    const mensagemErro = document.getElementById("mensagem-erro");

    mensagemSucesso.style.display = "none";
    mensagemErro.style.display = "none";

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: usuario, password: senha }),
            credentials: 'include'
        });

        if (response.ok) {
            mensagemSucesso.textContent = "Login realizado com sucesso!";
            mensagemSucesso.style.display = "block";

            // Redireciona para a página protegida após login
            setTimeout(() => {
                window.location.href = "/api/home";
            }, 1000);
        } else {
            const error = await response.json();
            mensagemErro.textContent = error.detail || "Credenciais inválidas";
            mensagemErro.style.display = "block";
        }
    } catch (error) {
        mensagemErro.textContent = "Erro ao conectar com o servidor";
        mensagemErro.style.display = "block";
        console.error("Erro:", error);
    }
});