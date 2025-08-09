// dropdown.js - Funcionalidad de navegación del dropdown

class DropdownNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.initializeDropdownEvents();
    }

    initializeDropdownEvents() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupDropdownEvents();
            });
        } else {
            this.setupDropdownEvents();
        }
    }

    setupDropdownEvents() {
        // Obtener todos los elementos del dropdown
        const dropdownItems = document.querySelectorAll('.dropdown-content a');

        if (dropdownItems.length === 0) {
            console.warn('No se encontraron elementos del dropdown. Reintentando en 500ms...');
            setTimeout(() => this.setupDropdownEvents(), 500);
            return;
        }

        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const category = item.textContent.trim();
                
                this.navigateToCategory(category);
            });
        });

        // También manejar clics en los botones principales del dropdown
        const dropdownButtons = document.querySelectorAll('.dropbtn');
        
        dropdownButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Solo prevenir el comportamiento por defecto si no hay subcategorías
                const dropdownContent = button.nextElementSibling;
                if (!dropdownContent || !dropdownContent.classList.contains('dropdown-content')) {
                    e.preventDefault();
                    const category = button.textContent.trim();
                    this.navigateToCategory(category);
                }
            });
        });
    }

    navigateToCategory(category) {
        // Excepción para "LOS MÁS VENDIDOS" - ir directamente al catálogo
        if (category === 'LOS MÁS VENDIDOS') {
            window.location.href = '/html/catalogo.html';
            return;
        }
        
        // Mapear categorías del dropdown a términos de búsqueda
        const categoryMapping = this.getCategoryMapping(category);
        
        const searchTerm = categoryMapping || category;
        
        if (window.productSearch) {
            window.productSearch.performSearch(searchTerm, true); // true = búsqueda exacta por ID
        } else {
            this.redirectToCatalog(searchTerm);
        }
    }

    getCategoryMapping(category) {
        // Mapeo de categorías del dropdown a IDs exactos que existen en products.json
        // IMPORTANTE: Busca por ID exacto, si no existe, retorna el término tal como está
        const mappings = {
            // MAPEO A IDs EXACTOS DE PRODUCTS.JSON
            'ESCOLAR': 'cuaderno',
            'OFICINA': 'folders', 
            'UNIVERSITARIO': 'cuadernos',
            'ZONA DE LECTURA': 'libros',
            
            // ARTE Y DISEÑO
            'ARTE Y DISEÑO': 'acuarelas',
            'BORRADORES': 'corrector',
            'CORRECTORES': 'corrector',
            'CRAYONES Y ÓLEOS': 'crayones',
            'LÁPICES': 'lapices',
            'MARCADORES': 'marcadores',
            'PLUMONES INDELEBLES': 'plumones',
            'PLUMONES PARA PIZARRA': 'plumones',
            'REGLAS': 'portaminas',
            'TIJERAS': 'tijeras', // No existe, mostrará sin resultados
            
            // ESCRITORIO
            'ARCHIVADORES': 'folders',
            'DISPENSADORES': 'dispensadores', // No existe
            'POSITS': 'posits', // No existe
            'CLIPS Y CHINCHES': 'clips', // No existe
            'PERFORADORAS': 'perforadoras', // No existe
            'ENGRAPADORAS Y GRAPAS': 'engrapadoras', // No existe
            'CINTAS ADHESIVAS': 'cinta adhesiva',
            'ORGANIZADORES DE ESCRITORIO': 'organizadores', // No existe
            
            // MOCHILAS - Buscar por ID exacto (no existen)
            'MOCHILAS': 'mochilas',
            'CARTUCHERAS': 'cartucheras',
            'LONCHERAS': 'loncheras',
            'MALETAS': 'maletas',
            
            // PAPELERIA
            'CARTONES': 'cartones', // No existe
            'CARTULINAS': 'cartulinas', // No existe
            'PAPEL CELOFAN': 'papel celofan', // No existe
            'PAPEL FOTOCOPIA': 'papel',
            'PAPEL FOTOGRAFICO': 'papel fotografico', // No existe
            'PAPELES ADHESIVOS': 'papel colores',
            
            // ARCHIVO
            'CARPETAS Y ARCHIVADORES': 'folders',
            'FOLDERES ESCOLARES': 'folders',
            
            // TECNOLOGIA
            'CALCULADORAS': 'calculadora',
            'ACCESORIOS PARA COMPUTADORA': 'accesorios computadora', // No existe
            'MOUSE Y TECLADOS': 'mouse',
            'CARGADORES': 'cargador',
            'MEMORIAS USB': 'memorias usb', // No existe
            'AUDIFONOS Y PARLANTES': 'audifonos',
            'ACCESORIOS VARIOS': 'funkos',
            
            // BELLEZA - No existen productos
            'PERFUMES': 'perfumes',
            'MAQUILLAJE': 'maquillaje',
            'TINTES': 'tintes',
            'ESPEJOS': 'espejos',
            'CUIDADO PERSONAL': 'cuidado personal',
            
            // LECTURA
            'BIBLIAS': 'biblias', // No existe
            'LIBROS ESCOLARES': 'libros',
            'PLAN LECTOR': 'libros',
            'TEXTOS ESCOLARES': 'libros',
            'DE CULTO': 'libros'
        };

        return mappings[category] || category.toLowerCase();
    }

    redirectToCatalog(searchTerm) {
        // Guardar término de búsqueda en sessionStorage
        sessionStorage.setItem('searchTerm', searchTerm);
        sessionStorage.setItem('exactIdMatch', 'true');
        
        // Redirigir a la página de catálogo con búsqueda exacta
        const catalogUrl = '/html/catalogo.html?search=' + encodeURIComponent(searchTerm) + '&exact=true';
        window.location.href = catalogUrl;
    }

    // Método para reinicializar eventos si el DOM se actualiza
    reinitialize() {
        this.setupDropdownEvents();
    }
}

// Inicializar navegación del dropdown cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Función para inicializar la navegación del dropdown
    function initializeDropdownNavigation() {
        const dropdownNavigation = new DropdownNavigation();
        
        // Hacer disponible globalmente para debugging
        window.dropdownNavigation = dropdownNavigation;
    }
    
    // Si el headernav ya está cargado, inicializar inmediatamente
    if (document.querySelector('.dropdown-content')) {
        initializeDropdownNavigation();
    } else {
        // Esperar a que se dispare el evento de headernav cargado
        document.addEventListener('headernavLoaded', function() {
            setTimeout(initializeDropdownNavigation, 100);
        });
        
        // Fallback: intentar después de un delay
        setTimeout(() => {
            if (!window.dropdownNavigation) {
                initializeDropdownNavigation();
            }
        }, 1000);
    }
});

// Función de debugging global
window.debugDropdown = function() {
    if (window.dropdownNavigation) {
        window.dropdownNavigation.reinitialize();
    }
    
    return {
        dropdownNavigation: window.dropdownNavigation,
        dropdownItems: document.querySelectorAll('.dropdown-content a').length,
        dropdownButtons: document.querySelectorAll('.dropbtn').length,
        productSearch: !!window.productSearch
    };
};

// Función para probar mapeos específicos
window.testDropdownMapping = function(category) {
    if (!window.dropdownNavigation) {
        console.error('dropdownNavigation no disponible');
        return;
    }
    
    const mapping = window.dropdownNavigation.getCategoryMapping(category);
    
    if (window.productSearch && window.productSearch.products) {
        const results = window.productSearch.searchProducts(mapping, true); // true = búsqueda exacta por ID
    }
    
    return mapping;
};



// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DropdownNavigation;
} 