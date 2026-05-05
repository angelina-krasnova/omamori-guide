// Карта мест Японии

let map = null;
let markers = [];
let burgerMenu, navMenu;

// Инициализация карты
function initMap() {
    map = L.map('map').setView([36.2048, 138.2529], 6);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 4
    }).addTo(map);
    
    loadLocations();
}

// Загрузка локаций из JSON
function loadLocations() {
    fetch('data/locations.json')
        .then(response => response.json())
        .then(data => {
            displayMarkers(data.locations);
        })
        .catch(error => console.error('Ошибка загрузки локаций:', error));
}

// Отображение маркеров
function displayMarkers(locations) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    locations.forEach(location => {
        const grayMarker = L.divIcon({
            html: `<div style="background: #8B0000; width: 12px; height: 12px; border-radius: 50%; border: 1px solid #B22222; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16],
            className: 'custom-marker'
        });
        
        const marker = L.marker([location.lat, location.lng], { icon: grayMarker })
            .bindPopup(createPopupContent(location))
            .addTo(map);
        
        markers.push(marker);
    });
}

// Содержимое всплывающего окна
function createPopupContent(location) {
    let creatureLink = '';
    let legendLink = '';
    
    if (location.relatedCreatureId) {
        creatureLink = `<a href="creature.html?id=${location.relatedCreatureId}" class="popup-link">→ Страница существа</a>`;
    }
    
    if (location.relatedLegendId) {
        legendLink = `<a href="legends.html#${location.relatedLegendId}" class="popup-link">→ Читать легенду</a>`;
    }
    
    // Объединяем ссылки
    let linksHtml = '';
    if (creatureLink && legendLink) {
        linksHtml = `<div class="popup-links">${creatureLink}${legendLink}</div>`;
    } else if (creatureLink || legendLink) {
        linksHtml = `<div class="popup-links">${creatureLink || legendLink}</div>`;
    }
    
    return `
        <div class="map-popup">
            <h3 class="popup-title">${location.name}</h3>
            <p class="popup-description">${location.description}</p>
            ${linksHtml}
        </div>
    `;
}

// Функция для временного отключения/включения карты
function setMapInteraction(enable) {
    if (!map) return;
    
    if (enable) {
        // Включаем карту
        if (map.dragging) map.dragging.enable();
        if (map.touchZoom) map.touchZoom.enable();
        if (map.scrollWheelZoom) map.scrollWheelZoom.enable();
        if (map.doubleClickZoom) map.doubleClickZoom.enable();
        if (map.tap) map.tap.enable();
    } else {
        // Отключаем карту
        if (map.dragging) map.dragging.disable();
        if (map.touchZoom) map.touchZoom.disable();
        if (map.scrollWheelZoom) map.scrollWheelZoom.disable();
        if (map.doubleClickZoom) map.doubleClickZoom.disable();
        if (map.tap) map.tap.disable();
    }
}

// Настройка бургер-меню для карты
function setupBurgerForMap() {
    burgerMenu = document.getElementById('burgerMenu');
    navMenu = document.getElementById('navMenu');
    
    if (!burgerMenu || !navMenu) return;
    
    // Убираем старый обработчик, чтобы не было дублирования
    const newBurger = burgerMenu.cloneNode(true);
    burgerMenu.parentNode.replaceChild(newBurger, burgerMenu);
    burgerMenu = newBurger;
    
    burgerMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        navMenu.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            // Когда меню открыто — отключаем карту
            setMapInteraction(false);
            document.body.style.overflow = 'hidden';
            // Поднимаем меню выше карты
            if (navMenu) navMenu.style.zIndex = '10000';
        } else {
            // Когда меню закрыто — включаем карту
            setMapInteraction(true);
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            setMapInteraction(true);
            document.body.style.overflow = '';
        });
    });
}

// Запуск всех инициализаций
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    // Ждём, пока карта полностью инициализируется
    setTimeout(setupBurgerForMap, 300);
});