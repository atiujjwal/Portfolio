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
        themeIcon.textContent = "☀";
    } else {
        document.body.classList.remove("light-mode");
        themeIcon.textContent = "☾";
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
    localStorage.setItem("theme", mode);
})();

themeToggleBtn.addEventListener("click", () => {
    const current = document.body.classList.contains("light-mode")
        ? "light"
        : "dark";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("theme", next);
});
