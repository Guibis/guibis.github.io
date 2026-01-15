document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('btn-start');
    const overlay = document.getElementById('intro-overlay');

    if (startBtn && overlay) {
        startBtn.addEventListener('click', () => {
            // First, user sees the button hover/active animation, maybe we just hide the button first
            // or trigger the page reveal immediately.
            
            // Let's add the fade-out class to the button itself to make it disappear
            startBtn.classList.add('fade-out'); // startBtn is now the <a> tag

            // Then, after a short delay or immediately, reveal the page.
            // Since the user said "click -> it disappears -> animation executed -> show content"
            // We can delay the overlay lift slightly to let the button disappear.
            
            setTimeout(() => {
                overlay.classList.add('reveal-overlay');
            }, 500);
        });
    }
});
