document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const form = document.getElementById('cadastro-form');
    const nomeInput = document.getElementById('nomeCompleto');
    const emailInput = document.getElementById('emailCadastro');
    const usuarioInput = document.getElementById('usuarioCadastro');
    const senhaInput = document.getElementById('senhaCadastro');
    const confirmaSenhaInput = document.getElementById('confirmaSenha');
    const mensagemSucesso = document.getElementById('mensagem-sucesso');
    const mensagemErro = document.getElementById('mensagem-erro');
    
    // Toggle para mostrar/ocultar senha
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.closest('.position-relative').querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Alternar ícone entre olho aberto/fechado
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });
    
    // Validação em tempo real da confirmação de senha
    confirmaSenhaInput.addEventListener('input', validarSenhas);
    senhaInput.addEventListener('input', validarSenhas);
    
    function validarSenhas() {
        const senha = senhaInput.value;
        const confirmacao = confirmaSenhaInput.value;
        
        if (senha && confirmacao) {
            if (senha !== confirmacao) {
                mostrarErro("As senhas não coincidem");
                confirmaSenhaInput.setCustomValidity("As senhas não coincidem");
            } else {
                limparMensagens();
                confirmaSenhaInput.setCustomValidity("");
            }
        } else {
            limparMensagens();
        }
    }
    
    // Envio do formulário
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Validar senhas novamente antes do envio
        if (senhaInput.value !== confirmaSenhaInput.value) {
            mostrarErro("As senhas não coincidem");
            return;
        }
        
        // Dados do formulário
        const dados = {
            name: nomeInput.value.trim(),
            email: emailInput.value.trim(),
            username: usuarioInput.value.trim(),
            password: senhaInput.value
        };
        
        try {
            const response = await fetch('/api/adduser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            });
            
            const resultado = await response.json();
            
            if (response.ok) {
                mostrarSucesso("Cadastro realizado com sucesso! Redirecionando...");
                
                // Limpar formulário
                form.reset();
                
                // Redirecionar após 2 segundos
                setTimeout(() => {
                    window.location.href = "/api/login";
                }, 2000);
            } else {
                // Tratar diferentes tipos de erro
                if (resultado.detail === "Email ou nome de usuário já cadastrado") {
                    mostrarErro("Este e-mail ou nome de usuário já está em uso");
                } else if (resultado.detail) {
                    mostrarErro(resultado.detail);
                } else {
                    mostrarErro("Ocorreu um erro durante o cadastro");
                }
            }
        } catch (error) {
            mostrarErro("Erro de conexão. Por favor, tente novamente.");
            console.error('Erro:', error);
        }
    });
    
    // Funções auxiliares
    function mostrarSucesso(mensagem) {
        mensagemSucesso.textContent = mensagem;
        mensagemSucesso.style.display = "block";
        mensagemErro.style.display = "none";
    }
    
    function mostrarErro(mensagem) {
        mensagemErro.textContent = mensagem;
        mensagemErro.style.display = "block";
        mensagemSucesso.style.display = "none";
    }
    
    function limparMensagens() {
        mensagemSucesso.style.display = "none";
        mensagemErro.style.display = "none";
    }
});