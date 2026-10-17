// =========================================================
// StudentHub - Registration Form Validation
// js/register.js
// =========================================================

const registrationForm = document.getElementById("registrationForm");

if (registrationForm) {

    // =====================================================
    // DOM Elements
    // =====================================================

    const studentName = document.getElementById("studentName");
    const studentEmail = document.getElementById("studentEmail");
    const studentMobile = document.getElementById("studentMobile");
    const studentPassword = document.getElementById("studentPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const course = document.getElementById("course");
    const year = document.getElementById("year");
    const terms = document.getElementById("terms");
    const passwordStrength = document.getElementById("passwordStrength");
    const passwordStrengthBar = document.getElementById("passwordStrengthBar");
    const formSuccess = document.getElementById("formSuccess");

    // =====================================================
    // Regular Expressions
    // =====================================================

    // Full Name: alphabets, spaces, apostrophes, and hyphens (min 2 characters)
    const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)+$/;

    // Email Address: standard email format (user@domain.tld)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // Indian Mobile Number: 10 digits starting with 6, 7, 8, or 9
    const mobileRegex = /^[6-9][0-9]{9}$/;

    // Password: at least 8 characters, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    // =====================================================
    // Helper Functions: Error Display & Reset
    // =====================================================

    function showError(input, errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
        }
        if (input) {
            input.setAttribute("aria-invalid", "true");
        }
    }

    function clearError(input, errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = "";
        }
        if (input) {
            input.removeAttribute("aria-invalid");
        }
    }

    // =====================================================
    // Field Validators
    // =====================================================

    // 1. Full Name
    function validateName() {
        const value = studentName.value.trim();

        if (value === "") {
            showError(studentName, "studentNameError", "Full Name is required.");
            return false;
        }

        if (value.length < 3) {
            showError(studentName, "studentNameError", "Name must be at least 3 characters long.");
            return false;
        }

        if (!nameRegex.test(value)) {
            showError(studentName, "studentNameError", "Enter first and last name using letters only.");
            return false;
        }

        clearError(studentName, "studentNameError");
        return true;
    }

    // 2. Email Address
    function validateEmail() {
        const value = studentEmail.value.trim();

        if (value === "") {
            showError(studentEmail, "studentEmailError", "Email Address is required.");
            return false;
        }

        if (!emailRegex.test(value)) {
            showError(studentEmail, "studentEmailError", "Enter a valid email address (e.g. name@charusat.ac.in).");
            return false;
        }

        clearError(studentEmail, "studentEmailError");
        return true;
    }

    // 3. Mobile Number
    function validateMobile() {
        const value = studentMobile.value.trim();

        if (value === "") {
            showError(studentMobile, "studentMobileError", "Mobile Number is required.");
            return false;
        }

        if (!mobileRegex.test(value)) {
            showError(studentMobile, "studentMobileError", "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
            return false;
        }

        clearError(studentMobile, "studentMobileError");
        return true;
    }

    // 4. Password Strength Meter Calculation
    function getPasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }

    function updatePasswordStrength() {
        const password = studentPassword.value;
        const score = getPasswordStrength(password);

        if (password === "") {
            passwordStrength.textContent = "Password strength: Not entered";
            passwordStrengthBar.style.width = "0%";
            passwordStrengthBar.style.backgroundColor = "transparent";
            return;
        }

        if (score <= 2) {
            passwordStrength.textContent = "Password strength: Weak";
            passwordStrengthBar.style.width = "30%";
            passwordStrengthBar.style.backgroundColor = "#d32f2f";
        } else if (score <= 4) {
            passwordStrength.textContent = "Password strength: Medium";
            passwordStrengthBar.style.width = "65%";
            passwordStrengthBar.style.backgroundColor = "#f59e0b";
        } else {
            passwordStrength.textContent = "Password strength: Strong";
            passwordStrengthBar.style.width = "100%";
            passwordStrengthBar.style.backgroundColor = "#10b981";
        }
    }

    // 5. Password Validation
    function validatePassword() {
        const value = studentPassword.value;

        if (value === "") {
            showError(studentPassword, "studentPasswordError", "Password is required.");
            return false;
        }

        if (!passwordRegex.test(value)) {
            showError(
                studentPassword,
                "studentPasswordError",
                "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character."
            );
            return false;
        }

        clearError(studentPassword, "studentPasswordError");
        return true;
    }

    // 6. Confirm Password Validation
    function validateConfirmPassword() {
        const value = confirmPassword.value;

        if (value === "") {
            showError(confirmPassword, "confirmPasswordError", "Please confirm your password.");
            return false;
        }

        if (value !== studentPassword.value) {
            showError(confirmPassword, "confirmPasswordError", "Passwords do not match.");
            return false;
        }

        clearError(confirmPassword, "confirmPasswordError");
        return true;
    }

    // 7. Course Validation
    function validateCourse() {
        if (course.value === "") {
            showError(course, "courseError", "Please select a course.");
            return false;
        }

        clearError(course, "courseError");
        return true;
    }

    // 8. Year Validation
    function validateYear() {
        if (year.value === "") {
            showError(year, "yearError", "Please select your year.");
            return false;
        }

        clearError(year, "yearError");
        return true;
    }

    // 9. Gender Validation
    function validateGender() {
        const selectedGender = document.querySelector('input[name="gender"]:checked');
        const errorElement = document.getElementById("genderError");

        if (!selectedGender) {
            if (errorElement) errorElement.textContent = "Please select your gender.";
            return false;
        }

        if (errorElement) errorElement.textContent = "";
        return true;
    }

    // 10. Terms Acceptance Validation
    function validateTerms() {
        const errorElement = document.getElementById("termsError");

        if (!terms.checked) {
            if (errorElement) errorElement.textContent = "You must accept the terms and conditions.";
            return false;
        }

        if (errorElement) errorElement.textContent = "";
        return true;
    }

    // =====================================================
    // Real-Time Event Listeners
    // =====================================================

    studentName.addEventListener("input", validateName);
    studentEmail.addEventListener("input", validateEmail);

    // Mobile Number: Filter numeric characters and enforce 10 digits
    studentMobile.addEventListener("input", function () {
        studentMobile.value = studentMobile.value.replace(/\D/g, "").slice(0, 10);
        validateMobile();
    });

    studentPassword.addEventListener("input", function () {
        updatePasswordStrength();
        validatePassword();
        if (confirmPassword.value !== "") {
            validateConfirmPassword();
        }
    });

    confirmPassword.addEventListener("input", validateConfirmPassword);
    course.addEventListener("change", validateCourse);
    year.addEventListener("change", validateYear);

    document.querySelectorAll('input[name="gender"]').forEach(function (radio) {
        radio.addEventListener("change", validateGender);
    });

    terms.addEventListener("change", validateTerms);

    // =====================================================
    // Form Submission Handling
    // =====================================================

    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (formSuccess) {
            formSuccess.textContent = "";
        }

        const validName = validateName();
        const validEmail = validateEmail();
        const validMobile = validateMobile();
        const validPassword = validatePassword();
        const validConfirmPassword = validateConfirmPassword();
        const validCourse = validateCourse();
        const validYear = validateYear();
        const validGender = validateGender();
        const validTerms = validateTerms();

        const isValid =
            validName &&
            validEmail &&
            validMobile &&
            validPassword &&
            validConfirmPassword &&
            validCourse &&
            validYear &&
            validGender &&
            validTerms;

        if (!isValid) {
            // Accessible focus: Shift focus to the first invalid field
            const firstInvalidInput = registrationForm.querySelector('[aria-invalid="true"]');
            if (firstInvalidInput && typeof firstInvalidInput.focus === "function") {
                firstInvalidInput.focus();
            }
            return;
        }

        // On successful client-side validation
        if (formSuccess) {
            formSuccess.textContent = "Registration successful! Welcome to StudentHub.";
            formSuccess.style.display = "block";
        }
    });
}
