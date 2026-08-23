// =========================================================
// Notification
// =========================================================

let notification = document.getElementById("notification");
let closeButton = document.getElementById("closeBtn");

if (notification && closeButton) {
    closeButton.onclick = function () {
        notification.style.display = "none";
    };
}


// =========================================================
// Dark Mode
// =========================================================

let themeButton = document.getElementById("themeBtn");

if (themeButton) {
    let savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeButton.innerHTML = "Light Mode";
    } else {
        document.body.classList.remove("dark");
        themeButton.innerHTML = "Dark Mode";
    }

    themeButton.onclick = function () {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            themeButton.innerHTML = "Light Mode";
            localStorage.setItem("theme", "dark");
        } else {
            themeButton.innerHTML = "Dark Mode";
            localStorage.setItem("theme", "light");
        }
    };
}


// =========================================================
// Mobile Menu
// =========================================================

const menuButton = document.getElementById("menuBtn");
const mainMenu = document.getElementById("mainMenu");

if (menuButton && mainMenu) {

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-controls", "mainMenu");

    menuButton.addEventListener("click", function () {

        const isOpen = mainMenu.classList.toggle("active");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });

    const menuLinks = mainMenu.querySelectorAll("a");

    menuLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mainMenu.classList.remove("active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });
}


// =========================================================
// Change Welcome Heading
// =========================================================

const changeButton = document.getElementById("changeBtn");
const welcomeHeading = document.getElementById("welcomeHeading");

if (changeButton && welcomeHeading) {

    const headings = [
        "Welcome to StudentHub",
        "Your Digital Campus Portal"
    ];

    let headingIndex = 0;

    changeButton.addEventListener("click", function () {

        headingIndex =
            (headingIndex + 1) % headings.length;

        welcomeHeading.textContent =
            headings[headingIndex];
    });
}


// =========================================================
// Image Slider
// =========================================================

const sliderImage = document.getElementById("sliderImage");
const sliderCaption = document.getElementById("sliderCaption");
const previousButton = document.getElementById("previousBtn");
const nextButton = document.getElementById("nextBtn");

if (
    sliderImage &&
    sliderCaption &&
    previousButton &&
    nextButton
) {

    const slides = [
        {
            image: "../images/campus1.jpg",
            caption: "StudentHub Campus"
        },
        {
            image: "../images/campus2.webp",
            caption: "StudentHub Learning Environment"
        },
        {
            image: "../images/campus3.webp",
            caption: "StudentHub Campus Activities"
        },
        {
            image: "../images/campus4.webp",
            caption: "StudentHub Library"
        },
        {
            image: "../images/campus5.webp",
            caption: "StudentHub Student Life"
        }
    ];

    let currentSlide = 0;

    function showSlide(index) {

        currentSlide =
            (index + slides.length) % slides.length;

        // Fade out
        sliderImage.style.opacity = "0";

        setTimeout(function () {

            // Change image
            sliderImage.src =
                slides[currentSlide].image;

            // Update alt text
            sliderImage.alt =
                slides[currentSlide].caption;

            // Update caption
            sliderCaption.textContent =
                slides[currentSlide].caption;

            // Fade in
            sliderImage.style.opacity = "1";

        }, 150);
    }

    // Previous button
    previousButton.addEventListener(
        "click",
        function () {
            showSlide(currentSlide - 1);
        }
    );

    // Next button
    nextButton.addEventListener(
        "click",
        function () {
            showSlide(currentSlide + 1);
        }
    );

    // Show first image
    showSlide(0);

    // Automatic slide every 3 seconds
    setInterval(function () {
        showSlide(currentSlide + 1);
    }, 3000);
}


// =========================================================
// FAQ Accordion
// =========================================================

const faqButtons =
    document.querySelectorAll(".faq-item button");

faqButtons.forEach(function (button) {

    const answer = button.nextElementSibling;

    button.setAttribute(
        "aria-expanded",
        "false"
    );

    // Accessibility: connect button to its answer
    if (answer && answer.id) {
        button.setAttribute(
            "aria-controls",
            answer.id
        );
    }

    button.addEventListener("click", function () {

        const answer =
            button.nextElementSibling;

        if (!answer) {
            return;
        }

        const isOpen =
            answer.style.display === "block";

        // Close all FAQ answers
        document
            .querySelectorAll(
                ".faq-item div[id^='faqAnswer']"
            )
            .forEach(function (item) {

                item.style.display = "none";
            });

        // Reset all buttons
        faqButtons.forEach(function (item) {

            item.setAttribute(
                "aria-expanded",
                "false"
            );
        });

        // Open selected answer
        if (!isOpen) {

            answer.style.display = "block";

            button.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    });
});


// =========================================================
// Announcement Modal
// =========================================================

const openModalButton =
    document.getElementById("openModalBtn");

const announcementModal =
    document.getElementById("announcementModal");

const closeModalButton =
    document.getElementById("closeModal");

let modalOpener = null;


// Open Modal
function openAnnouncement() {

    if (!announcementModal) {
        return;
    }

    // Remember the element that opened the modal
    modalOpener = document.activeElement;

    announcementModal.style.display = "block";

    // Accessibility
    announcementModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

    // Move keyboard focus to close button
    if (closeModalButton) {
        closeModalButton.focus();
    }
}


// Close Modal
function closeAnnouncement() {

    if (!announcementModal) {
        return;
    }

    announcementModal.style.display = "none";

    // Accessibility
    announcementModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

    // Return focus to the element that opened the modal
    if (
        modalOpener &&
        typeof modalOpener.focus === "function"
    ) {
        modalOpener.focus();
    }
}


// Open modal button
if (openModalButton) {

    openModalButton.addEventListener(
        "click",
        openAnnouncement
    );
}


// Close modal button
if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeAnnouncement
    );
}


// Close modal by clicking outside
if (announcementModal) {

    announcementModal.addEventListener(
        "click",
        function (event) {

            if (event.target === announcementModal) {
                closeAnnouncement();
            }
        }
    );
}


// Close modal with Escape key
document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {
            closeAnnouncement();
        }
    }
);


// =========================================================
// Workshop Registration
// =========================================================

const registerButton =
    document.getElementById("registerBtn");

if (registerButton) {

    registerButton.addEventListener(
        "click",
        function () {

            alert(
                "Workshop registration is open! Please visit the Events page to register."
            );
        }
    );
}