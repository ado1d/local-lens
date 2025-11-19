document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', currentTheme);
  themeToggle.textContent =
    currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  themeToggle.addEventListener('click', () => {
    const newTheme =
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent =
      newTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  });
});
