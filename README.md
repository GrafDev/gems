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
2. dev-код убран, в prod не должно быть
3. Разобран style.css по логическим блокам.
4. Скрипты и стили вынесены из index.html
5. Исправлен баг c неисчезновением правой картинки на мобильных экранах
6. Добалвена анимация на появление после loader.
7. Проведена проверка на загрузку при ограниченой скорости: 4G грузит за 1.5 сек. что приемлемо. 3G грузит 10секунд.
    Основные потребители это бэкграунд. Решение есть, сделать их загрузку lazy. Если необходимо могу сделать. Скрипты грузятся быстро их не много сплитить их не вижу смысла. Но опять же если вклчить перфекционзим, то можно и засплитить.
8. win-button-page.html , не удалял, так как на нее идет редирект после  "Congratulation".
