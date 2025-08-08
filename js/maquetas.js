//Funcion para carousel de maquetas
const portfolioItems = [
  {
    image: "/img/maquetas/1.jpg",
    title: "Sistema Digestivo",
    category: "Biologia",
    description: "Maqueta interactiva del sistema digestivo"
  },
  {
    image: "/img/maquetas/2.jpg",
    title: "Sunat Tributacion",
    category: "Contabilidad",
    description: "Maqueta interactiva de la tributacion"
  },
  {
    image: "/img/maquetas/3.jpg",
    title: "Alimentos en inglés",
    category: "Inglés",
    description: "Maqueta interactiva de los alimentos en inglés"
  },
  {
    image: "/img/maquetas/4.jpg",
    title: "La neurona",
    category: "Biologia",
    description: "Maqueta interactiva de la neurona"
  },
  {
    image: "/img/maquetas/5.jpg",
    title: "Región Costa del Perú",
    category: "Geografia",
    description: "Maqueta interactiva de la región Costa del Perú"
  }
];

// Variables globales
const track = document.querySelector('.carousel-track');
let currentIndex = 0;
let isTransitioning = false;
let startX = 0;
let currentX = 0;
let isDragging = false;
let startTranslate = 0;
let currentTranslate = 0;
let prevTranslate = 0;

/**
 * Detecta si el dispositivo es móvil
 * @returns {boolean} true si es un dispositivo móvil
 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
}

/**
 * Obtiene la configuración de swipe según el dispositivo
 * @returns {Object} Configuración de swipe
 */
function getSwipeConfig() {
  const isMobile = isMobileDevice();
  return {
    resistance: isMobile ? 0.2 : 0.3, // Menor resistencia en móviles
    threshold: isMobile ? 0.3 : 0.25, // Mayor threshold en móviles
    maxTranslate: isMobile ? 25 : 30, // Menor movimiento máximo en móviles
    transitionDuration: isMobile ? '0.5s' : '0.4s'
  };
}

// ========================================
// FUNCIONES DEL MODAL
// ========================================

/**
 * Crea el modal y lo agrega al DOM
 * @returns {HTMLElement} El elemento modal creado
 */
function createModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'maquetasModal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-image-container">
        <img class="modal-image" src="" alt="">
      </div>
      <div class="modal-info">
        <h3 class="modal-title"></h3>
        <p class="modal-category"></p>
        <p class="modal-description"></p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Configurar event listeners del modal
  setupModalEventListeners(modal);
  
  return modal;
}

/**
 * Configura los event listeners del modal
 * @param {HTMLElement} modal - El elemento modal
 */
function setupModalEventListeners(modal) {
  // Cerrar modal al hacer click fuera del contenido
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Prevenir que se cierre al hacer click en el contenido
  const modalContent = modal.querySelector('.modal-content');
  if (modalContent) {
    modalContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

/**
 * Abre el modal con la información del item
 * @param {Object} item - Objeto con la información del item
 */
function openModal(item) {
  let modal = document.querySelector('#maquetasModal');
  if (!modal) {
    modal = createModal();
  }
  
  // Actualizar contenido del modal
  updateModalContent(modal, item);
  
  // Mostrar modal
  modal.style.display = 'flex';
  document.body.classList.add('modal-active');
  
  // Configurar touch listeners para el modal
  setupModalTouchListeners();
}

/**
 * Actualiza el contenido del modal
 * @param {HTMLElement} modal - El elemento modal
 * @param {Object} item - Objeto con la información del item
 */
function updateModalContent(modal, item) {
  const modalImage = modal.querySelector('.modal-image');
  const modalTitle = modal.querySelector('.modal-title');
  const modalCategory = modal.querySelector('.modal-category');
  const modalDescription = modal.querySelector('.modal-description');

  if (modalImage) modalImage.src = item.image;
  if (modalImage) modalImage.alt = item.title;
  if (modalTitle) modalTitle.textContent = item.title;
  if (modalCategory) modalCategory.textContent = item.category;
  if (modalDescription) modalDescription.textContent = item.description;
}

/**
 * Cierra el modal
 */
function closeModal() {
  const modal = document.querySelector('#maquetasModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-active');
  }
}

// ========================================
// FUNCIONES DEL CAROUSEL
// ========================================

/**
 * Obtiene el número de items por vista según el ancho de pantalla
 * @returns {number} Número de items por vista
 */
function getItemsPerView() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

/**
 * Renderiza el carousel con todos los items
 */
function renderCarousel() {
  if (!track) return;
  
  track.innerHTML = "";
  
  // Duplicar elementos para scroll infinito
  const duplicatedItems = [...portfolioItems, ...portfolioItems, ...portfolioItems];
  
  duplicatedItems.forEach((item, itemIndex) => {
    const card = createCarouselCard(item, itemIndex);
    track.appendChild(card);
  });

  // Configurar posición inicial
  const itemsPerView = getItemsPerView();
  currentIndex = portfolioItems.length;
  updateCarouselPosition();

  // Agregar event listeners para las imágenes
  setupCarouselImageListeners();
  
  // Configurar touch listeners
  setupTouchListeners();
}

/**
 * Crea una tarjeta del carousel
 * @param {Object} item - Objeto con la información del item
 * @param {number} itemIndex - Índice del item
 * @returns {HTMLElement} Elemento de la tarjeta
 */
function createCarouselCard(item, itemIndex) {
  const card = document.createElement('div');
  card.className = 'carousel-card';
  card.innerHTML = `
    <div style="position:relative;">
      <img src="${item.image}" alt="${item.title}" class="carousel-image" data-index="${itemIndex % portfolioItems.length}">
      <div class="category-tag">${item.category}</div>
    </div>
    <div class="card-content">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
  `;
  return card;
}

/**
 * Configura los event listeners para las imágenes del carousel
 */
function setupCarouselImageListeners() {
  const carouselImages = document.querySelectorAll('.carousel-image');
  carouselImages.forEach((img, imgIndex) => {
    img.addEventListener('click', () => {
      const actualIndex = imgIndex % portfolioItems.length;
      openModal(portfolioItems[actualIndex]);
    });
  });
}

/**
 * Actualiza la posición del carousel
 */
function updateCarouselPosition() {
  if (!track) return;
  
  const itemsPerView = getItemsPerView();
  const slideWidth = (100 / itemsPerView) + (2 / itemsPerView);
  const translateX = -(currentIndex * slideWidth);
  
  // Obtener configuración según el dispositivo
  const config = getSwipeConfig();
  track.style.transition = `transform ${config.transitionDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  track.style.transform = `translateX(${translateX}%)`;
}

/**
 * Desliza el carousel en la dirección especificada
 * @param {number} direction - Dirección del deslizamiento (-1: izquierda, 1: derecha)
 */
function slideCarousel(direction) {
  if (isTransitioning) return;
  
  isTransitioning = true;
  currentIndex += direction;
  
  updateCarouselPosition();
  
  // Verificar si necesitamos resetear la posición para scroll infinito
  const itemsPerView = getItemsPerView();
  const totalItems = portfolioItems.length;
  const config = getSwipeConfig();
  
  setTimeout(() => {
    if (currentIndex >= totalItems + itemsPerView) {
      currentIndex = itemsPerView;
      track.style.transition = 'none';
      updateCarouselPosition();
      setTimeout(() => {
        track.style.transition = `transform ${config.transitionDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      }, 10);
    } else if (currentIndex < itemsPerView) {
      currentIndex = totalItems + itemsPerView - 1;
      track.style.transition = 'none';
      updateCarouselPosition();
      setTimeout(() => {
        track.style.transition = `transform ${config.transitionDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      }, 10);
    }
    isTransitioning = false;
  }, parseFloat(config.transitionDuration) * 1000);
}

/**
 * Maneja el redimensionamiento de la ventana
 */
function handleResize() {
  if (!track) return;
  
  const itemsPerView = getItemsPerView();
  currentIndex = Math.max(itemsPerView, currentIndex);
  updateCarouselPosition();
}

// ========================================
// FUNCIONES DE TOUCH/DRAG
// ========================================

/**
 * Configura los event listeners de touch para el carousel
 */
function setupTouchListeners() {
  if (!track) return;
  
  // Touch events
  track.addEventListener('touchstart', handleTouchStart);
  track.addEventListener('touchmove', handleTouchMove);
  track.addEventListener('touchend', handleTouchEnd);
  
  // Mouse events para desktop
  track.addEventListener('mousedown', handleMouseDown);
  track.addEventListener('mousemove', handleMouseMove);
  track.addEventListener('mouseup', handleMouseUp);
  track.addEventListener('mouseleave', handleMouseUp);
  
  // Prevenir selección de texto durante el drag
  track.addEventListener('selectstart', (e) => e.preventDefault());
}

/**
 * Maneja el inicio del touch/drag
 * @param {Event} e - Evento de touch o mouse
 */
function handleTouchStart(e) {
  if (isTransitioning) return;
  
  isDragging = true;
  startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
  startTranslate = currentTranslate;
  
  // Suavizar la transición al inicio
  track.style.transition = 'none';
  track.style.cursor = 'grabbing';
  track.classList.add('dragging');
  
  // Solo prevenir scroll vertical durante el drag en touch, no en mouse
  if (e.type === 'touchstart') {
    // No prevenir por defecto para permitir scroll natural
    // Solo prevenir si hay múltiples toques
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }
}

/**
 * Maneja el movimiento del touch/drag
 * @param {Event} e - Evento de touch o mouse
 */
function handleTouchMove(e) {
  if (!isDragging) return;
  
  currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
  const diff = currentX - startX;
  
  // Obtener configuración según el dispositivo
  const config = getSwipeConfig();
  const adjustedDiff = diff * config.resistance;
  
  currentTranslate = startTranslate + adjustedDiff;
  
  // Limitar el movimiento para evitar que se vaya demasiado lejos
  currentTranslate = Math.max(-config.maxTranslate, Math.min(config.maxTranslate, currentTranslate));
  
  track.style.transform = `translateX(${currentTranslate}%)`;
  
  // Solo prevenir scroll si hay movimiento horizontal significativo
  if (Math.abs(diff) > 15) {
    e.preventDefault();
  }
}

/**
 * Maneja el fin del touch/drag
 * @param {Event} e - Evento de touch o mouse
 */
function handleTouchEnd(e) {
  if (!isDragging) return;
  
  isDragging = false;
  track.style.cursor = 'grab';
  
  // Obtener configuración según el dispositivo
  const config = getSwipeConfig();
  track.style.transition = `transform ${config.transitionDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  track.classList.remove('dragging');
  
  const diff = currentX - startX;
  const threshold = window.innerWidth * config.threshold;
  
  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      slideCarousel(-1); // Swipe right - previous
    } else {
      slideCarousel(1); // Swipe left - next
    }
  } else {
    // Volver a la posición original con transición suave
    updateCarouselPosition();
  }
  
  // Resetear variables de touch después de un breve delay
  const transitionMs = parseFloat(config.transitionDuration) * 1000;
  setTimeout(() => {
    startX = 0;
    currentX = 0;
    startTranslate = 0;
    currentTranslate = 0;
  }, transitionMs);
}

/**
 * Maneja el inicio del mouse drag
 * @param {Event} e - Evento de mouse
 */
function handleMouseDown(e) {
  handleTouchStart(e);
}

/**
 * Maneja el movimiento del mouse drag
 * @param {Event} e - Evento de mouse
 */
function handleMouseMove(e) {
  handleTouchMove(e);
}

/**
 * Maneja el fin del mouse drag
 * @param {Event} e - Evento de mouse
 */
function handleMouseUp(e) {
  handleTouchEnd(e);
}

/**
 * Configura los event listeners de touch para el modal
 */
function setupModalTouchListeners() {
  const modal = document.querySelector('#maquetasModal');
  if (!modal) return;
  
  let modalStartX = 0;
  let modalCurrentX = 0;
  let isModalDragging = false;
  
  modal.addEventListener('touchstart', (e) => {
    modalStartX = e.touches[0].clientX;
    isModalDragging = true;
  });
  
  modal.addEventListener('touchmove', (e) => {
    if (!isModalDragging) return;
    modalCurrentX = e.touches[0].clientX;
  });
  
  modal.addEventListener('touchend', (e) => {
    if (!isModalDragging) return;
    
    isModalDragging = false;
    const diff = modalCurrentX - modalStartX;
    const threshold = window.innerWidth * 0.3; // 30% del ancho de la pantalla
    
    if (Math.abs(diff) > threshold) {
      closeModal();
    }
  });
}

// ========================================
// FUNCIONES DE NAVEGACIÓN
// ========================================

/**
 * Configura los event listeners de navegación
 */
function setupNavigationListeners() {
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => slideCarousel(-1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => slideCarousel(1));
  }
}

/**
 * Configura los event listeners de los botones de acción
 */
function setupActionButtons() {
  const btnSolicitar = document.querySelector('.btn-solicitar');
  const btnEjemplos = document.querySelector('.btn-ejemplos');
  
  if (btnSolicitar) {
    btnSolicitar.addEventListener('click', () => {
      const contactSection = document.getElementById('contact-section');
      if (contactSection) {
        contactSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
  
  if (btnEjemplos) {
    btnEjemplos.addEventListener('click', () => {
      const portfolioSection = document.getElementById('portfolio-section');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
}

// ========================================
// FUNCIONES DEL FORMULARIO WHATSAPP
// ========================================

/**
 * Formatea la fecha para mostrar en el mensaje de WhatsApp
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada como DD/MM/YYYY
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Valida que todos los campos requeridos estén completos
 * @param {Object} formData - Datos del formulario
 * @returns {boolean} true si todos los campos requeridos están completos
 */
function validateForm(formData) {
  const requiredFields = ['name', 'email', 'deadline', 'message'];
  return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
}

/**
 * Valida el formato del email
 * @param {string} email - Email a validar
 * @returns {boolean} true si el email tiene formato válido
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Construye el mensaje para WhatsApp
 * @param {Object} formData - Datos del formulario
 * @returns {string} Mensaje formateado para WhatsApp
 */
function buildWhatsAppMessage(formData) {
  const formattedDate = formatDate(formData.deadline);
  
  // Obtener fecha y hora actual
  const now = new Date();
  const currentDate = now.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const currentTime = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  let message = `*Nueva Solicitud de Maqueta - Librería JSR*%0A%0A`;
  message += `*Nombre:* ${formData.name}%0A`;
  message += `*Email:* ${formData.email}%0A`;
  
  if (formData.phone && formData.phone.trim() !== '') {
    message += `*Teléfono:* ${formData.phone}%0A`;
  }
  
  message += `*Fecha de Entrega:* ${formattedDate}%0A%0A`;
  message += `*Descripción del Proyecto:*%0A${formData.message.replace(/\n/g, '%0A')}%0A%0A`;
  message += `---%0A`;
  message += `*Enviado desde:* Maquetas - Librería JSR%0A`;
  message += `*Fecha y hora de envío:* ${currentDate} a las ${currentTime}`;
  
  return message;
}

/**
 * Abre WhatsApp con el mensaje predefinido
 * @param {string} message - Mensaje formateado para WhatsApp
 */
function openWhatsApp(message) {
  const phoneNumber = '51999451887';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

/**
 * Maneja el envío del formulario
 * @param {Event} e - Evento del formulario
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    deadline: form.deadline.value,
    message: form.message.value.trim()
  };
  
  // Validar campos requeridos
  if (!validateForm(formData)) {
    showFormMessage('Por favor, completa todos los campos requeridos.', 'error');
    return;
  }
  
  // Validar formato del email
  if (!validateEmail(formData.email)) {
    showFormMessage('Por favor, ingresa un email válido.', 'error');
    return;
  }
  
  // Construir mensaje para WhatsApp
  const whatsappMessage = buildWhatsAppMessage(formData);
  
  // Mostrar mensaje de confirmación
  showFormMessage('Redirigiendo a WhatsApp...', 'success');
  
  // Abrir WhatsApp después de un breve delay
  setTimeout(() => {
    openWhatsApp(whatsappMessage);
    
    // Limpiar formulario después de enviar
    form.reset();
    showFormMessage('', '');
  }, 1500);
}

/**
 * Muestra mensajes en el formulario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje ('success', 'error', '')
 */
function showFormMessage(message, type) {
  const messageElement = document.getElementById('formMessage');
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
  }
}

/**
 * Configura los event listeners del formulario
 */
function setupFormListeners() {
  const form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

/**
 * Configura todos los event listeners globales
 */
function setupGlobalEventListeners() {
  // Cerrar modal con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Manejar redimensionamiento
  window.addEventListener('resize', handleResize);
}

// ========================================
// INICIALIZACIÓN
// ========================================

/**
 * Inicializa toda la funcionalidad
 */
function initialize() {
  renderCarousel();
  setupNavigationListeners();
  setupActionButtons();
  setupGlobalEventListeners();
  setupFormListeners();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initialize);