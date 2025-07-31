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
        
        // Remover event listeners existentes para evitar duplicados
        const existingDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
        existingDropdownBtns.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
        
        function openMobileMenu() {            
            elements.mobileNav.classList.add('active');
            elements.mobileOverlay.classList.add('active');
            document.body.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                const navVisible = elements.mobileNav.classList.contains('active');
                const overlayVisible = elements.mobileOverlay.classList.contains('active');
            }, 100);
        }
        
        function closeMobileMenu() {            
            elements.mobileNav.classList.remove('active');
            elements.mobileOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
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
        
        // Manejar dropdowns con lógica mejorada
        const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
        dropdownBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
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
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMobileMenu);
    } else {
        initializeMobileMenu();
    }
    
    document.addEventListener('navbarLoaded', initializeMobileMenu);
    
    setTimeout(initializeMobileMenu, 1000);
    
})(); 