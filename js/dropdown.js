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
        // Mapeo de categorías del dropdown a las categorías exactas en products.json
        const mappings = {
            // UTILES
            'ESCOLAR': 'UTILES',
            'OFICINA': 'UTILES',
            'UNIVERSITARIO': 'UTILES',
            'ZONA DE LECTURA': 'UTILES',
            'ARTE Y DISEÑO': 'ARTE Y DISEÑO',
            'BORRADORES': 'UTILES',
            'CORRECTORES': 'CORRECTORES',
            'CRAYONES Y ÓLEOS': 'CRAYONES Y ÓLEOS',
            'LÁPICES': 'LÁPICES',
            'MARCADORES': 'MARCADORES',
            'PLUMONES INDELEBLES': 'PLUMONES INDELEBLES',
            'PLUMONES PARA PIZARRA': 'PLUMONES INDELEBLES',
            'REGLAS': 'UTILES',
            'TIJERAS': 'UTILES',
            
            // ESCRITORIO
            'ARCHIVADORES': 'UTILES',
            'DISPENSADORES': 'UTILES',
            'POSITS': 'UTILES',
            'CLIPS Y CHINCHES': 'UTILES',
            'PERFORADORAS': 'UTILES',
            'ENGRAPADORAS Y GRAPAS': 'UTILES',
            'CINTAS ADHESIVAS': 'CINTAS ADHESIVAS',
            'ORGANIZADORES DE ESCRITORIO': 'UTILES',
            
            // MOCHILAS
            'MOCHILAS': 'UTILES',
            'CARTUCHERAS': 'UTILES',
            'LONCHERAS': 'UTILES',
            'MALETAS': 'UTILES',
            
            // PAPELERIA
            'CARTONES': 'UTILES',
            'CARTULINAS': 'UTILES',
            'PAPEL CELOFAN': 'PAPELES ADHESIVOS',
            'PAPEL FOTOCOPIA': 'PAPEL FOTOCOPIA',
            'PAPEL FOTOGRAFICO': 'PAPEL FOTOCOPIA',
            'PAPELES ADHESIVOS': 'PAPELES ADHESIVOS',
            
            // ARCHIVO
            'CARPETAS Y ARCHIVADORES': 'UTILES',
            'FOLDERES ESCOLARES': 'FOLDERES ESCOLARES',
            
            // TECNOLOGIA
            'CALCULADORAS': 'CALCULADORAS',
            'ACCESORIOS PARA COMPUTADORA': 'TECNOLOGIA',
            'MOUSE Y TECLADOS': 'MOUSE Y TECLADOS',
            'CARGADORES': 'CARGADORES',
            'MEMORIAS USB': 'TECNOLOGIA',
            'AUDIFONOS Y PARLANTES': 'AUDIFONOS Y PARLANTES',
            'ACCESORIOS VARIOS': 'ACCESORIOS VARIOS',
            
            // BELLEZA
            'PERFUMES': 'ACCESORIOS VARIOS',
            'MAQUILLAJE': 'ACCESORIOS VARIOS',
            'TINTES': 'ACCESORIOS VARIOS',
            'ESPEJOS': 'ACCESORIOS VARIOS',
            'CUIDADO PERSONAL': 'ACCESORIOS VARIOS',
            
            // LECTURA
            'BIBLIAS': 'LECTURA',
            'LIBROS ESCOLARES': 'LECTURA',
            'PLAN LECTOR': 'LECTURA',
            'TEXTOS ESCOLARES': 'LECTURA',
            'DE CULTO': 'LECTURA'
        };

        return mappings[category] || category;
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

console.log('Función de debugging disponible: window.debugDropdown()');

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DropdownNavigation;
} 