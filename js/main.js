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
            <div class="preview-card-image" style="background: linear-gradient(135deg, #B22222, #8B0000);">${creature.nameJa}</div>
            <h3>${creature.name}</h3>
            <p>${creature.shortDesc}</p>
            <a href="creature.html?id=${creature.id}" class="btn btn-secondary" style="margin-top: 15px;">Подробнее</a>
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
            <div class="preview-card-image" style="background: linear-gradient(135deg, #B22222, #8B0000);">${creature.nameJa}</div>
            <h3>${creature.name}</h3>
            <p class="creature-name-ja">${creature.nameJa}</p>
            <p>${creature.shortDesc}</p>
            <a href="creature.html?id=${creature.id}" class="btn btn-secondary" style="margin-top: 15px;">Подробнее</a>
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
                <img src="images/creatures/${creature.image}" alt="${creature.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 24px;">
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

// Функция для просмотра изображения в полном размере которую я заменю на функцию для просмотра в допреальности
window.openAR = function(creatureId) {
    // Сначала получаем данные о существе, чтобы узнать имя файла
    fetch('data/creatures.json')
        .then(response => response.json())
        .then(data => {
            const creature = data.creatures.find(c => c.id === creatureId);
            if (creature) {
                const imageUrl = `images/creatures/${creature.image}`;
                
                // Создаем модальное окно для просмотра изображения
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    cursor: pointer;
                `;
                
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = creature.name;
                img.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                    border-radius: 8px;
                `;
                
                modal.appendChild(img);
                
                // Закрытие по клику
                modal.addEventListener('click', function() {
                    document.body.removeChild(modal);
                });
                
                document.body.appendChild(modal);
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки изображения:', error);
            alert('Не удалось загрузить изображение');
        });
};