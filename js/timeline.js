//Funcion para timeline, carga de DOM
document.addEventListener("DOMContentLoaded", () => {
    const events = document.querySelectorAll(".timeline-event");
    const cardImage = document.querySelector(".timeline-card img");
    const cardTitle = document.querySelector(".card-text h3");
    const cardText = document.querySelector(".card-text p");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    const timelineData = {
        "2005": {
            img: "/img/misc/timeline-1.png",
            title: "GENESIS",
            text: "Librerías JSR nace como un emprendimiento personal del Sr. Jesus Bonifacio con el objetivo de ofrecer un servicio de calidad a la comunidad y de generar un medio de ingresos."
        },
        "2010": {
            img: "/img/misc/timeline-2.jpg",
            title: "EXPANSION",
            text: "Con 5 años activo, JSR empieza a ganar terreno como principal librería de la urbanización."
        },
        "2018": {
            img: "/img/misc/timeline-3.jpg",
            title: "CONSOLIDACION",
            text: "En 2018, JSR se consolida como la librería confiable para los vecinos de la urbanización."
        },
        "2025": {
            img: "/img/misc/timeline-6.jpg",
            title: "FUTURO",
            text: "Expansión internacional y nuevas tecnologías en librerías digitales."
        }
    };

    //Lista de años ordenados y actualización de indice
    const years = Object.keys(timelineData); 
    let currentIndex = 0; 

    //Actualizacion de card con los años y eventos
    function updateCard(year) {
        if (timelineData[year]) {
            cardImage.src = timelineData[year].img;
            cardTitle.textContent = timelineData[year].title;
            cardText.textContent = timelineData[year].text;
        }

        events.forEach(e => e.classList.remove("active"));
        document.querySelector(`.timeline-event[data-year="${year}"]`)?.classList.add("active");

        currentIndex = years.indexOf(year);
    }

    // Evento de clic en los eventos
    events.forEach(event => {
        event.addEventListener("click", function () {
            const year = this.getAttribute("data-year");
            updateCard(year);
        });
    });

    // Evento de clic con btn "prev"
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + years.length) % years.length; 
        updateCard(years[currentIndex]);
    });

    // Evento de clic con btn"next"
    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % years.length; 
        updateCard(years[currentIndex]);
    });

    updateCard(years[0]);
});


//Funcion para despliegue de FAQ
document.addEventListener("DOMContentLoaded", function () {
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(question => {
        question.addEventListener("click", function () {
            let faqItem = this.parentElement; 

            let isActive = faqItem.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach(item => {
                item.classList.remove("active");
            });

            if (!isActive) {
                faqItem.classList.add("active");
            }
        });
    });
});
