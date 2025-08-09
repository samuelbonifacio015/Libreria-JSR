//Funcion de carousel
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.carousel-dot');

    let currentSlide = 0;
    const totalSlides = slides.length;

    let autoplayInterval;
    const autoplayDelay = 5000;

    function goToSlide(slide) {
        if (slide >= totalSlides) {
            slide = 0;
        } else if (slide < 0) {
            slide = totalSlides - 1;
        }
    
        carousel.style.transform = `translateX(-${slide * 100}%)`;
    
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slide);
        });
    
        currentSlide = slide;
    }
    

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoplay();
        });
    });

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();
});

//Funcion para volver al inicio
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.querySelector('.back-to-top');

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    });
 
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) { 
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
});

//Funcion para el botón flotante de Sobre Nosotros
document.addEventListener('DOMContentLoaded', function() {
    const floatingAboutUs = document.querySelector('.floating-about-us');
    
    if (floatingAboutUs) {
        window.addEventListener('scroll', function() {
            // Mostrar el botón después de desplazarse 400px
            if (window.scrollY > 400) {
                floatingAboutUs.style.opacity = '1';
                floatingAboutUs.style.visibility = 'visible';
            } else {
                floatingAboutUs.style.opacity = '0';
                floatingAboutUs.style.visibility = 'hidden';
            }
        });
    }
});

//Funcion para dar la funcionalidad al menu móvil
document.addEventListener('navbarLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileOverlay = document.getElementById('mobileOverlay');

    // Abrir menú móvil
    if (mobileMenuBtn && mobileNav && mobileOverlay) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileNav.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        });
    }

    // Cerrar menú móvil con botón de cerrar
    if (mobileNavClose && mobileNav && mobileOverlay) {
        mobileNavClose.addEventListener('click', function () {
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll del body
        });
    }

    // Cerrar menú móvil al hacer click en el overlay
    if (mobileOverlay && mobileNav) {
        mobileOverlay.addEventListener('click', function () {
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll del body
        });
    }

    // Cerrar menú al redimensionar la ventana (si se vuelve a desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Funcionalidad de dropdowns móviles
    const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
    
    mobileDropdownBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.parentElement;
            const isActive = dropdown.classList.contains('active');
            
            // Cerrar todos los dropdowns
            mobileDropdownBtns.forEach(otherBtn => {
                otherBtn.parentElement.classList.remove('active');
            });
            
            // Abrir el dropdown clickeado si no estaba activo
            if (!isActive) {
                dropdown.classList.add('active');
            }
        });
    });
});