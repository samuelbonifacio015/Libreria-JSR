// Script para el menu móvil

(function() {
    'use strict';
    
    console.log('🔧 Iniciando fix del menú móvil...');
    
    function initializeMobileMenu() {        
        const elements = {
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            mobileNav: document.getElementById('mobileNav'),
            mobileNavClose: document.getElementById('mobileNavClose'),
            mobileOverlay: document.getElementById('mobileOverlay')
        };
        
        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);
            
        if (missingElements.length > 0) {
            return;
        }
        
        // Asegurar que todos los dropdowns estén cerrados por defecto
        const allDropdowns = document.querySelectorAll('.mobile-dropdown');
        allDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        function openMobileMenu() {            
            // Cerrar TODOS los dropdowns antes de abrir el menú
            const allDropdowns = document.querySelectorAll('.mobile-dropdown');
            allDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            elements.mobileNav.classList.add('active');
            elements.mobileOverlay.classList.add('active');
            document.body.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
        }
        
        function closeMobileMenu() {            
            elements.mobileNav.classList.remove('active');
            elements.mobileOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            
            // Cerrar todos los dropdowns al cerrar el menú
            allDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
        
        elements.mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openMobileMenu();
        });
        
        elements.mobileNavClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });
        
        elements.mobileOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && elements.mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Manejar dropdowns
        const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
        dropdownBtns.forEach(btn => {
            // Remover event listeners existentes
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // Agregar nuevo event listener
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = this.closest('.mobile-dropdown');
                const isActive = dropdown.classList.contains('active');
                
                // Cerrar otros dropdowns
                dropdownBtns.forEach(otherBtn => {
                    if (otherBtn !== this) {
                        const otherDropdown = otherBtn.closest('.mobile-dropdown');
                        if (otherDropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    }
                });
                
                // Toggle del dropdown actual
                if (dropdown) {
                    dropdown.classList.toggle('active', !isActive);
                }
            });
        });

        // AGREGAR NAVEGACIÓN POR CATEGORÍAS PARA MENÚ MÓVIL
        setupMobileCategoryNavigation();
    
    }
    
    // Función para configurar la navegación por categorías en móvil
    function setupMobileCategoryNavigation() {
        // Manejar enlaces de categorías principales
        const mobileCategoryLinks = document.querySelectorAll('.mobile-category-link');
        mobileCategoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const category = this.textContent.trim();
                console.log('Categoría móvil seleccionada:', category);
                
                navigateToCategory(category);
                closeMobileMenu();
            });
        });
        
        // Manejar enlaces de subcategorías en dropdowns
        const mobileDropdownLinks = document.querySelectorAll('.mobile-dropdown-content a');
        mobileDropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const category = this.textContent.trim();
                console.log('Subcategoría móvil seleccionada:', category);
                
                navigateToCategory(category);
                closeMobileMenu();
            });
        });
    }
    
    // Navegar a categorías 
    function navigateToCategory(category) {
        console.log('=== NAVEGANDO A CATEGORÍA DESDE MÓVIL ===');
        console.log('Categoría original:', category);
        
        // Excepción para "LOS MÁS VENDIDOS" - ir directamente al catálogo
        if (category === 'LOS MÁS VENDIDOS') {
            console.log('Excepción: LOS MÁS VENDIDOS - redirigiendo directamente al catálogo');
            window.location.href = '/html/catalogo.html';
            return;
        }
        
        // Mapear categorías del dropdown a términos de búsqueda
        const categoryMapping = getCategoryMapping(category);
        console.log('Categoría mapeada:', categoryMapping);
        
        // Navegar a categorías
        const searchTerm = categoryMapping || category;
        console.log('Término de búsqueda final:', searchTerm);
        console.log('window.productSearch disponible:', !!window.productSearch);
        
        if (window.productSearch) {
            console.log('Usando productSearch.performSearch con:', searchTerm, '(búsqueda exacta por ID)');
            window.productSearch.performSearch(searchTerm, true); // true = búsqueda exacta por ID
        } else {
            console.log('productSearch no disponible, usando redirectToCatalog con:', searchTerm);
            redirectToCatalog(searchTerm);
        }
    }
    
    // Mapeo de categorías (mismo que en dropdown.js)
    function getCategoryMapping(category) {
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
            'TIJERAS': 'tijeras',
            
            // ESCRITORIO
            'ARCHIVADORES': 'folders',
            'DISPENSADORES': 'dispensadores',
            'POSITS': 'posits',
            'CLIPS Y CHINCHES': 'clips',
            'PERFORADORAS': 'perforadoras',
            'ENGRAPADORAS Y GRAPAS': 'engrapadoras',
            'CINTAS ADHESIVAS': 'cinta adhesiva',
            'ORGANIZADORES DE ESCRITORIO': 'organizadores',
            
            // MOCHILAS
            'MOCHILAS': 'mochilas',
            'CARTUCHERAS': 'cartucheras',
            'LONCHERAS': 'loncheras',
            'MALETAS': 'maletas',
            
            // PAPELERIA
            'CARTONES': 'cartones',
            'CARTULINAS': 'cartulinas',
            'PAPEL CELOFAN': 'papel celofan',
            'PAPEL FOTOCOPIA': 'papel',
            'PAPEL FOTOGRAFICO': 'papel fotografico',
            'PAPELES ADHESIVOS': 'papel colores',
            
            // ARCHIVO
            'CARPETAS Y ARCHIVADORES': 'folders',
            'FOLDERES ESCOLARES': 'folders',
            
            // TECNOLOGIA
            'CALCULADORAS': 'calculadora',
            'ACCESORIOS PARA COMPUTADORA': 'accesorios computadora',
            'MOUSE Y TECLADOS': 'mouse',
            'CARGADORES': 'cargador',
            'MEMORIAS USB': 'memorias usb',
            'AUDIFONOS Y PARLANTES': 'audifonos',
            'ACCESORIOS VARIOS': 'funkos',
            
            // BELLEZA
            'PERFUMES': 'perfumes',
            'MAQUILLAJE': 'maquillaje',
            'TINTES': 'tintes',
            'ESPEJOS': 'espejos',
            'CUIDADO PERSONAL': 'cuidado personal',
            
            // LECTURA
            'BIBLIAS': 'biblias',
            'LIBROS ESCOLARES': 'libros',
            'PLAN LECTOR': 'libros',
            'TEXTOS ESCOLARES': 'libros',
            'DE CULTO': 'libros'
        };

        return mappings[category] || category.toLowerCase();
    }
    
    function redirectToCatalog(searchTerm) {
        console.log('Redirigiendo al catálogo con término:', searchTerm, '(búsqueda exacta por ID)');
        
        // Guardar término de búsqueda en sessionStorage
        sessionStorage.setItem('searchTerm', searchTerm);
        sessionStorage.setItem('exactIdMatch', 'true');
        
        // Redirigir a la página de catálogo con búsqueda exacta
        const catalogUrl = '/html/catalogo.html?search=' + encodeURIComponent(searchTerm) + '&exact=true';
        window.location.href = catalogUrl;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMobileMenu);
    } else {
        initializeMobileMenu();
    }
    
    document.addEventListener('navbarLoaded', initializeMobileMenu);
    
    setTimeout(initializeMobileMenu, 1000);
    
})();