/**
 * Constant representing the token for remote storage.
 */
const STORAGE_TOKEN = '3HDM5PQUHYXFJ42ELVGHJHKC15X2E80YC0TD1RAR';

/**
 * Constant representing the URL for remote storage.
 */
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Toggles the visibility of the password input field.
 */
function toggleShowPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

/**
 * Toggles the visibility of the confirm password input field.
 */
function toggleShowConfirmPassword() {
    const passwordInput = document.getElementById('confirmPasswordInput');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

/**
 * Sets an item in the remote storage.
 * @param {string} key - The key for the item.
 * @param {any} value - The value to be stored.
 * @returns {Promise<any>} - A promise resolving to the response data.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
}

/**
 * Gets an item from the remote storage.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<any>} - A promise resolving to the value of the item.
 * @throws {string} - Throws an error if the item with the specified key is not found.
 */
async function getItem(key) {
    const URL = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(URL).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

/**
 * Adds an event listener to the window that listens for resize events.
 * If the window's inner width changes from below 700 pixels to above 700 pixels, the page will be reloaded once.
 * The page will not reload again until the width goes back to 700 pixels or less and then exceeds 700 pixels again.
 */
window.addEventListener('resize', (function() {
    /**
     * Indicates whether the page has been reloaded due to crossing the 700 pixels threshold.
     * @type {boolean}
     */
    let hasReloaded = false;

    /**
     * Indicates whether the window's width was below or equal to 700 pixels before the last resize event.
     * @type {boolean}
     */
    let wasBelowThreshold = window.innerWidth <= 700;

    return function() {
        /**
         * Indicates whether the window's width is currently above 700 pixels.
         * @type {boolean}
         */
        const isAboveThreshold = window.innerWidth > 700;

        if (isAboveThreshold && !hasReloaded && wasBelowThreshold) {
            window.location.reload();
            hasReloaded = true;
        } else if (!isAboveThreshold) {
            hasReloaded = false;
            wasBelowThreshold = true;
        } else {
            wasBelowThreshold = false;
        }
    };
})());

