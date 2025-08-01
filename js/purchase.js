/**
 * Sistema de Compra - Librería JSR
 * Maneja la finalización de compras y procesamiento de pedidos
 */

(function() {
    'use strict';

    // Configuración del sistema de compra
    const PURCHASE_CONFIG = {
        shippingCost: 10.00,
        freeShippingMinimum: 100.00,
        orderPrefix: 'JSR',
        emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phonePattern: /^[0-9]{9,15}$/
    };

    // Estado de la aplicación
    let purchaseData = null;
    let isProcessing = false;

    /**
     * Inicializar el sistema de compra
     */
    function initializePurchase() {
        console.log('🛒 Inicializando sistema de compra...');
        
        // Verificar si hay productos en el carrito
        if (!hasCartItems()) {
            showError('No hay productos en el carrito. Redirigiendo al inicio...');
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
            return;
        }
        
        // Cargar datos de compra
        loadPurchaseData();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Renderizar información
        renderOrderSummary();
        
        console.log('✅ Sistema de compra inicializado');
    }

    /**
     * Verificar si hay productos en el carrito
     */
    function hasCartItems() {
        try {
            const cartItems = localStorage.getItem('jsr_cart_items');
            if (!cartItems) return false;
            
            const items = JSON.parse(cartItems);
            return items && items.length > 0;
        } catch (error) {
            console.error('Error al verificar carrito:', error);
            return false;
        }
    }

    /**
     * Cargar datos de compra desde localStorage
     */
    function loadPurchaseData() {
        try {
            const cartItems = localStorage.getItem('jsr_cart_items');
            if (!cartItems) {
                showError('No se encontraron productos en el carrito. Redirigiendo...');
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 2000);
                return;
            }

            const items = JSON.parse(cartItems);
            if (!items || items.length === 0) {
                showError('El carrito está vacío. Redirigiendo...');
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 2000);
                return;
            }

            // Crear datos de compra
            purchaseData = {
                orderId: generateOrderId(),
                items: items,
                subtotal: 0,
                shipping: 0,
                total: 0,
                createdAt: new Date().toISOString()
            };

            console.log('✅ Datos de compra cargados:', purchaseData);
        } catch (error) {
            console.error('Error al cargar datos de compra:', error);
            showError('Error al cargar los datos. Redirigiendo...');
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        }
    }

    /**
     * Generar ID de pedido único
     */
    function generateOrderId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `${PURCHASE_CONFIG.orderPrefix}-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
    }

    /**
     * Configurar event listeners
     */
    function setupEventListeners() {
        // Formulario de compra
        const purchaseForm = document.getElementById('purchaseForm');
        if (purchaseForm) {
            purchaseForm.addEventListener('submit', handleConfirmPurchase);
        }

        // Botón del modal para ir al inicio
        const goToHomeBtn = document.getElementById('goToHome');
        if (goToHomeBtn) {
            goToHomeBtn.addEventListener('click', handleGoToHome);
        }

        // Botón de cerrar modal
        const modalCloseBtn = document.getElementById('modalClose');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeConfirmationModal);
        }

        // Validación en tiempo real del formulario
        setupFormValidation();
    }

    /**
     * Configurar validación del formulario
     */
    function setupFormValidation() {
        const form = document.getElementById('purchaseForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }

    /**
     * Renderizar resumen del pedido
     */
    function renderOrderSummary() {
        if (!purchaseData) return;

        // Mostrar ID del pedido
        const orderIdDisplay = document.getElementById('orderIdDisplay');
        if (orderIdDisplay) {
            orderIdDisplay.textContent = `Pedido: ${purchaseData.orderId}`;
        }

        // Renderizar items
        renderOrderItems();
        
        // Calcular y mostrar totales
        calculateAndDisplayTotals();
    }

    /**
     * Renderizar items del pedido
     */
    function renderOrderItems() {
        const container = document.getElementById('orderItems');
        if (!container || !purchaseData.items) return;

        container.innerHTML = '';

        purchaseData.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('order-item');
            
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='/img/products/default.jpg'">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-brand">${item.brand || 'Sin marca'}</div>
                    <div class="item-quantity">Cantidad: ${item.quantity}</div>
                </div>
                <div class="item-price">S/. ${(item.price * item.quantity).toFixed(2)}</div>
            `;
            
            container.appendChild(itemElement);
        });
    }

    /**
     * Calcular y mostrar totales
     */
    function calculateAndDisplayTotals() {
        if (!purchaseData) return;

        const subtotal = purchaseData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= PURCHASE_CONFIG.freeShippingMinimum ? 0 : PURCHASE_CONFIG.shippingCost;
        const total = subtotal + shipping;

        // Actualizar elementos en el DOM
        updateElement('subtotalAmount', `S/. ${subtotal.toFixed(2)}`);
        updateElement('totalAmount', `S/. ${total.toFixed(2)}`);
        
        const shippingElement = document.getElementById('shippingAmount');
        if (shippingElement) {
            if (shipping === 0) {
                shippingElement.innerHTML = '<span style="color: #27ae60; font-weight: 600;">¡GRATIS!</span>';
            } else {
                shippingElement.textContent = `S/. ${shipping.toFixed(2)}`;
            }
        }

        // Actualizar datos de compra
        purchaseData.subtotal = subtotal;
        purchaseData.shipping = shipping;
        purchaseData.total = total;
    }

    /**
     * Actualizar elemento del DOM
     */
    function updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    /**
     * Manejar confirmación de compra
     */
    async function handleConfirmPurchase(event) {
        event.preventDefault();
        
        if (isProcessing) return;

        // Validar formulario
        if (!validateForm()) {
            showError('Por favor, completa todos los campos requeridos correctamente.');
            return;
        }

        isProcessing = true;
        showProcessingState(true);

        try {
            // Simular procesamiento
            await processOrder();
            
            // Mostrar confirmación
            showConfirmationModal();
            
            // Limpiar carrito
            clearCart();
            
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            showError('Hubo un error al procesar tu pedido. Por favor, inténtalo nuevamente.');
        } finally {
            isProcessing = false;
            showProcessingState(false);
        }
    }

    /**
     * Validar formulario completo
     */
    function validateForm() {
        const form = document.getElementById('purchaseForm');
        if (!form) return false;

        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validar campo individual
     */
    function validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Limpiar errores previos
        clearFieldError(event);

        // Validar campo requerido
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'Este campo es requerido';
            isValid = false;
        }
        // Validar email
        else if (field.type === 'email' && value && !PURCHASE_CONFIG.emailPattern.test(value)) {
            errorMessage = 'Ingresa un email válido';
            isValid = false;
        }
        // Validar teléfono
        else if (field.type === 'tel' && value && !PURCHASE_CONFIG.phonePattern.test(value.replace(/\D/g, ''))) {
            errorMessage = 'Ingresa un teléfono válido (9-15 dígitos)';
            isValid = false;
        }

        // Mostrar error si es inválido
        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    /**
     * Mostrar error en campo
     */
    function showFieldError(field, message) {
        field.style.borderColor = '#e74c3c';
        
        // Crear mensaje de error si no existe
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.classList.add('field-error');
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '14px';
            errorElement.style.marginTop = '5px';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    /**
     * Limpiar error de campo
     */
    function clearFieldError(event) {
        const field = event.target;
        field.style.borderColor = '#ecf0f1';
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Procesar pedido (simulación)
     */
    async function processOrder() {
        // Simular tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Recopilar datos del formulario
        const formData = new FormData(document.getElementById('purchaseForm'));
        const orderData = {
            ...purchaseData,
            customer: {
                name: formData.get('customerName'),
                lastName: formData.get('customerLastName'),
                email: formData.get('customerEmail'),
                phone: formData.get('customerPhone'),
                notes: formData.get('deliveryNotes')
            },
            processedAt: new Date().toISOString(),
            status: 'confirmed'
        };

        // Guardar pedido (en un caso real, esto se enviaría al servidor)
        localStorage.setItem(`jsr_order_${purchaseData.orderId}`, JSON.stringify(orderData));
        
        console.log('✅ Pedido procesado:', orderData);
        return orderData;
    }

    /**
     * Mostrar estado de procesamiento
     */
    function showProcessingState(processing) {
        const confirmBtn = document.getElementById('confirmPurchase');
        if (confirmBtn) {
            if (processing) {
                confirmBtn.classList.add('loading');
                confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                confirmBtn.disabled = true;
            } else {
                confirmBtn.classList.remove('loading');
                confirmBtn.innerHTML = '<i class="fas fa-check"></i> Confirmar Pedido';
                confirmBtn.disabled = false;
            }
        }
    }

    /**
     * Mostrar modal de confirmación
     */
    function showConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        const finalOrderId = document.getElementById('finalOrderId');
        
        if (modal && finalOrderId) {
            finalOrderId.textContent = purchaseData.orderId;
            modal.classList.add('show');
        }
    }

    /**
     * Cerrar modal de confirmación
     */
    function closeConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    /**
     * Limpiar carrito después de la compra
     */
    function clearCart() {
        localStorage.removeItem('jsr_cart_items');
    }

    /**
     * Manejar ir al inicio
     */
    function handleGoToHome() {
        window.location.href = '/index.html';
    }

    /**
     * Mostrar error
     */
    function showError(message) {
        alert(message); // En una implementación real, usarías un sistema de notificaciones más elegante
    }

    /**
     * Inicializar cuando el DOM esté listo
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePurchase);
    } else {
        initializePurchase();
    }

})();