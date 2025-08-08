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

function renderCarousel() {
  track.innerHTML = "";
  portfolioItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.innerHTML = `
      <div style="position:relative;">
        <img src="${item.image}" alt="${item.title}">
        <div class="category-tag">${item.category}</div>
      </div>
      <div class="card-content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
    track.appendChild(card);
  });
}

function slideCarousel(direction) {
  const totalItems = portfolioItems.length;
  const itemsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  index += direction;
  if (index < 0) index = 0;
  if (index > maxIndex) index = maxIndex;

  const slideWidth = (100 / itemsPerView) + (2 / itemsPerView); // includes gap
  track.style.transform = `translateX(-${index * slideWidth}%)`;
}

// Inicializar carousel
document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  if (track) {
    renderCarousel();
    
    document.querySelector('.carousel-nav.prev').addEventListener('click', () => slideCarousel(-1));
    document.querySelector('.carousel-nav.next').addEventListener('click', () => slideCarousel(1));
  }
});