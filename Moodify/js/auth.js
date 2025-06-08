// Função para verificar se o usuário está logado
function checkAuth() {
    fetch('forms/check_auth.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                // Se não estiver logado e não estiver na página de login ou cadastro
                if (!window.location.pathname.includes('login.html') && 
                    !window.location.pathname.includes('cadastro.html')) {
                    window.location.href = 'login.html';
                }
            }
        })
        .catch(error => {
            console.error('Erro ao verificar autenticação:', error);
        });
}

// Verifica autenticação quando a página carrega
document.addEventListener('DOMContentLoaded', checkAuth); 