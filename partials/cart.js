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
     * Mostrar dropdown del carrito
     */
    function showCartDropdown() {
        if (!window.JSRCart.dropdown) return;

        // Asegurar que el dropdown esté renderizado
        renderCart();
        
        window.JSRCart.dropdown.style.display = 'block';
        
        // Forzar reflow para la animación
        window.JSRCart.dropdown.offsetHeight;
        
        window.JSRCart.dropdown.classList.add('show');
        
        // Actualizar contador y carrito flotante
        updateCartCount();
        updateFloatingCart();
        
        console.log('🛒 Carrito mostrado');
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
     * Remover producto del carrito
     */
    window.removeFromCart = function(element) {
        const cartItem = element.closest('.cart-item');
        if (!cartItem) return;

        const productId = cartItem.getAttribute('data-product-id');
        const productIndex = window.JSRCart.items.findIndex(item => item.id === productId);

        if (productIndex > -1) {
            const removedItem = window.JSRCart.items[productIndex];
            window.JSRCart.items.splice(productIndex, 1);

            // Guardar cambios
            saveCartToStorage();

            // Actualizar UI
            renderCart();
            updateCartCount();
            updateFloatingCart();

            showNotification(`${removedItem.name} eliminado del carrito`, 'info');
            
            console.log('🗑️ Producto eliminado del carrito:', removedItem.name);
        }
    };

    /**
     * Actualizar cantidad de producto
     */
    window.updateCartQuantity = function(element, change) {
        const cartItem = element.closest('.cart-item');
        if (!cartItem) return;

        const productId = cartItem.getAttribute('data-product-id');
        const item = window.JSRCart.items.find(item => item.id === productId);

        if (!item) return;

        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
            // Eliminar producto si cantidad es 0 o menor
            window.removeFromCart(element);
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
     * Renderizar el carrito completo
     */
    function renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');
        const cartEmpty = document.getElementById('cartEmpty');

        if (!cartItemsContainer) return;

        if (window.JSRCart.items.length === 0) {
            // Mostrar estado vacío
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (cartFooter) cartFooter.style.display = 'none';
            cartItemsContainer.innerHTML = cartEmpty ? '' : '<div class="cart-empty"><i class="fas fa-shopping-cart cart-empty-icon"></i><p>Tu carrito está vacío</p><small>¡Agrega algunos productos y empezemos a comprar!</small></div>';
        } else {
            // Mostrar productos
            if (cartEmpty) cartEmpty.style.display = 'none';
            if (cartFooter) cartFooter.style.display = 'block';

            const itemsHTML = window.JSRCart.items.map(item => createCartItemHTML(item)).join('');
            cartItemsContainer.innerHTML = itemsHTML;

            // Actualizar totales
            updateCartTotals();
        }
    }

    /**
     * Crear HTML para un item del carrito
     */
    function createCartItemHTML(item) {
        const subtotal = (item.price * item.quantity).toFixed(2);
        
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='/img/products/default.jpg'">
                </div>
                
                <div class="cart-item-details">
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-brand">${item.brand}</p>
                        <div class="cart-item-price">
                            <span class="price-label">Precio:</span>
                            <span class="price-value">S/. <span class="price-amount">${item.price.toFixed(2)}</span></span>
                        </div>
                    </div>
                    
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease" onclick="updateCartQuantity(this, -1)" title="Disminuir cantidad">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn increase" onclick="updateCartQuantity(this, 1)" title="Aumentar cantidad">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        
                        <button class="remove-item-btn" onclick="removeFromCart(this)" title="Eliminar producto">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="cart-item-subtotal">
                    <span class="subtotal-label">Subtotal:</span>
                    <span class="subtotal-amount">S/. <span class="subtotal-value">${subtotal}</span></span>
                </div>
            </div>
        `;
    }

    /**
     * Actualizar totales del carrito
     */
    function updateCartTotals() {
        const total = window.JSRCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = window.JSRCart.items.reduce((sum, item) => sum + item.quantity, 0);

        // Actualizar total
        const cartTotalElement = document.getElementById('cartTotal');
        if (cartTotalElement) {
            cartTotalElement.textContent = total.toFixed(2);
        }

        // Actualizar contador de productos
        const cartItemsCountElement = document.getElementById('cartItemsCount');
        if (cartItemsCountElement) {
            cartItemsCountElement.textContent = itemCount;
        }
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

        // Mostrar carrito flotante cuando se hace scroll
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const headerHeight = 200;
            
            if (scrollPosition > headerHeight && window.JSRCart.items.length > 0) {
                floatingCart.classList.add('visible');
            } else {
                floatingCart.classList.remove('visible');
            }
        });

        // Click en el ícono del carrito flotante
        if (floatingCartIcon) {
            floatingCartIcon.addEventListener('click', function() {
                showCartDropdown();
                // Scroll hacia arriba suavemente
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Configurar botones del carrito flotante
        const viewCartBtn = document.querySelector('.floating-cart-view-cart');
        const checkoutBtn = document.querySelector('.floating-cart-checkout');

        if (viewCartBtn) {
            viewCartBtn.addEventListener('click', function() {
                showCartDropdown();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
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
     * Actualizar carrito flotante
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
        if (totalItems > 0 && window.scrollY > 200) {
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
            // Mostrar hasta 3 productos
            const itemsToShow = window.JSRCart.items.slice(0, 3);
            
            itemsToShow.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('floating-cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='/img/products/default.jpg'">
                    <div class="floating-cart-item-details">
                        <div class="floating-cart-item-name">${item.name}</div>
                        <div class="floating-cart-item-price">S/. ${(item.price * item.quantity).toFixed(2)} (x${item.quantity})</div>
                    </div>
                `;
                floatingCartItems.appendChild(itemElement);
            });

            // Si hay más de 3 productos, mostrar indicador
            if (window.JSRCart.items.length > 3) {
                const moreItemsElement = document.createElement('div');
                moreItemsElement.classList.add('floating-cart-item');
                moreItemsElement.innerHTML = `
                    <div class="floating-cart-item-details">
                        <div class="floating-cart-item-name">+ ${window.JSRCart.items.length - 3} productos más...</div>
                    </div>
                `;
                floatingCartItems.appendChild(moreItemsElement);
            }
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