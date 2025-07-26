document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay parámetros de búsqueda en la URL o términos guardados
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    const savedSearchTerm = sessionStorage.getItem('searchTerm');
    
    // Si hay términos de búsqueda, no cargar todos los productos (lo manejará search.js)
    if (!searchTerm && !savedSearchTerm) {
        fetch('../partials/products.json')
            .then(response => response.json())
            .then(data => {
                const productsContainer = document.querySelector('.products-grid');  
                if (productsContainer) {
                    
                    data.forEach(product => {
                        // Determinar si el producto está disponible
                        const isAvailable = product.availability.toLowerCase().includes('disponible');
                        const availabilityClass = isAvailable ? '' : 'out-of-stock';
                        
                        const productCard = `
                        <div class="product-card">
                            <span class="discount">${product.discount}</span>
                            <img src="${product.img}" alt="${product.alt}" />
                            <div class="brand">${product.brand}</div>
                            <div class="product-name">${product.productName}</div>
                            <div class="reviews">
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <i class="fa-solid fa-star"></i>
                              <span>${product.reviews}</span>
                            </div>
                            <p class="price">
                              <span class="original">${product.priceOriginal}</span>  
                              <span class="discounted">${product.priceDiscounted}</span>
                            </p>
                            <p class="availability ${availabilityClass}">${product.availability}</p>
                            <button class="add-to-cart">Añadir al carrito</button>
                            <button class="quick-view">Vista rápida</button>  
                        </div>  
                        `;
                        productsContainer.innerHTML += productCard;  
                    });
                    
                    setupEventListeners();
                }
            })
            .catch(error => console.error('Error', error));
    } else {
        // Si hay búsqueda, solo configurar los event listeners después de que search.js cargue los resultados
        setTimeout(() => {
            setupEventListeners();
        }, 200);
    }
    
    // Inicializar componentes que no dependen del navbar
    window.setupQuickView();
    window.setupBackToTop();
    window.setupFilters();
    window.setupFloatingCart();
    window.setupPagination();
    
    document.addEventListener('navbarLoaded', function() {
        window.initializeCart();
    });
    
    setTimeout(function() {
        window.initializeCart();
    }, 1000);
    
    function setupEventListeners() {
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.addEventListener('click', function(e) {
                if (e.target.classList.contains('add-to-cart')) {
                    handleAddToCart(e);
                }
                
                if (e.target.classList.contains('quick-view')) {
                    handleQuickView(e);
                }
            });
        }
        
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                document.getElementById('quickViewModal').style.display = 'none';
            });
        }
        
        const modalAddToCartBtn = document.querySelector('.modal-right .add-to-cart');
        if (modalAddToCartBtn) {
            modalAddToCartBtn.addEventListener('click', function() {
                const modalProductTitle = document.getElementById('modalProductTitle');
                const modalBrand = document.getElementById('modalBrand');
                const modalDiscountedPrice = document.getElementById('modalDiscountedPrice');
                const modalMainImage = document.getElementById('modalMainImage');
                const modalQuantity = document.getElementById('modalQuantity');
                const quickViewModal = document.getElementById('quickViewModal');
                
                if (!modalProductTitle || !modalBrand || !modalDiscountedPrice || !modalMainImage) return;
                
                const product = {
                    name: modalProductTitle.textContent,
                    brand: modalBrand.textContent,
                    price: parseFloat(modalDiscountedPrice.textContent.replace('S/. ', '')),
                    image: modalMainImage.src,
                    quantity: parseInt(modalQuantity ? modalQuantity.value : 1) || 1
                };
                
                if (window.addToCart) {
                    window.addToCart(product);
                }
                
                if (quickViewModal) {
                    quickViewModal.style.display = 'none';
                }
            });
        }
        
        window.addEventListener('click', function(e) {
            const modal = document.getElementById('quickViewModal');
            if (modal && e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    window.handleAddToCart = handleAddToCart;
    window.handleQuickView = handleQuickView;
});

// Funciones globales

window.initializeCart = function() {
    if (window.cartInitialized) return;
    
    window.cart = window.cart || [];
    
    const cartDropdown = document.getElementById('cartDropdown');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');
    const cartIcon = document.querySelector('.cart-icon');
    const cartClose = document.querySelector('.cart-close');
    
    if (!cartIcon || !cartDropdown) {
        console.log('Elementos del carrito aún no disponibles');
        return;
    }
    
    console.log('Inicializando carrito');
    window.cartInitialized = true;
    
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
    });
    
    if (cartClose) {
        cartClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            cartDropdown.style.display = 'none';
        });
    }
    
    document.addEventListener('click', function(e) {
        if (cartDropdown && cartIcon && 
            !cartDropdown.contains(e.target) && 
            !cartIcon.contains(e.target)) {
            cartDropdown.style.display = 'none';
        }
    });
    
    // Funcion global para carrito (add product)
    window.addToCart = function(product) {
        if (!window.cart) window.cart = [];
        
        console.log('Añadiendo al carrito:', product);
        
        const existingItem = window.cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            product.quantity = product.quantity || 1;
            window.cart.push(product);
        }
        updateCart();
        
        if (cartDropdown) {
            cartDropdown.style.display = 'block';
        }
        
        window.updateFloatingCart();
    };
    
    window.removeFromCart = function(productName) {
        if (!window.cart) return;
        window.cart = window.cart.filter(item => item.name !== productName);
        updateCart();
        
        window.updateFloatingCart();
    };
    
    window.updateQuantity = function(productName, change) {
        if (!window.cart) return;
        
        const item = window.cart.find(item => item.name === productName);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                window.removeFromCart(productName);
            } else {
                updateCart();
                
                window.updateFloatingCart();
            }
        }
    };
    
    function updateCart() {
        if (!cartItemsContainer || !cartCount || !cartTotal) return;
        
        cartItemsContainer.innerHTML = '';
        
        if (window.cart && window.cart.length > 0) {
            window.cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item-entry');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" />
                    <div class="cart-item-details">
                        <div class="brand">${item.brand}</div>
                        <div class="name">${item.name}</div>
                        <div class="price">S/. ${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase">+</button>
                    </div>
                    <button class="cart-item-remove">Quitar</button>
                `;

                const increaseBtn = itemElement.querySelector('.increase');
                if (increaseBtn) {
                    increaseBtn.addEventListener('click', function() {
                        window.updateQuantity(item.name, 1);
                    });
                }

                const decreaseBtn = itemElement.querySelector('.decrease');
                if (decreaseBtn) {
                    decreaseBtn.addEventListener('click', function() {
                        window.updateQuantity(item.name, -1);
                    });
                }

                const removeBtn = itemElement.querySelector('.cart-item-remove');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        window.removeFromCart(item.name);
                    });
                }

                cartItemsContainer.appendChild(itemElement);
            });
            
            const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            const totalPrice = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = totalPrice.toFixed(2);
        } else {
            cartCount.textContent = '0';
            cartTotal.textContent = '0.00';
            cartItemsContainer.innerHTML = '<div class="empty-cart">No hay productos en el carrito</div>';
        }
    }

    window.updateCart = updateCart;
    updateCart();
};

window.setupFloatingCart = function() {
    const floatingCart = document.getElementById('floatingCart');
    const floatingCartItems = document.getElementById('floatingCartItems');
    const floatingCartCount = document.getElementById('floatingCartCount');
    const floatingCartTotal = document.getElementById('floatingCartTotal');
    const floatingCartIcon = document.querySelector('.floating-cart-icon');
    const viewCartBtn = document.querySelector('.floating-cart-view-cart');
    const checkoutBtn = document.querySelector('.floating-cart-checkout');
    
    if (!floatingCart || !floatingCartItems || !floatingCartCount || !floatingCartTotal) {
        console.log('Elementos del carrito flotante aún no disponibles');
        return;
    }
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const headerHeight = 200; 
        
        if (scrollPosition > headerHeight) {
            floatingCart.classList.add('visible');
        } else {
            floatingCart.classList.remove('visible');
        }
    });
    
    window.updateFloatingCart = function() {
        if (!window.cart || !floatingCartItems || !floatingCartCount || !floatingCartTotal) return;
        
        const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
        floatingCartCount.textContent = totalItems;
        
        floatingCartItems.innerHTML = '';
        
        const selectionInfo = document.createElement('div');
        selectionInfo.classList.add('floating-cart-selection-info');
        selectionInfo.textContent = `${totalItems} producto${totalItems !== 1 ? 's' : ''} seleccionado${totalItems !== 1 ? 's' : ''}`;
        floatingCartItems.appendChild(selectionInfo);
        
        if (window.cart.length > 0) {
            const itemsToShow = window.cart.slice(0, 3);
            
            itemsToShow.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('floating-cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" />
                    <div class="floating-cart-item-details">
                        <div class="floating-cart-item-name">${item.name}</div>
                        <div class="floating-cart-item-price">S/. ${(item.price * item.quantity).toFixed(2)} (x${item.quantity})</div>
                    </div>
                `;
                floatingCartItems.appendChild(itemElement);
            });
            
            if (window.cart.length > 3) {
                const moreItemsElement = document.createElement('div');
                moreItemsElement.classList.add('floating-cart-item');
                moreItemsElement.innerHTML = `
                    <div class="floating-cart-item-details">
                        <div class="floating-cart-item-name">+ ${window.cart.length - 3} productos más...</div>
                    </div>
                `;
                floatingCartItems.appendChild(moreItemsElement);
            }
            
            const totalPrice = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            floatingCartTotal.textContent = totalPrice.toFixed(2);
        } else {
            const emptyElement = document.createElement('div');
            emptyElement.classList.add('floating-cart-item');
            emptyElement.innerHTML = '<div class="floating-cart-item-details">No hay productos en el carrito</div>';
            floatingCartItems.appendChild(emptyElement);
            floatingCartTotal.textContent = '0.00';
        }
    };
    
    if (floatingCartIcon) {
        floatingCartIcon.addEventListener('click', function() {
            const cartDropdown = document.getElementById('cartDropdown');
            if (cartDropdown) {
                cartDropdown.style.display = 'block';
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function() {
            const cartDropdown = document.getElementById('cartDropdown');
            if (cartDropdown) {
                cartDropdown.style.display = 'block';
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            console.log('Redireccionar a checkout');
            alert('¡Gracias por tu compra!');
        });
    }
    
    if (window.cart && window.cart.length > 0) {
        window.updateFloatingCart();
    }
};

window.setupQuickView = function() {
    const modal = document.getElementById('quickViewModal');
    const modalClose = document.getElementById('modalClose');
    
    if (modal) {
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    window.changeQuantity = function(change) {
        const modalQuantity = document.getElementById('modalQuantity');
        if (modalQuantity) {
            let currentQuantity = parseInt(modalQuantity.value) || 1;
            currentQuantity += change;
            if (currentQuantity < 1) currentQuantity = 1;
            modalQuantity.value = currentQuantity;
        }
    };
};

window.setupBackToTop = function() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' 
            });
        });
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) { 
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }
};

window.setupFilters = function() {
    const filterHeaders = document.querySelectorAll('.sidebar h2');
    filterHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon) icon.classList.toggle('rotated');
            
            const ul = this.nextElementSibling;
            if (ul && ul.tagName === 'UL') {
                ul.classList.toggle('collapsed');
            }
        });
    });
    
    const filtersTitle = document.querySelector('.sidebar h3');
    const filtersList = document.querySelector('.sidebar ul');
    if (filtersTitle && filtersList) {
        filtersTitle.addEventListener('click', () => {
            filtersList.classList.toggle('collapsed');
            const icon = filtersTitle.querySelector('i');
            if (icon) icon.classList.toggle('rotated');
        });
    }
};

window.setupPagination = function() {
    const paginationItems = document.querySelectorAll('.pagination-item');
    const paginationNext = document.querySelector('.pagination-next');
    
    if (paginationItems.length) {
        paginationItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                paginationItems.forEach(i => i.classList.remove('active'));
                
                this.classList.add('active');
                
                console.log(`Cargar página ${this.textContent}`);
                
                document.querySelector('.products').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
    
    if (paginationNext) {
        paginationNext.addEventListener('click', function(e) {
            e.preventDefault();
            
            const activePage = document.querySelector('.pagination-item.active');
            if (!activePage) return;
            
            const nextPage = parseInt(activePage.textContent) + 1;
            
            const nextElement = Array.from(paginationItems).find(item => 
                parseInt(item.textContent) === nextPage
            );
            
            if (nextElement) {
                paginationItems.forEach(i => i.classList.remove('active'));
                
                nextElement.classList.add('active');
                
                console.log(`Cargar página ${nextPage}`);
                
                document.querySelector('.products').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
};

function handleAddToCart(e) {
    const productCard = e.target.closest('.product-card');
    if (productCard) {
        try {
            const name = productCard.querySelector('.product-name').textContent;
            const brand = productCard.querySelector('.brand').textContent;
            const priceText = productCard.querySelector('.discounted').textContent.replace('S/. ', '');
            const price = parseFloat(priceText);
            const image = productCard.querySelector('img').src;
            
            if (!name || !brand || isNaN(price) || !image) {
                console.error('Datos de producto inválidos:', { name, brand, price, image });
                return;
            }
            
            const product = {
                name: name,
                brand: brand,
                price: price,
                image: image,
                quantity: 1
            };
            
            console.log('Producto a añadir:', product);
            
            if (window.addToCart) {
                window.addToCart(product);
            } else {
                console.error('La función addToCart no está disponible');
                
                if (!window.cartInitialized) {
                    console.log('Intentando inicializar el carrito');
                    window.initializeCart();
                    
                    if (window.addToCart) {
                        window.addToCart(product);
                    }
                }
            }
        } catch (error) {
            console.error('Error al añadir producto al carrito:', error);
        }
    }
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
        
        // Se añade info de disponibilidad al modal
        const modalActions = document.querySelector('.modal-right .actions');
        if (modalActions) {
            // Eliminar el mensaje de disponibilidad anterior si existe
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
        
        // Se añade info de disponibilidad al modal
        if (modalMainImage) modalMainImage.src = imgSrc;
        if (modalProductTitle) modalProductTitle.textContent = productName;
        if (modalBrand) modalBrand.textContent = brand;
        if (modalDiscount) modalDiscount.textContent = discount;
        if (modalOriginalPrice) modalOriginalPrice.textContent = originalPrice;
        if (modalDiscountedPrice) modalDiscountedPrice.textContent = discountedPrice;
        if (modalQuantity) modalQuantity.value = 1;
        
        // Se añade miniaturas al modal
        if (modalThumbnails) {
            modalThumbnails.innerHTML = '';
            for (let i = 0; i < 4; i++) {
                const thumbnail = document.createElement('img');
                thumbnail.src = imgSrc;
                thumbnail.alt = 'Miniatura';
                modalThumbnails.appendChild(thumbnail);
            }
        }

        // Se muestra el modal
        if (quickViewModal) {
            quickViewModal.style.display = 'flex';
        }
    }
}