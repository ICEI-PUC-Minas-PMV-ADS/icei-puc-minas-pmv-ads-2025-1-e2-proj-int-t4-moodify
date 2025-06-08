document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".php-email-form");
    if (!form) {
        console.error("Formulário não encontrado");
        return;
    }

    // Logs movidos para depois da verificação do form
    console.log("Elementos do formulário:", {
        name: form.querySelector("input[name='name']"),
        subject: form.querySelector("input[name='subject']"),
        email: form.querySelector("input[name='email']"),
        password: form.querySelector("input[name='password']"),
        confirm_password: form.querySelector("input[name='confirm_password']")
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const senha = this.querySelector('input[name="password"]').value;
        const confirma_senha = this.querySelector('input[name="confirm_password"]').value;
        
        const loadingElement = form.querySelector('.loading');
        const errorElement = form.querySelector('.error-message');
        const sentElement = form.querySelector('.sent-message');

        // Limpa mensagens anteriores
        loadingElement.style.display = 'none';
        errorElement.style.display = 'none';
        sentElement.style.display = 'none';

        // Verifica se as senhas conferem
        if (senha !== confirma_senha) {
            errorElement.textContent = 'As senhas não conferem';
            errorElement.style.display = 'block';
            return;
        }

        // Mostra loading
        loadingElement.style.display = 'block';

        fetch('forms/signin.php', {
            method: 'POST',
            body: new FormData(this)
        })
        .then(response => response.text())
        .then(data => {
            loadingElement.style.display = 'none';
            
            try {
                const result = JSON.parse(data);
                
                if (result.status === 'success') {
                    // Mostra mensagem de sucesso
                    sentElement.textContent = 'Cadastro realizado com sucesso!';
                    sentElement.style.display = 'block';
                    
                    // Redireciona para login após 2 segundos
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    // Mostra mensagem de erro
                    errorElement.textContent = result.message || 'Erro ao cadastrar usuário';
                    errorElement.style.display = 'block';
                }
            } catch (e) {
                console.error('Resposta do servidor:', data);
                errorElement.textContent = 'Erro ao processar resposta do servidor';
                errorElement.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            loadingElement.style.display = 'none';
            errorElement.textContent = 'Erro ao processar cadastro. Tente novamente.';
            errorElement.style.display = 'block';
        });
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidDate(date) {
        if (!date) return false;
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            return age - 1 >= 13;
        }
        return age >= 13;
    }
});

function showErrorMessage(message) {
    const errorElement = document.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}