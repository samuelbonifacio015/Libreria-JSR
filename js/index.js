//Funcion de carousel
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

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

    nextBtn.addEventListener('click', () =>{
        nextSlide();
        resetAutoplay();
    });

    prevBtn.addEventListener('click', () =>{
        prevSlide();
        resetAutoplay();
    });

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

//Funcion para dar la funcionalidad al menu (FUNCIONALIDAD PENDIENTE)
document.getElementById('hamburgerMenu').addEventListener('click', function () {
    document.getElementById('mobileNav').classList.add('active');
  });
  
  document.getElementById('mobileNavClose').addEventListener('click', function () {
    document.getElementById('mobileNav').classList.remove('active');
  });
  