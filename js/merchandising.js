// Función para cargar productos en las secciones de merchandising
document.addEventListener('DOMContentLoaded', function() {
    loadMerchandisingProducts();
    initializeProductNavigation();
});

function loadMerchandisingProducts() {
    fetch('/partials/products.json')
        .then(response => response.json())
        .then(data => {
            // Productos para la sección "Promociones"
            const promotionProducts = data.filter(product => 
                product.brand === 'FABER-CASTELL' ||
                product.brand === 'CASIO' ||
                product.brand === 'LOGITECH' ||
                product.brand === 'PIGMA-MICRON' ||
                product.brand === 'XIAOMI' ||
                product.brand === 'CATRICE' ||
                product.brand === 'STICK\'N-NOTES' ||
                product.brand === 'SONY' ||
                product.brand === 'MARVEL'
            ).slice(0, 9); 

            // Productos para la sección "Diseño & Dibujo"
            const designDrawingProducts = data.filter(product => 
                product.productName.toLowerCase().includes('lapices') ||
                product.productName.toLowerCase().includes('marcador') ||
                product.productName.toLowerCase().includes('portaminas') ||
                product.productName.toLowerCase().includes('bitacora') ||
                product.productName.toLowerCase().includes('corrector') ||
                product.brand === 'FABER-CASTELL' ||
                product.brand === 'PIGMA-MICRON' ||
                product.brand === 'VINIFAN' ||
                product.brand === 'MILAN' ||
                product.brand === 'CATRICE'
            ).slice(0, 8); // Aumentamos a 8 productos para mejor scroll

            // Productos para la sección "Infantil"  
            const infantilProducts = data.filter(product =>
                product.productName.toLowerCase().includes('plastilina') ||
                product.productName.toLowerCase().includes('acuarelas') ||
                product.productName.toLowerCase().includes('crayones') ||
                product.productName.toLowerCase().includes('peluche') ||
                product.productName.toLowerCase().includes('plumones') ||
                product.brand === 'ARTESCO' ||
                product.brand === 'ARTI CREATIVO' ||
                product.brand === 'LAYCONSA' ||
                product.brand === 'PHARMAX'
            ).slice(0, 10); // Aumentamos a 10 productos

            // Productos para la sección "Papelería"
            const papeleriaProducts = data.filter(product =>
                product.productName.toLowerCase().includes('cuaderno') ||
                product.productName.toLowerCase().includes('folder') ||
                product.productName.toLowerCase().includes('papel') ||
                product.productName.toLowerCase().includes('cinta') ||
                product.productName.toLowerCase().includes('resaltador') ||
                product.productName.toLowerCase().includes('bitacora') ||
                product.brand === 'MINERVA' ||
                product.brand === 'VINIFAN' ||
                product.brand === 'STABILO' ||
                product.brand === 'STICK\'N-NOTES' ||
                product.brand === 'REPORT'
            ).slice(0, 8); // Aumentamos a 8 productos

            // Renderizar productos de Promociones
            renderProducts('promotion-products', promotionProducts);
            
            // Renderizar productos de Diseño & Dibujo
            renderProducts('design-drawing-products', designDrawingProducts);
            
            // Renderizar productos Infantiles
            renderProducts('infantil-products', infantilProducts);
            
            // Renderizar productos de Papelería
            renderProducts('papeleria-products', papeleriaProducts);
            
            // Inicializar navegación después de cargar los productos
            setTimeout(() => {
                updateNavigationVisibility();
                // Mostrar flecha derecha por defecto cuando hay productos
                showInitialNavigation();
            }, 100);
            
        })
        .catch(error => console.error('Error cargando productos:', error));
}

function renderProducts(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    products.forEach(product => {
        const isAvailable = product.availability.toLowerCase().includes('disponible');
        const availabilityClass = isAvailable ? '' : 'out-of-stock';
        
        const productCard = `
            <div class="product-card">
                <span class="discount">${product.discount}</span>
                <img src="${product.img}" alt="${product.alt}" />
                <div class="brand">${product.brand}</div>
                <div class="product-name">${product.productName}</div>
                <div class="reviews">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
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
        
        container.innerHTML += productCard;
    });
}

// Variables para posiciones de scroll
let currentPositions = {
    promotion: 0,
    'design-drawing': 0,
    infantil: 0,
    papeleria: 0
};

function getScrollAmount() {
    if (window.innerWidth <= 480) {
        return 120; // Scroll parcial en móvil
    } else if (window.innerWidth <= 768) {
        return 160; // Tarjeta completa en tablet
    }
    return 230; // Tarjeta completa en desktop
}

function initializeProductNavigation() {
    const navButtons = document.querySelectorAll('.product-nav-arrow');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const section = this.getAttribute('data-section');
            const direction = this.classList.contains('prev') ? -1 : 1;
            scrollProducts(section, direction);
        });
    });

    const containers = document.querySelectorAll('.merchandising-section .product-list-container');
    containers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            updateNavigationVisibility();
        });
    });

    window.addEventListener('resize', () => {
        Object.keys(currentPositions).forEach(section => {
            currentPositions[section] = 0;
            const container = document.querySelector(`#${section}-products`);
            if (container) {
                container.style.transform = 'translateX(0px)';
            }
        });
        updateNavigationVisibility();
    });
}

function scrollProducts(section, direction) {
    const productList = document.querySelector(`#${section}-products`);
    if (!productList) return;

    const container = productList.closest('.product-list-container');
    if (!container) return;

    const containerWidth = container.offsetWidth;
    
    // Calcular el ancho total basado en productos reales y tamaño de pantalla
    const productCards = productList.querySelectorAll('.product-card');
    let cardWidth = 230;
    if (window.innerWidth <= 480) {
        cardWidth = 150;
    } else if (window.innerWidth <= 768) {
        cardWidth = 160;
    }
    const totalWidth = productCards.length * cardWidth; // Solo el ancho de la tarjeta
    
    const maxScroll = Math.max(0, totalWidth - containerWidth);

    currentPositions[section] += getScrollAmount() * direction;
    currentPositions[section] = Math.max(
        0,
        Math.min(currentPositions[section], maxScroll)
    );

    productList.style.transform = `translateX(-${currentPositions[section]}px)`;
    productList.style.transition = 'transform 0.3s ease';

    setTimeout(() => {
        updateNavigationVisibility();
    }, 300);
}

function updateNavigationVisibility() {
    const sections = ['promotion', 'design-drawing', 'infantil', 'papeleria'];
    
    sections.forEach(section => {
        const productList = document.querySelector(`#${section}-products`);
        if (!productList) return;

        const container = productList.closest('.product-list-container');
        if (!container) return;

        const prevBtn = container.querySelector('.product-nav-arrow.prev');
        const nextBtn = container.querySelector('.product-nav-arrow.next');

        if (!prevBtn || !nextBtn) return;

        const containerWidth = container.offsetWidth;
        
        // Usar la misma lógica de cálculo responsive
        const productCards = productList.querySelectorAll('.product-card');
        let cardWidth = 230;
        if (window.innerWidth <= 480) {
            cardWidth = 150;
        } else if (window.innerWidth <= 768) {
            cardWidth = 160;
        }
        const totalWidth = productCards.length * cardWidth;
        const maxScroll = Math.max(0, totalWidth - containerWidth);

        if (maxScroll <= 0) {
            prevBtn.classList.remove('visible');
            nextBtn.classList.remove('visible');
            return;
        }

        // Mostrar flecha izquierda si no estamos al inicio
        if (currentPositions[section] > 10) {
            prevBtn.classList.add('visible');
        } else {
            prevBtn.classList.remove('visible');
        }

        // Mostrar flecha derecha si no estamos al final
        if (currentPositions[section] < maxScroll - 10) {
            nextBtn.classList.add('visible');
        } else {
            nextBtn.classList.remove('visible');
        }
    });
}



function showInitialNavigation() {
    setTimeout(() => {
        updateNavigationVisibility();
        
        // Mostrar flechas "next" iniciales
        Object.keys(currentPositions).forEach(section => {
            const productList = document.querySelector(`#${section}-products`);
            if (productList) {
                const productCards = productList.querySelectorAll('.product-card');
                const container = productList.closest('.product-list-container');
                const nextBtn = container?.querySelector('.product-nav-arrow.next');
                
                if (productCards.length > 0 && nextBtn) {
                    const containerWidth = container.offsetWidth;
                    let cardWidth = 230;
                    if (window.innerWidth <= 480) {
                        cardWidth = 150;
                    } else if (window.innerWidth <= 768) {
                        cardWidth = 160;
                    }
                    const totalWidth = productCards.length * cardWidth;
                    
                    if (totalWidth > containerWidth) {
                        nextBtn.classList.add('visible');
                    }
                }
            }
        });
    }, 200);
}

 