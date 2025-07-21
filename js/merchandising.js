// Función para cargar productos en las secciones de merchandising
document.addEventListener('DOMContentLoaded', function() {
    loadMerchandisingProducts();
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
                product.brand === 'CATRICE'
            ).slice(0, 6); // Limitamos a 6 productos

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
            ).slice(0, 6); // Limitamos a 6 productos

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
            ).slice(0, 8); // Aumentamos a 8 productos

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
            ).slice(0, 6); // Limitamos a 6 productos

            // Renderizar productos de Promociones
            renderProducts('promotion-products', promotionProducts);
            
            // Renderizar productos de Diseño & Dibujo
            renderProducts('design-drawing-products', designDrawingProducts);
            
            // Renderizar productos Infantiles
            renderProducts('infantil-products', infantilProducts);
            
            // Renderizar productos de Papelería
            renderProducts('papeleria-products', papeleriaProducts);
            
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

 