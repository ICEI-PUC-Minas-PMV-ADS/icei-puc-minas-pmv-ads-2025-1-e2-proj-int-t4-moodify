document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".php-email-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const name = form.querySelector("input[name='name']").value.trim();
        const birthDate = form.querySelector("input[name='subject']").value;
        const email = form.querySelector("input[name='email']").value.trim();
        const password = form.querySelectorAll("input[name='email']")[1].value;
        const confirmPassword = form.querySelectorAll("input[name='email']")[2].value;

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