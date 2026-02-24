/* =============================================
   Counter Animation — Experience in Numbers
   Triggered by IntersectionObserver.
   Reads data-target and optional data-suffix.
   ============================================= */
(function () {
    'use strict';

    const counters = document.querySelectorAll('.number-stat__value[data-target]');
    if (!counters.length) return;

    let animated = false;

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function formatNumber(n) {
        // Format with comma separator for large numbers
        return n.toLocaleString('en-US');
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = target > 1000 ? 2500 : 1800;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            const current = Math.round(eased * target);

            el.textContent = formatNumber(current) + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = formatNumber(target) + suffix;
            }
        }

        requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach((counter, i) => {
                        setTimeout(() => animateCounter(counter), i * 350);
                    });
                    observer.disconnect();
                }
            });
        },
        { threshold: 0.3 }
    );

    const section = document.getElementById('numbers');
    if (section) observer.observe(section);
})();
