let contadorCarrito = 0;

function abrirCarrito() {
    alert('Abriendo carrito...');
    
}

function añadirAlCarrito(producto) {
    contadorCarrito++;
    

    const contador = document.querySelector('.carrito-contador');
    if (contador) {
        contador.textContent = contadorCarrito;
    }
    
   
    const carritoBtn = document.querySelector('.carrito-flotante');
    carritoBtn.classList.add('pulso');
    setTimeout(() => {
        carritoBtn.classList.remove('pulso');
    }, 600);
    
    console.log(`${producto} añadido al carrito. Total: ${contadorCarrito}`);
}


const carousels = {};

function initCarousel(carouselId) {
    console.log('Inicializando carrusel:', carouselId);
    
    const container = document.querySelector(`[data-carousel="${carouselId}"]`);
    if (!container) {
        console.error(`No se encontró contenedor para: ${carouselId}`);
        return;
    }
    
    const images = container.querySelectorAll('.carousel-image');
    const totalSlides = images.length;
    
    console.log(`Carrusel ${carouselId} tiene ${totalSlides} imágenes`);
    
    
    if (totalSlides <= 1) {
        container.setAttribute('data-single', 'true');
        console.log(`Carrusel ${carouselId} marcado como single`);
        return;
    }

    carousels[carouselId] = {
        currentSlide: 0,
        totalSlides: totalSlides,
        container: container,
        imagesContainer: container.querySelector('.carousel-images')
    };

  
    createDots(carouselId);
    console.log(`Carrusel ${carouselId} inicializado correctamente`);
}

function createDots(carouselId) {
    const dotsContainer = document.getElementById(`dots-${carouselId}`);
    if (!dotsContainer) {
        console.error(`No se encontró contenedor de puntos: dots-${carouselId}`);
        return;
    }
    
    const totalSlides = carousels[carouselId].totalSlides;
    

    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(carouselId, i);
        dotsContainer.appendChild(dot);
    }
    
    console.log(`Creados ${totalSlides} puntos para ${carouselId}`);
}

function moveSlide(carouselId, direction) {
    console.log(`moveSlide llamado: ${carouselId}, dirección: ${direction}`);
    
    if (!carousels[carouselId]) {
        console.error(`Carrusel ${carouselId} no está inicializado`);
        return;
    }
    
    const carousel = carousels[carouselId];
    const oldSlide = carousel.currentSlide;
    carousel.currentSlide += direction;
    
    if (carousel.currentSlide >= carousel.totalSlides) {
        carousel.currentSlide = 0;
    } else if (carousel.currentSlide < 0) {
        carousel.currentSlide = carousel.totalSlides - 1;
    }
    
    console.log(`Cambiando de slide ${oldSlide} a ${carousel.currentSlide}`);
    updateCarousel(carouselId);
}

function goToSlide(carouselId, slideIndex) {
    console.log(`goToSlide: ${carouselId}, slide: ${slideIndex}`);
    
    if (!carousels[carouselId]) {
        console.error(`Carrusel ${carouselId} no está inicializado`);
        return;
    }
    
    carousels[carouselId].currentSlide = slideIndex;
    updateCarousel(carouselId);
}

function updateCarousel(carouselId) {
    const carousel = carousels[carouselId];
    const translateX = -carousel.currentSlide * 100;
    
    console.log(`Actualizando carrusel ${carouselId}: translateX(${translateX}%)`);
    
    if (carousel.imagesContainer) {
        carousel.imagesContainer.style.transform = `translateX(${translateX}%)`;
    } else {
        console.error(`No se encontró imagesContainer para ${carouselId}`);
    }
    
   
    const dots = document.querySelectorAll(`#dots-${carouselId} .dot`);
    dots.forEach((dot, index) => {
        if (index === carousel.currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando carruseles...');
    
    const allCarousels = document.querySelectorAll('[data-carousel]');
    console.log(`Encontrados ${allCarousels.length} carruseles`);
    
    allCarousels.forEach(carousel => {
        const carouselId = carousel.getAttribute('data-carousel');
        initCarousel(carouselId);
    });
    
    console.log('Carruseles inicializados:', Object.keys(carousels));
});


function testCarousel(carouselId) {
    console.log('=== TEST CARRUSEL ===');
    console.log('ID:', carouselId);
    console.log('Datos del carrusel:', carousels[carouselId]);
    
    if (carousels[carouselId]) {
        console.log('Probando movimiento...');
        moveSlide(carouselId, 1);
    }
}

function debugPuntos() {
    const allDots = document.querySelectorAll('.carousel-dots');
    console.log('=== DEBUG PUNTOS ===');
    
    allDots.forEach((dotContainer, index) => {
        console.log(`Contenedor ${index}:`);
        console.log('- ID:', dotContainer.id);
        console.log('- Padre:', dotContainer.parentElement.getAttribute('data-carousel'));
        console.log('- Puntos dentro:', dotContainer.querySelectorAll('.dot').length);
        console.log('---');
    });
}


document.addEventListener('DOMContentLoaded', function() {

  
    setTimeout(debugPuntos, 1000);
});

function initProductCardLinks() {
  const cards = document.querySelectorAll('.producto-card[data-url]');
  cards.forEach(card => {
    
    card.classList.add('card-clickable');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');
    const name = card.querySelector('.producto-nombre')?.textContent?.trim() || 'producto';
    card.setAttribute('aria-label', `Ver ${name}`);

 
    card.addEventListener('click', (e) => {

      if (e.target.closest('.btn-añadir, .carousel-btn, .carousel-dots')) return;
      const url = card.dataset.url;
      if (url) window.location.href = url;
    });


    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = card.dataset.url;
        if (url) window.location.href = url;
      }
    });
  });


  document.querySelectorAll('.btn-añadir').forEach(btn => {
    btn.addEventListener('click', (e) => e.stopPropagation());
  });
  
  document.querySelectorAll('.carousel-btn, .carousel-dots').forEach(el => {
    el.addEventListener('click', (e) => e.stopPropagation());
  });
}


document.addEventListener('DOMContentLoaded', initProductCardLinks);

