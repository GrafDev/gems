// Создаем класс для ленивой загрузки фоновых изображений
class BackgroundLazyLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: '50px 0px',
            threshold: 0.1,
            ...options
        };

        this.loadedImages = new Set();
        this.observer = null;
        this.init();
    }

    init() {
        // Создаем IntersectionObserver только если он поддерживается браузером
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            });
        } else {
            // Для старых браузеров загружаем все изображения сразу
            this.loadAllBackgrounds();
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadBackground(entry.target);
                // Прекращаем наблюдение после загрузки
                this.observer.unobserve(entry.target);
            }
        });
    }

    loadBackground(element) {
        const bgUrl = element.getAttribute('data-bg');
        if (!bgUrl || this.loadedImages.has(bgUrl)) return;

        // Предзагружаем изображение
        const img = new Image();
        img.onload = () => {
            element.style.backgroundImage = `url(${bgUrl})`;
            this.loadedImages.add(bgUrl);
            element.classList.add('bg-loaded');
        };
        img.src = bgUrl;
    }

    observe(elements) {
        if (!elements) return;

        const elementArray = Array.isArray(elements) ? elements : [elements];
        elementArray.forEach(element => {
            if (this.observer) {
                this.observer.observe(element);
            } else {
                this.loadBackground(element);
            }
        });
    }

    loadAllBackgrounds() {
        const elements = document.querySelectorAll('[data-bg]');
        elements.forEach(element => this.loadBackground(element));
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.loadedImages.clear();
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const lazyLoader = new BackgroundLazyLoader();

    // Получаем элементы с фоновыми изображениями
    const bodyWrapper = document.querySelector('.body-wrapper');
    const modalContainer = document.querySelector('.modal__container');

    // Устанавливаем data-bg атрибуты
    if (bodyWrapper) {
        const isMobile = window.innerWidth <= 767;
        const bgImage = isMobile ? 'assets/images/page-bg-mobile.webp' : 'assets/images/page-bg.webp';
        bodyWrapper.setAttribute('data-bg', bgImage);
    }

    if (modalContainer) {
        modalContainer.setAttribute('data-bg', 'assets/images/modal-background.webp');
    }

    // Начинаем наблюдение
    lazyLoader.observe([bodyWrapper, modalContainer]);
});

export default BackgroundLazyLoader;
