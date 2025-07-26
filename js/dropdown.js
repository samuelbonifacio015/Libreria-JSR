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
        console.log('Navegando a categoría:', category);
        
        // Mapear categorías del dropdown a términos de búsqueda
        const categoryMapping = this.getCategoryMapping(category);
        
        if (categoryMapping) {
            // Usar la funcionalidad de búsqueda existente
            if (window.productSearch) {
                window.productSearch.performSearch(categoryMapping);
            } else {
                // Si no está disponible, redirigir directamente
                this.redirectToCatalog(categoryMapping);
            }
        } else {
            // Si no hay mapeo específico, usar la categoría tal como está
            if (window.productSearch) {
                window.productSearch.performSearch(category);
            } else {
                this.redirectToCatalog(category);
            }
        }
    }

    getCategoryMapping(category) {
        // Mapeo de categorías del dropdown a términos de búsqueda más específicos
        const mappings = {
            // UTILES
            'ESCOLAR': 'útiles escolares',
            'OFICINA': 'útiles oficina',
            'UNIVERSITARIO': 'útiles universitarios',
            'ZONA DE LECTURA': 'útiles lectura',
            'ARTE Y DISEÑO': 'arte diseño',
            'BORRADORES': 'borradores',
            'CORRECTORES': 'correctores',
            'CRAYONES Y ÓLEOS': 'crayones óleos',
            'LÁPICES': 'lápices',
            'MARCADORES': 'marcadores',
            'PLUMONES INDELEBLES': 'plumones indelebles',
            'PLUMONES PARA PIZARRA': 'plumones pizarra',
            'REGLAS': 'reglas',
            'TIJERAS': 'tijeras',
            
            // ESCRITORIO
            'ARCHIVADORES': 'archivadores',
            'DISPENSADORES': 'dispensadores',
            'POSITS': 'posits',
            'CLIPS Y CHINCHES': 'clips chinches',
            'PERFORADORAS': 'perforadoras',
            'ENGRAPADORAS Y GRAPAS': 'engrapadoras grapas',
            'CINTAS ADHESIVAS': 'cintas adhesivas',
            'ORGANIZADORES DE ESCRITORIO': 'organizadores escritorio',
            
            // MOCHILAS
            'MOCHILAS': 'mochilas',
            'CARTUCHERAS': 'cartucheras',
            'LONCHERAS': 'loncheras',
            'MALETAS': 'maletas',
            
            // PAPELERIA
            'CARTONES': 'cartones',
            'CARTULINAS': 'cartulinas',
            'PAPEL CELOFAN': 'papel celofán',
            'PAPEL FOTOCOPIA': 'papel fotocopia',
            'PAPEL FOTOGRAFICO': 'papel fotográfico',
            'PAPELES ADHESIVOS': 'papeles adhesivos',
            
            // ARCHIVO
            'CARPETAS Y ARCHIVADORES': 'carpetas archivadores',
            'FOLDERES ESCOLARES': 'folders escolares',
            
            // TECNOLOGIA
            'CALCULADORAS': 'calculadoras',
            'ACCESORIOS PARA COMPUTADORA': 'accesorios computadora',
            'MOUSE Y TECLADOS': 'mouse teclados',
            'CARGADORES': 'cargadores',
            'MEMORIAS USB': 'memorias usb',
            'AUDIFONOS Y PARLANTES': 'audífonos parlantes',
            'ACCESORIOS VARIOS': 'accesorios varios',
            
            // BELLEZA
            'PERFUMES': 'perfumes',
            'MAQUILLAJE': 'maquillaje',
            'TINTES': 'tintes',
            'ESPEJOS': 'espejos',
            'CUIDADO PERSONAL': 'cuidado personal',
            
            // LECTURA
            'BIBLIAS': 'biblias',
            'LIBROS ESCOLARES': 'libros escolares',
            'PLAN LECTOR': 'plan lector',
            'TEXTOS ESCOLARES': 'textos escolares',
            'DE CULTO': 'libros culto'
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

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DropdownNavigation;
} 