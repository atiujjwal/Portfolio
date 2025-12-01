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

// FORM SUBMISSION
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
            status.innerHTML = "Thanks for your message! I'll get in touch with you soon.";
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

if (form) {
    form.addEventListener("submit", handleSubmit);
}

// --- PROJECT MODAL LOGIC (New) ---

const modal = document.getElementById("project-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-description");
const modalImage = document.getElementById("modal-image");
const modalTags = document.getElementById("modal-tags");
const modalLiveLink = document.getElementById("modal-live-link");
const modalGithubLink = document.getElementById("modal-github-link");

// 1. Select all triggers (Expand Buttons)
const expandButtons = document.querySelectorAll(".card-expand-btn");

function openModal(card) {
    // Get data from data attributes
    const title = card.getAttribute("data-title");
    const desc = card.getAttribute("data-desc");
    const image = card.getAttribute("data-image");
    const live = card.getAttribute("data-live");
    const github = card.getAttribute("data-github");
    const tags = card.getAttribute("data-tags");

    // Populate Modal
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalImage.src = image;

    // Handle Tags (CSV string to HTML)
    modalTags.innerHTML = "";
    if (tags) {
        tags.split(",").forEach(tag => {
            const span = document.createElement("span");
            span.className = "project-tag";
            span.textContent = tag.trim();
            modalTags.appendChild(span);
        });
    }

    // Handle Links (Show/Hide logic)
    if (live && live !== "#" && live.trim() !== "") {
        modalLiveLink.href = live;
        modalLiveLink.classList.remove("hidden");
    } else {
        modalLiveLink.classList.add("hidden");
    }

    if (github && github !== "#" && github.trim() !== "") {
        modalGithubLink.href = github;
        modalGithubLink.classList.remove("hidden");
    } else {
        modalGithubLink.classList.add("hidden");
    }

    // Show Modal & Disable Scroll
    if (modal) {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
}

// Event Listeners for Expand Buttons
expandButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent bubbling if card also has a listener
        const card = btn.closest(".project-card");
        openModal(card);
    });
});

// Allow clicking the card thumbnail to open modal as well
document.querySelectorAll(".project-thumb").forEach(thumb => {
    thumb.addEventListener("click", (e) => {
        const card = thumb.closest(".project-card");
        openModal(card);
    });
});

// Close Button Listener
if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
}

// Click Outside to Close
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// ESC Key to Close
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
        closeModal();
    }
});