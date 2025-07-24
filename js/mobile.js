// Script para el menú móvil
// Este archivo maneja la funcionalidad del menú hamburguesa

(function() {
    'use strict';
    
    function initializeMobileMenu() {
        // Verificar que estamos en un dispositivo móvil o pantalla pequeña
        if (window.innerWidth > 768) {
            return;
        }
        
        const elements = {
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            mobileNav: document.getElementById('mobileNav'),
            mobileNavClose: document.getElementById('mobileNavClose'),
            mobileOverlay: document.getElementById('mobileOverlay')
        };
        
        // Verificar que todos los elementos necesarios existen
        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);
            
        if (missingElements.length > 0) {
            return;
        }
        
        // Función para abrir el menú
        function openMobileMenu() {
            console.log('Menú móvil abierto');
            
            elements.mobileNav.classList.add('active');
            elements.mobileOverlay.classList.add('active');
            document.body.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
        }
        
        // Función para cerrar el menú
        function closeMobileMenu() {
            elements.mobileNav.classList.remove('active');
            elements.mobileOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
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