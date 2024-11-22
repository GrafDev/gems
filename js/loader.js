let progressInterval = null;
const progressLine = document.querySelector('.loader__progress-line');
const loader = document.querySelector('.loader');
const bodyWrapper = document.querySelector('.body-wrapper');

function increaseLoaderProgress() {
    let width = 0;
    progressInterval = setInterval(() => {
        if (width >= 99) {
            progressLine.style.width = '100%';
        } else {
            width += 5; // Ускорим прогресс
            progressLine.style.width = width + '%';
        }
    }, 50); // Уменьшим интервал
}

function addLoadedClass() {
    loader.classList.add('is--loaded');
    setTimeout(() => {
        bodyWrapper.classList.add('is--visible');
    }, 100);
}

function setLoaderProgressTo100() {
    progressLine.style.width = '100%';
    clearInterval(progressInterval);
    setTimeout(addLoadedClass, 300);
}

increaseLoaderProgress();

// Ждем только загрузку DOM
document.addEventListener('DOMContentLoaded', setLoaderProgressTo100);

// Страховка, если DOMContentLoaded уже произошел
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setLoaderProgressTo100();
}
