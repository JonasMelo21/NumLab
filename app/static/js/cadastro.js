// app/static/js/cadastro.js
document.getElementById('cadastro-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById("nomeCompleto").value;
    const email = document.getElementById("emailCadastro").value;
    const username = document.getElementById("usuarioCadastro").value;
    const password = document.getElementById("senhaCadastro").value;
    const confirmaSenha = document.getElementById("confirmaSenha").value;

    const mensagemSucesso = document.getElementById("mensagem-sucesso");
    const mensagemErro = document.getElementById("mensagem-erro");

    mensagemSucesso.style.display = "none";
    mensagemErro.style.display = "none";

    if (password !== confirmaSenha) {
        mensagemErro.textContent = "Senhas não coincidem";
        mensagemErro.style.display = "block";
        return;
    }

    const data = {
        name: name,
        email: email,
        username: username,
        password: password
    };

    try {
        const response = await fetch('/api/adduser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            mensagemSucesso.textContent = "Usuário cadastrado com sucesso";
            mensagemSucesso.style.display = "block";
            mensagemErro.style.display = "none";

            setTimeout(() => {
                window.location.href = "/api/login";
            }, 2000);
        } else {
            const error = await response.json();
            mensagemErro.textContent = error.detail === "Email ou nome de usuário já cadastrado" 
                ? "Usuário já existe" 
                : `Erro: ${error.detail}`;
            mensagemErro.style.display = "block";
            mensagemSucesso.style.display = "none";
        }
    } catch (error) {
        mensagemErro.textContent = `Erro ao conectar: ${error}`;
        mensagemErro.style.display = "block";
        mensagemSucesso.style.display = "none";
    }
});

// Validação em tempo real das senhas
document.getElementById('confirmaSenha').addEventListener('input', function() {
    const password = document.getElementById("senhaCadastro").value;
    const confirmaSenha = this.value;
    const mensagemSucesso = document.getElementById("mensagem-sucesso");
    const mensagemErro = document.getElementById("mensagem-erro");

    mensagemSucesso.style.display = "none";
    mensagemErro.style.display = "none";

    if (password || confirmaSenha) {
        if (password !== confirmaSenha) {
            mensagemErro.textContent = "Senhas não coincidem";
            mensagemErro.style.display = "block";
        }
    }
});