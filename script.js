document.addEventListener('DOMContentLoaded', () => {
    // 1. OPENING ANIMATION SEQUENCE
    const phrases = [
        document.getElementById('phrase-1'),
        document.getElementById('phrase-2'),
        document.getElementById('phrase-3'),
        document.getElementById('phrase-4'),
        document.getElementById('phrase-5')
    ];

    const overlay = document.getElementById('opening-overlay');
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function playOpeningSequence() {
        // Wait slightly before starting
        await sleep(500);

        for (let i = 0; i < phrases.length; i++) {
            const phrase = phrases[i];
            if (!phrase) continue;

            // Step 1: Fade In
            phrase.classList.add('active');

            if (i === phrases.length - 1) {
                // Last word (ZERO) remains visible longer
                await sleep(1600);
            } else {
                // Regular word display time
                await sleep(1100);
                // Step 2: Transition out
                phrase.classList.remove('active');
                phrase.classList.add('fade-prev');
                // Wait for the exit animation transition before starting the next entry
                await sleep(400);
            }
        }

        // Fade out overlay
        overlay.classList.add('fade-out');

        // Enable scrolling
        document.body.style.overflow = '';

        // Clean up overlay element after transition finishes
        setTimeout(() => {
            overlay.style.display = 'none';
            // Force activate first view elements to guarantee prompt rendering
            triggerFirstViewReveals();
        }, 1500);
    }

    if (overlay) {
        document.body.style.overflow = 'hidden';
        playOpeningSequence();
    } else {
        document.body.style.overflow = '';
        triggerFirstViewReveals();
    }

    // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserverOptions = {
        root: null, // Default is viewport
        rootMargin: '0px 0px -15% 0px', // Trigger when element is 15% above the bottom edge
        threshold: 0.05 // Trigger as soon as 5% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it is animated, stop observing to improve scroll performance
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    function triggerFirstViewReveals() {
        const firstViewReveals = document.querySelectorAll('#first-view .reveal');
        firstViewReveals.forEach(el => {
            el.classList.add('active');
        });
    }

    // 4. SMOOTH SCROLL OFFSET FOR CTA LINKS
    const ctaLinks = document.querySelectorAll('a[href^="#"]');
    ctaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Get header height if absolute/fixed, or use 0
                const headerOffset = 60; 
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
