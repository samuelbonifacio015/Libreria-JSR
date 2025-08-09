/*-----------------------------------*\
  #JSR CLUB - JavaScript
\*-----------------------------------*/

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== PRICING TOGGLE FUNCTIONALITY =====
    const pricingToggle = document.getElementById('pricingToggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');
    
    if (pricingToggle) {
        pricingToggle.addEventListener('change', function() {
            if (this.checked) {
                // Show yearly prices
                monthlyPrices.forEach(price => price.style.display = 'none');
                yearlyPrices.forEach(price => price.style.display = 'inline');
            } else {
                // Show monthly prices
                monthlyPrices.forEach(price => price.style.display = 'inline');
                yearlyPrices.forEach(price => price.style.display = 'none');
            }
        });
    }
    
    // ===== FAQ ACCORDION FUNCTIONALITY =====
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for benefit cards
                if (entry.target.classList.contains('benefit-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.benefit-card, .pricing-card, .testimonial-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===== FLOATING CARDS ANIMATION =====
    const floatingCards = document.querySelectorAll('.card-float');
    
    floatingCards.forEach((card, index) => {
        const randomDelay = Math.random() * 2000 + index * 500;
        const randomDuration = Math.random() * 2000 + 4000;
        
        card.style.animationDelay = `${randomDelay}ms`;
        card.style.animationDuration = `${randomDuration}ms`;
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // ===== HERO STATS COUNTER ANIMATION =====
    const statItems = document.querySelectorAll('.stat-item strong');
    
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target >= 1000) {
                element.textContent = Math.floor(current).toLocaleString() + '+';
            } else {
                element.textContent = Math.floor(current) + '%';
            }
        }, 16);
    };
    
    // Trigger counter animation when hero section is in view
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statItems.forEach((stat, index) => {
                    const text = stat.textContent;
                    let target = parseInt(text.replace(/[^\d]/g, ''));
                    
                    setTimeout(() => {
                        animateCounter(stat, target, 2000);
                    }, index * 200);
                });
                
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
    
    // ===== BUTTON CLICK EFFECTS =====
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-plan');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // ===== PARALLAX EFFECT FOR HERO SECTION =====
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroContent && heroVisual) {
            heroContent.style.transform = `translateY(${rate * 0.5}px)`;
            heroVisual.style.transform = `translateY(${rate * 0.3}px)`;
        }
    });
    
    // ===== PRICING CARD HOVER EFFECTS =====
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = '';
            }
        });
    });
    
    // ===== TESTIMONIAL CAROUSEL AUTO-SCROLL =====
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    const highlightTestimonial = () => {
        testimonialCards.forEach((card, index) => {
            if (index === currentTestimonial) {
                card.style.transform = 'scale(1.05)';
                card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                card.style.zIndex = '10';
            } else {
                card.style.transform = '';
                card.style.boxShadow = '';
                card.style.zIndex = '1';
            }
        });
        
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    };
    
    if (testimonialCards.length > 0) {
        setInterval(highlightTestimonial, 4000);
    }
    
    // ===== BENEFIT CARDS TILT EFFECT =====
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    benefitCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * 10;
            const rotateY = (centerX - x) / centerX * 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // ===== SCROLL PROGRESS INDICATOR =====
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(135deg, #19416F 0%, #00AEEF 100%);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    };
    
    createScrollProgress();
    
    // ===== LOADING ANIMATIONS =====
    const addLoadingAnimations = () => {
        const elements = document.querySelectorAll('.hero-content, .hero-visual, .section-title');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    };
    
    // Trigger loading animations
    setTimeout(addLoadingAnimations, 100);
    
    // ===== PLAN SELECTION TRACKING =====
    const planButtons = document.querySelectorAll('.btn-plan');
    
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planName = this.closest('.pricing-card').querySelector('h3').textContent;
            
            // Show selection feedback
            const feedback = document.createElement('div');
            feedback.textContent = `¡Has seleccionado ${planName}!`;
            feedback.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #19416F 0%, #00AEEF 100%);
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                font-weight: 600;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.style.opacity = '1';
            }, 100);
            
            setTimeout(() => {
                feedback.style.opacity = '0';
                setTimeout(() => {
                    feedback.remove();
                }, 300);
            }, 2000);
        });
    });
});

// ===== UTILITY FUNCTIONS =====
const utils = {
    // Throttle function for performance
    throttle: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ===== CSS INJECTION FOR RIPPLE EFFECT =====
const rippleCSS = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style); 