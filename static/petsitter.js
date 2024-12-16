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

    

    // Event listener de los botones
    document.querySelector('#inicio').addEventListener('click', () => navigateTo('inicio'));
    document.querySelector('#turnos').addEventListener('click', () => navigateTo('turnos'));
    document.querySelector('#nosotros').addEventListener('click', () => navigateTo('nosotros'));
    document.querySelector('#contacto').addEventListener('click', () => navigateTo('contacto'));
    document.querySelector('#resenas').addEventListener('click', () => navigateTo('resenas'));

    // Formulario de reserva
    // Inizializar flatpickr
    flatpickr("#date", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        maxDate: new Date().fp_incr(60)
    });

    // Seleccion de tarjetas de servicios
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceTypeInput = document.getElementById('service-type');

    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            card.classList.toggle('selected');
            const serviceType = card.dataset.service;
            const serviceTypeInput = document.getElementById('service-type');
            
            // Update the hidden input with the selected service types
            const selectedServices = Array.from(document.querySelectorAll('.service-card.selected'))
                .map(card => card.dataset.service);
            serviceTypeInput.value = selectedServices.join(', '); // Store the selected services
        });
    });

   // Manejar el envio del formulario de reserva
   document.querySelector('#booking-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const petName = document.getElementById('pet-name').value.trim();
        const selectedDate = document.getElementById('date').value.trim();
        const selectedServices = serviceTypeInput.value;

        // Validacion del formulario
        if (!selectedServices) {
            alert('Por favor, selecciona al menos un servicio.');
            return;
        }

        if (!selectedDate) {
            alert('Por favor, selecciona una fecha y hora.');
            return;
        }

        // Crear el objeto de la reservacion a guardar
        const reservation = {
            petName: petName,
            selectedDate: selectedDate,
            selectedServices: selectedServices
        };
        //logear para debug
        console.log("Guardando reserva:")
        console.log(reservation)

        // Fetchear reservaciones existentes y añadir nueva antes de guardar
        const existingReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        existingReservations.push(reservation);
        localStorage.setItem('reservations', JSON.stringify(existingReservations));

        // Mostrar mensaje de confirmacion de reserva
        const confirmationMessage = document.getElementById('confirmation-message');
        confirmationMessage.innerHTML = `
            <div class="alert custom-alert">
                <strong>¡Reserva confirmada!</strong><br>
                Mascota: <strong>${petName}</strong><br>
                Servicios: <strong>${selectedServices}</strong><br>
                Fecha y hora: <strong>${selectedDate}</strong>
            </div>
        `;

        // Resetear el formulario y deseleccionar los servicios
        this.reset();
        serviceCards.forEach(c => c.classList.remove('selected')); // Fix to clear selected services
        serviceTypeInput.value = ''; // Ensure the input value resets

        // Mostrar mensaje de reservas previas
        showPreviousReservationsMessage();
    });


    window.addEventListener('load', function() {
        // Fetchear todas las reservas al cargar la pagina
        const existingReservations = JSON.parse(localStorage.getItem('reservations')) || [];
    
        // Mostrar en consola para debug
        if (existingReservations.length > 0) {
            console.log('Existing Reservations:', existingReservations);
        } else {
            console.log('No existing reservations found.');
        }
    });
    

 
    // Cambios en URLs al navegar y cargar seccion correspondiente
    window.addEventListener('hashchange', function() {
        const view = window.location.hash.replace('#', '') || 'inicio';
        loadView(view);
    });

    // Valor inicial del hash en URL
    const initialView = window.location.hash.replace('#', '') || 'inicio';
    loadView(initialView);

    // Mostrar reseñas al ir a la seccion de reseñas
    if (window.location.hash.includes('resenas')) {
        displayReviews();
    }
});

function showPreviousReservationsMessage() {
    const previousReservationsMessage = document.getElementById('previous-reservations');
    const previousReservations = JSON.parse(localStorage.getItem('reservations')) || [];

    console.log('Existing Reservations:', previousReservations);  // Debugging

    if (previousReservations.length > 0) {
        previousReservationsMessage.style.display = 'inline'; // Show the message
    } else {
        previousReservationsMessage.style.display = 'none'; // Hide if no reservations
    }
}

// Handle the "Tienes reservas previas" click event
document.getElementById('previous-reservations').addEventListener('click', function() {
    const previousReservations = JSON.parse(localStorage.getItem('reservations')) || [];
    displayReservationPopup(previousReservations);
});

// Function to display the popup with reservation details
function displayReservationPopup(reservations) {
    let popupContent = '<h3>Reservas previas</h3><ul>';

    reservations.forEach((reservation, index) => {
        popupContent += `
            <li data-index="${index}">
                <strong>Mascota:</strong> ${reservation.petName}<br>
                <strong>Servicios:</strong> ${reservation.selectedServices}<br>
                <strong>Fecha y Hora:</strong> ${reservation.selectedDate}<br>
                <button class="delete-reservation-btn btn btn-danger btn-sm mt-2">Eliminar</button>
            </li>
            <hr>
        `;
    });

    popupContent += '</ul>';

    // Create the modal
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            ${popupContent}
        </div>
    `;

    // Append modal to the body
    document.body.appendChild(modal);

    // Add event listener to close the modal
    modal.querySelector('.close-btn').addEventListener('click', function () {
        modal.remove();
    });

    // Add event listeners to delete buttons
    modal.querySelectorAll('.delete-reservation-btn').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.closest('li').dataset.index; // Get the index from the list item
            deleteReservation(index, modal);
        });
    });

    // Display the modal
    modal.style.display = 'Flex';
}

// Function to delete a reservation
function deleteReservation(index, modal) {
    // Fetch reservations from localStorage
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    
    // Remove the selected reservation
    reservations.splice(index, 1);

    // Update localStorage
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // Refresh the modal content or close it if no reservations remain
    if (reservations.length > 0) {
        modal.remove(); // Remove the current modal
        displayReservationPopup(reservations); // Reload with updated reservations
    } else {
        modal.remove(); // Close the modal
        showPreviousReservationsMessage(); // Update the "Previous Reservations" message visibility
    }
}



// Check for previous reservations on page load and show the message if needed
window.addEventListener('load', function() {
    showPreviousReservationsMessage();
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

//Funcion para mostrar todas las reviews del JSON
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

                // Remover slash inicial de la URL para evitar problemas con Github pages
                const fixedImageUrl = review.image_url.startsWith('/') ? review.image_url.slice(1) : review.image_url;

                const reviewCard = document.createElement("div");
                reviewCard.classList.add("col-md-4", "mb-4");

                reviewCard.innerHTML = `
                    <div class="resena-card">
                        <div class="stars mb-2">
                            ${generateStarRating(review.rating)}
                        </div>
                        <img src="${fixedImageUrl}" class="card-img-top rounded-circle" alt="Review by ${review.reviewer}">
                        <div class="card-body text-center">
                            <h3 class="card-title">${review.reviewer}</h3>
                            <h5 class="card-title">
                                <i class="fas fa-paw paw-icon-before"></i>
                                ${review.pet}
                                <i class="fas fa-paw paw-icon-after"></i>
                            </h5>
                            <p class="card-text">${review.review}</p>
                        </div>
                    </div>
                `;
                reviewsContainer.appendChild(reviewCard);
            });
        });
}


