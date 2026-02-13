/* ============================== Aside ============================ */
const nav = document.querySelector(".nav"),
      navList = nav.querySelectorAll("li"),
      totalNavList = navList.length,
      allSection = document.querySelectorAll(".section"),
      totalSection = allSection.length;

// Add overlay to body
const overlay = document.createElement("div");
overlay.classList.add("overlay");
document.body.appendChild(overlay);

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    a.addEventListener("click", function (e) {
        e.preventDefault();
        removeBackSection();
        for (let j = 0; j < totalNavList; j++) {
            if (navList[j].querySelector("a").classList.contains("active")) {
                addBackSection(j);
            }
            navList[j].querySelector("a").classList.remove("active");
            navList[j].querySelector("a").removeAttribute("aria-current");
        }
        this.classList.add("active");
        this.setAttribute("aria-current", "page");
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
    navTogglerBtn.setAttribute("aria-expanded", "false");
    overlay.classList.remove("active");
});

function asideSectionTogglerBtn() {
    aside.classList.toggle("open");
    navTogglerBtn.classList.toggle("open");
    
    const isOpen = aside.classList.contains("open");
    navTogglerBtn.setAttribute("aria-expanded", isOpen);

    if (isOpen) {
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

/* ============================== Last Update Date ============================ */
document.addEventListener("DOMContentLoaded", function () {
    const lastUpdateDate = new Date("2026-02-12");
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = lastUpdateDate.toLocaleDateString('en-GB', options);

    const lastUpdateDiv = document.getElementById("last-update");
    if (lastUpdateDiv) {
        lastUpdateDiv.textContent = "Last update: " + formattedDate;
    }

    const lastUpdateCV = document.getElementById("last-update-cv");
    if (lastUpdateCV) {
        lastUpdateCV.textContent = "Last update: " + formattedDate;
    }

    const lastUpdateRes = document.getElementById("last-update-res");
    if (lastUpdateRes) {
        lastUpdateRes.textContent = "Last update: " + formattedDate;
    }
});


/* ============================== Publications Abstract Toggle ============================ */
function toggleAbstract(abstractId) {
    const abstractContent = document.getElementById(abstractId);
    const button = document.querySelector(`[onclick="toggleAbstract('${abstractId}')"]`);
    
    if (abstractContent.classList.contains('expanded')) {
        abstractContent.classList.remove('expanded');
        button.classList.remove('active');
    } else {
        // Close all other open abstracts
        document.querySelectorAll('.abstract-content.expanded').forEach(content => {
            content.classList.remove('expanded');
        });
        document.querySelectorAll('.abstract-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Open the selected one
        abstractContent.classList.add('expanded');
        button.classList.add('active');
    }
}

/* ============================== Publications Filters ============================ */
window.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.src_timeline-item');
    
    if (filterButtons.length === 0 || timelineItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Filter publications
            timelineItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'flex';
                    setTimeout(() => item.classList.add('show'), 10);
                } else if (filterValue === 'journal' || filterValue === 'conference') {
                    if (item.getAttribute('data-type') === filterValue) {
                        item.style.display = 'flex';
                        setTimeout(() => item.classList.add('show'), 10);
                    } else {
                        item.classList.remove('show');
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                } else {
                    // Year filter
                    if (item.getAttribute('data-year') === filterValue) {
                        item.style.display = 'flex';
                        setTimeout(() => item.classList.add('show'), 10);
                    } else {
                        item.classList.remove('show');
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                }
            });
        });
    });
    
    // Initialize all items as visible
    timelineItems.forEach(item => {
        item.classList.add('show');
    });
});

/* ============================== Scroll to Top Button ============================ */
window.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollToTopBtn) return;
    
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});