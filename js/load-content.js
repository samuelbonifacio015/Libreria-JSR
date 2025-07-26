document.addEventListener('DOMContentLoaded', function() {
    // Cargar navbar
    fetch('/partials/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            
            // Inicializar funcionalidad del navbar después de cargarlo
            setTimeout(() => {
                initializeNavbar();
                
                // Disparar evento personalizado para notificar que el navbar está listo
                const navbarLoadedEvent = new CustomEvent('navbarLoaded');
                document.dispatchEvent(navbarLoadedEvent);
                console.log('Navbar cargado y evento disparado');
            }, 100); // Añadir un pequeño delay para asegurar que el DOM esté listo
        })
        .catch(error => console.error('Error cargando navbar:', error));

    // Cargar header nav
    fetch('/partials/headernav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('headernav-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error cargando header nav:', error));

    // Cargar footer
    fetch('/partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error cargando footer:', error));
});

// Función para inicializar la funcionalidad del navbar
function initializeNavbar() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileOverlay = document.getElementById('mobileOverlay');

    // Abrir menú mobile
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            if (mobileNav && mobileOverlay) {
                mobileNav.classList.add('active');
                mobileOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Cerrar menú mobile
    function closeMobileMenu() {
        if (mobileNav && mobileOverlay) {
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Manejar dropdowns en mobile
    const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
    mobileDropdownBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dropdown = this.closest('.mobile-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        });
    });

    // Cerrar menú al hacer click en un enlace
    const mobileLinks = document.querySelectorAll('.mobile-category-link, .mobile-dropdown-content a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(closeMobileMenu, 100);
        });
    });

    // Manejar dropdown del carrito - MEJORADO
    const cartDropdown = document.getElementById('cartDropdown');
    const cartClose = document.querySelector('.cart-close');
    
    // Seleccionar botones del carrito tanto desktop como móvil
    const desktopCartBtn = document.querySelector('.cart-btn');
    const mobileCartBtn = document.querySelector('.mobile-cart-btn');
    
    // Función para mostrar/ocultar el dropdown
    function toggleCartDropdown(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (cartDropdown) {
            const isVisible = cartDropdown.style.display === 'block';
            cartDropdown.style.display = isVisible ? 'none' : 'block';
        }
    }
    
    // Agregar event listeners a ambos botones
    if (desktopCartBtn && cartDropdown) {
        desktopCartBtn.addEventListener('click', toggleCartDropdown);
    }
    
    if (mobileCartBtn && cartDropdown) {
        mobileCartBtn.addEventListener('click', toggleCartDropdown);
    }

    // Cerrar dropdown con el botón X
    if (cartClose && cartDropdown) {
        cartClose.addEventListener('click', function(e) {
            e.preventDefault();
            cartDropdown.style.display = 'none';
        });
    }

    // Cerrar dropdown del carrito al hacer click fuera
    document.addEventListener('click', function(e) {
        if (cartDropdown && 
            !e.target.closest('.cart-container') && 
            !e.target.closest('.mobile-cart-container') &&
            !e.target.closest('.cart-dropdown')) {
            cartDropdown.style.display = 'none';
        }
    });

    // Manejar resize de ventana para responsive
    window.addEventListener('resize', function() {
        // Cerrar menú mobile si se cambia a desktop
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
        
        // Ocultar dropdown del carrito en resize
        if (cartDropdown) {
            cartDropdown.style.display = 'none';
        }
    });
}
