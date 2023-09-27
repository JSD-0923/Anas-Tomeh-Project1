const toggleDarkModeButton = document.getElementById('toggleDarkModeButton');
toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
const toggleDarkModeButtonMobile = document.getElementById('toggleDarkModeButtonMobile');
toggleDarkModeButtonMobile.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

const courseCard = document.getElementById('courseCard');

courseCard.addEventListener('click', function () {
    window.location.href = 'details/details.html';
});