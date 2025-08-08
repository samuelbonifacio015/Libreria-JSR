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
  
  setTimeout(() => {
    if (currentIndex >= totalItems + itemsPerView) {
      currentIndex = itemsPerView;
      track.style.transition = 'none';
      updateCarouselPosition();
      setTimeout(() => {
        track.style.transition = 'transform 0.5s ease';
      }, 10);
    } else if (currentIndex < itemsPerView) {
      currentIndex = totalItems + itemsPerView - 1;
      track.style.transition = 'none';
      updateCarouselPosition();
      setTimeout(() => {
        track.style.transition = 'transform 0.5s ease';
      }, 10);
    }
    isTransitioning = false;
  }, 500);
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
// EVENT LISTENERS GLOBALES
// ========================================

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
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initialize);