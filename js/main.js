// Основной JavaScript файл для Гида

document.addEventListener('DOMContentLoaded', function() {
    // Бургер-меню
    initBurgerMenu();
    
    // Загрузка данных о существах
    loadCreaturesData();
});

function initBurgerMenu() {
    const burgerMenu = document.getElementById('burgerMenu');
    const navMenu = document.getElementById('navMenu');
    
    if (burgerMenu) {
        burgerMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Анимация бургера
            const spans = this.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Загрузка данных из JSON
async function loadCreaturesData() {
    try {
        const response = await fetch('data/creatures.json');
        const data = await response.json();
        const creatures = data.creatures;
        
        // Определяем текущую страницу
        const currentPage = window.location.pathname.split('/').pop();
        
        // Загружаем карточки для главной страницы
        if (currentPage === 'index.html' || currentPage === '') {
            displayPreviewCards(creatures);
        }
        
        // Загружаем каталог
        if (currentPage === 'catalog.html') {
            displayCatalog(creatures);
            initFilters(creatures);
        }
        
        // Загружаем данные о существе на странице creature.html
        if (currentPage === 'creature.html') {
            const urlParams = new URLSearchParams(window.location.search);
            const creatureId = urlParams.get('id');
            if (creatureId) {
                displayCreature(creatures, creatureId);
            }
        }
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Отображение превью на главной
function displayPreviewCards(creatures) {
    const previewGrid = document.getElementById('preview-grid');
    if (!previewGrid) return;
    
    previewGrid.innerHTML = '';
    
    // Массив с ID существ, которые хочу показать
    const selectedIds = ['kitsune', 'oni', 'raijin', 'shinboku', 'tengu'];
    
    // Фильтрую существа
    const selectedCreatures = creatures.filter(creature => 
        selectedIds.includes(creature.id)
    );
    
    selectedCreatures.forEach(creature => {
        const card = document.createElement('div');
        card.className = 'preview-card';
        card.dataset.creature = creature.id;
        
        card.innerHTML = `
            <div class="preview-card-image">${creature.nameJa}</div>
            <h3>${creature.name}</h3>
            <p>${creature.shortDesc}</p>
            <a href="creature.html?id=${creature.id}" class="btn btn-secondary" >Подробнее</a>
        `;
        
        previewGrid.appendChild(card);
    });
}

// Отображение каталога
function displayCatalog(creatures) {
    const catalogGrid = document.getElementById('catalogGrid');
    if (!catalogGrid) return;
    
    catalogGrid.innerHTML = '';
    
    creatures.forEach(creature => {
        const card = document.createElement('div');
        card.className = 'preview-card';
        card.dataset.creature = creature.id;
        card.dataset.type = creature.type;
        
        card.innerHTML = `
            <div class="preview-card-image">${creature.nameJa}</div>
            <h3>${creature.name}</h3>
            <p class="creature-name-ja">${creature.nameJa}</p>
            <p>${creature.shortDesc}</p>
            <a href="creature.html?id=${creature.id}" class="btn btn-secondary">Подробнее</a>
        `;
        
        catalogGrid.appendChild(card);
    });
    
    // Анимация появления карточек
    animateCards();
}

// Инициализация фильтров
function initFilters(creatures) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.preview-card');
    
    if (filterBtns.length && cards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                
                cards.forEach(card => {
                    if (filter === 'all' || card.dataset.type === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Анимация карточек
function animateCards() {
    const cards = document.querySelectorAll('.preview-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Отображение страницы существа
function displayCreature(creatures, creatureId) {
    const creature = creatures.find(c => c.id === creatureId);
    if (!creature) return;
    
    const creatureContent = document.getElementById('creature-content');
    if (!creatureContent) return;
    
    document.title = `${creature.name} | Японская мифология`;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', `${creature.name} — ${creature.shortDesc}. Узнайте больше о характере, способностях и легендах этого существа.`);
    }
    
    creatureContent.innerHTML = `
        <div class="profile-image">
            <div class="creature-image-large">
                <img src="images/creatures/${creature.image}" alt="${creature.name}">
            </div>
            
            <a href="#" class="btn btn-ar" onclick="openAR('${creature.id}'); return false;">
                <span class="ar-icon">◈</span> Посмотреть в AR
            </a>
            <p class="ar-note">* Дополненная реальность</p>
            </a>
        </div>
        
        <div class="profile-info">
            <h1 class="creature-name">${creature.name} <span class="japanese-name">${creature.nameJa}</span></h1>
            <p class="name-romaji">${creature.nameRomaji}</p>
            
            <div class="creature-description">
                <p>${creature.fullDesc}</p>
            </div>
            
            <div class="characteristics-grid">
                <div class="characteristic-card">
                    <h4>Характер</h4>
                    <p>${creature.characteristics.character}</p>
                </div>
                <div class="characteristic-card">
                    <h4>Обитание</h4>
                    <p>${creature.characteristics.habitat}</p>
                </div>
                <div class="characteristic-card">
                    <h4>Способности</h4>
                    <p>${creature.characteristics.abilities}</p>
                </div>
                <div class="characteristic-card">
                    <h4>Тип</h4>
                    <p>${creature.characteristics.type}</p>
                </div>
            </div>
        </div>
    `;
}

// Функция для просмотра существа в допреальности
window.openAR = function(creatureId) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        // На телефоне: открываем AR-страницу
        window.location.href = `ar.html?id=${creatureId}`;
    } else {
        // На компьютере: показываем QR-код
        showQRCodeForDesktop(creatureId);
    }
};

// Показ QR-кода на компьютере
function showQRCodeForDesktop(creatureId) {
    fetch('data/creatures.json')
        .then(response => response.json())
        .then(data => {
            const creature = data.creatures.find(c => c.id === creatureId);
            if (!creature) return;
            
            const arUrl = `${window.location.origin}/omamori-guide/ar.html?id=${creatureId}`;
            
            const modal = document.createElement('div');
            modal.className = 'qr-modal';
            modal.innerHTML = `
                <div class="paper-texture">
                    <p>Отсканируйте QR-код, чтобы увидеть <strong>${creature.name}</strong> в AR</p>
                    <div id="qrCodeContainer"></div>
                    <p style="color: var(--text-muted); font-size: 12px;">Android: Chrome | iOS: Safari</p>
                    <button class="btn btn-primary" onclick="this.closest('.qr-modal').remove()">Закрыть</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            setTimeout(() => {
                const qrContainer = document.getElementById('qrCodeContainer');
                if (qrContainer && typeof QRCode !== 'undefined') {
                    qrContainer.innerHTML = '';
                    new QRCode(qrContainer, {
                        text: arUrl,
                        width: 220,
                        height: 220,
                        colorDark: "#B22222",
                        colorLight: "transparent",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
            }, 100);
            
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        })
        .catch(error => console.error('Ошибка:', error));
}

// Функция закрытия 
window.closeARModal = function() {
    const modal = document.querySelector('div[style*="z-index: 10000"]');
    if (modal) modal.remove();
};