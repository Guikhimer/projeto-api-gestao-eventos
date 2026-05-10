const API_URL = '/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const goToRegister = document.getElementById('go-to-register');
    const goToLogin = document.getElementById('go-to-login');
    
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    // Se já estiver logado, redireciona
    if (localStorage.getItem('token')) {
        window.location.href = 'dashboard.html';
    }

    // Toggle Forms
    goToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginError.innerText = '';
    });

    goToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        registerError.innerText = '';
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;
        
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });
            const data = await res.json();

            if (data.sucesso) {
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                loginError.innerText = data.erro || 'Erro ao fazer login';
            }
        } catch (error) {
            loginError.innerText = 'Erro de conexão com o servidor';
        }
    });

    // Handle Register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('register-nome').value;
        const email = document.getElementById('register-email').value;
        const senha = document.getElementById('register-senha').value;
        
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });
            const data = await res.json();

            if (data.sucesso) {
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                registerError.innerText = data.erro || 'Erro ao registrar';
            }
        } catch (error) {
            registerError.innerText = 'Erro de conexão com o servidor';
        }
    });
});
