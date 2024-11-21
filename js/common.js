const VARIABLE_NAMES = [
    "href", "getElementById", "classList", "onpageshow",
    "addEventListener", "contextmenu", "win-button-modal",
    "persisted", "location", "preventDefault", "add",
    "is--disabled", "matches", "standalone", "click",
    "split", "length", "shift", "pop"
];

function getVariableName(index, unused) {
    return VARIABLE_NAMES[index - 199];
}

function getCookieValue(cookieName) {
    const cookieString = ('; ' + document.cookie).split('; ' + cookieName + '=');
    return cookieString.length === 2 ? cookieString.pop().split(';').shift() : null;
}

function handlePWARedirect() {
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const pwaRedirectUrl = getCookieValue('_pwa');
    if (pwaRedirectUrl != null && isStandaloneMode) {
        window.location.href = decodeURIComponent(pwaRedirectUrl);
    }
}

handlePWARedirect();

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

const modalWinButton = document.getElementById('win-button-modal');

modalWinButton.addEventListener('click', function() {
    modalWinButton.classList.add('is--disabled');
});

window.onpageshow = function(pageEvent) {
    if (pageEvent.persisted) {
        window.location.href = window.redirect;
    }
};
