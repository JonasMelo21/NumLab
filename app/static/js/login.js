document.getElementById("form-login").addEventListener("submit", async function(event) {
    event.preventDefault(); // This prevents the default form submission

    // 1. Coletar dados do formulário - usando os nomes EXATOS do seu modelo Pydantic
    const formData = {
        usuarioLogin: document.getElementById("usuarioLogin").value.trim(), // Must match UserLogin model
        senhaLogin: document.getElementById("senhaLogin").value.trim()     // Must match UserLogin model
    };

    // 2. Elementos de mensagem
    const mensagemSucesso = document.getElementById("mensagem-sucesso");
    const mensagemErro = document.getElementById("mensagem-erro");
    
    // 3. Resetar mensagens
    mensagemSucesso.style.display = "none";
    mensagemErro.style.display = "none";

    try {
        // 4. Enviar requisição como JSON
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', // Important for JSON
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        });

        // 5. Processar resposta - handle redirect if response is redirect
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        const data = await response.json();
        
        if (response.ok) {
            // Se tiver mensagem de sucesso (opcional)
            if (data.message) {
                mensagemSucesso.textContent = data.message;
                mensagemSucesso.style.display = "block";
            }
            // Redirecionar após 1 segundo (opcional)
            setTimeout(() => {
                window.location.href = "/api/home";
            }, 1000);
        } else {
            // Tratar erros da API
            mensagemErro.textContent = data.detail || "Credenciais inválidas";
            mensagemErro.style.display = "block";
        }
        
    } catch (error) {
        console.error("Erro:", error);
        mensagemErro.textContent = "Erro ao conectar com o servidor";
        mensagemErro.style.display = "block";
    }
});