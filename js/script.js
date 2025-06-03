/* ============================== Aside ============================ */
const nav = document.querySelector(".nav"),
      navList = nav.querySelectorAll("li"),
      totalNavList = navList.length,
      allSection = document.querySelectorAll(".section"),
      totalSection = allSection.length;

// Aggiunta dell'overlay al body
const overlay = document.createElement("div");
overlay.classList.add("overlay");
document.body.appendChild(overlay);

for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    a.addEventListener("click", function () {
        removeBackSection();
        for (let j = 0; j < totalNavList; j++) {
            if (navList[j].querySelector("a").classList.contains("active")) {
                addBackSection(j);
            }
            navList[j].querySelector("a").classList.remove("active");
        }
        this.classList.add("active");
        showSection(this);
        if (window.innerWidth < 1200) {
            asideSectionTogglerBtn();
        }
    });
}

document.querySelector(".logo a").addEventListener("click", function (event) {
    event.preventDefault();
    removeBackSection();
    showSection(this);
    updateNav(this);
});

function removeBackSection() {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("back-section");
    }
}

function addBackSection(num) {
    allSection[num].classList.add("back-section");
}

function showSection(element) {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("active");
    }
    const target = element.getAttribute("href").split("#")[1];
    document.querySelector("#" + target).classList.add("active");
}

function updateNav(element) {
    for (let i = 0; i < totalNavList; i++) {
        navList[i].querySelector("a").classList.remove("active");
        const target = element.getAttribute("href").split("#")[1];
        if (target === navList[i].querySelector("a").getAttribute("href").split("#")[1]) {
            navList[i].querySelector("a").classList.add("active");
        }
    }
}

const navTogglerBtn = document.querySelector(".nav-toggler"),
      aside = document.querySelector(".aside");

navTogglerBtn.addEventListener("click", () => {
    asideSectionTogglerBtn();
});

overlay.addEventListener("click", () => {
    aside.classList.remove("open");
    navTogglerBtn.classList.remove("open");
    overlay.classList.remove("active");
});

function asideSectionTogglerBtn() {
    aside.classList.toggle("open");
    navTogglerBtn.classList.toggle("open");

    if (aside.classList.contains("open")) {
        overlay.classList.add("active");
    } else {
        overlay.classList.remove("active");
    }
}

/* ========================== Dark/Light Mode Toggle =========================== */
const dayNight = document.querySelector(".day-night");

dayNight.addEventListener("click", () => {
    dayNight.querySelector("i").classList.toggle("fa-sun");
    dayNight.querySelector("i").classList.toggle("fa-moon");
    document.body.classList.toggle("dark");
});

window.addEventListener("load", () => {
    if (document.body.classList.contains("dark")) {
        dayNight.querySelector("i").classList.add("fa-sun");
    } else {
        dayNight.querySelector("i").classList.add("fa-moon");
    }
});

/* ============================== Skills ============================ */
document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-GB', options);
    const lastUpdateDiv = document.getElementById("last-update");

    if (lastUpdateDiv) {
        lastUpdateDiv.textContent = "Last update: " + formattedDate;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-GB', options);

    const lastUpdateCV = document.getElementById("last-update-cv");
    if (lastUpdateCV) {
        lastUpdateCV.textContent = "Last update: " + formattedDate;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-GB', options);

    const lastUpdateCV = document.getElementById("last-update-res");
    if (lastUpdateCV) {
        lastUpdateCV.textContent = "Last update: " + formattedDate;
    }
});