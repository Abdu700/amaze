/* ============================================
   Carousel.js — Project Slider Navigation
   Navigate between project sections using arrows,
   dots, keyboard, touch swipe, and mouse drag
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('project-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.project-slide');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.project-slider__dot') : [];
    const track = slider.querySelector('.project-slider__track');

    let current = 0;
    let isAnimating = false;
    const total = slides.length;
    const TRANSITION_DURATION = 550; // ms — matches CSS transition

    // ——————————————————————————
    // Set track height from a slide
    // ——————————————————————————
    function updateTrackHeight(slideIndex) {
        const slide = slides[slideIndex !== undefined ? slideIndex : current];
        if (!slide || !track) return;

        // All slides are position:absolute, so we must temporarily
        // switch to relative to get the real scrollHeight
        const origPos = slide.style.position;
        const origVis = slide.style.visibility;
        const origOpacity = slide.style.opacity;

        slide.style.position = 'relative';
        slide.style.visibility = 'visible';
        slide.style.opacity = '0';

        const height = slide.scrollHeight;

        slide.style.position = origPos || '';
        slide.style.visibility = origVis || '';
        slide.style.opacity = origOpacity || '';

        // Only update if height is reasonable (> 100px)
        if (height > 100) {
            track.style.height = height + 'px';
        }
    }

    // Watch images inside the first active slide — recalc on each load
    function watchImagesLoad() {
        const activeSlide = slides[current];
        if (!activeSlide) return;

        const imgs = activeSlide.querySelectorAll('img');
        imgs.forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', () => updateTrackHeight(current), { once: true });
            }
        });
    }

    // ——————————————————————————
    // Go to a specific slide
    // ——————————————————————————
    function goToSlide(index, direction) {
        if (isAnimating || index === current || index < 0 || index >= total) return;
        isAnimating = true;

        const oldSlide = slides[current];
        const newSlide = slides[index];
        const goingForward = direction === 'next' || (direction === undefined && index > current);

        // 1) Update track height to match new slide
        updateTrackHeight(index);

        // 2) Position the new slide off-screen in the entry direction
        newSlide.style.transition = 'none'; // no animation for initial positioning
        newSlide.style.transform = goingForward ? 'translateX(40px)' : 'translateX(-40px)';
        newSlide.style.opacity = '0';
        newSlide.style.visibility = 'visible';
        newSlide.style.pointerEvents = 'none';

        // Force browser reflow so the initial position takes effect
        void newSlide.offsetHeight;

        // 3) Re-enable transitions
        newSlide.style.transition = '';

        // 4) Animate: old slide exits, new slide enters
        requestAnimationFrame(() => {
            // Exit old slide
            oldSlide.style.transform = goingForward ? 'translateX(-40px)' : 'translateX(40px)';
            oldSlide.style.opacity = '0';

            // Enter new slide
            newSlide.style.transform = 'translateX(0)';
            newSlide.style.opacity = '1';
        });

        // 5) Update dots
        dots.forEach(d => d.classList.remove('project-slider__dot--active'));
        if (dots[index]) dots[index].classList.add('project-slider__dot--active');

        // 6) Clean up after transition
        setTimeout(() => {
            oldSlide.classList.remove('project-slide--active');
            oldSlide.style.transform = '';
            oldSlide.style.opacity = '';
            oldSlide.style.visibility = '';
            oldSlide.style.pointerEvents = '';

            newSlide.classList.add('project-slide--active');
            newSlide.style.transform = '';
            newSlide.style.opacity = '';
            newSlide.style.visibility = '';
            newSlide.style.pointerEvents = '';

            current = index;
            isAnimating = false;
        }, TRANSITION_DURATION);
    }

    // ——————————————————————————
    // Arrow handlers
    // ——————————————————————————
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prev = current === 0 ? total - 1 : current - 1;
            goToSlide(prev, 'prev');
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const next = current === total - 1 ? 0 : current + 1;
            goToSlide(next, 'next');
        });
    }

    // ——————————————————————————
    // Dot handlers
    // ——————————————————————————
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            const direction = i > current ? 'next' : 'prev';
            goToSlide(i, direction);
        });
    });

    // ——————————————————————————
    // Keyboard navigation
    // ——————————————————————————
    document.addEventListener('keydown', (e) => {
        const rect = slider.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        if (e.key === 'ArrowLeft') {
            const prev = current === 0 ? total - 1 : current - 1;
            goToSlide(prev, 'prev');
        } else if (e.key === 'ArrowRight') {
            const next = current === total - 1 ? 0 : current + 1;
            goToSlide(next, 'next');
        }
    });

    // ——————————————————————————
    // Touch swipe + Mouse drag
    // ——————————————————————————
    let dragStartX = 0;
    let dragDelta = 0;
    let isDragging = false;
    const SWIPE_THRESHOLD = 50; // px needed to register a swipe

    function onDragStart(x) {
        if (isAnimating) return;
        isDragging = true;
        dragStartX = x;
        dragDelta = 0;
        track.classList.add('is-dragging');
    }

    function onDragMove(x) {
        if (!isDragging) return;
        dragDelta = x - dragStartX;
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('is-dragging');

        if (Math.abs(dragDelta) > SWIPE_THRESHOLD) {
            if (dragDelta < 0) {
                // Swiped left → go next
                const next = current === total - 1 ? 0 : current + 1;
                goToSlide(next, 'next');
            } else {
                // Swiped right → go prev
                const prev = current === 0 ? total - 1 : current - 1;
                goToSlide(prev, 'prev');
            }
        }

        dragDelta = 0;
    }

    // Touch events
    track.addEventListener('touchstart', (e) => {
        onDragStart(e.touches[0].clientX);
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        onDragMove(e.touches[0].clientX);
    }, { passive: true });

    track.addEventListener('touchend', onDragEnd);

    // Mouse events
    track.addEventListener('mousedown', (e) => {
        e.preventDefault();
        onDragStart(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        onDragMove(e.clientX);
    });

    window.addEventListener('mouseup', onDragEnd);

    // ——————————————————————————
    // Init
    // ——————————————————————————
    updateTrackHeight(0);
    watchImagesLoad();

    // Recalculate after all assets finish loading
    window.addEventListener('load', () => updateTrackHeight(current));

    // Periodic rechecks to catch late-loading images / fonts
    setTimeout(() => updateTrackHeight(current), 500);
    setTimeout(() => updateTrackHeight(current), 1000);
    setTimeout(() => updateTrackHeight(current), 2000);

    window.addEventListener('resize', () => updateTrackHeight(current));
});
