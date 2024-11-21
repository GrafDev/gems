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
            width += 2;
            progressLine.style.width = width + '%';
        }
    }, 1000);
}

function addLoadedClass() {
    loader.classList.add('is--loaded');
    // Добавляем небольшую задержку перед показом контента
    setTimeout(() => {
        bodyWrapper.classList.add('is--visible');
    }, 100);
}

function setLoaderProgressTo100() {
    setTimeout(() => {
        progressLine.style.width = '100%';
        clearInterval(progressInterval);
        setTimeout(() => {
            addLoadedClass();
        }, 800)
    }, 600)
}

increaseLoaderProgress();
window.addEventListener('load', setLoaderProgressTo100);
