// Используем IIFE для изоляции кода
(function() {
    // Проверяем, не инициализирован ли уже слот
    if (window.slotInstance) {
        return;
    }

    const symbolCache = {};

    class SlotSymbol {
        constructor(symbolId = SlotSymbol.getRandomSymbol()) {
            this.id = symbolId;
            this.templatePath = document.getElementById('reels')?.getAttribute('data-template') || 'default-template';

            if (symbolCache[symbolId]) {
                this.img = symbolCache[symbolId].cloneNode();
            } else {
                this.img = new Image();
                this.img.src = 'assets/' + this.templatePath + '/' + symbolId + '.webp';
                this.img.alt = 'icon-' + symbolId;
                symbolCache[symbolId] = this.img;
            }
        }

        static preload() {
            SlotSymbol.availableSymbols.forEach(symbol => new SlotSymbol(symbol));
        }

        static get availableSymbols() {
            return ['1', '2', '3', '4', '5', '6', 'win'];
        }

        static getRandomSymbol() {
            const symbols = this.availableSymbols;
            if (symbols.length === 0) {
                console.warn('No symbols available');
                return null;
            }
            return symbols[Math.floor(Math.random() * symbols.length)];
        }

        static getSymbolByIndex(index) {
            if (index >= this.availableSymbols.length) {
                console.warn('Invalid number for win line: ', index);
                return this.availableSymbols[0];
            }
            return this.availableSymbols[index];
        }
    }

    class Reel {
        constructor(reelContainer, index, initialSymbols) {
            this.reelContainer = reelContainer;
            this.reelIndex = index;
            this.symbolContainer = document.createElement('div');
            this.symbolContainer.classList.add('icons');
            this.reelContainer.appendChild(this.symbolContainer);

            this.animation = this.symbolContainer.animate([
                { top: 0, filter: 'blur(2px)' },
                { filter: 'blur(0)', offset: 0.5 },
                {
                    top: `calc((${10 * Math.pow(this.spinDuration, 2)} / 3) * -100% - (${10 * Math.pow(this.spinDuration, 2)} * 3px))`,
                    filter: 'blur(2px)'
                }
            ], {
                duration: 1000 * this.spinDuration,
                easing: 'ease-in-out'
            });

            this.animation.cancel();

            if (initialSymbols) {
                initialSymbols.forEach(symbol =>
                    this.symbolContainer.appendChild(new SlotSymbol(symbol).img)
                );
            }
        }

        get spinDuration() {
            return 1 + Math.pow(this.reelIndex / 2, 2);
        }

        addSymbols(nextSymbols) {
            const fragment = document.createDocumentFragment();
            const totalSymbols = 10 * Math.pow(this.spinDuration, 2);

            for (let i = 3; i < 3 + totalSymbols; i++) {
                const isLastSymbols = i >= totalSymbols - 2;
                const symbolIndex = i - totalSymbols;
                const symbol = new SlotSymbol(isLastSymbols ? nextSymbols[symbolIndex] : undefined);
                fragment.appendChild(symbol.img);
            }
            this.symbolContainer.appendChild(fragment);
        }

        playSpinSound() {
            const sound = new Audio('assets/sound/start-sound.mp3');
            sound.muted = false;
            sound.currentTime = 0.1;
            sound.play().catch(error => {
                console.warn('Error playing spin sound:', error);
            });
        }

        spin() {
            const animationComplete = new Promise(resolve => this.animation.onfinish = resolve);
            const timeoutComplete = new Promise(resolve =>
                setTimeout(resolve, 1000 * this.spinDuration)
            );

            this.animation.cancel();
            this.animation.play();

            return Promise.race([animationComplete, timeoutComplete])
                .then(() => {
                    if (this.animation.playState !== 'finished') {
                        this.animation.finish();
                    }
                    this.playSpinSound();

                    const extraSymbols = this.symbolContainer.children.length - 3;
                    for (let i = 0; i < extraSymbols; i++) {
                        this.symbolContainer.firstChild.remove();
                    }
                });
        }
    }

    class Slot {
        constructor(container, options = {}) {
            if (!container) {
                console.error('Slot container not found');
                return;
            }

            SlotSymbol.preload();

            this.isMobile = window.innerWidth <= 991;
            this.spinCounter = 0;

            this.desktopSymbolsFirst = [
                ["1", "6", "2"], ["3", "1", "2"],
                ["win", "4", "win"], ["6", "2", "1"],
                ["win", "5", "6"]
            ];

            this.desktopSymbolsSecond = [
                ["1", "6", "1"], ["1", "1", "win"],
                ["win", "3", "4"], ["win", "5", "3"],
                ["1", "2", "6"]
            ];

            this.mobileSymbolsFirst = [
                ["1", "2", "3"],
                ["4", "win", "6"],
                ["1", "win", "4"]
            ];

            this.mobileSymbolsSecond = [
                ["1", "6", "4"],
                ["1", "win", "2"],
                ["win", "3", "6"]
            ];

            this.currentSymbols = this.isMobile ?
                this.mobileSymbolsFirst :
                this.desktopSymbolsFirst;

            this.nextSymbols = this.isMobile ?
                this.mobileSymbolsSecond :
                this.desktopSymbolsSecond;

            this.container = container;
            this.maxSpins = parseFloat(this.container.getAttribute('data-spin')) || 1;

            if (this.isMobile) {
                const reelsContainer = document.getElementById('reels');
                if (reelsContainer && reelsContainer.children.length >= 3) {
                    reelsContainer.removeChild(reelsContainer.lastElementChild);
                    reelsContainer.removeChild(reelsContainer.lastElementChild);
                }
            }

            this.reels = Array.from(this.container.getElementsByClassName('reel'))
                .map((reel, index) => new Reel(reel, index, this.currentSymbols[index]));

            this.spinButton = document.getElementById('go-btn');
            if (this.spinButton) {
                this.spinButton.addEventListener('click', () => this.handleSpin());
            }

            this.defaultButtonText = document.getElementById('go-btn-default-text');
            this.nextButtonText = document.getElementById('go-btn-next-text');

            if (options.inverted) {
                this.container.classList.add('inverted');
            }

            window.addEventListener('placementOpenModal', () => {
                this.handleModalOpen();
            });

            this.config = options;
        }

        get isWinner() {
            return this.spinCounter === this.maxSpins;
        }

        handleSpin() {
            if (this.spinButton.disabled) return;

            this.spinCounter += 1;
            this.currentSymbols = this.nextSymbols;

            this.generateSymbols();

            return Promise.all(this.reels.map(reel => {
                reel.addSymbols(this.nextSymbols[reel.reelIndex]);
                return reel.spin();
            })).then(() => this.handleSpinEnd(this.nextSymbols));
        }

        generateSymbols() {
            this.generateWinningSymbols();
            this.generateRandomSymbols();

            this.winSymbols = this.isMobile ?
                this.mobileWinSymbols :
                this.desktopWinSymbols;

            this.randomSymbolSet = this.isMobile ?
                this.mobileRandomSymbols :
                this.desktopRandomSymbols;

            this.nextSymbols = this.isWinner ?
                this.winSymbols :
                this.randomSymbolSet;
        }

        generateWinningSymbols() {
            this.desktopWinSymbols = Array(5).fill(null).map(() => {
                return [
                    SlotSymbol.getRandomSymbol(),
                    SlotSymbol.getSymbolByIndex(6),
                    SlotSymbol.getRandomSymbol()
                ];
            });

            this.mobileWinSymbols = Array(3).fill(null).map(() => {
                return [
                    SlotSymbol.getRandomSymbol(),
                    SlotSymbol.getSymbolByIndex(6),
                    SlotSymbol.getRandomSymbol()
                ];
            });
        }

        generateRandomSymbols() {
            this.desktopRandomSymbols = Array(5).fill(null).map(() => {
                return Array(3).fill(null).map(() => SlotSymbol.getRandomSymbol());
            });

            this.mobileRandomSymbols = Array(3).fill(null).map(() => {
                return Array(3).fill(null).map(() => SlotSymbol.getRandomSymbol());
            });
        }

        handleSpinStart() {
            this.container.classList.remove('is--winner');
            this.spinButton.disabled = true;
            this.config.onSpinStart?.();
        }

        updateButtonVisibility() {
            if (this.spinCounter > 0 && this.spinCounter !== 1) {
                this.defaultButtonText?.classList.add('hidden');
                this.nextButtonText?.classList.add('visible');
            }
        }

        handleSpinEnd(symbols) {
            this.spinButton.disabled = false;
            this.config.onSpinEnd?.(symbols);
            this.updateButtonVisibility();

            if (this.isWinner) {
                this.container.classList.add('is--winner');
                this.spinButton.disabled = true;
                setTimeout(() => {
                    window.dispatchEvent(new Event('placementOpenModal'));
                }, 1200);
            }
        }

        handleModalOpen() {
            this.playWinSound();
            this.showEffects();
            this.showModal();
        }

        playWinSound() {
            const winSound = new Audio('assets/sound/win-sound.mp3');
            winSound.currentTime = 0;
            winSound.play().catch(error => {
                console.warn('Error playing win sound:', error);
            });
        }

        showEffects() {
            const effects = document.querySelector('.effects');
            if (!effects) return;

            effects.classList.add('visible');
            effects.classList.remove('hidden');

            const effectsImage = document.getElementById('effects-image');
            if (effectsImage) {
                const effectsBlock = document.createElement('div');
                effectsBlock.style.backgroundImage = `url(${effectsImage.src})`;
                effectsBlock.classList.add('effects__block');
                effects.appendChild(effectsBlock);
            }

            setTimeout(() => {
                effects.classList.remove('visible');
                effects.classList.add('hidden');
            }, 1500);
        }

        showModal() {
            document.body.classList.add('is--modal-open');
        }
    }

    // Инициализация после загрузки DOM
    function init() {
        const goBtn = document.getElementById('go-btn');
        if (goBtn) {
            goBtn.addEventListener('click', () => {
                const startSound = new Audio('assets/sound/start-sound.mp3');
                startSound.currentTime = 0;
                startSound.play().catch(error => {
                    console.warn('Error playing start sound:', error);
                });
            });
        }

        const slotConfig = {
            inverted: true,
            onSpinStart: () => {},
            onSpinEnd: () => {}
        };

        const slotElement = document.getElementById('slot');
        if (slotElement) {
            window.slotInstance = new Slot(slotElement, slotConfig);
        }
    }

    // Запускаем инициализацию после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
