//     function checkDevMode() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const devMode = urlParams.get('devMode');
//     const devModeContainer = document.getElementById('devMode');
//
//     if (devMode === 'true') {
//     devModeContainer.classList.add('is--active');
// } else if (devMode === 'false') {
//     devModeContainer.classList.remove('is--active');
// }
// }
//
//     document.getElementById('toggleMenu').addEventListener('click', () => {
//     const menuButton = document.getElementById('toggleMenu');
//     const menu = document.getElementById('settingsWrapper');
//     menuButton.classList.toggle('is--open');
//     menu.classList.toggle('is--open');
// });
//     document.getElementById('getSettings').addEventListener('click', async () => {
//     try {
//     const response = await fetch('/settings');
//     if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
// }
//     const data = await response.json();
//     document.getElementById('settingsTextarea').value = JSON.stringify(data, null, 2);
// } catch (error) {
//     console.error('Error fetching settings:', error);
// }
// });
//     document.getElementById('submitSettings').addEventListener('click', async () => {
//     try {
//     const settings = document.getElementById('settingsTextarea').value;
//     const response = await fetch('/settings', {
//     method: 'PUT',
//     headers: {
//     'Content-Type': 'application/json'
// },
//     body: settings
// });
//     if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
// }
//     window.location.reload();
// } catch (error) {
//     console.error('Error:', error);
// }
// });
//     window.addEventListener('DOMContentLoaded', checkDevMode);
