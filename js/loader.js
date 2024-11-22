// Проверяем, не объявлены ли уже переменные
if (typeof window.loaderProgress === 'undefined') {
    window.loaderProgress = {
        interval: null,
        line: document.querySelector('.loader__progress-line'),
        loader: document.querySelector('.loader'),
        bodyWrapper: document.querySelector('.body-wrapper'),

        increaseProgress() {
            let width = 0;
            this.interval = setInterval(() => {
                if (width >= 99) {
                    this.line.style.width = '100%';
                } else {
                    width += 5;
                    this.line.style.width = width + '%';
                }
            }, 50);
        },

        addLoadedClass() {
            this.loader.classList.add('is--loaded');
            setTimeout(() => {
                this.bodyWrapper.classList.add('is--visible');
            }, 100);
        },

        setProgressTo100() {
            this.line.style.width = '100%';
            clearInterval(this.interval);
            setTimeout(() => this.addLoadedClass(), 300);
        },

        init() {
            this.increaseProgress();

            // Ждем загрузку DOM
            document.addEventListener('DOMContentLoaded', () => this.setProgressTo100());

            // Страховка, если DOMContentLoaded уже произошел
            if (document.readyState === 'interactive' || document.readyState === 'complete') {
                this.setProgressTo100();
            }
        }
    };

    window.loaderProgress.init();
}
