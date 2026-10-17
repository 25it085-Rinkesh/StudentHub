// =========================================================
// StudentHub - Student Login Validation & Interaction
// js/login.js
// =========================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const loginEmailError = document.getElementById("loginEmailError");
    const loginPasswordError = document.getElementById("loginPasswordError");
    const loginSuccess = document.getElementById("loginSuccess");

    function validateLoginEmail() {
        const value = loginEmail.value.trim();
        if (value === "") {
            if (loginEmailError) loginEmailError.textContent = "Email Address or Username is required.";
            loginEmail.setAttribute("aria-invalid", "true");
            return false;
        }
        if (loginEmailError) loginEmailError.textContent = "";
        loginEmail.removeAttribute("aria-invalid");
        return true;
    }

    function validateLoginPassword() {
        const value = loginPassword.value;
        if (value === "") {
            if (loginPasswordError) loginPasswordError.textContent = "Password is required.";
            loginPassword.setAttribute("aria-invalid", "true");
            return false;
        }
        if (loginPasswordError) loginPasswordError.textContent = "";
        loginPassword.removeAttribute("aria-invalid");
        return true;
    }

    loginEmail.addEventListener("input", validateLoginEmail);
    loginPassword.addEventListener("input", validateLoginPassword);

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (loginSuccess) {
            loginSuccess.textContent = "";
        }

        const validEmail = validateLoginEmail();
        const validPassword = validateLoginPassword();

        if (!validEmail || !validPassword) {
            const firstInvalid = loginForm.querySelector('[aria-invalid="true"]');
            if (firstInvalid && typeof firstInvalid.focus === "function") {
                firstInvalid.focus();
            }
            return;
        }

        if (loginSuccess) {
            loginSuccess.textContent = "Login validation passed! Ready for server authentication.";
            loginSuccess.style.display = "block";
        }
    });
}
