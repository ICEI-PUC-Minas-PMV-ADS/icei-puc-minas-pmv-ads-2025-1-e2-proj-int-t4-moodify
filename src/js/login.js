document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".php-email-form");
    const emailInput = form.querySelector("input[name='email']");
    const passwordInput = form.querySelector("input[placeholder='Senha']");

    form.addEventListener("submit", function (event) {
        let valid = true;
        
        // Validação do e-mail
        if (!validateEmail(emailInput.value)) {
            alert("Por favor, insira um e-mail válido.");
            valid = false;
        }

        // Validação da senha
        if (passwordInput.value.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            valid = false;
        }

        if (!valid) {
            event.preventDefault(); // Impede o envio do formulário se houver erro
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
