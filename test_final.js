// Test final para verificar que el modal funcione
console.log('🧪 Test final del modal...');

// Verificar funciones después de 3 segundos
setTimeout(() => {
    console.log('🔍 Verificando funciones del modal:');
    console.log('  - handleModalAddToCart:', typeof window.handleModalAddToCart);
    console.log('  - addProductFromModal:', typeof window.addProductFromModal);
    console.log('  - loadProductsData:', typeof window.loadProductsData);
    console.log('  - addToCart:', typeof window.addToCart);
    console.log('  - JSRCart:', !!window.JSRCart);
    
    if (window.JSRCart) {
        console.log('  - JSRCart.addToCart:', typeof window.JSRCart.addToCart);
        console.log('  - JSRCart.getInstance:', typeof window.JSRCart.getInstance);
    }
    
    console.log('✅ Test completado');
}, 3000); 