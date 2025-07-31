document.addEventListener('DOMContentLoaded', function() {
    // Cargar navbar
    fetch('/partials/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            
            // Cargar el carrito después del navbar
            return loadCart();
        })
        .then(() => {
            // Inicializar funcionalidad del navbar después de cargar todo
            setTimeout(() => {
                initializeNavbar();
                
                // Disparar evento personalizado para notificar que el navbar está listo
                const navbarLoadedEvent = new CustomEvent('navbarLoaded');
                document.dispatchEvent(navbarLoadedEvent);
                console.log('Navbar y carrito cargados, evento disparado');
            }, 100); // Añadir un pequeño delay para asegurar que el DOM esté listo
        })
        .catch(error => console.error('Error cargando navbar:', error));

    // Cargar header nav
    fetch('/partials/headernav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('headernav-placeholder').innerHTML = data;
            
            // Disparar evento personalizado para notificar que el headernav está listo
            setTimeout(() => {
                const headernavLoadedEvent = new CustomEvent('headernavLoaded');
                document.dispatchEvent(headernavLoadedEvent);
                console.log('Headernav cargado y evento disparado');
            }, 100);
        })
        .catch(error => console.error('Error cargando header nav:', error));

    // Cargar footer
    fetch('/partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error cargando footer:', error));

    // Cargar modal de vista rápida
    loadModal();
});

// Función para cargar el carrito (HTML, CSS y JS)
function loadCart() {
    return Promise.all([
        // Cargar HTML del carrito
        fetch('/partials/cart.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                // Insertar el carrito dropdown en el cart-container del navbar
                const navbarCartContainer = document.querySelector('.cart-container');
                if (navbarCartContainer) {
                    // Crear div temporal para parsear el HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data;
                    
                    // Insertar cada elemento del carrito
                    while (tempDiv.firstChild) {
                        navbarCartContainer.appendChild(tempDiv.firstChild);
                    }
                    console.log('✅ HTML del carrito dropdown cargado en navbar');
                } else {
                    console.warn('No se encontró .cart-container en el navbar');
                }

                // Crear e insertar el carrito flotante en el body
                const floatingCartHTML = `
                    <!--floating cart start-->
                    <div class="floating-cart" id="floatingCart">
                        <div class="floating-cart-icon">
                            <i class="fa-solid fa-cart-shopping"></i>
                            <span class="floating-cart-count" id="floatingCartCount">0</span>
                        </div>
                        <div class="floating-cart-preview">
                            <div class="floating-cart-preview-title">Carrito de Compras</div>
                            <div class="floating-cart-items" id="floatingCartItems">
                                <!-- items auto adding -->
                            </div>
                            <div class="floating-cart-total">
                                <span>Total:</span>
                                <span>S/. <span id="floatingCartTotal">0.00</span></span>
                            </div>
                            <div class="floating-cart-actions">
                                <button class="floating-cart-view-cart">Ver Carrito</button>
                                <button class="floating-cart-checkout">Comprar</button>
                            </div>
                        </div>
                    </div>
                    <!--floating cart end-->
                `;
                
                // Insertar carrito flotante antes del elemento footer-placeholder
                const footerPlaceholder = document.getElementById('footer-placeholder');
                if (footerPlaceholder) {
                    footerPlaceholder.insertAdjacentHTML('beforebegin', floatingCartHTML);
                    console.log('✅ Carrito flotante insertado en el body');
                } else {
                    // Si no hay footer-placeholder, insertar al final del body
                    document.body.insertAdjacentHTML('beforeend', floatingCartHTML);
                    console.log('✅ Carrito flotante insertado al final del body');
                }
            })
            .catch(error => {
                console.error('Error cargando HTML del carrito:', error);
                throw error;
            }),

        // Cargar CSS del carrito
        loadCSS('/partials/cart.css').catch(error => {
            console.error('Error cargando CSS del carrito:', error);
            throw error;
        }),

        // Cargar JS del carrito
        loadJS('/partials/cart.js').catch(error => {
            console.error('Error cargando JS del carrito:', error);
            throw error;
        })
    ]).then(() => {
        console.log('✅ Todos los componentes del carrito cargados');
        
        // Intentar inicializar el carrito después de cargar todo
        setTimeout(() => {
            if (window.JSRCart && typeof window.JSRCart.init === 'function') {
                window.JSRCart.init();
            } else if (typeof initializeCart === 'function') {
                initializeCart();
            } else {
                console.warn('No se pudo inicializar el carrito automáticamente');
            }
        }, 200);
    });
}

// Función para cargar archivos CSS dinámicamente
function loadCSS(href) {
    return new Promise((resolve, reject) => {
        // Verificar si ya está cargado
        if (document.querySelector(`link[href="${href}"]`)) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => {
            console.log(`✅ CSS cargado: ${href}`);
            resolve();
        };
        link.onerror = () => {
            console.error(`❌ Error cargando CSS: ${href}`);
            reject(new Error(`Error cargando CSS: ${href}`));
        };
        document.head.appendChild(link);
    });
}

// Función para cargar archivos JS dinámicamente
function loadJS(src) {
    return new Promise((resolve, reject) => {
        // Verificar si ya está cargado
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`✅ JS cargado: ${src}`);
            resolve();
        };
        script.onerror = () => {
            console.error(`❌ Error cargando JS: ${src}`);
            reject(new Error(`Error cargando JS: ${src}`));
        };
        document.head.appendChild(script);
    });
}

// Función para cargar el modal de vista rápida
function loadModal() {
    return Promise.all([
        // Cargar HTML del modal
        fetch('/partials/modal.html').then(response => response.text()),
        // Cargar CSS del modal
        fetch('/partials/modal.css').then(response => response.text())
    ]).then(([modalHtml, modalCss]) => {
        // Insertar HTML del modal en el body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);

        // Insertar CSS del modal
        const modalStyle = document.createElement('style');
        modalStyle.textContent = modalCss;
        document.head.appendChild(modalStyle);

        // Cargar y ejecutar JavaScript del modal
        return fetch('/partials/modal.js')
            .then(response => response.text())
            .then(modalJs => {
                const script = document.createElement('script');
                script.textContent = modalJs;
                document.head.appendChild(script);
                
                // Inicializar funcionalidad del modal
                if (window.setupQuickView) {
                    window.setupQuickView();
                }
            });
    }).catch(error => console.error('Error cargando modal:', error));
}

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

    // Manejar resize de ventana para responsive
    window.addEventListener('resize', function() {
        // Cerrar menú mobile si se cambia a desktop
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}
