document.addEventListener("DOMContentLoaded", function () {
    console.log("name", form.querySelector("input[name='name']"));
    console.log("subject", form.querySelector("input[name='subject']"));
    console.log("email", form.querySelector("input[name='email']"));
    console.log("password", form.querySelector("input[name='password']"));
    console.log("confirm_password", form.querySelector("input[name='confirm_password']"));
    const form = document.querySelector(".php-email-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const nameInput = form.querySelector("input[name='name']");
        const birthDateInput = form.querySelector("input[name='subject']");
        const emailInput = form.querySelector("input[name='email']");
        const passwordInput = form.querySelector("input[name='password']");
        const confirmPasswordInput = form.querySelector("input[name='confirm_password']");

        if (!nameInput || !birthDateInput || !emailInput || !passwordInput || !confirmPasswordInput) {
            alert("Um ou mais campos do formulário não foram encontrados. Verifique os names dos inputs!");
            return;
        }

        const name = nameInput.value.trim();
        const birthDate = birthDateInput.value;
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (name === "") {
            alert("Por favor, preencha seu nome.");
            return;
        }

        if (!isValidDate(birthDate)) {
            alert("Por favor, insira uma data de nascimento válida e tenha pelo menos 13 anos.");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Por favor, insira um e-mail válido.");
            return;
        }

        if (password.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }

        alert("Cadastro realizado com sucesso!");
        form.submit();
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