document.addEventListener("DOMContentLoaded", function() {
    // Verifica se está em uma página protegida
    const protectedPages = ['vibe.html', 'perfil.html']; // adicione outras páginas protegidas aqui
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        checkSession();
    }

    // Adiciona verificação de sessão aos links do menu
    const menuLinks = document.querySelectorAll('.navmenu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (protectedPages.includes(href)) {
                e.preventDefault();
                checkSession(href);
            }
        });
    });
});

function checkSession(redirectTo = null) {
    fetch('forms/check_session.php', {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.logged_in) {
            window.location.href = 'login.html';
        } else if (redirectTo) {
            window.location.href = redirectTo;
        }
    })
    .catch(error => {
        console.error('Erro ao verificar sessão:', error);
    });
}
