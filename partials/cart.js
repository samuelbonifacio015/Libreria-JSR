/**
 * JSR Cart System - Sistema de carrito de compras refactorizado
 * Versión optimizada con mejor estructura y funcionalidad completa
 */

(function() {
    'use strict';

    /**
     * Configuración del sistema de carrito
     */
    const CART_CONFIG = {
        storageKey: 'jsr_cart_items',
        maxItems: 50,
        animationDuration: 300,
        notificationTimeout: 3000,
        floatingCartShowDelay: 1000,
        retryDelay: 500
    };

    /**
     * Estado global del carrito
     */
    window.JSRCart = {
        items: [],
        isInitialized: false,
        isFloatingCartOpen: false,
        elements: {
        dropdown: null,
        notification: null,
            floatingCart: null,
            floatingCartCount: null,
            floatingCartItems: null,
            floatingCartTotal: null
        },
        config: CART_CONFIG
    };

    /**
     * Clase principal del sistema de carrito
     */
    class CartSystem {
        constructor() {
            this.initializeElements();
            this.bindMethods();
        }

        /**
         * Vincular métodos al contexto correcto
         */
        bindMethods() {
            this.handleAddToCart = this.handleAddToCart.bind(this);
            this.handleOutsideClick = this.handleOutsideClick.bind(this);
            this.handleKeydown = this.handleKeydown.bind(this);
            this.handleResize = this.handleResize.bind(this);
            this.handleScroll = this.handleScroll.bind(this);
        }

        /**
         * Inicializar elementos del DOM
         */
        initializeElements() {
            const elements = window.JSRCart.elements;
            
            elements.dropdown = document.getElementById('cartDropdown');
            elements.notification = document.getElementById('cartNotification');
            elements.floatingCart = document.getElementById('floatingCart');
            elements.floatingCartCount = document.getElementById('floatingCartCount');
            elements.floatingCartItems = document.getElementById('floatingCartItems');
            elements.floatingCartTotal = document.getElementById('floatingCartTotal');

            return this.validateElements();
        }

        /**
         * Validar que los elementos necesarios existen
         */
        validateElements() {
            const requiredElements = ['floatingCart'];
            const missingElements = requiredElements.filter(key => 
                !window.JSRCart.elements[key]
            );

            if (missingElements.length > 0) {
                console.warn('JSR Cart: Elementos faltantes:', missingElements);
                return false;
            }

            return true;
        }

        /**
         * Inicializar el sistema completo de carrito
         */
        async initialize() {
            if (window.JSRCart.isInitialized) {
                console.log('JSR Cart: Ya está inicializado');
                return true;
            }

            console.log('🔄 Inicializando JSR Cart System...');

            // Reintentar si faltan elementos
            if (!this.validateElements()) {
                console.warn('JSR Cart: Elementos no encontrados, reintentando...');
                setTimeout(() => this.initialize(), CART_CONFIG.retryDelay);
                return false;
            }

            try {
                // Cargar datos del carrito
                this.loadFromStorage();
                
                // Configurar event listeners
                this.setupEventListeners();

        // Configurar carrito flotante
                this.setupFloatingCart();
                
                // Configurar botones add-to-cart
                this.setupAddToCartButtons();
                
                // Renderizar estado inicial
                this.renderCart();
                this.updateCartCount();
                this.updateFloatingCart();
                
                // Mostrar carrito flotante automáticamente si hay items
                this.autoShowFloatingCart();

        // Marcar como inicializado
        window.JSRCart.isInitialized = true;

        console.log('✅ JSR Cart System inicializado correctamente');
                return true;
                
            } catch (error) {
                console.error('JSR Cart: Error durante la inicialización:', error);
                return false;
            }
        }

        /**
         * Configurar event listeners del sistema
         */
        setupEventListeners() {
        // Botones del carrito (desktop y mobile)
        const cartButtons = document.querySelectorAll('.cart-btn, .mobile-cart-btn');
        cartButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.toggleCartDropdown(e));
        });

            // Botón de cerrar carrito
        const closeBtn = document.getElementById('cartClose');
        if (closeBtn) {
                closeBtn.addEventListener('click', () => this.hideCartDropdown());
            }

            // Event listeners globales
            document.addEventListener('click', this.handleOutsideClick);
            document.addEventListener('click', this.handleFloatingCartOutsideClick.bind(this));
            document.addEventListener('keydown', this.handleKeydown);
            window.addEventListener('resize', this.handleResize);
            window.addEventListener('scroll', this.handleScroll);

        // Prevenir cierre al hacer click dentro del dropdown
            const { dropdown } = window.JSRCart.elements;
            if (dropdown) {
                dropdown.addEventListener('click', (e) => e.stopPropagation());
            }

            console.log('✅ Event listeners configurados');
        }

        /**
         * Configurar botones "Añadir al carrito"
         */
        setupAddToCartButtons() {
            // Usar delegación de eventos para botones dinámicos
            document.addEventListener('click', (e) => {
                if (e.target.matches('.add-to-cart, [data-action="add-to-cart"]')) {
                    e.preventDefault();
                    this.handleAddToCart(e);
                }
            });

            console.log('✅ Botones add-to-cart configurados');
        }

        /**
         * Mostrar automáticamente el carrito flotante
         */
        autoShowFloatingCart() {
            const { floatingCart } = window.JSRCart.elements;
            if (!floatingCart) return;

            // Mostrar inmediatamente si hay items
            if (window.JSRCart.items.length > 0) {
                this.showFloatingCart(true);
                console.log('🛒 Carrito flotante mostrado automáticamente');
            } else {
                // Mostrar después de un delay para que el usuario vea que está disponible
                setTimeout(() => {
                    this.showFloatingCart(false);
                }, CART_CONFIG.floatingCartShowDelay);
            }
        }

        /**
         * Manejar evento de añadir al carrito
         */
        async handleAddToCart(e) {
            const button = e.target;
            
            try {
                const productData = await this.extractProductData(button);
                
                if (productData) {
                    this.addToCart(productData);
                    this.showAddToCartEffect(button);
                } else {
                    console.warn('JSR Cart: No se pudo extraer datos del producto');
                    this.showNotification('Error al añadir producto', 'error');
                }
            } catch (error) {
                console.error('JSR Cart: Error al procesar producto:', error);
                this.showNotification('Error al añadir producto', 'error');
            }
        }

        /**
         * Extraer datos del producto desde el botón o elementos cercanos
         */
        async extractProductData(button) {
            // Buscar el contenedor del producto
            const productContainer = button.closest('.product-card, .modal-content, .product-item');
            if (!productContainer) {
                console.warn('JSR Cart: Contenedor del producto no encontrado');
                return null;
            }

            console.log('JSR Cart: Extrayendo datos del producto desde:', productContainer);

            // Intentar obtener ID del producto
            const productId = this.getProductId(productContainer);
            console.log('JSR Cart: ID del producto encontrado:', productId);
            
            // Si tenemos ID, buscar en products.json
            if (productId) {
                const productData = await this.getProductFromJson(productId, productContainer);
                if (productData) {
                    console.log('JSR Cart: Datos extraídos desde JSON:', productData);
                    return productData;
                }
            }

            // Fallback: extraer datos del DOM
            console.log('JSR Cart: Usando fallback DOM para extraer datos');
            const productData = {
                name: this.getProductName(productContainer),
                brand: this.getProductBrand(productContainer),
                price: this.getProductPrice(productContainer),
                image: this.getProductImage(productContainer),
                quantity: parseInt(this.getProductQuantity(productContainer)) || 1
            };

            console.log('JSR Cart: Datos extraídos del DOM:', productData);

            // Validar datos mínimos requeridos
            if (!productData.name || productData.price === null || productData.price <= 0) {
                console.warn('JSR Cart: Datos del producto incompletos o inválidos', productData);
                return null;
            }

            return productData;
        }

        /**
         * Obtener ID del producto desde el contenedor
         */
        getProductId(container) {
            // Buscar ID en diferentes atributos
            const idSources = [
                container.getAttribute('data-product-id'),
                container.getAttribute('data-id'),
                container.id,
                container.querySelector('[data-product-id]')?.getAttribute('data-product-id'),
                container.querySelector('[data-id]')?.getAttribute('data-id')
            ];

            for (const id of idSources) {
                if (id && id.trim()) return id.trim();
            }

            return null;
        }

        /**
         * Obtener datos del producto desde products.json
         */
        async getProductFromJson(productId, container) {
            try {
                if (!window.productsData) {
                    // Cargar products.json si no está disponible
                    const response = await fetch('/partials/products.json');
                    window.productsData = await response.json();
                }

                // Buscar producto por ID o nombre
                const product = window.productsData.find(p => 
                    p.id === productId || 
                    p.productName.toLowerCase().includes(productId.toLowerCase())
                );

                if (product) {
                    console.log('JSR Cart: Producto encontrado en JSON:', {
                        id: product.id,
                        name: product.productName,
                        priceDiscounted: product.priceDiscounted,
                        priceOriginal: product.priceOriginal
                    });

                    // Extraer precio usando solo priceDiscounted
                    const priceMatch = product.priceDiscounted.match(/(\d+(?:\.\d+)?)/);
                    const priceDiscounted = priceMatch ? parseFloat(priceMatch[0]) : 0;

                    // Extraer precio original si es necesario
                    const originalMatch = product.priceOriginal.match(/(\d+(?:\.\d+)?)/);
                    const priceOriginal = originalMatch ? parseFloat(originalMatch[0]) : 0;

                    console.log('JSR Cart: Precios extraídos:', {
                        priceDiscounted: priceDiscounted,
                        priceOriginal: priceOriginal
                    });

                    return {
                        name: product.productName,
                        brand: product.brand,
                        price: priceDiscounted,
                        originalPrice: priceOriginal,
                        image: product.img,
                        quantity: parseInt(this.getProductQuantity(container)) || 1,
                        category: product.category,
                        discount: product.discount
                    };
                }
            } catch (error) {
                console.warn('JSR Cart: Error al cargar products.json:', error);
            }

            return null;
        }

        /**
         * Métodos auxiliares para extraer datos del producto
         */
        getProductName(container) {
            const selectors = [
                '.product-name',
                '.name', 
                'h3',
                'h4',
                '[data-product-name]'
            ];
            
            for (const selector of selectors) {
                const element = container.querySelector(selector);
                if (element) {
                    return element.textContent.trim() || element.getAttribute('data-product-name');
                }
            }
            return null;
        }

        getProductBrand(container) {
            const selectors = [
                '.brand',
                '.product-brand',
                '[data-product-brand]'
            ];
            
            for (const selector of selectors) {
                const element = container.querySelector(selector);
                if (element) {
                    return element.textContent.trim() || element.getAttribute('data-product-brand');
                }
            }
            return 'Sin marca';
        }

        getProductPrice(container) {
            const selectors = [
                '.price .discounted',
                '.discounted',
                '.priceDiscounted',
                '.price-discounted', 
                '.current-price',
                '.price',
                '.product-price',
                '[data-product-price]'
            ];
            
            for (const selector of selectors) {
                const element = container.querySelector(selector);
                if (element) {
                    const priceText = element.textContent.trim() || element.getAttribute('data-product-price');
                    console.log('JSR Cart: Extrayendo precio del DOM:', {
                        selector: selector,
                        priceText: priceText
                    });
                    
                    // Extraer solo números y punto decimal
                    const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
                    console.log('JSR Cart: Precio extraído del DOM:', price);
                    
                    if (!isNaN(price) && price > 0) return price;
                }
            }
            
            // Si no encontramos precio con descuento, buscar precio original
            const originalSelectors = [
                '.price .original',
                '.original',
                '.priceOriginal',
                '.price-original',
                '.original-price'
            ];
            
            for (const selector of originalSelectors) {
                const element = container.querySelector(selector);
                if (element) {
                    const priceText = element.textContent.trim();
                    console.log('JSR Cart: Extrayendo precio original del DOM:', {
                        selector: selector,
                        priceText: priceText
                    });
                    
                    const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
                    console.log('JSR Cart: Precio original extraído del DOM:', price);
                    
                    if (!isNaN(price) && price > 0) return price;
                }
            }
            
            console.warn('JSR Cart: No se pudo extraer precio del DOM');
            return 0;
        }

        getProductImage(container) {
            const selectors = [
                '.product-image img',
                'img',
                '[data-product-image]'
            ];
            
            for (const selector of selectors) {
                const element = container.querySelector(selector);
                if (element) {
                    return element.src || element.getAttribute('data-product-image');
                }
            }
            return '/img/products/default.jpg';
        }

        getProductQuantity(container) {
            const selectors = [
                '.quantity-input input',
                'input[type="number"]',
                '[data-quantity]'
            ];
            
            for (const selector of selectors) {
                const element = container.querySelector(selector);
                if (element) {
                    return element.value || element.getAttribute('data-quantity');
                }
            }
            return 1;
    }

    /**
     * Toggle del dropdown del carrito
     */
        toggleCartDropdown(e) {
        e.preventDefault();
        e.stopPropagation();

            if (this.isCartVisible()) {
                this.hideCartDropdown();
        } else {
                this.showCartDropdown();
        }
    }

    /**
         * Mostrar dropdown del carrito
         */
        showCartDropdown() {
            const { dropdown } = window.JSRCart.elements;
            if (!dropdown) {
                // Si no hay dropdown, usar carrito flotante
                this.showFloatingCart(true);
            return;
        }

            dropdown.style.display = 'block';
            dropdown.classList.add('show');
            this.updateFloatingCart();
            this.updateCartCount();
        }

        /**
         * Mostrar carrito flotante
         */
        showFloatingCart(withFullFunctionality = false) {
            const { floatingCart } = window.JSRCart.elements;
            if (!floatingCart) return;

            window.JSRCart.isFloatingCartOpen = withFullFunctionality;
            
        floatingCart.classList.add('visible');
        floatingCart.style.opacity = '1';
        floatingCart.style.visibility = 'visible';
        
            if (withFullFunctionality) {
        const preview = floatingCart.querySelector('.floating-cart-preview');
        if (preview) {
            preview.style.maxHeight = '500px';
            preview.style.opacity = '1';
            preview.style.padding = '15px';
            preview.style.display = 'flex';
                }
        }
    }

    /**
     * Ocultar dropdown del carrito
     */
        hideCartDropdown() {
            const { dropdown } = window.JSRCart.elements;
            if (!dropdown) return;

            dropdown.classList.remove('show');
        
        setTimeout(() => {
                dropdown.style.display = 'none';
            }, CART_CONFIG.animationDuration);
    }

    /**
     * Verificar si el carrito está visible
     */
        isCartVisible() {
            const { dropdown } = window.JSRCart.elements;
            return dropdown && dropdown.classList.contains('show');
    }

    /**
     * Manejar click fuera del carrito
     */
        handleOutsideClick(e) {
            if (!this.isCartVisible()) return;

            const clickedOutside = !e.target.closest('.cart-dropdown') && 
            !e.target.closest('.cart-container') && 
                                 !e.target.closest('.mobile-cart-container');
                                 
            if (clickedOutside) {
                this.hideCartDropdown();
            }
        }

        /**
         * Manejar teclas del teclado
         */
        handleKeydown(e) {
            if (e.key === 'Escape' && this.isCartVisible()) {
                this.hideCartDropdown();
        }
    }

    /**
     * Manejar redimensionamiento de ventana
     */
        handleResize() {
            if (window.innerWidth > 768 && this.isCartVisible()) {
                return; // En desktop, mantener abierto
            }
            this.updateCartPosition();
        }

        /**
         * Manejar scroll de página
         */
        handleScroll() {
            const { floatingCart } = window.JSRCart.elements;
            if (!floatingCart || window.JSRCart.isFloatingCartOpen) return;

            const scrollPosition = window.scrollY;
            const threshold = 200;
            
            if (scrollPosition > threshold && window.JSRCart.items.length > 0) {
                floatingCart.classList.add('visible');
            }
        }

        /**
         * Manejar click fuera del carrito flotante
         */
        handleFloatingCartOutsideClick(e) {
            const { floatingCart } = window.JSRCart.elements;
            if (!floatingCart || !window.JSRCart.isFloatingCartOpen) return;

            // Verificar si el click fue fuera del carrito flotante
            if (!e.target.closest('#floatingCart') && !e.target.closest('.floating-cart')) {
                this.minimizeFloatingCart();
            }
        }

        /**
         * Minimizar carrito flotante
         */
        minimizeFloatingCart() {
            window.JSRCart.isFloatingCartOpen = false;
            
            const { floatingCart } = window.JSRCart.elements;
            const preview = floatingCart.querySelector('.floating-cart-preview');
            
            if (preview) {
                preview.style.maxHeight = '0';
                preview.style.opacity = '0';
                preview.style.padding = '10px';
            }
    }

    /**
     * Actualizar posición del carrito para mobile
     */
        updateCartPosition() {
            const { dropdown } = window.JSRCart.elements;
            if (!dropdown) return;
        
        if (window.innerWidth <= 768) {
                dropdown.style.right = '-20px';
        } else {
                dropdown.style.right = '0';
        }
    }

            /**
         * Añadir producto al carrito
         */
        addToCart(product) {
            console.log('🛒 Añadiendo producto:', product);
            console.log('🛒 Debug precio producto:', {
                price: product.price,
                priceType: typeof product.price,
                priceIsNumber: typeof product.price === 'number',
                priceGreaterThanZero: product.price > 0,
                productName: product.name,
                productBrand: product.brand
            });

            if (!this.validateProduct(product)) {
                console.error('JSR Cart: Producto inválido', product);
                this.showNotification('Error: Producto inválido', 'error');
                return false;
            }

        // Verificar límite de productos
            if (window.JSRCart.items.length >= CART_CONFIG.maxItems) {
                this.showNotification('Límite de productos alcanzado', 'warning');
                return false;
        }

        // Buscar si el producto ya existe
        const existingItem = window.JSRCart.items.find(item => 
            item.name === product.name && item.brand === product.brand
        );

        if (existingItem) {
            // Incrementar cantidad
            existingItem.quantity += (product.quantity || 1);
                console.log('📈 Cantidad incrementada:', product.name);
        } else {
            // Añadir nuevo producto
            const newItem = {
                    id: this.generateProductId(),
                name: product.name,
                brand: product.brand || 'Sin marca',
                price: parseFloat(product.price) || 0,
                image: product.image || '/img/products/default.jpg',
                quantity: product.quantity || 1,
                addedAt: new Date().toISOString()
            };
            
            window.JSRCart.items.push(newItem);
                console.log('➕ Producto añadido:', product.name);
            }

            // Actualizar sistema
            this.saveToStorage();
            this.renderCart();
            this.updateCartCount();
            this.updateFloatingCart();
            this.showFloatingCart(true);
            this.showNotification(`${product.name} añadido al carrito`);

            console.log('✅ Producto procesado correctamente');
            return true;
        }

        /**
         * Validar datos del producto
         */
        validateProduct(product) {
            const isValid = product && 
                   product.name && 
                   product.name.trim() !== '' &&
                   typeof product.price === 'number' &&
                   product.price > 0;

            if (!isValid) {
                console.warn('JSR Cart: Producto inválido:', {
                    product: product,
                    hasName: !!(product && product.name && product.name.trim()),
                    priceType: typeof (product && product.price),
                    priceValue: product && product.price,
                    priceValid: !!(product && typeof product.price === 'number' && product.price > 0)
                });
            }

            return isValid;
        }

        /**
         * Remover producto del carrito
         */
        removeFromCart(productName) {
            if (!window.JSRCart.items || !productName) return false;
        
        const removedItem = window.JSRCart.items.find(item => item.name === productName);
            if (!removedItem) return false;

        window.JSRCart.items = window.JSRCart.items.filter(item => item.name !== productName);
        
            this.saveToStorage();
            this.renderCart();
            this.updateCartCount();
            this.updateFloatingCart();

            this.showNotification(`${removedItem.name} eliminado del carrito`, 'info');
            console.log('🗑️ Producto eliminado:', removedItem.name);
            
            return true;
        }

        /**
         * Actualizar cantidad de producto
         */
        updateCartQuantity(productName, change) {
            if (!window.JSRCart.items || !productName) return false;
        
        const item = window.JSRCart.items.find(item => item.name === productName);
            if (!item) return false;

        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
                return this.removeFromCart(productName);
        }

        if (newQuantity > 99) {
                this.showNotification('Cantidad máxima alcanzada (99)', 'warning');
                return false;
        }

        item.quantity = newQuantity;

            this.saveToStorage();
            this.renderCart();
            this.updateCartCount();
            this.updateFloatingCart();
            
            return true;
        }

        /**
         * Renderizar el carrito completo
         */
        renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        if (window.JSRCart.items.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">No hay productos en el carrito</div>';
        } else {
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
                            <button class="decrease" onclick="window.updateCartQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                            <button class="increase" onclick="window.updateCartQuantity('${item.name}', 1)">+</button>
                    </div>
                        <button class="cart-item-remove" onclick="window.removeFromCart('${item.name}')">Quitar</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

            this.updateCartTotals();
    }

    /**
         * Actualizar totales del carrito
     */
        updateCartTotals() {
        const total = window.JSRCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = window.JSRCart.items.reduce((sum, item) => sum + item.quantity, 0);

            // Actualizar total en dropdown
        const cartTotalElement = document.getElementById('cartTotal');
        if (cartTotalElement) {
            cartTotalElement.textContent = total.toFixed(2);
        }

            // Actualizar contadores en navbar
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
                element.style.display = itemCount > 0 ? 'flex' : 'none';
        });
    }

    /**
         * Actualizar contador del carrito con animación
     */
        updateCartCount() {
        const itemCount = window.JSRCart.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
            
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
        showNotification(message, type = 'success') {
            const { notification } = window.JSRCart.elements;
            if (!notification) {
                console.log(`JSR Cart ${type.toUpperCase()}: ${message}`);
                return;
            }

            const notificationText = notification.querySelector('.notification-text');
        if (notificationText) {
            notificationText.textContent = message;
        }

            notification.className = `cart-notification ${type}`;
            notification.classList.add('show');

        setTimeout(() => {
                notification.classList.remove('show');
            }, CART_CONFIG.notificationTimeout);
    }

    /**
     * Efecto visual en botón de añadir
     */
        showAddToCartEffect(button) {
            if (!button) return;

            const originalText = button.textContent;
            const originalBg = button.style.backgroundColor;
            
            button.textContent = '¡Añadido!';
            button.style.backgroundColor = '#10b981';
            button.style.transform = 'scale(1.05)';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = originalBg;
                button.style.transform = '';
                button.disabled = false;
            }, 1500);
    }

    /**
     * Guardar carrito en localStorage
     */
        saveToStorage() {
        try {
                localStorage.setItem(CART_CONFIG.storageKey, JSON.stringify(window.JSRCart.items));
        } catch (error) {
            console.warn('JSR Cart: Error al guardar en localStorage:', error);
        }
    }

    /**
     * Cargar carrito desde localStorage
     */
        loadFromStorage() {
        try {
                const savedItems = localStorage.getItem(CART_CONFIG.storageKey);
            if (savedItems) {
                    window.JSRCart.items = JSON.parse(savedItems) || [];
                console.log('✅ Carrito cargado desde localStorage');
                } else {
                    window.JSRCart.items = [];
            }
        } catch (error) {
            console.warn('JSR Cart: Error al cargar desde localStorage:', error);
            window.JSRCart.items = [];
        }
    }

    /**
         * Generar ID único para productos
         */
        generateProductId() {
            return 'cart_item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        /**
         * Configurar carrito flotante
         */
        setupFloatingCart() {
            const { floatingCart } = window.JSRCart.elements;
            if (!floatingCart) return;

            const floatingCartIcon = floatingCart.querySelector('.floating-cart-icon');
            
            // Click en el ícono del carrito flotante
            if (floatingCartIcon) {
                floatingCartIcon.addEventListener('click', () => {
                    this.toggleFloatingCart();
                });
            }

            // Configurar botones del carrito flotante
            this.setupFloatingCartButtons();

            console.log('✅ Carrito flotante configurado');
        }

        /**
         * Configurar botones del carrito flotante
         */
        setupFloatingCartButtons() {
            const viewCartBtn = document.querySelector('.floating-cart-view-cart');
            const checkoutBtn = document.querySelector('.floating-cart-checkout');

            if (viewCartBtn) {
                viewCartBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.showNotification('Navegando al carrito completo...', 'info');
                });
            }

            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', () => {
                    if (window.JSRCart.items.length === 0) {
                        this.showNotification('Tu carrito está vacío', 'warning');
                        return;
                    }
                    
                    this.showNotification('Redirigiendo al checkout...', 'info');
                    this.proceedToCheckout();
                });
            }

            // Configurar delegación de eventos para botones dinámicos
            document.addEventListener('click', (e) => {
                if (e.target.matches('.floating-cart-purchase, .purchase-btn')) {
                    e.preventDefault();
                    this.proceedToPurchase();
                }
            });
        }

        /**
         * Toggle del carrito flotante
         */
        toggleFloatingCart() {
                window.JSRCart.isFloatingCartOpen = !window.JSRCart.isFloatingCartOpen;
                
            const { floatingCart } = window.JSRCart.elements;
                const preview = floatingCart.querySelector('.floating-cart-preview');
            
                if (window.JSRCart.isFloatingCartOpen) {
                    if (preview) {
                        preview.style.maxHeight = '500px';
                        preview.style.opacity = '1';
                        preview.style.padding = '15px';
                    }
                this.showNotification('Carrito expandido', 'info');
                } else {
                    if (preview) {
                        preview.style.maxHeight = '0';
                        preview.style.opacity = '0';
                        preview.style.padding = '10px';
                    }
                }
        }

        /**
         * Limpiar carrito
         */
        clearCart() {
            window.JSRCart.items = [];
            this.saveToStorage();
            this.renderCart();
            this.updateCartCount();
            this.updateFloatingCart();
            this.showNotification('Carrito vaciado', 'info');
        }

        /**
         * Proceder al checkout
         */
        proceedToCheckout() {
            console.log('Procesando checkout...');
            // Aquí se puede añadir lógica de checkout
        }

        /**
         * Proceder a la página de compra
         */
        proceedToPurchase() {
                if (window.JSRCart.items.length === 0) {
                this.showNotification('Tu carrito está vacío', 'warning');
                    return;
                }
                
            // Guardar datos de compra en localStorage
            const purchaseData = {
                items: [...window.JSRCart.items],
                total: window.JSRCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                timestamp: new Date().toISOString(),
                orderId: this.generateOrderId()
            };

            localStorage.setItem('jsr_purchase_data', JSON.stringify(purchaseData));
            
            this.showNotification('Redirigiendo a finalizar compra...', 'info');
            
            // Redirigir a la página de compra
            setTimeout(() => {
                window.location.href = '/purchase.html';
            }, 1000);
        }

        /**
         * Generar ID de orden único
         */
        generateOrderId() {
            const prefix = 'JSR';
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substr(2, 5);
            return `${prefix}-${timestamp}-${random}`.toUpperCase();
        }

        /**
         * Actualizar carrito flotante con funcionalidad completa
         */
        updateFloatingCart() {
            const { floatingCart, floatingCartCount, floatingCartItems, floatingCartTotal } = window.JSRCart.elements;
            
            if (!floatingCart || !floatingCartCount || !floatingCartItems || !floatingCartTotal) {
                return;
            }

            const totalItems = window.JSRCart.items.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = window.JSRCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Actualizar contador
            floatingCartCount.textContent = totalItems;

            // Mostrar/ocultar según tenga items o esté forzado a mostrar
            if (totalItems > 0 || window.JSRCart.isFloatingCartOpen) {
                floatingCart.classList.add('visible');
            } else {
                floatingCart.classList.remove('visible');
            }

            // Limpiar items anteriores
            floatingCartItems.innerHTML = '';

            // Agregar información de selección y botón de compra
            const headerInfo = document.createElement('div');
            headerInfo.classList.add('floating-cart-header');
            headerInfo.innerHTML = `
                <div class="floating-cart-selection-info">
                    ${totalItems} producto${totalItems !== 1 ? 's' : ''} seleccionado${totalItems !== 1 ? 's' : ''}
                </div>
                ${totalItems > 0 ? '<button class="floating-cart-purchase" onclick="event.stopPropagation()" title="Finalizar compra">🛒 Comprar</button>' : ''}
                ${totalItems > 0 ? '<button class="floating-cart-clear" onclick="event.stopPropagation(); window.clearCart()" title="Vaciar carrito">🗑️ Vaciar carrito</button>' : ''}
            `;
            floatingCartItems.appendChild(headerInfo);

            if (window.JSRCart.items.length > 0) {
                // Mostrar todos los productos con funcionalidad completa
                window.JSRCart.items.forEach(item => {
                    console.log('JSR Cart: Renderizando item en carrito flotante:', {
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        subtotal: item.price * item.quantity
                    });

                    const itemElement = document.createElement('div');
                    itemElement.classList.add('floating-cart-item');
                    itemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='/img/products/default.jpg'">
                        <div class="floating-cart-item-details">
                            <div class="floating-cart-item-name">${item.name}</div>
                            <div class="floating-cart-item-brand">${item.brand}</div>
                            <div class="floating-cart-item-price">S/. ${item.price.toFixed(2)} c/u</div>
                            <div class="floating-cart-item-controls">
                                <button class="qty-btn" onclick="event.stopPropagation(); window.updateCartQuantity('${item.name}', -1)">-</button>
                                <span class="qty-display">${item.quantity}</span>
                                <button class="qty-btn" onclick="event.stopPropagation(); window.updateCartQuantity('${item.name}', 1)">+</button>
                                <button class="remove-btn" onclick="event.stopPropagation(); window.removeFromCart('${item.name}')" title="Eliminar">×</button>
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
            
            console.log('JSR Cart: Total del carrito flotante actualizado:', {
                totalItems: totalItems,
                totalPrice: totalPrice,
                itemsCount: window.JSRCart.items.length
            });
        }
    }

    /**
     * Instancia global del sistema de carrito
     */
    let cartInstance = null;

    /**
     * Inicializar el sistema de carrito
     */
    function initializeCartSystem() {
        if (cartInstance) {
            console.log('JSR Cart: Sistema ya inicializado');
            return cartInstance;
        }

        cartInstance = new CartSystem();
        cartInstance.initialize().then(success => {
            if (success) {
                console.log('✅ JSR Cart System completamente inicializado');
                
                // Marcar como completamente funcional
                window.cartInitialized = true;
                
                // Dispatch custom event
                document.dispatchEvent(new CustomEvent('cartSystemReady', {
                    detail: { cartInstance }
                }));
            }
        });

        return cartInstance;
    }

    /**
     * Funciones de compatibilidad hacia atrás (APIs públicas)
     */
    window.addToCart = function(product) {
        if (!cartInstance) {
            cartInstance = initializeCartSystem();
            setTimeout(() => window.addToCart(product), 100);
            return;
        }
        return cartInstance.addToCart(product);
    };

    window.removeFromCart = function(productName) {
        return cartInstance ? cartInstance.removeFromCart(productName) : false;
    };

    window.updateCartQuantity = function(productName, change) {
        return cartInstance ? cartInstance.updateCartQuantity(productName, change) : false;
    };

    window.clearCart = function() {
        return cartInstance ? cartInstance.clearCart() : false;
    };

    window.getCartItems = function() {
        return [...window.JSRCart.items];
    };

    window.getCartTotal = function() {
        return window.JSRCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    window.updateFloatingCart = function() {
        return cartInstance ? cartInstance.updateFloatingCart() : false;
    };

    window.viewFullCart = function() {
        if (cartInstance) {
            cartInstance.hideCartDropdown();
        }
        console.log('Redirigiendo a carrito completo...');
    };

    window.proceedToCheckout = function() {
        if (cartInstance) {
            return cartInstance.proceedToCheckout();
        }
    };

    window.proceedToPurchase = function() {
        if (cartInstance) {
            return cartInstance.proceedToPurchase();
        }
    };

    window.debugCart = function() {
        console.log('🔍 Debug del carrito refactorizado:');
        console.log('- CartInstance:', !!cartInstance);
        console.log('- JSRCart inicializado:', window.JSRCart.isInitialized);
        console.log('- Items en carrito:', window.JSRCart.items.length);
        console.log('- Elementos encontrados:', Object.keys(window.JSRCart.elements).filter(key => window.JSRCart.elements[key]));
        
        if (window.JSRCart.items.length > 0) {
            console.log('- Productos en carrito:');
            window.JSRCart.items.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.name} - S/. ${item.price} x ${item.quantity} = S/. ${(item.price * item.quantity).toFixed(2)}`);
            });
            
            const total = window.JSRCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            console.log(`- Total calculado: S/. ${total.toFixed(2)}`);
        }
        
        return {
            cartInstance: !!cartInstance,
            initialized: window.JSRCart.isInitialized,
            itemsCount: window.JSRCart.items.length,
            elementsFound: Object.keys(window.JSRCart.elements).filter(key => window.JSRCart.elements[key]),
            total: window.JSRCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
    };

    /**
     * Inicialización automática del sistema
     */
    function autoInitialize() {
    if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCartSystem);
    } else {
            initializeCartSystem();
        }
    }

    /**
     * Reinicializar cuando el navbar se carga dinámicamente
     */
    document.addEventListener('navbarLoaded', function() {
        console.log('🔄 Navbar cargado, reinicializando carrito...');
        setTimeout(initializeCartSystem, 100);
    });

    // Exponer APIs principales
    window.JSRCart.init = initializeCartSystem;
    window.JSRCart.getInstance = () => cartInstance;

    // Inicializar automáticamente
    autoInitialize();

})(); 