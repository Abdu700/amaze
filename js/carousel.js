/* ============================================
   Carousel.js — Portfolio Tab Filtering
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.portfolio-tab');
    const cards = document.querySelectorAll('.portfolio-card');
    const grid = document.getElementById('portfolio-grid');

    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter cards with animation
            let visibleCount = 0;

            cards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';

                    // Stagger the reveal
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, visibleCount * 80);

                    visibleCount++;
                } else {
                    card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';

                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });

            // Dynamically adjust grid layout based on visible cards
            setTimeout(() => {
                adjustGridLayout(filter);
            }, 50);
        });
    });

    function adjustGridLayout(filter) {
        const visibleCards = [...cards].filter(card => {
            return filter === 'all' || card.getAttribute('data-category') === filter;
        });

        // Reset all cards to span properly
        visibleCards.forEach((card, i) => {
            if (visibleCards.length <= 2) {
                // If only 1-2 cards, make them all large
                card.classList.remove('portfolio-card--small');
                card.classList.add('portfolio-card--large');
                card.style.gridColumn = visibleCards.length === 1 ? 'span 12' : 'span 6';
            } else {
                // Alternate large/small
                if (i % 2 === 0) {
                    card.classList.add('portfolio-card--large');
                    card.classList.remove('portfolio-card--small');
                    card.style.gridColumn = 'span 7';
                } else {
                    card.classList.remove('portfolio-card--large');
                    card.classList.add('portfolio-card--small');
                    card.style.gridColumn = 'span 5';
                }
            }
        });
    }
});
