// Script mejorado para el menú móvil con debugging completo
// Este archivo solucionará definitivamente el problema del menú hamburguesa

(function() {
    'use strict';
    
    console.log('🔧 Iniciando fix del menú móvil...');
    
    function initializeMobileMenu() {
        // Verificar que estamos en un dispositivo móvil o pantalla pequeña
        if (window.innerWidth > 768) {
            console.log('📱 Dispositivo desktop detectado, menú móvil no necesario');
            return;
        }
        
        console.log('📱 Dispositivo móvil detectado, inicializando menú...');
        
        const elements = {
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            mobileNav: document.getElementById('mobileNav'),
            mobileNavClose: document.getElementById('mobileNavClose'),
            mobileOverlay: document.getElementById('mobileOverlay')
        };
        
        console.log('🔍 Elementos encontrados:', {
            mobileMenuBtn: !!elements.mobileMenuBtn,
            mobileNav: !!elements.mobileNav,
            mobileNavClose: !!elements.mobileNavClose,
            mobileOverlay: !!elements.mobileOverlay
        });
        
        // Verificar que todos los elementos necesarios existen
        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);
            
        if (missingElements.length > 0) {
            console.error('❌ Elementos faltantes:', missingElements);
            return;
        }
        
        console.log('✅ Todos los elementos encontrados, configurando eventos...');
        
        // Función para abrir el menú
        function openMobileMenu() {
            console.log('🍔 Abriendo menú móvil...');
            
            elements.mobileNav.classList.add('active');
            elements.mobileOverlay.classList.add('active');
            document.body.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
            
            console.log('✅ Menú móvil abierto exitosamente');
            
            // Verificar que las clases se aplicaron
            setTimeout(() => {
                const navVisible = elements.mobileNav.classList.contains('active');
                const overlayVisible = elements.mobileOverlay.classList.contains('active');
                console.log('🔍 Verificación post-apertura:', {
                    navActive: navVisible,
                    overlayActive: overlayVisible,
                    bodyOverflow: document.body.style.overflow
                });
            }, 100);
        }
        
        // Función para cerrar el menú
        function closeMobileMenu() {
            console.log('❌ Cerrando menú móvil...');
            
            elements.mobileNav.classList.remove('active');
            elements.mobileOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            
            console.log('✅ Menú móvil cerrado exitosamente');
        }
        
        // Event listeners
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
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Cerrar menú al redimensionar la ventana
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && elements.mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Manejar dropdowns móviles
        const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
        dropdownBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.closest('.mobile-dropdown');
                const isActive = dropdown.classList.contains('active');
                
                // Cerrar otros dropdowns
                dropdownBtns.forEach(otherBtn => {
                    if (otherBtn !== this) {
                        otherBtn.closest('.mobile-dropdown').classList.remove('active');
                    }
                });
                
                // Toggle el dropdown actual
                dropdown.classList.toggle('active', !isActive);
            });
        });
        
        console.log('🎉 Menú móvil inicializado correctamente');
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMobileMenu);
    } else {
        initializeMobileMenu();
    }
    
    // También inicializar cuando se cargue el navbar
    document.addEventListener('navbarLoaded', initializeMobileMenu);
    
    // Backup: Inicializar después de un pequeño delay
    setTimeout(initializeMobileMenu, 1000);
    
})(); 