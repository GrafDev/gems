// Проверяем, не объявлен ли уже объект backgroundLoader
if (typeof window.backgroundLoader === 'undefined') {
    window.backgroundLoader = {
        gradients: {
            'modal-background.webp': 'linear-gradient(180deg, #2e0800 0%, #450c00 50%, #2e0800 100%)',
            'page-bg.webp': 'linear-gradient(180deg, #301222 0%, #5a274f 50%, #301222 100%)',
            'left-person.webp': 'linear-gradient(90deg, #301222 0%, #5a274f 50%, #301222 100%)',
            'right-person.webp': 'linear-gradient(270deg, #301222 0%, #5a274f 50%, #301222 100%)'
        },

        getGradientByImage(imagePath) {
            const fileName = imagePath.split('/').pop();
            return this.gradients[fileName] || this.gradients['page-bg.webp'];
        },

        lazyLoadImage(element, imagePath) {
            element.style.backgroundImage = this.getGradientByImage(imagePath);

            const img = new Image();
            img.src = imagePath;

            img.onload = () => {
                element.style.transition = 'background-image 0.3s ease-in-out';
                element.style.backgroundImage = `url(${imagePath})`;
                element.classList.add('bg-loaded');
            };
        },

        init() {
            document.addEventListener('DOMContentLoaded', () => {
                const elements = {
                    modal: document.querySelector('.modal__container'),
                    body: document.querySelector('.body-wrapper'),
                    leftPerson: document.querySelector('.left__person'),
                    rightPerson: document.querySelector('.right__person')
                };

                if (elements.modal) {
                    this.lazyLoadImage(elements.modal, 'assets/images/modal-background.webp');
                }
                if (elements.body) {
                    this.lazyLoadImage(elements.body, 'assets/images/page-bg.webp');
                }
                if (elements.leftPerson) {
                    this.lazyLoadImage(elements.leftPerson, 'assets/images/left-person.webp');
                }
                if (elements.rightPerson) {
                    this.lazyLoadImage(elements.rightPerson, 'assets/images/right-person.webp');
                }
            });
        }
    };

    window.backgroundLoader.init();
}
