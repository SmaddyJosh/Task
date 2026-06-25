document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger icon between ☰ and ✕
            if (navLinks.classList.contains('active')) {
                hamburger.innerHTML = '&#10005;'; // X mark
            } else {
                hamburger.innerHTML = '&#9776;'; // Hamburger mark
            }
        });
    }
});
