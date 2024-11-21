# Структура проекта
 Проект задеплоен[https://grafdev.github.io/gems/]
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
│   ├── loader.js
│   └── main.js
├── pages/
│   └── win-button-page.html
├── index.html
├── manifest.json
└── sw.js
# Основные положения
1. Проведен общий рефакторинг.
2. dev-код закомичен и отрефакторен.
3. Разобран style.css по логическим блокам.
4. Скрипты и стили вынесены из index.html
5. Исправлен баг 