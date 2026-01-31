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