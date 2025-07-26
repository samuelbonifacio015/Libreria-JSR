// dropdown.js - Funcionalidad de navegación del dropdown

class DropdownNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.initializeDropdownEvents();
        console.log('Navegación del dropdown inicializada');
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
        
        console.log('Elementos del dropdown encontrados:', dropdownItems.length);
        console.log('Elementos del dropdown:', dropdownItems);

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
                console.log('Categoría seleccionada:', category);
                
                this.navigateToCategory(category);
            });
        });

        // También manejar clics en los botones principales del dropdown
        const dropdownButtons = document.querySelectorAll('.dropbtn');
        console.log('Botones del dropdown encontrados:', dropdownButtons.length);
        
        dropdownButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Solo prevenir el comportamiento por defecto si no hay subcategorías
                const dropdownContent = button.nextElementSibling;
                if (!dropdownContent || !dropdownContent.classList.contains('dropdown-content')) {
                    e.preventDefault();
                    const category = button.textContent.trim();
                    console.log('Categoría principal seleccionada:', category);
                    this.navigateToCategory(category);
                }
            });
        });
    }

    navigateToCategory(category) {
        console.log('=== NAVEGANDO A CATEGORÍA ===');
        console.log('Categoría original:', category);
        
        // Mapear categorías del dropdown a términos de búsqueda
        const categoryMapping = this.getCategoryMapping(category);
        console.log('Categoría mapeada:', categoryMapping);
        
        const searchTerm = categoryMapping || category;
        console.log('Término de búsqueda final:', searchTerm);
        console.log('window.productSearch disponible:', !!window.productSearch);
        
        if (window.productSearch) {
            console.log('Usando productSearch.performSearch con:', searchTerm);
            window.productSearch.performSearch(searchTerm);
        } else {
            console.log('productSearch no disponible, usando redirectToCatalog con:', searchTerm);
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
        console.log('Redirigiendo al catálogo con término:', searchTerm);
        
        // Guardar término de búsqueda en sessionStorage
        sessionStorage.setItem('searchTerm', searchTerm);
        
        // Redirigir a la página de catálogo
        const catalogUrl = '/html/catalogo.html?search=' + encodeURIComponent(searchTerm);
        window.location.href = catalogUrl;
    }

    // Método para reinicializar eventos si el DOM se actualiza
    reinitialize() {
        console.log('Reinicializando eventos del dropdown...');
        this.setupDropdownEvents();
    }
}

// Inicializar navegación del dropdown cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando DropdownNavigation...');
    
    // Función para inicializar la navegación del dropdown
    function initializeDropdownNavigation() {
        const dropdownNavigation = new DropdownNavigation();
        
        // Hacer disponible globalmente para debugging
        window.dropdownNavigation = dropdownNavigation;
        
        console.log('Navegación del dropdown inicializada');
    }
    
    // Si el headernav ya está cargado, inicializar inmediatamente
    if (document.querySelector('.dropdown-content')) {
        console.log('Elementos del dropdown encontrados, inicializando...');
        initializeDropdownNavigation();
    } else {
        // Esperar a que se dispare el evento de headernav cargado
        console.log('Esperando a que el headernav se cargue...');
        document.addEventListener('headernavLoaded', function() {
            console.log('Headernav cargado, inicializando navegación del dropdown...');
            setTimeout(initializeDropdownNavigation, 100);
        });
        
        // Fallback: intentar después de un delay
        setTimeout(() => {
            if (!window.dropdownNavigation) {
                console.log('Fallback: inicializando navegación del dropdown después de delay...');
                initializeDropdownNavigation();
            }
        }, 1000);
    }
});

// Función de debugging global
window.debugDropdown = function() {
    console.log('=== DEBUG DROPDOWN ===');
    console.log('window.dropdownNavigation:', window.dropdownNavigation);
    console.log('Elementos dropdown encontrados:', document.querySelectorAll('.dropdown-content a').length);
    console.log('Botones dropdown encontrados:', document.querySelectorAll('.dropbtn').length);
    console.log('Headernav cargado:', document.getElementById('headernav-placeholder')?.innerHTML?.length > 0);
    console.log('window.productSearch disponible:', !!window.productSearch);
    
    if (window.dropdownNavigation) {
        console.log('Reinicializando eventos del dropdown...');
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
    console.log(`=== PROBANDO MAPEO ===`);
    console.log(`Categoría: "${category}"`);
    console.log(`Mapeo: "${mapping}"`);
    
    if (window.productSearch && window.productSearch.products) {
        const results = window.productSearch.searchProducts(mapping);
        console.log(`Productos encontrados: ${results.length}`);
        results.forEach(p => console.log(`- ${p.productName} (${p.category})`));
    }
    
    return mapping;
};

console.log('Función de debugging disponible: window.debugDropdown()');

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DropdownNavigation;
} 