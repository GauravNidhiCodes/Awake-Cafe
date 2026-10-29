
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");
    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("navigation");

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("awake-theme") || "light";
    } catch (error) {
        savedTheme = "light";
    }

    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
    }

    function updateThemeButton() {
        if (!themeToggle) return;

        const isDark = body.classList.contains("dark-mode");
        themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
        themeToggle.setAttribute("aria-pressed", String(isDark));
    }

    updateThemeButton();

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            body.classList.toggle("dark-mode");

            const isDark = body.classList.contains("dark-mode");

            try {
                localStorage.setItem("awake-theme", isDark ? "dark" : "light");
            } catch (error) {
                // The theme still works if browser storage is unavailable.
            }

            updateThemeButton();
        });
    }

    function closeMobileMenu() {
        if (!navigation || !menuToggle) return;

        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    }

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.textContent = isOpen ? "×" : "☰";
        });

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMobileMenu);
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                closeMobileMenu();
            }
        });
    }

    const galleryImages = document.querySelectorAll(".gallery-item img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.getElementById("lightbox-close");

    let previouslyFocusedElement = null;

    function closeLightbox() {
        if (!lightbox) return;

        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        body.style.overflow = "";

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    }

    if (lightbox && lightboxImage && lightboxClose) {
        galleryImages.forEach(function (image) {
            image.addEventListener("click", function () {
                previouslyFocusedElement = image;

                lightboxImage.src = image.src;
                lightboxImage.alt = image.alt;

                const caption = image.closest("figure")?.querySelector("figcaption");

                if (lightboxCaption) {
                    lightboxCaption.textContent = caption
                        ? caption.textContent
                        : image.alt;
                }

                lightbox.classList.add("open");
                lightbox.setAttribute("aria-hidden", "false");
                body.style.overflow = "hidden";
                lightboxClose.focus();
            });
        });

        lightboxClose.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && lightbox.classList.contains("open")) {
                closeLightbox();
            }
        });
    }

    const bookingForm = document.getElementById("booking-form");
    const bookingDate = document.getElementById("booking-date");
    const bookingTime = document.getElementById("booking-time");
    const formStatus = document.getElementById("form-status");

    function getLocalDateString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    if (bookingDate) {
        bookingDate.min = getLocalDateString();
    }

    if (bookingForm && formStatus) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();
            formStatus.textContent = "";

            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            if (bookingDate && bookingDate.value < getLocalDateString()) {
                formStatus.textContent = "Please choose today or a future date.";
                return;
            }

            if (bookingTime &&
                (bookingTime.value < "09:00" || bookingTime.value > "22:00")) {
                formStatus.textContent = "Please choose a time between 9:00 AM and 10:00 PM.";
                return;
            }

            formStatus.textContent =
                "Thank you! Your demo booking request has been validated successfully.";
            formStatus.style.color = "var(--accent)";

            bookingForm.reset();

            if (bookingDate) {
                bookingDate.min = getLocalDateString();
            }
        });
    }
});
