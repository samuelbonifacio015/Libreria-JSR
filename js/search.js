//search.js - Funcionalidad de búsqueda de productos

class ProductSearch {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.initializeSearchEvents();
        console.log('Búsqueda de productos inicializada');
    }

    async loadProducts() {
        try {
            // Ruta de productos.json
            let jsonPath = '/partials/products.json';
            
            // Si estamos en una subcarpeta (como html/), usar ruta relativa a la carpeta html
            if (window.location.pathname.includes('/html/')) {
                jsonPath = '../partials/products.json';
            }
            
            console.log('Cargando productos desde:', jsonPath);
            const response = await fetch(jsonPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.products = await response.json();
            console.log('Productos cargados:', this.products.length);
        } catch (error) {
            console.error('Error cargando productos:', error);
            // Intentar con la otra ruta como fallback
            try {
                const fallbackPath = window.location.pathname.includes('/html/') 
                    ? '/partials/products.json' 
                    : '../partials/products.json';
                console.log('Intentando ruta fallback:', fallbackPath);
                const response = await fetch(fallbackPath);
                this.products = await response.json();
                console.log('Productos cargados con fallback:', this.products.length);
            } catch (fallbackError) {
                console.error('Error con fallback:', fallbackError);
            }
        }
    }

    initializeSearchEvents() {
        console.log('Inicializando eventos de búsqueda con overlay...');
        
        // Elementos del navbar
        const desktopSearchInput = document.querySelector('.search-input-container input');
        const desktopSearchBtn = document.querySelector('.search-btn');
        const mobileSearchInput = document.querySelector('.mobile-search-container input');
        const mobileSearchBtn = document.querySelector('.mobile-search-btn');

        // Elementos del overlay
        const searchOverlay = document.getElementById('searchOverlay');
        const searchOverlayInput = document.getElementById('searchOverlayInput');
        const searchOverlayClose = document.getElementById('searchOverlayClose');
        const searchSuggestionsOverlay = document.getElementById('searchSuggestionsOverlay');

        console.log('Elementos encontrados:', {
            desktopSearchInput: !!desktopSearchInput,
            desktopSearchBtn: !!desktopSearchBtn,
            mobileSearchInput: !!mobileSearchInput,
            mobileSearchBtn: !!mobileSearchBtn,
            searchOverlay: !!searchOverlay,
            searchOverlayInput: !!searchOverlayInput
        });

        // Abrir overlay al hacer clic en las barras de búsqueda
        if (desktopSearchInput) {
            desktopSearchInput.addEventListener('focus', () => this.openSearchOverlay());
            desktopSearchInput.addEventListener('click', () => this.openSearchOverlay());
        }

        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('focus', () => this.openSearchOverlay());
            mobileSearchInput.addEventListener('click', () => this.openSearchOverlay());
        }

        // Abrir overlay al hacer clic en los botones de búsqueda
        if (desktopSearchBtn) {
            desktopSearchBtn.addEventListener('click', () => {
                const searchTerm = desktopSearchInput ? desktopSearchInput.value : '';
                if (searchTerm.trim()) {
                    this.performSearch(searchTerm);
                } else {
                    this.openSearchOverlay();
                }
            });
        }

        if (mobileSearchBtn) {
            mobileSearchBtn.addEventListener('click', () => {
                const searchTerm = mobileSearchInput ? mobileSearchInput.value : '';
                if (searchTerm.trim()) {
                    this.performSearch(searchTerm);
                } else {
                    this.openSearchOverlay();
                }
            });
        }

        // Eventos del overlay
        if (searchOverlayInput) {
            searchOverlayInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(e.target.value);
                }
            });

            searchOverlayInput.addEventListener('input', (e) => {
                if (e.target.value.length >= 1) {
                    this.showSearchSuggestions(e.target.value);
                } else {
                    this.hideSuggestions();
                }
            });
        }

        // Cerrar overlay
        if (searchOverlayClose) {
            searchOverlayClose.addEventListener('click', () => this.closeSearchOverlay());
        }

        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    this.closeSearchOverlay();
                }
            });
        }

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
                this.closeSearchOverlay();
            }
        });
    }

    searchProducts(searchTerm, exactIdMatch = false) {
        if (!searchTerm || searchTerm.length < 1) {
            return this.products;
        }

        const term = searchTerm.toLowerCase().trim();
        
        // Si es búsqueda exacta por ID (para dropdown)
        if (exactIdMatch) {
            return this.products.filter(product => 
                product.id.toLowerCase() === term
            );
        }
        
        // Búsqueda general en todos los campos
        return this.products.filter(product => {
            // Buscar en todos los campos del producto
            const searchFields = [
                product.id,
                product.discount,
                product.img,
                product.alt,
                product.brand,
                product.productName,
                product.priceOriginal,
                product.priceDiscounted,
                product.availability,
                product.reviews,
                product.category
            ];

            return searchFields.some(field => 
                field && field.toString().toLowerCase().includes(term)
            );
        });
    }

    performSearch(searchTerm, exactIdMatch = false) {
        console.log('Realizando búsqueda para:', searchTerm, 'exactIdMatch:', exactIdMatch);
        
        if (!searchTerm || searchTerm.trim().length === 0) {
            alert('Por favor ingresa un término de búsqueda');
            return;
        }

        const results = this.searchProducts(searchTerm, exactIdMatch);
        console.log('Resultados encontrados:', results.length);

        // Guardar término de búsqueda en sessionStorage
        sessionStorage.setItem('searchTerm', searchTerm.trim());
        sessionStorage.setItem('searchResults', JSON.stringify(results));
        sessionStorage.setItem('exactIdMatch', exactIdMatch.toString());

        // Redirigir a página de catálogo con resultados
        if (window.location.pathname.includes('catalogo.html')) {
            // Si ya estamos en catálogo, recargar con resultados
            console.log('Mostrando resultados en catálogo actual');
            this.displaySearchResults(searchTerm, exactIdMatch);
        } else {
            // Redirigir a catálogo
            console.log('Redirigiendo al catálogo con resultados');
            window.location.href = '/html/catalogo.html?search=' + encodeURIComponent(searchTerm) + '&exact=' + exactIdMatch;
        }

        this.hideSuggestions();
        this.closeSearchOverlay();
    }

    displaySearchResults(searchTerm, exactIdMatch = false) {
        const results = this.searchProducts(searchTerm, exactIdMatch);
        const productsContainer = document.querySelector('.products-grid');
        const productsHeader = document.querySelector('.products h2');
        const productsCount = document.querySelector('.products-count');

        if (productsContainer) {
            // Actualizar título
            if (productsHeader) {
                productsHeader.textContent = `Resultados de búsqueda para: "${searchTerm}"`;
            }

            // Actualizar contador
            if (productsCount) {
                productsCount.textContent = `Mostrando ${results.length} producto${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`;
            }

            // Limpiar contenedor
            productsContainer.innerHTML = '';

            if (results.length === 0) {
                productsContainer.innerHTML = `
                    <div class="no-results">
                        <div class="no-results-content">
                            <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                            <h3>No se encontraron productos</h3>
                            <p>No encontramos productos que coincidan con "<strong>${searchTerm}</strong>"</p>
                            <p>Intenta con otros términos de búsqueda o <a href="/html/catalogo.html" style="color: var(--secondary-color);">ver todos los productos</a></p>
                        </div>
                    </div>
                `;
                return;
            }

            // Mostrar resultados
            results.forEach(product => {
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

            // Agregar botón para volver a todos los productos (evitar duplicación)
            if (results.length > 0) {
                // Verificar si ya existe un botón antes de crear uno nuevo
                const existingBtn = document.querySelector('.back-to-all-products');
                if (existingBtn) {
                    existingBtn.remove();
                }
                
                const backToAllBtn = document.createElement('div');
                backToAllBtn.className = 'back-to-all-products';
                backToAllBtn.innerHTML = `
                    <button onclick="window.location.href='/html/catalogo.html'" class="back-to-all-btn">
                        <i class="fas fa-arrow-left"></i> Ver todos los productos
                    </button>
                `;
                productsContainer.parentNode.insertBefore(backToAllBtn, productsContainer);
            }
        }
    }

    openSearchOverlay() {
        const searchOverlay = document.getElementById('searchOverlay');
        const searchOverlayInput = document.getElementById('searchOverlayInput');
        
        if (searchOverlay) {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Copiar valor existente si hay uno
            const existingValue = document.querySelector('.search-input-container input')?.value || 
                                document.querySelector('.mobile-search-container input')?.value || '';
            
            if (searchOverlayInput) {
                searchOverlayInput.value = existingValue;
                setTimeout(() => {
                    searchOverlayInput.focus();
                    if (existingValue) {
                        this.showSearchSuggestions(existingValue);
                    }
                }, 100);
            }
        }
    }

    closeSearchOverlay() {
        const searchOverlay = document.getElementById('searchOverlay');
        const searchOverlayInput = document.getElementById('searchOverlayInput');
        
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Actualizar inputs del navbar con el valor del overlay
            if (searchOverlayInput && searchOverlayInput.value) {
                const desktopInput = document.querySelector('.search-input-container input');
                const mobileInput = document.querySelector('.mobile-search-container input');
                
                if (desktopInput) desktopInput.value = searchOverlayInput.value;
                if (mobileInput) mobileInput.value = searchOverlayInput.value;
            }
            
            this.hideSuggestions();
        }
    }

    showSearchSuggestions(searchTerm) {
        const suggestions = this.getSearchSuggestions(searchTerm);
        const suggestionsContainer = document.getElementById('searchSuggestionsOverlay');
        
        if (!suggestionsContainer) return;
        
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        suggestionsContainer.innerHTML = '';
        
        suggestions.slice(0, 6).forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            
            // Determinar ícono basado en categoría
            let iconClass = 'fas fa-search';
            if (suggestion.category === 'Marca') iconClass = 'fas fa-tags';
            else if (suggestion.category === 'Producto') iconClass = 'fas fa-box';
            else if (suggestion.category === 'Categoría') iconClass = 'fas fa-th-large';
            
            suggestionItem.innerHTML = `
                <div class="suggestion-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="suggestion-content">
                    <span class="suggestion-text">${suggestion.text}</span>
                    <span class="suggestion-category">${suggestion.category}</span>
                </div>
            `;
            
            suggestionItem.addEventListener('click', () => {
                this.performSearch(suggestion.text);
            });
            
            suggestionsContainer.appendChild(suggestionItem);
        });

        suggestionsContainer.classList.add('show');
    }

    getSearchSuggestions(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        const suggestions = [];
        const seen = new Set();

        this.products.forEach(product => {
            // Sugerencias por marca
            if (product.brand.toLowerCase().includes(term) && !seen.has(product.brand.toLowerCase())) {
                suggestions.push({
                    text: product.brand,
                    category: 'Marca'
                });
                seen.add(product.brand.toLowerCase());
            }

            // Sugerencias por nombre de producto (palabras clave)
            const productWords = product.productName.toLowerCase().split(/[\s|]+/);
            productWords.forEach(word => {
                if (word.length > 2 && word.includes(term) && !seen.has(word)) {
                    suggestions.push({
                        text: word.charAt(0).toUpperCase() + word.slice(1),
                        category: 'Producto'
                    });
                    seen.add(word);
                }
            });

            // Sugerencias por categoría (id)
            if (product.id.toLowerCase().includes(term) && !seen.has(product.id.toLowerCase())) {
                suggestions.push({
                    text: product.id.charAt(0).toUpperCase() + product.id.slice(1),
                    category: 'Categoría'
                });
                seen.add(product.id.toLowerCase());
            }
        });

        return suggestions.sort((a, b) => a.text.localeCompare(b.text));
    }

    hideSuggestions() {
        const suggestionsContainer = document.getElementById('searchSuggestionsOverlay');
        if (suggestionsContainer) {
            suggestionsContainer.classList.remove('show');
        }
    }

    // Método para inicializar búsqueda desde URL params
    initializeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search');
        const exactMatch = urlParams.get('exact') === 'true';
        
        if (searchTerm) {
            // Llenar el campo de búsqueda
            const searchInputs = document.querySelectorAll('.search-input-container input, .mobile-search-container input');
            searchInputs.forEach(input => {
                input.value = searchTerm;
            });
            
            // Mostrar resultados
            this.displaySearchResults(searchTerm, exactMatch);
        } else {
            // Verificar si hay resultados en sessionStorage
            const savedSearchTerm = sessionStorage.getItem('searchTerm');
            const savedExactMatch = sessionStorage.getItem('exactIdMatch') === 'true';
            if (savedSearchTerm && window.location.pathname.includes('catalogo.html')) {
                this.displaySearchResults(savedSearchTerm, savedExactMatch);
                // Limpiar sessionStorage después de usar
                sessionStorage.removeItem('searchTerm');
                sessionStorage.removeItem('searchResults');
                sessionStorage.removeItem('exactIdMatch');
            }
        }
    }
}

// Inicializar búsqueda cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando ProductSearch...');
    
    // Función para inicializar la búsqueda
    function initializeSearch() {
        const productSearch = new ProductSearch();
        
        // Si estamos en la página de catálogo, verificar parámetros de URL
        if (window.location.pathname.includes('catalogo.html')) {
            setTimeout(() => {
                productSearch.initializeFromURL();
            }, 200);
        }
        
        // Hacer disponible globalmente para debugging
        window.productSearch = productSearch;
        
        // Función de prueba global
        window.testSearch = function(term, exactIdMatch = false) {
            console.log('=== PRUEBA DE BÚSQUEDA ===');
            console.log('Término:', term);
            console.log('Búsqueda exacta por ID:', exactIdMatch);
            console.log('Productos cargados:', productSearch.products.length);
            const results = productSearch.searchProducts(term, exactIdMatch);
            console.log('Resultados:', results.length);
            console.log('Productos encontrados:', results);
            return results;
        };
        
        console.log('Funciones de debugging disponibles:');
        console.log('- window.testSearch("término", false) - Búsqueda general');
        console.log('- window.testSearch("id", true) - Búsqueda exacta por ID');
        console.log('- window.productSearch - Acceso directo al objeto de búsqueda');
    }
    
    // Si el navbar ya está cargado, inicializar inmediatamente
    if (document.querySelector('.search-input-container input') || 
        document.querySelector('.mobile-search-container input')) {
        console.log('Elementos de búsqueda encontrados, inicializando...');
        initializeSearch();
    } else {
        // Esperar a que se dispare el evento de navbar cargado
        console.log('Esperando a que el navbar se cargue...');
        document.addEventListener('navbarLoaded', function() {
            console.log('Navbar cargado, inicializando búsqueda...');
            setTimeout(initializeSearch, 100);
        });
        
        // Fallback: intentar después de un delay
        setTimeout(() => {
            if (!window.productSearch) {
                console.log('Fallback: inicializando búsqueda después de delay...');
                initializeSearch();
            }
        }, 1000);
    }
}); 