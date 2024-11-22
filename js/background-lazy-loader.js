// Градиенты для разных типов изображений
const gradients = {
    'modal-background.webp': 'linear-gradient(180deg, #2e0800 0%, #450c00 50%, #2e0800 100%)',
    'page-bg.webp': 'linear-gradient(180deg, #301222 0%, #5a274f 50%, #301222 100%)',
    'left-person.webp': 'linear-gradient(90deg, #301222 0%, #5a274f 50%, #301222 100%)',
    'right-person.webp': 'linear-gradient(270deg, #301222 0%, #5a274f 50%, #301222 100%)'
};

function getGradientByImage(imagePath) {
    const fileName = imagePath.split('/').pop();
    return gradients[fileName] || gradients['page-bg.webp'];
}

function lazyLoadImage(element, imagePath) {
    // Устанавливаем градиент как временный фон
    element.style.backgroundImage = getGradientByImage(imagePath);

    // Создаем новый объект Image для предзагрузки
    const img = new Image();
    img.src = imagePath;

    img.onload = function() {
        // Плавно меняем фон на загруженное изображение
        element.style.transition = 'background-image 0.3s ease-in-out';
        element.style.backgroundImage = `url(${imagePath})`;
        element.classList.add('bg-loaded');
    };
}

// Инициализация ленивой загрузки для элементов
document.addEventListener('DOMContentLoaded', function() {
    // Модальное окно
    const modalContainer = document.querySelector('.modal__container');
    if (modalContainer) {
        lazyLoadImage(modalContainer, 'assets/images/modal-background.webp');
    }

    // Фон страницы
    const bodyWrapper = document.querySelector('.body-wrapper');
    if (bodyWrapper) {
        lazyLoadImage(bodyWrapper, 'assets/images/page-bg.webp');
    }

    // Персонажи
    const leftPerson = document.querySelector('.left__person');
    if (leftPerson) {
        lazyLoadImage(leftPerson, 'assets/images/left-person.webp');
    }

    const rightPerson = document.querySelector('.right__person');
    if (rightPerson) {
        lazyLoadImage(rightPerson, 'assets/images/right-person.webp');
    }
});
