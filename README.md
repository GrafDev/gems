# Структура проекта
 Проект задеплоен[https://grafdev.github.io/gems/]
## 
```
project/
├── assets/
│   ├── effects/
│   ├── images/
│   └── sound/
├── css/
│   ├── animations.css
│   ├── base.css
│   ├── button.css
│   ├── content-fade.css
│   ├── dev-mode.css
│   ├── layout.css
│   ├── loader.css
│   ├── media.css
│   ├── modal.css
│   ├── slot.css
│   ├── style.css
│   └── wheel.css
├── js/
│   ├── common.js
│   ├── dev-mode.js
│   ├── background-lazy-loader.js
│   ├── ImageGroupsSetup.js
│   ├── index.js
│   └── loader.js
├── pages/
│   └── win-button-page.html
├── index.html
├── manifest.json
└── sw.js
```

# Основные положения
1. Проведен общий рефакторинг.
2. dev-код закомичен и отрефакторен.
3. Разобран style.css по логическим блокам.
4. Скрипты и стили вынесены из index.html
5. Исправлен баг c неисчезновением правой картинки на мобильных экранах
6. Добалвена анимация на появление после loader.
7. Проведена проверка на загрузку при ограниченой скорости: 4G грузит за 1.5 сек. что приемлемо. 
    Основные потребители это бэкграунд. 
8. Сделана ленивая загрузка бэкграундов. грузятся асинхронно появляются постепенно.
9. win-button-page.html , не удалял, так как на нее идет редирект после  "Congratulation".
10. Закомичена проверка на ping, так как она редиректила на "https://linki.group/", зачем я так и не понял. 
