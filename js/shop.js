// Variables globales para el filtrado
let allProducts = [];
let filteredProducts = [];
let filterTimeout = null;
let currentView = 'grid';
let currentSort = 'popular';

// Función para cargar y mostrar productos con efectos de transición
function loadProducts(products = null) {
    const productsContainer = document.querySelector('.products-grid');
    if (!productsContainer) return;
    
    const productsToShow = products || allProducts;
    
    // Mostrar indicador de carga
    showLoadingState();
    
    // Efecto de fade out para productos existentes
    const existingCards = productsContainer.querySelectorAll('.product-card');
    if (existingCards.length > 0) {
        existingCards.forEach(card => {
            card.classList.add('fade-out');
        });
        
        // Esperar a que termine la transición de fade out
        setTimeout(() => {
            productsContainer.innerHTML = '';
            renderProducts(productsToShow, productsContainer);
            hideLoadingState();
        }, 300);
    } else {
        // Si no hay productos existentes, renderizar directamente
        renderProducts(productsToShow, productsContainer);
        hideLoadingState();
    }
    
    updateProductsCount(productsToShow.length);
    setupEventListeners();
    
    // Aplicar estilos de vista después de cargar productos
    setTimeout(() => {
        applyViewStyles(currentView);
        // Limpiar transiciones después de un tiempo
        setTimeout(() => {
            const productsGrid = document.querySelector('.products-grid');
            const productCards = productsGrid?.querySelectorAll('.product-card');
            if (productsGrid) productsGrid.style.removeProperty('transition');
            if (productCards) {
                productCards.forEach(card => {
                    card.style.removeProperty('transition');
                });
            }
        }, 350);
    }, 100);
}

// Función para mostrar estado de carga
function showLoadingState() {
    const productsContainer = document.querySelector('.products-grid');
    if (productsContainer) {
        productsContainer.style.opacity = '0.6';
        productsContainer.style.pointerEvents = 'none';
    }
}

// Función para ocultar estado de carga
function hideLoadingState() {
    const productsContainer = document.querySelector('.products-grid');
    if (productsContainer) {
        productsContainer.style.opacity = '1';
        productsContainer.style.pointerEvents = 'auto';
    }
}

// Función para renderizar productos con efecto de fade in
function renderProducts(products, container) {
    products.forEach((product, index) => {
        const isAvailable = product.availability.toLowerCase().includes('disponible');
        const availabilityClass = isAvailable ? '' : 'out-of-stock';
        
        let productCard;
        
        if (currentView === 'list') {
            productCard = `
            <div class="product-card fade-out">
                <span class="discount">${product.discount}</span>
                <img src="${product.img}" alt="${product.alt}" />
                <div class="product-info">
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
                </div>
                <div class="product-actions">
                    <button class="add-to-cart">Añadir al carrito</button>
                    <button class="quick-view">Vista rápida</button>
                </div>
            </div>  
            `;
        } else {
            productCard = `
            <div class="product-card fade-out">
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
        }
        
        container.innerHTML += productCard;
    });
    
    // Aplicar efecto de fade in con delay escalonado
    const newCards = container.querySelectorAll('.product-card');
    newCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.remove('fade-out');
            card.classList.add('fade-in');
        }, index * 50); // Delay escalonado de 50ms entre cada producto
    });
}

// Función para actualizar el contador de productos
function updateProductsCount(count) {
    const productsCount = document.querySelector('.products-count');
    if (productsCount) {
        productsCount.textContent = `Mostrando 1 - ${count} de ${count} productos`;
    }
}

// Función para aplicar filtros con debounce
function applyFiltersWithDebounce() {
    if (filterTimeout) {
        clearTimeout(filterTimeout);
    }
    
    filterTimeout = setTimeout(() => {
        applyFilters();
    }, 400); // Debounce de 400ms
}

// Función para aplicar filtros
function applyFilters() {
    const selectedBrands = getSelectedBrands();
    const priceRange = getPriceRange();
    
    filteredProducts = allProducts.filter(product => {
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const priceMatch = isPriceInRange(product.priceDiscounted, priceRange.min, priceRange.max);
        
        return brandMatch && priceMatch;
    });
    
    // Aplicar ordenamiento después del filtrado
    sortProducts();
    loadProducts(filteredProducts);
}

// Función para obtener las marcas seleccionadas
function getSelectedBrands() {
    const brandCheckboxes = document.querySelectorAll('input[data-filter="brand"]:checked');
    return Array.from(brandCheckboxes).map(checkbox => checkbox.value);
}

// Función para obtener el rango de precios
function getPriceRange() {
    const minPriceInput = document.querySelector('.min-price');
    const maxPriceInput = document.querySelector('.max-price');
    
    return {
        min: minPriceInput ? parseFloat(minPriceInput.value) || 0 : 0,
        max: maxPriceInput ? parseFloat(maxPriceInput.value) || 169 : 169
    };
}

// Función para verificar si el precio está en el rango
function isPriceInRange(priceString, min, max) {
    const price = parseFloat(priceString.replace('S/. ', ''));
    return price >= min && price <= max;
}

// Función para ordenar productos
function sortProducts() {
    if (!filteredProducts.length) return;
    
    switch (currentSort) {
        case 'popular':
            // Ordenar por popularidad (simulado con reviews)
            filteredProducts.sort((a, b) => {
                const reviewsA = parseInt(a.reviews) || 0;
                const reviewsB = parseInt(b.reviews) || 0;
                return reviewsB - reviewsA;
            });
            break;
            
        case 'price-asc':
            // Ordenar por precio de menor a mayor
            filteredProducts.sort((a, b) => {
                const priceA = parseFloat(a.priceDiscounted.replace('S/. ', ''));
                const priceB = parseFloat(b.priceDiscounted.replace('S/. ', ''));
                return priceA - priceB;
            });
            break;
            
        case 'price-desc':
            // Ordenar por precio de mayor a menor
            filteredProducts.sort((a, b) => {
                const priceA = parseFloat(a.priceDiscounted.replace('S/. ', ''));
                const priceB = parseFloat(b.priceDiscounted.replace('S/. ', ''));
                return priceB - priceA;
            });
            break;
            
        case 'name-asc':
            // Ordenar por nombre A-Z
            filteredProducts.sort((a, b) => {
                return a.productName.localeCompare(b.productName, 'es');
            });
            break;
            
        case 'name-desc':
            // Ordenar por nombre Z-A
            filteredProducts.sort((a, b) => {
                return b.productName.localeCompare(a.productName, 'es');
            });
            break;
            
        case 'newest':
            // Ordenar por más recientes (simulado con ID)
            filteredProducts.sort((a, b) => {
                const idA = parseInt(a.id) || 0;
                const idB = parseInt(b.id) || 0;
                return idB - idA;
            });
            break;
            
        case 'rating':
            // Ordenar por mejor valorados (simulado con reviews)
            filteredProducts.sort((a, b) => {
                const ratingA = parseFloat(a.rating) || 4.5;
                const ratingB = parseFloat(b.rating) || 4.5;
                return ratingB - ratingA;
            });
            break;
            
        default:
            // Ordenamiento por defecto (popular)
            filteredProducts.sort((a, b) => {
                const reviewsA = parseInt(a.reviews) || 0;
                const reviewsB = parseInt(b.reviews) || 0;
                return reviewsB - reviewsA;
            });
    }
}

// Función para cambiar vista de productos
function changeView(view) {
    currentView = view;
    const productsGrid = document.querySelector('.products-grid');
    const gridButton = document.querySelector('.grid-view');
    const listButton = document.querySelector('.list-view');
    
    if (!productsGrid) return;
    
    // Actualizar clases CSS
    if (view === 'list') {
        productsGrid.classList.add('list-view');
        productsGrid.classList.remove('grid-view');
        if (listButton) listButton.classList.add('active');
        if (gridButton) gridButton.classList.remove('active');
    } else {
        productsGrid.classList.remove('list-view');
        productsGrid.classList.add('grid-view');
        if (gridButton) gridButton.classList.add('active');
        if (listButton) listButton.classList.remove('active');
    }
    
    // Aplicar estilos dinámicos según la vista
    applyViewStyles(view);
    
    // Verificar que los estilos se aplicaron correctamente
    setTimeout(() => {
        if (!validateViewStyles(view)) {
            console.log('Reaplicando estilos para vista:', view);
            applyViewStyles(view);
            
            // Si aún no funciona, forzar la aplicación
            setTimeout(() => {
                if (!validateViewStyles(view)) {
                    forceApplyViewStyles(view);
                }
            }, 200);
        }
    }, 100);
    
    // Limpiar transiciones después de un tiempo
    setTimeout(() => {
        const productsGrid = document.querySelector('.products-grid');
        const productCards = productsGrid?.querySelectorAll('.product-card');
        if (productsGrid) productsGrid.style.removeProperty('transition');
        if (productCards) {
            productCards.forEach(card => {
                card.style.removeProperty('transition');
            });
        }
    }, 350);
    
    // Guardar preferencia en localStorage
    localStorage.setItem('productView', view);
}

// Función para cambiar ordenamiento
function changeSort(sortType) {
    currentSort = sortType;
    sortProducts();
    loadProducts(filteredProducts);
    
    // Guardar preferencia en localStorage
    localStorage.setItem('productSort', sortType);
}

// Función para configurar los filtros automáticos
function setupFilterSystem() {
    // Event listeners para checkboxes de marcas
    const brandCheckboxes = document.querySelectorAll('input[data-filter="brand"]');
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFiltersWithDebounce);
    });
    
    // Event listeners para inputs de precio
    const minPriceInput = document.querySelector('.min-price');
    const maxPriceInput = document.querySelector('.max-price');
    const slider = document.querySelector('.slider');
    
    if (minPriceInput) {
        minPriceInput.addEventListener('input', function() {
            const value = parseFloat(this.value) || 0;
            const maxValue = parseFloat(maxPriceInput.value) || 169;
            if (value > maxValue) {
                this.value = maxValue;
            }
            applyFiltersWithDebounce();
        });
    }
    
    if (maxPriceInput) {
        maxPriceInput.addEventListener('input', function() {
            const value = parseFloat(this.value) || 169;
            const minValue = parseFloat(minPriceInput.value) || 0;
            if (value < minValue) {
                this.value = minValue;
            }
            applyFiltersWithDebounce();
        });
    }
    
    if (slider) {
        slider.addEventListener('input', function() {
            const percentage = this.value;
            const maxPrice = 169;
            const calculatedMax = Math.round((percentage / 100) * maxPrice);
            if (maxPriceInput) {
                maxPriceInput.value = calculatedMax;
            }
            applyFiltersWithDebounce();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    const savedSearchTerm = sessionStorage.getItem('searchTerm');
    
    if (!searchTerm && !savedSearchTerm) {
        fetch('../partials/products.json')
            .then(response => response.json())
            .then(data => {
                allProducts = data;
                filteredProducts = [...data];
                loadProducts();
                
                // Aplicar estilos después de cargar productos
                setTimeout(() => {
                    if (currentView === 'list') {
                        applyListResponsiveStyles();
                    } else {
                        restoreGridResponsiveStyles();
                    }
                }, 500);
            })
            .catch(error => console.error('Error', error));
    } else {
        setTimeout(() => {
            setupEventListeners();
        }, 200);
    }
    
    window.setupQuickView();
    window.setupBackToTop();
    window.setupFilters();
    window.setupFloatingCart();
    window.setupPagination();
    window.setupProductControls();
    
    document.addEventListener('navbarLoaded', function() {
        console.log('Navbar cargado, inicializando carrito...');
        setTimeout(() => {
            window.initializeCart();
        }, 200);
    });
    
    setTimeout(function() {
        if (!window.cartInitialized) {
            console.log('Fallback: inicializando carrito...');
            window.initializeCart();
        }
    }, 2000);
    
    function setupEventListeners() {
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.addEventListener('click', function(e) {
                if (e.target.classList.contains('add-to-cart')) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(e);
                }
                
                if (e.target.classList.contains('quick-view')) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQuickView(e);
                }
            });
        }
        
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                const quickViewModal = document.getElementById('quickViewModal');
                if (quickViewModal) {
                    quickViewModal.style.display = 'none';
                }
            });
        }
        
        const modalAddToCartBtn = document.querySelector('.modal-right .add-to-cart');
        if (modalAddToCartBtn) {
            modalAddToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const modalProductTitle = document.getElementById('modalProductTitle');
                const modalBrand = document.getElementById('modalBrand');
                const modalDiscountedPrice = document.getElementById('modalDiscountedPrice');
                const modalMainImage = document.getElementById('modalMainImage');
                const modalQuantity = document.getElementById('modalQuantity');
                const quickViewModal = document.getElementById('quickViewModal');
                
                if (!modalProductTitle || !modalBrand || !modalDiscountedPrice || !modalMainImage) {
                    console.error('Datos del modal incompletos');
                    return;
                }
                
                const product = {
                    name: modalProductTitle.textContent,
                    brand: modalBrand.textContent,
                    price: parseFloat(modalDiscountedPrice.textContent.replace('S/. ', '')),
                    image: modalMainImage.src,
                    quantity: parseInt(modalQuantity ? modalQuantity.value : 1) || 1
                };
                
                console.log('Añadiendo producto desde modal:', product);
                
                if (window.addToCart) {
                    window.addToCart(product);
                } else {
                    console.error('Función addToCart no disponible en modal');
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

// Funciones globales delegadas al JSR Cart System

// Mantener compatibilidad con el código existente mientras se migra al nuevo sistema
window.initializeCart = function() {
    console.log('⚠️ initializeCart() es una función legacy - el carrito se inicializa automáticamente');
};

// Función legacy para compatibilidad con carrito flotante
window.setupFloatingCart = function() {
    console.log('⚠️ setupFloatingCart() es una función legacy - el carrito flotante se configura automáticamente');
    
    if (window.updateFloatingCart) {
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
    const filterHeaders = document.querySelectorAll('.sidebar h2, .catalogo-filter h3');
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
    
    setupFilterSystem();
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

window.setupProductControls = function() {
    // Configurar controles de vista
    const gridButton = document.querySelector('.grid-view');
    const listButton = document.querySelector('.list-view');
    const sortSelect = document.getElementById('sortSelect');
    
    // Cargar preferencias guardadas
    const savedView = localStorage.getItem('productView') || 'grid';
    const savedSort = localStorage.getItem('productSort') || 'popular';
    
    // Aplicar vista guardada
    changeView(savedView);
    
    // Aplicar ordenamiento guardado
    if (sortSelect) {
        sortSelect.value = savedSort;
        currentSort = savedSort;
    }
    
    // Event listeners para botones de vista
    if (gridButton) {
        gridButton.addEventListener('click', function(e) {
            e.preventDefault();
            changeView('grid');
        });
    }
    
    if (listButton) {
        listButton.addEventListener('click', function(e) {
            e.preventDefault();
            changeView('list');
        });
    }
    
    // Event listener para selector de ordenamiento
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            changeSort(this.value);
        });
    }
    
    // Configurar vista inicial del grid
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        if (currentView === 'list') {
            productsGrid.classList.add('list-view');
        } else {
            productsGrid.classList.add('grid-view');
        }
    }
    
    // Aplicar estilos iniciales
    setTimeout(() => {
        applyViewStyles(currentView);
        // Aplicar estilos responsive iniciales
        if (currentView === 'list') {
            applyListResponsiveStyles();
        } else {
            restoreGridResponsiveStyles();
        }
    }, 200);
    
    // Event listener para cambios de tamaño de ventana
    window.addEventListener('resize', handleResize);
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
            
            if (!window.cartInitialized) {
                console.log('Carrito no inicializado, intentando inicializar...');
                window.initializeCart();
                
                setTimeout(() => {
                    if (window.addToCart) {
                        window.addToCart(product);
                    } else {
                        console.error('No se pudo inicializar el carrito');
                    }
                }, 300);
            } else if (window.addToCart) {
                window.addToCart(product);
            } else {
                console.error('La función addToCart no está disponible');
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

// Función para aplicar estilos dinámicos según la vista
function applyViewStyles(view) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Agregar transición suave
    productsGrid.style.setProperty('transition', 'all 0.3s ease', 'important');
    
    // Remover estilos dinámicos anteriores
    productsGrid.style.removeProperty('grid-template-columns');
    productsGrid.style.removeProperty('gap');
    productsGrid.style.removeProperty('max-width');
    
    const productCards = productsGrid.querySelectorAll('.product-card');
    
    if (view === 'list') {
        // Estilos para vista de lista (columna)
        productsGrid.style.setProperty('grid-template-columns', '1fr', 'important');
        productsGrid.style.setProperty('max-width', '100%', 'important');
        
        // Aplicar estilos a las tarjetas de producto para vista de lista
        productCards.forEach(card => {
            card.style.setProperty('transition', 'all 0.3s ease', 'important');
            card.style.setProperty('display', 'flex', 'important');
            card.style.setProperty('flex-direction', 'row', 'important');
            card.style.setProperty('align-items', 'center', 'important');
            card.style.setProperty('text-align', 'left', 'important');
            card.style.setProperty('min-height', 'auto', 'important');
            card.style.setProperty('padding', '20px', 'important');
            
            // Estilos para la imagen en vista de lista
            const img = card.querySelector('img');
            if (img) {
                img.style.setProperty('width', '150px', 'important');
                img.style.setProperty('height', '150px', 'important');
                img.style.setProperty('margin-bottom', '0', 'important');
                img.style.setProperty('flex-shrink', '0', 'important');
                img.style.setProperty('object-fit', 'contain', 'important');
            }
            
            // Estilos para el contenido en vista de lista
            const productInfo = card.querySelector('.product-info');
            if (productInfo) {
                productInfo.style.setProperty('flex', '1', 'important');
                productInfo.style.setProperty('display', 'flex', 'important');
                productInfo.style.setProperty('flex-direction', 'column', 'important');
                productInfo.style.setProperty('justify-content', 'center', 'important');
            }
            
            // Estilos para los botones en vista de lista
            const productActions = card.querySelector('.product-actions');
            if (productActions) {
                productActions.style.setProperty('display', 'flex', 'important');
                productActions.style.setProperty('flex-direction', 'column', 'important');
                productActions.style.setProperty('gap', '10px', 'important');
                productActions.style.setProperty('min-width', '150px', 'important');
                productActions.style.setProperty('flex-shrink', '0', 'important');
                productActions.style.setProperty('justify-content', 'center', 'important');
            }
            
            // Estilos para los botones individuales
            const addToCartBtn = card.querySelector('.add-to-cart');
            const quickViewBtn = card.querySelector('.quick-view');
            
            if (addToCartBtn) {
                addToCartBtn.style.setProperty('padding', '12px 20px', 'important');
                addToCartBtn.style.setProperty('font-size', '14px', 'important');
                addToCartBtn.style.setProperty('font-weight', '600', 'important');
                addToCartBtn.style.setProperty('border-radius', '6px', 'important');
            }
            
            if (quickViewBtn) {
                quickViewBtn.style.setProperty('padding', '12px 20px', 'important');
                quickViewBtn.style.setProperty('font-size', '14px', 'important');
                quickViewBtn.style.setProperty('font-weight', '600', 'important');
                quickViewBtn.style.setProperty('border-radius', '6px', 'important');
            }
            
            // Estilos para elementos individuales en vista de lista
            const brand = card.querySelector('.brand');
            const productName = card.querySelector('.product-name');
            const reviews = card.querySelector('.reviews');
            const price = card.querySelector('.price');
            const availability = card.querySelector('.availability');
            
            if (brand) {
                brand.style.setProperty('font-size', '14px', 'important');
                brand.style.setProperty('font-weight', '600', 'important');
                brand.style.setProperty('color', '#666', 'important');
            }
            if (productName) {
                productName.style.setProperty('font-size', '16px', 'important');
                productName.style.setProperty('font-weight', '600', 'important');
                productName.style.setProperty('line-height', '1.3', 'important');
            }
            if (reviews) {
                reviews.style.setProperty('justify-content', 'flex-start', 'important');
                reviews.style.setProperty('margin', '8px 0', 'important');
            }
            if (price) {
                price.style.setProperty('margin', '10px 0', 'important');
                price.style.setProperty('display', 'flex', 'important');
                price.style.setProperty('flex-direction', 'column', 'important');
                price.style.setProperty('gap', '5px', 'important');
            }
            if (availability) {
                availability.style.setProperty('justify-content', 'flex-start', 'important');
                availability.style.setProperty('margin', '8px 0', 'important');
            }
        });
        
        // Estilos responsive para vista de lista
        applyListResponsiveStyles();
        
    } else {
        // Restaurar estilos originales para vista de cuadrícula
        productsGrid.style.setProperty('grid-template-columns', 'repeat(auto-fill, minmax(230px, 1fr))', 'important');
        productsGrid.style.removeProperty('gap');
        productsGrid.style.removeProperty('max-width');
        
        // Restaurar estilos originales de las tarjetas
        productCards.forEach(card => {
            card.style.setProperty('transition', 'all 0.3s ease', 'important');
            card.style.removeProperty('display');
            card.style.removeProperty('flex-direction');
            card.style.removeProperty('align-items');
            card.style.removeProperty('text-align');
            card.style.removeProperty('min-height');
            card.style.removeProperty('padding');
            card.style.removeProperty('gap');
            
            // Restaurar imagen
            const img = card.querySelector('img');
            if (img) {
                img.style.removeProperty('width');
                img.style.removeProperty('height');
                img.style.removeProperty('margin-bottom');
                img.style.removeProperty('flex-shrink');
                img.style.removeProperty('object-fit');
            }
            
            // Restaurar product-info
            const productInfo = card.querySelector('.product-info');
            if (productInfo) {
                productInfo.style.removeProperty('flex');
                productInfo.style.removeProperty('display');
                productInfo.style.removeProperty('flex-direction');
                productInfo.style.removeProperty('gap');
                productInfo.style.removeProperty('justify-content');
            }
            
            // Restaurar product-actions
            const productActions = card.querySelector('.product-actions');
            if (productActions) {
                productActions.style.removeProperty('display');
                productActions.style.removeProperty('flex-direction');
                productActions.style.removeProperty('gap');
                productActions.style.removeProperty('min-width');
                productActions.style.removeProperty('flex-shrink');
                productActions.style.removeProperty('justify-content');
            }
            
            // Restaurar elementos individuales
            const brand = card.querySelector('.brand');
            const productName = card.querySelector('.product-name');
            const reviews = card.querySelector('.reviews');
            const price = card.querySelector('.price');
            const availability = card.querySelector('.availability');
            
            if (brand) brand.style.removeProperty('font-size');
            if (productName) productName.style.removeProperty('font-size');
            if (reviews) reviews.style.removeProperty('justify-content');
            if (price) price.style.removeProperty('margin');
            if (availability) availability.style.removeProperty('justify-content');
        });
        
        // Restaurar estilos responsive originales
        restoreGridResponsiveStyles();
    }
}

// Función para aplicar estilos responsive en vista de lista
function applyListResponsiveStyles() {
    const productsGrid = document.querySelector('.products-grid');
    const productCards = productsGrid?.querySelectorAll('.product-card');
    
    if (!productsGrid || !productCards) return;
    
    if (window.innerWidth <= 768) {
        // Estilos para móviles en vista de lista
        productsGrid.style.setProperty('grid-template-columns', '1fr', 'important');
        productsGrid.style.removeProperty('gap');
        
        productCards.forEach(card => {
            card.style.setProperty('flex-direction', 'column', 'important');
            card.style.setProperty('text-align', 'center', 'important');
            card.style.setProperty('padding', '15px', 'important');
            card.style.setProperty('gap', '15px', 'important');
            
            const img = card.querySelector('img');
            if (img) {
                img.style.setProperty('width', '120px', 'important');
                img.style.setProperty('height', '120px', 'important');
            }
            
            const productInfo = card.querySelector('.product-info');
            if (productInfo) {
                productInfo.style.setProperty('justify-content', 'center', 'important');
            }
            
            const productActions = card.querySelector('.product-actions');
            if (productActions) {
                productActions.style.setProperty('flex-direction', 'row', 'important');
                productActions.style.setProperty('min-width', 'auto', 'important');
                productActions.style.setProperty('justify-content', 'center', 'important');
            }
        });
    } else if (window.innerWidth <= 1024) {
        // Estilos para tablets en vista de lista
        productsGrid.style.setProperty('grid-template-columns', '1fr', 'important');
        productsGrid.style.removeProperty('gap');
        
        productCards.forEach(card => {
            card.style.setProperty('flex-direction', 'row', 'important');
            card.style.setProperty('text-align', 'left', 'important');
            card.style.setProperty('padding', '20px', 'important');
            card.style.setProperty('gap', '20px', 'important');
            
            const img = card.querySelector('img');
            if (img) {
                img.style.setProperty('width', '150px', 'important');
                img.style.setProperty('height', '150px', 'important');
            }
            
            const productInfo = card.querySelector('.product-info');
            if (productInfo) {
                productInfo.style.setProperty('justify-content', 'center', 'important');
            }
            
            const productActions = card.querySelector('.product-actions');
            if (productActions) {
                productActions.style.setProperty('flex-direction', 'column', 'important');
                productActions.style.setProperty('min-width', '150px', 'important');
                productActions.style.setProperty('justify-content', 'center', 'important');
            }
        });
    } else {
        // Estilos para desktop en vista de lista
        productsGrid.style.setProperty('grid-template-columns', '1fr', 'important');
        productsGrid.style.removeProperty('gap');
        
        productCards.forEach(card => {
            card.style.setProperty('flex-direction', 'row', 'important');
            card.style.setProperty('text-align', 'left', 'important');
            card.style.setProperty('padding', '20px', 'important');
            card.style.setProperty('gap', '20px', 'important');
            
            const img = card.querySelector('img');
            if (img) {
                img.style.setProperty('width', '150px', 'important');
                img.style.setProperty('height', '150px', 'important');
            }
            
            const productInfo = card.querySelector('.product-info');
            if (productInfo) {
                productInfo.style.setProperty('justify-content', 'center', 'important');
            }
            
            const productActions = card.querySelector('.product-actions');
            if (productActions) {
                productActions.style.setProperty('flex-direction', 'column', 'important');
                productActions.style.setProperty('min-width', '150px', 'important');
                productActions.style.setProperty('justify-content', 'center', 'important');
            }
        });
    }
}

// Función para restaurar estilos responsive originales
function restoreGridResponsiveStyles() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Restaurar estilos originales del grid según el tamaño de pantalla
    if (window.innerWidth <= 768) {
        productsGrid.style.setProperty('grid-template-columns', 'repeat(2, 1fr)', 'important');
        productsGrid.style.removeProperty('gap');
    } else if (window.innerWidth <= 1024) {
        productsGrid.style.setProperty('grid-template-columns', 'repeat(3, 1fr)', 'important');
        productsGrid.style.removeProperty('gap');
    } else {
        productsGrid.style.setProperty('grid-template-columns', 'repeat(auto-fill, minmax(230px, 1fr))', 'important');
        productsGrid.style.removeProperty('gap');
    }
    
    // Restaurar estilos originales de las tarjetas
    const productCards = productsGrid.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // Remover todos los estilos dinámicos aplicados
        card.style.removeProperty('display');
        card.style.removeProperty('flex-direction');
        card.style.removeProperty('align-items');
        card.style.removeProperty('text-align');
        card.style.removeProperty('min-height');
        card.style.removeProperty('padding');
        card.style.removeProperty('gap');
        card.style.removeProperty('transition');
        
        // Restaurar imagen
        const img = card.querySelector('img');
        if (img) {
            img.style.removeProperty('width');
            img.style.removeProperty('height');
            img.style.removeProperty('margin-bottom');
            img.style.removeProperty('flex-shrink');
            img.style.removeProperty('object-fit');
        }
        
        // Restaurar product-info
        const productInfo = card.querySelector('.product-info');
        if (productInfo) {
            productInfo.style.removeProperty('flex');
            productInfo.style.removeProperty('display');
            productInfo.style.removeProperty('flex-direction');
            productInfo.style.removeProperty('gap');
            productInfo.style.removeProperty('justify-content');
        }
        
        // Restaurar product-actions
        const productActions = card.querySelector('.product-actions');
        if (productActions) {
            productActions.style.removeProperty('display');
            productActions.style.removeProperty('flex-direction');
            productActions.style.removeProperty('gap');
            productActions.style.removeProperty('min-width');
            productActions.style.removeProperty('flex-shrink');
            productActions.style.removeProperty('justify-content');
        }
        
        // Restaurar elementos individuales
        const brand = card.querySelector('.brand');
        const productName = card.querySelector('.product-name');
        const reviews = card.querySelector('.reviews');
        const price = card.querySelector('.price');
        const availability = card.querySelector('.availability');
        const addToCartBtn = card.querySelector('.add-to-cart');
        const quickViewBtn = card.querySelector('.quick-view');
        
        if (brand) {
            brand.style.removeProperty('font-size');
            brand.style.removeProperty('font-weight');
            brand.style.removeProperty('color');
        }
        if (productName) {
            productName.style.removeProperty('font-size');
            productName.style.removeProperty('font-weight');
            productName.style.removeProperty('line-height');
        }
        if (reviews) {
            reviews.style.removeProperty('justify-content');
            reviews.style.removeProperty('margin');
        }
        if (price) {
            price.style.removeProperty('margin');
            price.style.removeProperty('display');
            price.style.removeProperty('flex-direction');
            price.style.removeProperty('gap');
        }
        if (availability) {
            availability.style.removeProperty('justify-content');
            availability.style.removeProperty('margin');
        }
        if (addToCartBtn) {
            addToCartBtn.style.removeProperty('padding');
            addToCartBtn.style.removeProperty('font-size');
            addToCartBtn.style.removeProperty('font-weight');
            addToCartBtn.style.removeProperty('border-radius');
        }
        if (quickViewBtn) {
            quickViewBtn.style.removeProperty('padding');
            quickViewBtn.style.removeProperty('font-size');
            quickViewBtn.style.removeProperty('font-weight');
            quickViewBtn.style.removeProperty('border-radius');
        }
    });
}

// Función para manejar cambios de tamaño de ventana
function handleResize() {
    // Debounce para evitar múltiples llamadas
    if (window.resizeTimeout) {
        clearTimeout(window.resizeTimeout);
    }
    
    window.resizeTimeout = setTimeout(() => {
        if (currentView === 'list') {
            applyListResponsiveStyles();
        } else {
            restoreGridResponsiveStyles();
        }
    }, 100);
}

// Función para verificar si los estilos se aplicaron correctamente
function validateViewStyles(view) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return false;
    
    if (view === 'list') {
        const computedStyle = window.getComputedStyle(productsGrid);
        return computedStyle.gridTemplateColumns === '1fr';
    } else {
        const computedStyle = window.getComputedStyle(productsGrid);
        return computedStyle.gridTemplateColumns.includes('repeat');
    }
}

// Función para forzar la aplicación de estilos si fallan
function forceApplyViewStyles(view) {
    console.log('Forzando aplicación de estilos para vista:', view);
    
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Remover todas las clases y estilos
    productsGrid.className = 'products-grid';
    productsGrid.removeAttribute('style');
    
    // Aplicar estilos desde cero
    setTimeout(() => {
        applyViewStyles(view);
        if (view === 'list') {
            applyListResponsiveStyles();
        } else {
            restoreGridResponsiveStyles();
        }
    }, 50);
}