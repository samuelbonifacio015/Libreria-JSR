// Funciones globales para el modal de vista rápida
window.setupQuickView = function() {
    setupQuickViewEventListeners();
    setupModalClose();
    setupQuantityControls();
};

function setupQuickViewEventListeners() {
    // Event delegation para botones de vista rápida
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-view')) {
            e.preventDefault();
            e.stopPropagation();
            handleQuickView(e);
        }
    });
}

function setupModalClose() {
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            const quickViewModal = document.getElementById('quickViewModal');
            if (quickViewModal) {
                quickViewModal.style.display = 'none';
            }
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    const modalOverlay = document.getElementById('quickViewModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });
    }
}

function setupQuantityControls() {
    window.changeQuantity = function(delta) {
        const quantityInput = document.getElementById('modalQuantity');
        if (quantityInput) {
            let currentValue = parseInt(quantityInput.value) || 1;
            let newValue = currentValue + delta;
            if (newValue < 1) newValue = 1;
            quantityInput.value = newValue;
        }
    };
}

function handleQuickView(e) {
    const productCard = e.target.closest('.product-card');
    if (productCard) {
        const imgSrc = productCard.querySelector('img').src;
        const productName = productCard.querySelector('.product-name').textContent;
        const brand = productCard.querySelector('.brand').textContent;
        const discount = productCard.querySelector('.discount').textContent;
        const originalPrice = productCard.querySelector('.price .original').textContent;
        const discountedPrice = productCard.querySelector('.price .discounted').textContent;
        const availability = productCard.querySelector('.availability').textContent;
        const isAvailable = availability.toLowerCase().includes('disponible');
        const availabilityClass = isAvailable ? '' : 'out-of-stock';
        
        const modalMainImage = document.getElementById('modalMainImage');
        const modalProductTitle = document.getElementById('modalProductTitle');
        const modalBrand = document.getElementById('modalBrand');
        const modalDiscount = document.getElementById('modalDiscount');
        const modalOriginalPrice = document.getElementById('modalOriginalPrice');
        const modalDiscountedPrice = document.getElementById('modalDiscountedPrice');
        const modalQuantity = document.getElementById('modalQuantity');
        const modalThumbnails = document.getElementById('modalThumbnails');
        const quickViewModal = document.getElementById('quickViewModal');
        
        const modalActions = document.querySelector('.modal-right .actions');
        if (modalActions) {
            const existingAvailability = document.querySelector('.modal-right .product-availability');
            if (existingAvailability) {
                existingAvailability.remove();
            }
            
            const availabilityElement = document.createElement('div');
            availabilityElement.className = `product-availability ${availabilityClass}`;
            availabilityElement.textContent = availability;
            
            modalActions.parentNode.insertBefore(availabilityElement, modalActions);
            
            const addToCartBtn = modalActions.querySelector('.add-to-cart');
            const buyNowBtn = modalActions.querySelector('.buy-now');
            
            if (addToCartBtn && buyNowBtn) {
                if (!isAvailable) {
                    addToCartBtn.disabled = true;
                    addToCartBtn.classList.add('disabled');
                    buyNowBtn.disabled = true;
                    buyNowBtn.classList.add('disabled');
                } else {
                    addToCartBtn.disabled = false;
                    addToCartBtn.classList.remove('disabled');
                    buyNowBtn.disabled = false;
                    buyNowBtn.classList.remove('disabled');
                }
            }
        }
        
        if (modalMainImage) modalMainImage.src = imgSrc;
        if (modalProductTitle) modalProductTitle.textContent = productName;
        if (modalBrand) modalBrand.textContent = brand;
        if (modalDiscount) modalDiscount.textContent = discount;
        if (modalOriginalPrice) modalOriginalPrice.textContent = originalPrice;
        if (modalDiscountedPrice) modalDiscountedPrice.textContent = discountedPrice;
        if (modalQuantity) modalQuantity.value = 1;
        
        if (modalThumbnails) {
            modalThumbnails.innerHTML = '';
            for (let i = 0; i < 4; i++) {
                const thumbnail = document.createElement('img');
                thumbnail.src = imgSrc;
                thumbnail.alt = 'Miniatura';
                modalThumbnails.appendChild(thumbnail);
            }
        }

        if (quickViewModal) {
            quickViewModal.style.display = 'flex';
        }
    }
} 