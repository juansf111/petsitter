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
    
});

// Ocultar todas las vistas
function hideAllViews() {
    document.querySelector('#inicio-view').style.display = 'none';
    document.querySelector('#turnos-view').style.display = 'none';
    document.querySelector('#nosotros-view').style.display = 'none';
    document.querySelector('#contacto-view').style.display = 'none';
}

//Mostrar una vista
function loadView(view) {
    hideAllViews();
    document.querySelector(`#${view}-view`).style.display = 'block';
}

//Navegar a una seccion
function navigateTo(view) {
    window.location.hash = view === 'inicio' ? '' : view;
}

