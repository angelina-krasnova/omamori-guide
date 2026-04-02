// Генерация подвала
function generateFooter() {
    const currentYear = new Date().getFullYear();
    
    return `
    <footer>
        <div class="container">
            <p>© ${currentYear} Гид по японской мифологии</p>
            <p class="footer-note">Производственная практика | Разработчик: Краснова Ангелина</p>
        </div>
    </footer>
    `;
}

// Вставка подвала в документ
document.addEventListener('DOMContentLoaded', function() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = generateFooter();
    }
});