// Получаем элементы
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

// Если нет необходимых элементов — безопасно выходим
if (menuToggle && mainNav) {
    // Создаем оверлей для меню
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);

    // Функция открытия/закрытия меню
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

        // Переключаем состояния
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', String(!isExpanded));
        mainNav.classList.toggle('active');
        navOverlay.classList.toggle('active');

        // Блокируем скролл при открытом меню
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';

        // Если меню открыто — показываем шапку (если она была скрыта)
        const headerEl = document.querySelector('.header');
        if (headerEl) {
            if (mainNav.classList.contains('active')) {
                headerEl.classList.remove('header--hidden');
                headerEl.classList.add('header--visible');
            } else {
                headerEl.classList.remove('header--visible');
            }
        }
    }

    // Обработчики событий
    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    // Закрытие меню при клике на ссылку (ссылки имеют класс 'link' в HTML)
    const navLinks = document.querySelectorAll('.nav__list .link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && mainNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Закрытие меню при изменении размера окна (если перешли на десктоп)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// ----------------------------------------------------------------
// Кнопка «Наверх» (мобильная): появляется при скролле, при клике — плавно наверх
// ----------------------------------------------------------------
(function() {
    const scrollBtn = document.getElementById('scrollTop');
    if (!scrollBtn) return;

    const SHOW_AT = 200; // показать кнопку после этого скролла (px)
    let visible = false;

    function onScroll() {
        if (window.scrollY > SHOW_AT && !visible) {
            visible = true;
            scrollBtn.classList.add('visible');
            scrollBtn.setAttribute('aria-hidden', 'false');
        } else if (window.scrollY <= SHOW_AT && visible) {
            visible = false;
            scrollBtn.classList.remove('visible');
            scrollBtn.setAttribute('aria-hidden', 'true');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    function triggerScrollTop() {
        scrollBtn.classList.add('pressed');
        setTimeout(() => scrollBtn.classList.remove('pressed'), 500);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Обрабатываем pointerdown/touchstart, чтобы сработать сразу при нажатии во время инерционного скролла
    scrollBtn.addEventListener('pointerdown', (e) => {
        if (e.cancelable) e.preventDefault();
        triggerScrollTop();
    });

    // Fallback для старых мобильных браузеров — touchstart с passive:false
    scrollBtn.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        triggerScrollTop();
    }, { passive: false });

    // click — запасной вариант для десктопа
    scrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        triggerScrollTop();
    });

    // начальная проверка
    onScroll();
})();

// ----------------------------------------------------------------
// Автоскрытие шапки на мобилках: скрываем при прокрутке вниз, показываем при прокрутке вверх
// ----------------------------------------------------------------
(function() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastY = window.scrollY;
    let ticking = false;
    let enabled = window.innerWidth <= 480;

    function enable() {
        header.classList.add('header--fixed');
        // Надёжно выставим padding у body чтобы контент не "прыгнул"
        document.body.style.paddingTop = header.offsetHeight + 'px';
    }

    function disable() {
        header.classList.remove('header--fixed');
        header.classList.remove('header--hidden');
        header.classList.remove('header--visible');
        document.body.style.paddingTop = '';
    }

    function handleScroll() {
        const y = window.scrollY;
        const dy = y - lastY;

        // небольшая толерантность к мелким изменениям
        if (Math.abs(dy) < 5) return;

        // Если меню открыто — держим шапку видимой
        const menuOpen = document.getElementById('menuToggle')?.classList.contains('active');
        if (menuOpen) {
            header.classList.remove('header--hidden');
            lastY = y;
            return;
        }

        if (y <= 0) {
            // вверху страницы — точно показываем
            header.classList.remove('header--hidden');
        } else if (dy > 0 && y > header.offsetHeight) {
            // скролл вниз — скрываем
            header.classList.add('header--hidden');
        } else if (dy < 0) {
            // скролл вверх — показываем
            header.classList.remove('header--hidden');
        }

        lastY = y;
    }

    window.addEventListener('scroll', () => {
        if (!enabled) return;
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        const should = window.innerWidth <= 480;
        if (should && !enabled) { enabled = true; enable(); }
        if (!should && enabled) { enabled = false; disable(); }
    });

    if (enabled) enable();
})();