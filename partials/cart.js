/**
 * JSR Cart System - Manejo completo del carrito de compras
 * Este sistema funciona como un partial global en toda la aplicación
 */

(function() {
    'use strict';

    // Estado global del carrito
    window.JSRCart = {
        items: [],
        isInitialized: false,
        dropdown: null,
        notification: null,
        
        // Configuración
        config: {
            storageKey: 'jsr_cart_items',
            maxItems: 50,
            animationDuration: 300,
            notificationTimeout: 3000
        }
    };

    /**
     * Inicializar el sistema de carrito
     */
    function initializeCart() {
        if (window.JSRCart.isInitialized) return;

        // Obtener elementos del DOM
        window.JSRCart.dropdown = document.getElementById('cartDropdown');
        window.JSRCart.notification = document.getElementById('cartNotification');

        if (!window.JSRCart.dropdown) {
            console.warn('JSR Cart: Dropdown del carrito no encontrado');
            return;
        }

        // Cargar carrito desde localStorage
        loadCartFromStorage();

        // Configurar event listeners
        setupEventListeners();

        // Renderizar carrito inicial
        renderCart();

        // Configurar carrito flotante
        setupFloatingCart();

        // Actualizar carrito flotante inicial
        updateFloatingCart();

        // Marcar como inicializado
        window.JSRCart.isInitialized = true;

        console.log('✅ JSR Cart System inicializado correctamente');
    }

    /**
     * Configurar todos los event listeners
     */
    function setupEventListeners() {
        // Botones del carrito (desktop y mobile)
        const cartButtons = document.querySelectorAll('.cart-btn, .mobile-cart-btn');
        cartButtons.forEach(btn => {
            btn.addEventListener('click', toggleCartDropdown);
        });

        // Botón de cerrar
        const closeBtn = document.getElementById('cartClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideCartDropdown);
        }

        // Click fuera del carrito para cerrar
        document.addEventListener('click', handleOutsideClick);

        // Prevenir cierre al hacer click dentro del dropdown
        if (window.JSRCart.dropdown) {
            window.JSRCart.dropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        // Tecla ESC para cerrar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isCartVisible()) {
                hideCartDropdown();
            }
        });

        // Manejar resize para responsive
        window.addEventListener('resize', handleResize);
    }

    /**
     * Toggle del dropdown del carrito
     */
    function toggleCartDropdown(e) {
        e.preventDefault();
        e.stopPropagation();

        if (isCartVisible()) {
            hideCartDropdown();
        } else {
            showCartDropdown();
        }
    }

    /**
     * Mostrar carrito flotante con funcionalidad completa
     */
    function showCartDropdown() {
        const floatingCart = document.getElementById('floatingCart');
        if (!floatingCart) return;

        // Actualizar el carrito flotante
        updateFloatingCart();
        updateCartCount();
        
        // Activar modo abierto permanente
        window.JSRCart.isFloatingCartOpen = true;
        
        // Hacer visible el carrito flotante con funcionalidad completa
        floatingCart.classList.add('visible');
        floatingCart.style.opacity = '1';
        floatingCart.style.visibility = 'visible';
        
        // Forzar que el preview esté siempre visible con funcionalidad completa
        const preview = floatingCart.querySelector('.floating-cart-preview');
        if (preview) {
            preview.style.maxHeight = '500px';
            preview.style.opacity = '1';
            preview.style.padding = '15px';
            preview.style.display = 'flex';
        }
        
        // Mostrar notificación de que el carrito está activo
        showNotification('Carrito activado - funcionalidad completa visible', 'success');
        
        console.log('🛒 Carrito flotante activado con funcionalidad completa');
    }

    /**
     * Ocultar dropdown del carrito
     */
    function hideCartDropdown() {
        if (!window.JSRCart.dropdown) return;

        window.JSRCart.dropdown.classList.remove('show');
        
        setTimeout(() => {
            if (window.JSRCart.dropdown) {
                window.JSRCart.dropdown.style.display = 'none';
            }
        }, window.JSRCart.config.animationDuration);
    }

    /**
     * Verificar si el carrito está visible
     */
    function isCartVisible() {
        return window.JSRCart.dropdown && 
               window.JSRCart.dropdown.classList.contains('show');
    }

    /**
     * Manejar click fuera del carrito
     */
    function handleOutsideClick(e) {
        if (!isCartVisible()) return;

        if (!e.target.closest('.cart-dropdown') && 
            !e.target.closest('.cart-container') && 
            !e.target.closest('.mobile-cart-container')) {
            hideCartDropdown();
        }
    }

    /**
     * Manejar redimensionamiento de ventana
     */
    function handleResize() {
        if (window.innerWidth > 768 && isCartVisible()) {
            // En desktop, mantener abierto
            return;
        }
        
        // En mobile, ajustar posición si es necesario
        updateCartPosition();
    }

    /**
     * Actualizar posición del carrito para mobile
     */
    function updateCartPosition() {
        if (!window.JSRCart.dropdown) return;
        
        if (window.innerWidth <= 768) {
            window.JSRCart.dropdown.style.right = '-20px';
        } else {
            window.JSRCart.dropdown.style.right = '0';
        }
    }

    /**
     * Añadir producto al carrito
     */
    window.addToCart = function(product) {
        if (!product || !product.name) {
            console.error('JSR Cart: Producto inválido');
            return;
        }

        // Verificar límite de productos
        if (window.JSRCart.items.length >= window.JSRCart.config.maxItems) {
            showNotification('No puedes añadir más productos al carrito', 'warning');
            return;
        }

        // Buscar si el producto ya existe
        const existingItem = window.JSRCart.items.find(item => 
            item.name === product.name && item.brand === product.brand
        );

        if (existingItem) {
            // Incrementar cantidad
            existingItem.quantity += (product.quantity || 1);
        } else {
            // Añadir nuevo producto
            const newItem = {
                id: generateProductId(),
                name: product.name,
                brand: product.brand || 'Sin marca',
                price: parseFloat(product.price) || 0,
                image: product.image || '/img/products/default.jpg',
                quantity: product.quantity || 1,
                addedAt: new Date().toISOString()
            };
            
            window.JSRCart.items.push(newItem);
        }

        // Guardar en localStorage
        saveCartToStorage();

        // Actualizar UI
        renderCart();
        updateCartCount();
        updateFloatingCart();

        // Mostrar carrito
        showCartDropdown();

        // Mostrar notificación
        showNotification(`${product.name} añadido al carrito`);

        // Efecto visual en el botón de añadir
        showAddToCartEffect();

        console.log('✅ Producto añadido al carrito:', product.name);
    };

    /**
     * Remover producto del carrito (estilo antiguo)
     */
    window.removeFromCart = function(productName) {
        if (!window.JSRCart.items) return;
        
        const removedItem = window.JSRCart.items.find(item => item.name === productName);
        window.JSRCart.items = window.JSRCart.items.filter(item => item.name !== productName);
        
        // Guardar cambios
        saveCartToStorage();

        // Actualizar UI
        renderCart();
        updateCartCount();
        updateFloatingCart();

        if (removedItem) {
            showNotification(`${removedItem.name} eliminado del carrito`, 'info');
            console.log('🗑️ Producto eliminado del carrito:', removedItem.name);
        }
    };

    /**
     * Actualizar cantidad de producto (estilo antiguo)
     */
    window.updateCartQuantity = function(productName, change) {
        if (!window.JSRCart.items) return;
        
        const item = window.JSRCart.items.find(item => item.name === productName);
        if (!item) return;

        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
            // Eliminar producto si cantidad es 0 o menor
            window.removeFromCart(productName);
            return;
        }

        if (newQuantity > 99) {
            showNotification('Cantidad máxima alcanzada (99)', 'warning');
            return;
        }

        // Actualizar cantidad
        item.quantity = newQuantity;

        // Guardar cambios
        saveCartToStorage();

        // Actualizar UI
        renderCart();
        updateCartCount();
        updateFloatingCart();
    };

    /**
     * Renderizar el carrito completo (estilo antiguo)
     */
    function renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        if (window.JSRCart.items.length === 0) {
            // Mostrar estado vacío
            cartItemsContainer.innerHTML = '<div class="empty-cart">No hay productos en el carrito</div>';
        } else {
            // Mostrar productos con estructura antigua
            window.JSRCart.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item-entry');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='/img/products/default.jpg'" />
                    <div class="cart-item-details">
                        <div class="brand">${item.brand}</div>
                        <div class="name">${item.name}</div>
                        <div class="price">S/. ${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="decrease" onclick="updateCartQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase" onclick="updateCartQuantity('${item.name}', 1)">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">Quitar</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        // Actualizar totales
        updateCartTotals();
    }

    // Función createCartItemHTML eliminada - ahora usamos estructura antigua

    /**
     * Actualizar totales del carrito (estilo antiguo)
     */
    function updateCartTotals() {
        const total = window.JSRCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = window.JSRCart.items.reduce((sum, item) => sum + item.quantity, 0);

        // Actualizar total en el carrito dropdown
        const cartTotalElement = document.getElementById('cartTotal');
        if (cartTotalElement) {
            cartTotalElement.textContent = total.toFixed(2);
        }

        // Actualizar contador en el navbar (tanto desktop como mobile)
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
            if (itemCount > 0) {
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        });
    }

    /**
     * Actualizar contador del carrito en navbar
     */
    function updateCartCount() {
        const itemCount = window.JSRCart.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
            
            // Añadir efecto visual si hay cambios
            if (itemCount > 0) {
                element.style.display = 'flex';
                element.classList.add('pulse-animation');
                setTimeout(() => element.classList.remove('pulse-animation'), 600);
            } else {
                element.style.display = 'none';
            }
        });
    }

    /**
     * Mostrar notificación
     */
    function showNotification(message, type = 'success') {
        if (!window.JSRCart.notification) return;

        const notificationText = window.JSRCart.notification.querySelector('.notification-text');
        if (notificationText) {
            notificationText.textContent = message;
        }

        // Aplicar clase de tipo
        window.JSRCart.notification.className = `cart-notification ${type}`;
        window.JSRCart.notification.classList.add('show');

        // Ocultar después del timeout
        setTimeout(() => {
            if (window.JSRCart.notification) {
                window.JSRCart.notification.classList.remove('show');
            }
        }, window.JSRCart.config.notificationTimeout);
    }

    /**
     * Efecto visual en botón de añadir
     */
    function showAddToCartEffect() {
        const activeButton = document.querySelector('.add-to-cart:hover, .add-to-cart:focus');
        if (activeButton) {
            const originalText = activeButton.textContent;
            const originalBg = activeButton.style.backgroundColor;
            
            activeButton.textContent = '¡Añadido!';
            activeButton.style.backgroundColor = '#10b981';
            activeButton.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                activeButton.textContent = originalText;
                activeButton.style.backgroundColor = originalBg;
                activeButton.style.transform = '';
            }, 1500);
        }
    }

    /**
     * Guardar carrito en localStorage
     */
    function saveCartToStorage() {
        try {
            localStorage.setItem(window.JSRCart.config.storageKey, JSON.stringify(window.JSRCart.items));
        } catch (error) {
            console.warn('JSR Cart: Error al guardar en localStorage:', error);
        }
    }

    /**
     * Cargar carrito desde localStorage
     */
    function loadCartFromStorage() {
        try {
            const savedItems = localStorage.getItem(window.JSRCart.config.storageKey);
            if (savedItems) {
                window.JSRCart.items = JSON.parse(savedItems);
                console.log('✅ Carrito cargado desde localStorage');
            }
        } catch (error) {
            console.warn('JSR Cart: Error al cargar desde localStorage:', error);
            window.JSRCart.items = [];
        }
    }

    /**
     * Limpiar carrito
     */
    window.clearCart = function() {
        window.JSRCart.items = [];
        saveCartToStorage();
        renderCart();
        updateCartCount();
        updateFloatingCart();
        showNotification('Carrito limpiado', 'info');
    };

    /**
     * Obtener items del carrito
     */
    window.getCartItems = function() {
        return [...window.JSRCart.items];
    };

    /**
     * Obtener total del carrito
     */
    window.getCartTotal = function() {
        return window.JSRCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    /**
     * Configurar carrito flotante
     */
    function setupFloatingCart() {
        const floatingCart = document.getElementById('floatingCart');
        const floatingCartIcon = document.querySelector('.floating-cart-icon');
        
        if (!floatingCart) return;

        // Variable para rastrear si el carrito flotante está abierto manualmente
        window.JSRCart.isFloatingCartOpen = false;

        // Mostrar carrito flotante cuando se hace scroll o se abre manualmente
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const headerHeight = 200;
            
            // Solo manejar scroll si no está abierto manualmente
            if (!window.JSRCart.isFloatingCartOpen) {
                if (scrollPosition > headerHeight && window.JSRCart.items.length > 0) {
                    floatingCart.classList.add('visible');
                } else if (window.JSRCart.items.length === 0) {
                    floatingCart.classList.remove('visible');
                }
            }
        });

        // Click en el ícono del carrito flotante
        if (floatingCartIcon) {
            floatingCartIcon.addEventListener('click', function() {
                // Alternar estado abierto/cerrado
                window.JSRCart.isFloatingCartOpen = !window.JSRCart.isFloatingCartOpen;
                
                const preview = floatingCart.querySelector('.floating-cart-preview');
                if (window.JSRCart.isFloatingCartOpen) {
                    // Abrir carrito flotante
                    if (preview) {
                        preview.style.maxHeight = '500px';
                        preview.style.opacity = '1';
                        preview.style.padding = '15px';
                    }
                    showNotification('Carrito abierto - funcionalidad completa', 'info');
                } else {
                    // Cerrar carrito flotante
                    if (preview) {
                        preview.style.maxHeight = '0';
                        preview.style.opacity = '0';
                        preview.style.padding = '10px';
                    }
                }
            });
        }

        // Configurar botones del carrito flotante
        const viewCartBtn = document.querySelector('.floating-cart-view-cart');
        const checkoutBtn = document.querySelector('.floating-cart-checkout');

        if (viewCartBtn) {
            viewCartBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                showNotification('Navegando al carrito completo...', 'info');
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (window.JSRCart.items.length === 0) {
                    showNotification('Tu carrito está vacío', 'warning');
                    return;
                }
                
                showNotification('Redirigiendo al checkout...', 'info');
                window.proceedToCheckout();
            });
        }

        console.log('✅ Carrito flotante configurado');
    }

    /**
     * Actualizar carrito flotante con funcionalidad completa
     */
    function updateFloatingCart() {
        const floatingCart = document.getElementById('floatingCart');
        const floatingCartCount = document.getElementById('floatingCartCount');
        const floatingCartItems = document.getElementById('floatingCartItems');
        const floatingCartTotal = document.getElementById('floatingCartTotal');
        
        if (!floatingCart || !floatingCartCount || !floatingCartItems || !floatingCartTotal) {
            return;
        }

        const totalItems = window.JSRCart.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = window.JSRCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Actualizar contador
        floatingCartCount.textContent = totalItems;

        // Mostrar/ocultar según tenga items
        if (totalItems > 0) {
            floatingCart.classList.add('visible');
        } else {
            floatingCart.classList.remove('visible');
        }

        // Limpiar items anteriores
        floatingCartItems.innerHTML = '';

        // Agregar información de selección
        const selectionInfo = document.createElement('div');
        selectionInfo.classList.add('floating-cart-selection-info');
        selectionInfo.textContent = `${totalItems} producto${totalItems !== 1 ? 's' : ''} seleccionado${totalItems !== 1 ? 's' : ''}`;
        floatingCartItems.appendChild(selectionInfo);

        if (window.JSRCart.items.length > 0) {
            // Mostrar todos los productos con funcionalidad completa
            window.JSRCart.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('floating-cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='/img/products/default.jpg'">
                    <div class="floating-cart-item-details">
                        <div class="floating-cart-item-name">${item.name}</div>
                        <div class="floating-cart-item-brand">${item.brand}</div>
                        <div class="floating-cart-item-price">S/. ${item.price.toFixed(2)} c/u</div>
                        <div class="floating-cart-item-controls">
                            <button class="qty-btn" onclick="updateCartQuantity('${item.name}', -1)">-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateCartQuantity('${item.name}', 1)">+</button>
                            <button class="remove-btn" onclick="removeFromCart('${item.name}')" title="Eliminar">×</button>
                        </div>
                        <div class="floating-cart-item-subtotal">Subtotal: S/. ${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `;
                floatingCartItems.appendChild(itemElement);
            });
        } else {
            // Carrito vacío
            const emptyElement = document.createElement('div');
            emptyElement.classList.add('floating-cart-item');
            emptyElement.innerHTML = '<div class="floating-cart-item-details">No hay productos en el carrito</div>';
            floatingCartItems.appendChild(emptyElement);
        }

        // Actualizar total
        floatingCartTotal.textContent = totalPrice.toFixed(2);
    }

    // Exponer función para compatibilidad
    window.updateFloatingCart = updateFloatingCart;

    /**
     * Generar ID único para productos
     */
    function generateProductId() {
        return 'cart_item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Funciones para los botones del carrito
     */
    window.viewFullCart = function() {
        hideCartDropdown();
        // Aquí puedes redirigir a una página completa del carrito
        console.log('Redirigiendo a carrito completo...');
        // window.location.href = '/cart.html';
    };

    window.proceedToCheckout = function() {
        if (window.JSRCart.items.length === 0) {
            showNotification('Tu carrito está vacío', 'warning');
            return;
        }

        hideCartDropdown();
        // Aquí puedes redirigir al checkout
        console.log('Procesando checkout...');
        showNotification('Redirigiendo al checkout...', 'info');
        // window.location.href = '/checkout.html';
    };

    /**
     * Inicializar cuando el DOM esté listo
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCart);
    } else {
        initializeCart();
    }

    /**
     * Reinicializar si el navbar se recarga dinámicamente
     */
    document.addEventListener('navbarLoaded', function() {
        setTimeout(initializeCart, 100);
    });

    // Exponer funciones globales
    window.JSRCart.init = initializeCart;
    window.JSRCart.show = showCartDropdown;
    window.JSRCart.hide = hideCartDropdown;
    window.JSRCart.toggle = toggleCartDropdown;

})(); 