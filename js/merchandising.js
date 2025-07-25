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

// Funciones para navegación horizontal
function initializeProductNavigation() {
    const navButtons = document.querySelectorAll('.product-nav-arrow');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            const direction = this.classList.contains('prev') ? -1 : 1;
            scrollProducts(section, direction);
        });
    });

    // Agregar eventos de scroll para actualizar visibilidad de flechas
    const containers = document.querySelectorAll('.merchandising-section .product-list-container');
    containers.forEach(container => {
        container.addEventListener('scroll', function() {
            updateNavigationVisibility();
        });
    });

    // Actualizar visibilidad inicial
    window.addEventListener('resize', updateNavigationVisibility);
}

function scrollProducts(section, direction) {
    const container = document.querySelector(`#${section}-products`).closest('.product-list-container');
    const productList = container.querySelector('.product-list');
    
    if (!container || !productList) return;

    // Obtener el ancho de desplazamiento basado en el tamaño de la pantalla
    let scrollAmount;
    
    if (window.innerWidth <= 480) {
        scrollAmount = 150; // Ancho de producto móvil + gap
    } else if (window.innerWidth <= 768) {
        scrollAmount = 180; // Ancho de producto tablet + gap
    } else {
        scrollAmount = 250; // Ancho de producto desktop + gap
    }

    const currentScroll = container.scrollLeft;
    const targetScroll = currentScroll + (scrollAmount * direction);

    // Scroll suave
    container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
    });

    // Actualizar visibilidad de flechas después del scroll
    setTimeout(() => {
        updateNavigationVisibility();
    }, 300);
}

function updateNavigationVisibility() {
    const sections = ['promotion', 'design-drawing', 'infantil', 'papeleria'];
    
    sections.forEach(section => {
        const container = document.querySelector(`#${section}-products`).closest('.product-list-container');
        if (!container) return;

        const productList = container.querySelector('.product-list');
        const prevBtn = container.querySelector('.product-nav-arrow.prev');
        const nextBtn = container.querySelector('.product-nav-arrow.next');

        if (!productList || !prevBtn || !nextBtn) return;

        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const maxScroll = scrollWidth - clientWidth;

        // Mostrar/ocultar flecha izquierda
        if (scrollLeft > 5) {
            prevBtn.classList.add('visible');
        } else {
            prevBtn.classList.remove('visible');
        }

        // Mostrar/ocultar flecha derecha
        if (scrollLeft < maxScroll - 5) {
            nextBtn.classList.add('visible');
        } else {
            nextBtn.classList.remove('visible');
        }

        // En desktop, ocultar flechas si no hay scroll necesario
        if (window.innerWidth > 768 && maxScroll <= 0) {
            prevBtn.classList.remove('visible');
            nextBtn.classList.remove('visible');
        }
    });
}

// Touch/swipe support para móviles
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    const container = e.target.closest('.product-list-container');
    if (container) {
        touchStartX = e.changedTouches[0].screenX;
    }
});

document.addEventListener('touchend', function(e) {
    const container = e.target.closest('.product-list-container');
    if (container) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(container);
    }
});

function handleSwipe(container) {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX - touchEndX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        const section = container.querySelector('.product-list').id.replace('-products', '');
        const direction = swipeDistance > 0 ? 1 : -1;
        scrollProducts(section, direction);
    }
}

// Función para mostrar las flechas iniciales cuando hay contenido disponible
function showInitialNavigation() {
    const sections = ['promotion', 'design-drawing', 'infantil', 'papeleria'];
    
    sections.forEach(section => {
        const container = document.querySelector(`#${section}-products`).closest('.product-list-container');
        if (!container) return;

        const productList = container.querySelector('.product-list');
        const nextBtn = container.querySelector('.product-nav-arrow.next');

        if (!productList || !nextBtn) return;

        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;

        // Si hay más contenido que el visible, mostrar la flecha derecha
        if (scrollWidth > clientWidth) {
            nextBtn.classList.add('visible');
        }
    });
}

 