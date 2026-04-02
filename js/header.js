// Функция для определения активной страницы
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename;
}

// Генерация шапки
function generateHeader() {
    const currentPage = getCurrentPage();
    
    return `
    <div class="red-accent-line"></div>
    
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <img src="images/omamori_black.png" alt="Omamori" class="nav-icon">
                Omamori Guide
            </div>
            <button class="burger-menu" id="burgerMenu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''}>Главная</a></li>
                <li><a href="catalog.html" ${currentPage === 'catalog.html' ? 'class="active"' : ''}>Существа</a></li>
                <li><a href="legends.html" ${currentPage === 'legends.html' ? 'class="active"' : ''}>Сказания</a></li>
                <li><a href="about.html" ${currentPage === 'about.html' ? 'class="active"' : ''}>О проекте</a></li>
            </ul>
        </div>
    </nav>
    `;
}

// Вставка шапки в документ
document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = generateHeader();
    }
});