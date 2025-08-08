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
let index = 0;

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
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function renderCarousel() {
  track.innerHTML = "";
  portfolioItems.forEach((item, itemIndex) => {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.innerHTML = `
      <div style="position:relative;">
        <img src="${item.image}" alt="${item.title}" class="carousel-image" data-index="${itemIndex}">
        <div class="category-tag">${item.category}</div>
      </div>
      <div class="card-content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
    track.appendChild(card);
  });

  const carouselImages = document.querySelectorAll('.carousel-image');
  carouselImages.forEach((img, imgIndex) => {
    img.addEventListener('click', () => {
      openModal(portfolioItems[imgIndex]);
    });
  });
}

function slideCarousel(direction) {
  const totalItems = portfolioItems.length;
  const itemsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  index += direction;
  if (index < 0) index = 0;
  if (index > maxIndex) index = maxIndex;

  const slideWidth = (100 / itemsPerView) + (2 / itemsPerView);
  track.style.transform = `translateX(-${index * slideWidth}%)`;
}

document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  if (track) {
    renderCarousel();
    
    document.querySelector('.carousel-nav.prev').addEventListener('click', () => slideCarousel(-1));
    document.querySelector('.carousel-nav.next').addEventListener('click', () => slideCarousel(1));
  }

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
});