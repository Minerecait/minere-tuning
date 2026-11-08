// === КОНФИГУРАЦИЯ TELEGRAM БОТА ===
const TG_CONFIG = {
    TOKEN: '9041676636:AAFHK4EihKddlLS3KDxWoQqlryW7EZlAdAM',
    CHAT_ID: '5370231697'
};

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. ЭФФЕКТ ПАДАЮЩЕГО СНЕГА --- */
    function createSnowflake() {
        const snow = document.createElement('div');
        snow.classList.add('snowflake');
        snow.innerHTML = '&#10052;';
        snow.style.left = Math.random() * 100 + 'vw';
        snow.style.animationDuration = Math.random() * 4 + 4 + 's'; 
        snow.style.opacity = Math.random() * 0.6 + 0.2;
        snow.style.fontSize = Math.random() * 10 + 10 + 'px';
        document.body.appendChild(snow);
        
        // Удаляем снежинку через 8 секунд
        setTimeout(() => { snow.remove(); }, 8000);
    }
    setInterval(createSnowflake, 180);

    /* --- 2. АНИМАЦИИ ПРИ СКРОЛЛЕ --- */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    
    reveals.forEach(r => observer.observe(r));

    /* --- 3. МОБИЛЬНОЕ МЕНЮ --- */
    const burger = document.getElementById('burger-menu');
    const navLinks = document.getElementById('nav-links');
    
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if(navLinks.classList.contains('active')){
                burger.classList.replace('fa-bars', 'fa-xmark');
            } else {
                burger.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    /* --- 4. РЕАЛЬНАЯ ОТПРАВКА В TELEGRAM --- */
    const form = document.getElementById('lead-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const formSuccess = document.getElementById('form-success');
            const formError = document.getElementById('form-error');
            
            // Сбрасываем старые уведомления
            if (formSuccess) formSuccess.style.display = 'none';
            if (formError) formError.style.display = 'none';
            
            // Блокируем кнопку
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Отправка...';
            submitBtn.disabled = true;

            // Собираем значения из полей
            const carInput = document.getElementById('car');
            const car = carInput ? carInput.value.trim() : 'Не указано';
            
            const serviceEl = document.querySelector('input[name="service"]:checked');
            const service = serviceEl ? serviceEl.value : 'Не выбрано';
            
            const nameInput = document.getElementById('client_name');
            const name = nameInput ? nameInput.value.trim() || 'Не указано' : 'Не указано';
            
            const contactInput = document.getElementById('contact');
            const contact = contactInput ? contactInput.value.trim() : 'Не указано';

            // Формируем красивый текст для Telegram
            const message = `🔥 Новая заявка с сайта MINERE!\n\n🚗 Авто: ${car}\n🛠 Услуга: ${service}\n👤 Клиент: ${name}\n📞 Связь: ${contact}`;

            try {
                // Отправляем запрос на сервер Telegram
                const response = await fetch(`https://api.telegram.org/bot${TG_CONFIG.TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: TG_CONFIG.CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });

                if (response.ok) {
                    form.reset();
                    form.style.display = 'none'; // Скрываем саму форму
                    if (formSuccess) formSuccess.style.display = 'block'; // Показываем успех
                } else {
                    throw new Error('Telegram API Error');
                }
            } catch (error) {
                // Показываем ошибку сети
                if (formError) formError.style.display = 'block';
            } finally {
                // Разблокируем кнопку, если произошла ошибка
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});