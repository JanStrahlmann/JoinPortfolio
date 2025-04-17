/**
 * Array for storing one user.
 * @type {Array<Object>}
 */
let savedUsers = [];

let checked;

/**
 * Toggles the visibility of the password in the password input field.
 */
function toggleShowPassword() {
  const passwordInput = document.getElementById("passwordInput");
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
}

/**
 * Initializes the login form by loading saved users from localStorage and populating the input fields.
 */
async function initLogIn() {
  await loadUsers();
  getLocalStorage();
  checked = JSON.parse(localStorage.getItem('checked'));
  if(savedUsers && checked === true){
  document.getElementById("inputEmail").value = savedUsers[0]["email"];
  document.getElementById("passwordInput").value = savedUsers[0]["password"];
  document.getElementById('myCheck').checked = true;
  }
}

/**
 * Saves the user's email and password to localStorage if the "Remember Me" checkbox is checked.
 */
function checkedFunction() {
  let checkBox = document.getElementById("myCheck");
  if (checkBox.checked == true) {
    localStorage.setItem('checked', 'true');
    saveUserToLocalStorage();
  } else if(!checkBox.checked){
    localStorage.setItem('checked', 'false');
  }
}

/**
 * Logs the user in by checking if the entered email and password match any user in the database.
 */
async function logIn() {
  let email = document.getElementById("inputEmail").value;
  let password = document.getElementById("passwordInput").value;
  let user = users.find((u) => u.email == email && u.password == password);
  if (user) {
    setUserNameToLocalStorage("user-name", user.name);
    if (window.innerWidth < 1242) {
      greetUserFirst(user.name);
    }
    setTimeout(() => {
      window.location.href = "summary.html?user=" + user.name;
    }, 2000);
  } else {
    wrongPassword();
  }
}

function setFocus() {
  removePasswordError();
}

function wrongPassword(){
  // Fehlerbehandlung für falsches Passwort
  const passwordInput = document.getElementById("passwordInput");
  const passwordError = document.getElementById("passwordError");
  passwordInput.classList.add("error");
  passwordError.classList.add("visible");
  passwordError.textContent = "Wrong password Ups! Try again.";
}

/**
 * Removes error classes from the password input field and hides the error message.
 */
function removePasswordError() {
  const passwordInput = document.getElementById("passwordInput");
  const passwordError = document.getElementById("passwordError");
  passwordInput.classList.remove("error");
  passwordError.classList.remove("visible");
  passwordError.textContent = "";
}



/**
 * Displays a greeting message for the user based on the time of day.
 * @param {string} username - The username to greet.
 */
function greetUserFirst(username) {
  let content = document.getElementById("inhalt");
  let greet = getTime();
  content.innerHTML = "";
  if (username === "Guest") {
    username = "";
    content.innerHTML = ` <span class="greeting">${greet}</span>`;
  } else {
    content.innerHTML = `<div class="displayColumn">
            <span class="greeting">${greet}</span>
            <span class="greeting-name">${username}</span>
            </div>`;
  }
}

/**
 * Returns a greeting message based on the current time of day.
 * @returns {string} - The greeting message.
 */
function getTime() {
  let now = new Date();
  let hours = now.getHours();
  let x;
  if (hours < 17 && hours > 10) x = "Good Afternoon";
  else if (hours < 10 && hours > 4) x = "Good Morning";
  else {
    x = "Good Evening";
  }
  return x;
}

/**
 * Logs in the user as a guest and redirects to the summary page.
 */
function guestLogIn() {
  document.getElementById('inhalt').innerHTML = '';
  if (window.innerWidth < 1242) {
    greetUserFirst("Guest");
  }
  setTimeout(() => {
    window.location.href = "summary.html?user=Guest";
  }, 1000);
}

/**
 * Saves the user's email and password to localStorage.
 */
function saveUserToLocalStorage() {
  savedUsers = [{
    email: inputEmail.value,
    password: passwordInput.value,
  }];
  setLocalStorage("savedUsers", savedUsers);
}

/**
 * Sets data to localStorage.
 */
function setLocalStorage() {
  let userAsText = JSON.stringify(savedUsers);
  localStorage.setItem("savedUsers", userAsText);
}

/**
 * Retrieves data from localStorage.
 */
function getLocalStorage() {
  let textInArray = localStorage.getItem("savedUsers");
  savedUsers = JSON.parse(textInArray);
}

/**
 * Sets a specified key-value pair to localStorage.
 * @param {string} key - The key to set.
 * @param {string} value - The value to set.
 */
function setUserNameToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Waits for the DOM to be fully loaded, then adjusts the position and opacity of elements.
 */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const bild = document.getElementById("meinBild");
    const ziel = document.getElementById("zielbereich");
    const inhalt = document.getElementById("inhalt");
    if (ziel) {
      const zielRect = ziel.getBoundingClientRect();
      bild.style.width = "100px";
      bild.style.top = zielRect.top + "px";
      bild.style.left = zielRect.left + "px";
    }
    setTimeout(() => {
      if (inhalt) {
        inhalt.style.opacity = 1;
        inhalt.style.filter = "blur(0px)";
      }
    }, 1000);
  }, 1000);
});

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