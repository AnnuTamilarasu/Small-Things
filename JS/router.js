// SPA Page Switching
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.dataset.page;

    // Hide all sections
    sections.forEach(sec => sec.style.display = 'none');

    // Show target section
    const activeSection = document.getElementById(target);
    if (activeSection) activeSection.style.display = 'block';
  });
});

// Show home section by default
document.addEventListener('DOMContentLoaded', () => {
  const home = document.getElementById('home');
  if (home) home.style.display = 'block';
});
