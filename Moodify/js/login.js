document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".php-email-form");
    if (!form) {
        console.error("Formulário não encontrado");
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const loadingElement = form.querySelector('.loading');
        const errorElement = form.querySelector('.error-message');
        const sentElement = form.querySelector('.sent-message');

        // Limpa mensagens anteriores
        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) errorElement.style.display = 'none';
        if (sentElement) sentElement.style.display = 'none';

        // Mostra loading
        if (loadingElement) loadingElement.style.display = 'block';

        fetch('forms/login.php', {
            method: 'POST',
            body: new FormData(this),
            headers: {
                'Accept': 'application/json'  // Indica que esperamos JSON como resposta
            }
        })
        .then(response => response.text())
        .then(data => {
            if (loadingElement) loadingElement.style.display = 'none';
            
            try {
                const result = JSON.parse(data);
                
                if (result.status === 'success') {
                    // Login bem-sucedido
                    if (sentElement) {
                        sentElement.textContent = 'Login realizado com sucesso!';
                        sentElement.style.display = 'block';
                    }
                    
                    // Redireciona para a página principal
                    window.location.href = 'vibe.html';  // Redirecionamento imediato
                } else {
                    // Mostra erro
                    if (errorElement) {
                        errorElement.textContent = result.message || 'Erro ao fazer login';
                        errorElement.style.display = 'block';
                    }
                }
            } catch (e) {
                console.error('Resposta do servidor:', data);
                if (errorElement) {
                    errorElement.textContent = 'Erro ao processar resposta do servidor';
                    errorElement.style.display = 'block';
                }
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            if (loadingElement) loadingElement.style.display = 'none';
            if (errorElement) {
                errorElement.textContent = 'Erro ao processar login. Tente novamente.';
                errorElement.style.display = 'block';
            }
        });
    });
});
