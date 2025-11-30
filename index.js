document.getElementById("year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

document
    .querySelectorAll(".reveal")
    .forEach((el) => observer.observe(el));

// Active nav link on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveLink() {
    let currentId = "home";
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
            currentId = section.id;
        }
    });

    navLinks.forEach((link) => {
        if (link.getAttribute("href") === "#" + currentId) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);

// THEME TOGGLE LOGIC
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function applyTheme(mode) {
    if (mode === "light") {
        document.body.classList.add("light-mode");
       themeIcon.src = "images/dark_theme.png";
    } else {
        document.body.classList.remove("light-mode");
        themeIcon.src = "images/light_theme.png";
    }
}

(function initTheme() {
    const stored = localStorage.getItem("theme");
    let mode = stored;
    if (!mode) {
        const prefersLight =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: light)").matches;
        mode = prefersLight ? "light" : "dark";
    }
    applyTheme(mode);
})();

themeToggleBtn.addEventListener("click", () => {
    const current = document.body.classList.contains("light-mode") ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";

    applyTheme(next);
    localStorage.setItem("theme", next);
});



const form = document.getElementById("contact-form");

async function handleSubmit(event) {
    event.preventDefault();
    const status = document.getElementById("my-form-status");
    const data = new FormData(event.target);

    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "Thanks for your message! I'll get in touch with you soon.";         //TODO: show a popup
            status.style.color = "#36a75fff";
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form";
                    status.style.color = "#ef4444";
                }
            })
        }
    }).catch(error => {
        status.innerHTML = "Oops! There was a problem submitting your form";
        status.style.color = "#ef4444";
    });
}

form.addEventListener("submit", handleSubmit);