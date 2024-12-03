document.addEventListener('DOMContentLoaded', function() {
    // Slideshow 
    const images = [
        'static/slideshow/1.jpeg',
        'static/slideshow/2.jpeg',
        'static/slideshow/3.jpeg',
        'static/slideshow/4.jpeg'
    ];
    
    const heroImage = document.querySelector('#inicio-view img');
    let currentImage = 0;
    
    setInterval(() => {
        currentImage = (currentImage + 1) % images.length;
        heroImage.src = images[currentImage];
    }, 3000);

    // Inicializacion de flatpickr 
    flatpickr("#date", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        maxDate: new Date().fp_incr(30)
    });

    // Event listener de los botones
    document.querySelector('#inicio').addEventListener('click', () => navigateTo('inicio'));
    document.querySelector('#turnos').addEventListener('click', () => navigateTo('turnos'));
    document.querySelector('#nosotros').addEventListener('click', () => navigateTo('nosotros'));
    document.querySelector('#contacto').addEventListener('click', () => navigateTo('contacto'));
    document.querySelector('#resenas').addEventListener('click', () => navigateTo('resenas'));

    document.querySelector('#booking-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Turno reservado! Te enviaremos la confirmación por email.');
        this.reset();
    });

    // Cambios en URLs al navegar y cargar seccion correspondiente
    window.addEventListener('hashchange', function() {
        const view = window.location.hash.replace('#', '') || 'inicio';
        loadView(view);
    });

    // Valor inicial del hash en URL
    const initialView = window.location.hash.replace('#', '') || 'inicio';
    loadView(initialView);

    // Display reviews when navigating to "reseñas"
    if (window.location.hash.includes('resenas')) {
        displayReviews();
    }
});

// Ocultar todas las vistas
function hideAllViews() {
    document.querySelector('#inicio-view').style.display = 'none';
    document.querySelector('#turnos-view').style.display = 'none';
    document.querySelector('#nosotros-view').style.display = 'none';
    document.querySelector('#contacto-view').style.display = 'none';
    document.querySelector('#resenas-view').style.display = 'none';
}

//Mostrar una vista
function loadView(view) {
    hideAllViews();
    document.querySelector(`#${view}-view`).style.display = 'block';

    // Cargar reseñas si se esta en ese view
    if (view === 'resenas') {
        displayReviews();
    }
}

//Navegar a una seccion
function navigateTo(view) {
    window.location.hash = view === 'inicio' ? '' : view;
}

// Cargar y mostrar reseñas a partir de reviews.json
function displayReviews() {
    fetch('static/reviews.json')
        .then(response => response.json())
        .then(reviewsData => {
            const reviewsContainer = document.getElementById("reviews-container");

            // Limpiar container para evitar inconsistencias
            reviewsContainer.innerHTML = '';

            // Iterar por el json ya cargado (ReviewsData) y generar cards con su data y estrellas)
            reviewsData.forEach(review => {
                // Funcion para generar estrellas
                const generateStarRating = (rating) => {
                    let starsHTML = '';
                    // Full stars
                    for (let i = 0; i < Math.floor(rating); i++) {
                        starsHTML += '<i class="fas fa-star"></i>';
                    }
                    
                    // Half star if decimal part exists
                    if (rating % 1 !== 0) {
                        starsHTML += '<i class="fas fa-star-half-alt"></i>';
                    }
                    
                    // Empty stars to fill up to 5
                    const emptyStars = 5 - Math.ceil(rating);
                    for (let i = 0; i < emptyStars; i++) {
                        starsHTML += '<i class="far fa-star"></i>';
                    }
                    
                    return starsHTML;
                };

                const reviewCard = document.createElement("div");
                reviewCard.classList.add("col-md-4", "mb-4");

                reviewCard.innerHTML = `
                    <div class="resena-card">
                        <img src="${review.image_url}" class="card-img-top rounded-circle" alt="Review by ${review.reviewer}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${review.pet}</h5>
                            <div class="stars mb-2">
                                ${generateStarRating(review.rating)}
                            </div>
                            <p class="card-text">${review.review}</p>
                        </div>
                    </div>
                `;
                reviewsContainer.appendChild(reviewCard);
            });
        })
        .catch(error => {
            console.error('Error loading reviews:', error);
            const reviewsContainer = document.getElementById("reviews-container");
            reviewsContainer.innerHTML = '<p>Error loading reviews. Please try again later.</p>';
        });
}

