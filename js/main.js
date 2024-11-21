import { Slot } from './components/Slot';
import { Loader } from './components/Loader';
import { AnimationImages } from './components/AnimationImages';
import { DevMode } from './dev/DevMode';
import { initializePWA } from './utils/browserUtils';

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация загрузчика
    const loader = new Loader();
    loader.start();

    // Инициализация анимаций
    const animations = new AnimationImages();
    animations.initialize();

    // Инициализация слота
    const slot = new Slot(document.getElementById('slot'), {
        inverted: true,
        onSpinStart: symbols => {},
        onSpinEnd: symbols => {}
    });

    // Инициализация режима разработчика
    if (process.env.NODE_ENV === 'development') {
        const devMode = new DevMode();
    }

    // Инициализация PWA
    initializePWA();
});
