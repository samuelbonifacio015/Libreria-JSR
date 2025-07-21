document.addEventListener('DOMContentLoaded', function() {
    // Mostrar/ocultar contraseñas
    setupPasswordToggles();
    
    // Setup de LoginForm y Validacion
    setupLoginForm();
    
    // Setup de RegisterForm y Validacion
    setupRegisterForm();
    
    // Setup de PasswordStrengthMeter
    setupPasswordStrengthMeter();
});

// Mostrar/ocultar contraseñas
function setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
}

// Setup de LoginForm y Validacion
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember')?.checked || false;
            
            if (!validateEmail(email)) {
                showError('Correo electrónico inválido');
                return;
            }
            
            if (password.length < 6) {
                showError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            showSuccess('Iniciando sesión...');
            
            console.log('Login con:', { email, password, remember });
            
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1500);
        });
    }
}

// Setup de RegisterForm y Validacion
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAccept = document.getElementById('termsAccept')?.checked || false;
            
            if (!firstName || !lastName) {
                showError('Por favor completa tu nombre y apellido');
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Correo electrónico inválido');
                return;
            }
            
            if (!validatePhone(phone)) {
                showError('Número de teléfono inválido');
                return;
            }
            
            if (password.length < 6) {
                showError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Las contraseñas no coinciden');
                return;
            }
            
            if (!termsAccept) {
                showError('Debes aceptar los términos y condiciones');
                return;
            }
            
            showSuccess('¡Creando tu cuenta!');
            
            console.log('Registro con:', { 
                firstName, 
                lastName, 
                email, 
                phone, 
                password 
            });
            
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1500);
        });
    }
}

// Setup de PasswordStrengthMeter
function setupPasswordStrengthMeter() {
    const passwordInput = document.getElementById('password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = getPasswordStrength(password);
            updatePasswordStrengthUI(strength);
        });
    }
}

// Obtener fortaleza de contraseña
function getPasswordStrength(password) {
    if (!password) return 0;
    
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    //Complejidad de password
    if (/[A-Z]/.test(password)) score += 1; 
    if (/[0-9]/.test(password)) score += 1; 
    if (/[^A-Za-z0-9]/.test(password)) score += 1; 
    
    return Math.min(3, score);
}

function updatePasswordStrengthUI(strength) {
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthSegments.length || !strengthText) return;
    
    strengthSegments.forEach(segment => {
        segment.className = 'strength-segment';
    });
    
    if (strength >= 1) {
        strengthSegments[0].classList.add('weak');
        strengthText.textContent = 'Contraseña débil';
    }
    
    if (strength >= 2) {
        strengthSegments[0].classList.add('medium');
        strengthSegments[1].classList.add('medium');
        strengthText.textContent = 'Contraseña media';
    }
    
    if (strength >= 3) {
        strengthSegments[0].classList.add('strong');
        strengthSegments[1].classList.add('strong');
        strengthSegments[2].classList.add('strong');
        strengthText.textContent = 'Contraseña fuerte';
    }
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    return /^\d{9,}$/.test(phone);
}

function showError(message) {
    alert(message); 
}

function showSuccess(message) {
    alert(message);
} 