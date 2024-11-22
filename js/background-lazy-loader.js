// Градиенты для разных типов изображений
const gradients = {
    'modal-background.webp': 'linear-gradient(180deg, #2e0800 0%, #450c00 50%, #2e0800 100%)',
    'page-bg.webp': 'linear-gradient(180deg, #301222 0%, #5a274f 50%, #301222 100%)',
    'left-person.webp': 'linear-gradient(90deg, #301222 0%, #5a274f 50%, #301222 100%)',
    'right-person.webp': 'linear-gradient(270deg, #301222 0%, #5a274f 50%, #301222 100%)'
};

// Порядок загрузки элементов
const loadOrder = [
    { selector: '.body-wrapper', imagePath: 'assets/images/page-bg.webp', priority: 'high' },
    { selector: '.modal__container', imagePath: 'assets/images/modal-background.webp', priority: 'low' },
    { selector: '.left__person', imagePath: 'assets/images/left-person.webp', priority: 'medium' },
    { selector: '.right__person', imagePath: 'assets/images/right-person.webp', priority: 'medium' }
];

function getGradientByImage(imagePath) {
    const fileName = imagePath.split('/').pop();
    return gradients[fileName] || gradients['page-bg.webp'];
}

function lazyLoadImage(element, imagePath, onLoad) {
    // Если это персонаж, сначала скрываем его
    const isPerson = element.classList.contains('left__person') || element.classList.contains('right__person');
    if (isPerson) {
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
    }

    // Устанавливаем градиент как временный фон
    element.style.backgroundImage = getGradientByImage(imagePath);

    // Создаем новый объект Image для предзагрузки
    const img = new Image();
    img.src = imagePath;

    img.onload = function() {
        // Плавно меняем фон на загруженное изображение
        element.style.transition = 'background-image 0.3s ease-in-out, opacity 0.5s ease-in-out';
        element.style.backgroundImage = `url(${imagePath})`;
        element.classList.add('bg-loaded');

        // Если это персонаж, плавно показываем его
        if (isPerson) {
            requestAnimationFrame(() => {
                element.style.visibility = 'visible';
                element.style.opacity = '1';
            });
        }

        if (onLoad) onLoad();
    };
}

// Функция для последовательной загрузки с приоритетами
function loadImagesInOrder() {
    // Сначала загружаем высокоприоритетные элементы
    const highPriority = loadOrder.filter(item => item.priority === 'high');
    const mediumPriority = loadOrder.filter(item => item.priority === 'medium');
    const lowPriority = loadOrder.filter(item => item.priority === 'low');

    // Загружаем высокоприоритетные элементы
    Promise.all(highPriority.map(item => {
        const element = document.querySelector(item.selector);
        return new Promise(resolve => {
            if (element) {
                lazyLoadImage(element, item.imagePath, resolve);
            } else {
                resolve();
            }
        });
    })).then(() => {
        // После загрузки основных элементов начинаем загрузку персонажей
        mediumPriority.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                lazyLoadImage(element, item.imagePath);
            }
        });

        // И в последнюю очередь загружаем низкоприоритетные элементы
        lowPriority.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                lazyLoadImage(element, item.imagePath);
            }
        });
    });
}

// Инициализация ленивой загрузки
document.addEventListener('DOMContentLoaded', loadImagesInOrder);
