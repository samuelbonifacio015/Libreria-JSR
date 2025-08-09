/**
 * Sistema de Compra - Librería JSR
 * Maneja la finalización de compras y procesamiento de pedidos
 */

(function() {
    'use strict';

    // Configuración del sistema de compra
    const PURCHASE_CONFIG = {
        orderPrefix: 'JSR',
        emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phonePattern: /^[0-9]{9,15}$/,
        whatsappNumber: '51999451887'
    };

    // Estado de la aplicación
    let purchaseData = null;
    let isProcessing = false;
    let currentStep = 1;

    /**
     * Inicializar el sistema de compra
     */
    function initializePurchase() {
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
                total: 0,
                createdAt: new Date().toISOString()
            };

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
        // Botón de volver al catálogo
        const backToCatalogBtn = document.getElementById('backToCatalog');
        if (backToCatalogBtn) {
            backToCatalogBtn.addEventListener('click', handleBackToCatalog);
        }

        // Formulario de compra (Paso 1)
        const purchaseForm = document.getElementById('purchaseForm');
        if (purchaseForm) {
            purchaseForm.addEventListener('submit', handleContinueToPayment);
        }

        // Botón de finalizar pedido (Paso 2)
        const finalizeOrderBtn = document.getElementById('finalizeOrder');
        if (finalizeOrderBtn) {
            finalizeOrderBtn.addEventListener('click', handleFinalizeOrder);
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
        const total = subtotal; // Sin costo de envío

        // Actualizar elementos en el DOM
        updateElement('subtotalAmount', `S/. ${subtotal.toFixed(2)}`);
        updateElement('totalAmount', `S/. ${total.toFixed(2)}`);
        
        // Ocultar o mostrar envío como GRATIS
        const shippingElement = document.getElementById('shippingAmount');
        if (shippingElement) {
            shippingElement.innerHTML = '<span style="color: #27ae60; font-weight: 600;">¡GRATIS!</span>';
        }

        // Actualizar datos de compra
        purchaseData.subtotal = subtotal;
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
     * Manejar volver al catálogo
     */
    function handleBackToCatalog() {
        window.location.href = '/html/catalogo.html';
    }

    /**
     * Manejar continuar al paso de pago
     */
    async function handleContinueToPayment(event) {
        event.preventDefault();
        
        if (isProcessing) return;

        // Validar formulario
        if (!validateForm()) {
            showError('Por favor, completa todos los campos requeridos correctamente.');
            return;
        }

        // Guardar datos del formulario
        const formData = new FormData(document.getElementById('purchaseForm'));
        purchaseData.customer = {
            name: formData.get('customerName'),
            lastName: formData.get('customerLastName'),
            email: formData.get('customerEmail'),
            phone: formData.get('customerPhone'),
            notes: formData.get('deliveryNotes')
        };

        // Ir al paso 2
        goToStep(2);
    }

    /**
     * Manejar finalizar pedido
     */
    async function handleFinalizeOrder() {
        if (isProcessing) return;

        isProcessing = true;
        showProcessingState(true);

        try {
            // Simular procesamiento
            await processOrder();
            
            // Mostrar confirmación
            showConfirmationModal();
            
            // Limpiar carrito
            clearCart();
            
            // Redirigir a WhatsApp después de un breve delay
            setTimeout(() => {
                redirectToWhatsApp();
            }, 2000);
            
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            showError('Hubo un error al procesar tu pedido. Por favor, inténtalo nuevamente.');
        } finally {
            isProcessing = false;
            showProcessingState(false);
        }
    }

    /**
     * Navegar a un paso específico
     */
    function goToStep(step) {
        currentStep = step;
        
        // Ocultar todos los contenidos
        document.getElementById('step1Content').style.display = 'none';
        document.getElementById('step2Content').style.display = 'none';
        
        // Mostrar el contenido del paso actual
        if (step === 1) {
            document.getElementById('step1Content').style.display = 'grid';
        } else if (step === 2) {
            document.getElementById('step2Content').style.display = 'block';
            renderFinalOrderSummary();
        }
        
        // Actualizar indicadores de pasos
        updateStepIndicators(step);
    }

    /**
     * Actualizar indicadores de pasos
     */
    function updateStepIndicators(activeStep) {
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        
        if (activeStep === 1) {
            step1.classList.remove('inactive');
            step1.classList.add('active');
            step2.classList.remove('active');
            step2.classList.add('inactive');
        } else if (activeStep === 2) {
            step1.classList.remove('active');
            step1.classList.add('inactive');
            step2.classList.remove('inactive');
            step2.classList.add('active');
        }
    }

    /**
     * Renderizar resumen final del pedido
     */
    function renderFinalOrderSummary() {
        const container = document.getElementById('finalOrderSummary');
        if (!container || !purchaseData) return;

        let html = `
            <div class="final-summary-item">
                <strong>ID del Pedido:</strong> ${purchaseData.orderId}
            </div>
            <div class="final-summary-item">
                <strong>Cliente:</strong> ${purchaseData.customer.name} ${purchaseData.customer.lastName}
            </div>
            <div class="final-summary-item">
                <strong>Teléfono:</strong> ${purchaseData.customer.phone}
            </div>
        `;

        if (purchaseData.customer.email) {
            html += `<div class="final-summary-item">
                <strong>Email:</strong> ${purchaseData.customer.email}
            </div>`;
        }

        html += `
            <div class="final-summary-item">
                <strong>Total de Productos:</strong> ${purchaseData.items.length}
            </div>
            <div class="final-summary-item">
                <strong>Subtotal:</strong> S/. ${purchaseData.subtotal.toFixed(2)}
            </div>
            <div class="final-summary-item">
                <strong>Envío:</strong> GRATIS
            </div>
            <div class="final-summary-item total">
                <strong>Total Final:</strong> S/. ${purchaseData.total.toFixed(2)}
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Construir mensaje para WhatsApp
     */
    function buildWhatsAppMessage() {
        if (!purchaseData || !purchaseData.customer) return '';

        const now = new Date();
        const currentDate = now.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const currentTime = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });

        let message = `*🛒 NUEVA COMPRA - LIBRERÍA JSR*\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        // Información del pedido
        message += `*📋 DETALLES DEL PEDIDO*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `🆔 *ID del Pedido:* ${purchaseData.orderId}\n`;
        message += `📅 *Fecha de Compra:* ${currentDate} a las ${currentTime}\n`;
        message += `🌐 *Sitio Web:* https://libreria-jsr.vercel.app\n\n`;
        
        // Datos del cliente
        message += `*👤 DATOS DEL CLIENTE*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `• Nombre: ${purchaseData.customer.name} ${purchaseData.customer.lastName}\n`;
        message += `• Teléfono: ${purchaseData.customer.phone}\n`;
        
        if (purchaseData.customer.email && purchaseData.customer.email.trim() !== '') {
            message += `• Email: ${purchaseData.customer.email}\n`;
        }
        
        if (purchaseData.customer.notes && purchaseData.customer.notes.trim() !== '') {
            message += `• Mensaje: ${purchaseData.customer.notes.replace(/\n/g, ' ')}\n`;
        }

        message += `\n*🛍️ PRODUCTOS ADQUIRIDOS*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        purchaseData.items.forEach((item, index) => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            const itemName = item.name || 'Producto sin nombre';
            const itemBrand = item.brand || 'Sin marca';
            message += `${index + 1}. ${itemName} (${itemBrand})\n`;
            message += `   📦 Cantidad: ${item.quantity}\n`;
            message += `   💰 Precio: S/. ${itemTotal}\n\n`;
        });

        message += `*💰 RESUMEN DE COMPRA*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `• Subtotal: S/. ${purchaseData.subtotal.toFixed(2)}\n`;
        message += `• Envío: 🎉 GRATIS\n`;
        message += `• Total Final: S/. ${purchaseData.total.toFixed(2)}\n\n`;
        
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `*📞 Para consultas:* +51 999 451 887\n`;
        message += `*🌐 Visítanos:* https://libreria-jsr.vercel.app\n`;
        message += `*⏰ Enviado:* ${currentDate} a las ${currentTime}\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        return message;
    }

    /**
     * Redirigir a WhatsApp
     */
    function redirectToWhatsApp() {
        const message = buildWhatsAppMessage();
        if (!message) {
            console.error('Error al construir mensaje de WhatsApp');
            return;
        }

        try {
            const whatsappUrl = `https://wa.me/${PURCHASE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        } catch (error) {
            console.error('Error al redirigir a WhatsApp:', error);
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

        const orderData = {
            ...purchaseData,
            processedAt: new Date().toISOString(),
            status: 'confirmed'
        };

        // Guardar pedido (en un caso real, esto se enviaría al servidor)
        localStorage.setItem(`jsr_order_${purchaseData.orderId}`, JSON.stringify(orderData));
        
        return orderData;
    }

    /**
     * Mostrar estado de procesamiento
     */
    function showProcessingState(processing) {
        const finalizeBtn = document.getElementById('finalizeOrder');
        if (finalizeBtn) {
            if (processing) {
                finalizeBtn.classList.add('loading');
                finalizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                finalizeBtn.disabled = true;
            } else {
                finalizeBtn.classList.remove('loading');
                finalizeBtn.innerHTML = '<i class="fas fa-check"></i> Finalizar el Pedido';
                finalizeBtn.disabled = false;
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