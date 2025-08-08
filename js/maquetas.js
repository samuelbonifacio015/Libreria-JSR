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

const track = document.querySelector('.carousel-track');
let currentIndex = 0;
let isTransitioning = false;

function createModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close">&times;</button>
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
  return modal;
}

function openModal(item) {
  const modal = document.querySelector('.modal') || createModal();
  const modalImage = modal.querySelector('.modal-image');
  const modalTitle = modal.querySelector('.modal-title');
  const modalCategory = modal.querySelector('.modal-category');
  const modalDescription = modal.querySelector('.modal-description');

  modalImage.src = item.image;
  modalImage.alt = item.title;
  modalTitle.textContent = item.title;
  modalCategory.textContent = item.category;
  modalDescription.textContent = item.description;

  modal.classList.add('active');
  document.body.classList.add('modal-active');
}

function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-active');
  }
}

function getItemsPerView() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function renderCarousel() {
  if (!track) return;
  
  track.innerHTML = "";
  
  // Duplicar elementos para scroll infinito
  const duplicatedItems = [...portfolioItems, ...portfolioItems, ...portfolioItems];
  
  duplicatedItems.forEach((item, itemIndex) => {
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
    track.appendChild(card);
  });

  // Configurar posición inicial
  const itemsPerView = getItemsPerView();
  currentIndex = portfolioItems.length;
  updateCarouselPosition();

  // Agregar event listeners para las imágenes
  const carouselImages = document.querySelectorAll('.carousel-image');
  carouselImages.forEach((img, imgIndex) => {
    img.addEventListener('click', () => {
      const actualIndex = imgIndex % portfolioItems.length;
      openModal(portfolioItems[actualIndex]);
    });
  });
}

function updateCarouselPosition() {
  if (!track) return;
  
  const itemsPerView = getItemsPerView();
  const slideWidth = (100 / itemsPerView) + (2 / itemsPerView);
  const translateX = -(currentIndex * slideWidth);
  
  track.style.transform = `translateX(${translateX}%)`;
}

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

function handleResize() {
  if (!track) return;
  
  const itemsPerView = getItemsPerView();
  currentIndex = Math.max(itemsPerView, currentIndex);
  updateCarouselPosition();
}

document.addEventListener('DOMContentLoaded', function() {
  renderCarousel();
  
  // Event listeners para navegación
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => slideCarousel(-1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => slideCarousel(1));
  }

  // Event listeners para modal
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Event listener para resize
  window.addEventListener('resize', handleResize);
  
  // Auto-play opcional (comentado por defecto)
  // setInterval(() => slideCarousel(1), 5000);
});