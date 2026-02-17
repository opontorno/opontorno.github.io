/* ============================== Initialization Function ============================ */
function initializeWebsite() {

/* ============================== Load Stats from JSON (Updated by Semantic Scholar API) ============================ */
fetch('data/stats.json')
    .then(response => response.json())
    .then(data => {
        // Update research stat numbers with counter animation
        if (data.publications) animateValue('stat-publications', 0, data.publications, 1500);
        if (data.citations) animateValue('stat-citations', 0, data.citations, 1500);
        if (data.h_index) animateValue('stat-h-index', 0, data.h_index, 1200);
        if (data.most_cited) animateValue('stat-most-cited', 0, data.most_cited, 1500);
        
        // Update GitHub stat numbers with counter animation
        if (data.github) {
            if (data.github.public_repos) animateValue('stat-repos', 0, data.github.public_repos, 1500);
            if (data.github.total_stars) animateValue('stat-stars', 0, data.github.total_stars, 1500);
            if (data.github.followers) animateValue('stat-followers', 0, data.github.followers, 1500);
            if (data.github.total_forks) animateValue('stat-forks', 0, data.github.total_forks, 1500);
            
            // Update Projects page stats (without plus sign)
            if (data.github.public_repos) animateValue('projects-repos', 0, data.github.public_repos, 1500, false);
            if (data.github.total_stars) animateValue('projects-stars', 0, data.github.total_stars, 1500, false);
            if (data.github.total_forks) animateValue('projects-forks', 0, data.github.total_forks, 1500, false);
            if (data.github.followers) animateValue('projects-followers', 0, data.github.followers, 1500, false);
            
            // Load featured projects
            if (data.github.featured_projects && data.github.featured_projects.length > 0) {
                loadFeaturedProjects(data.github.featured_projects);
                loadTopicsCloud(data.github.featured_projects);
                loadQuickInsights(data.github.featured_projects, data.github.top_languages);
            }
            
            // Load language distribution
            if (data.github.top_languages) {
                loadLanguageDistribution(data.github.top_languages);
            }
        }
        
        // Update paper citations automatically
        if (data.publications_details) {
            updatePaperCitations(data.publications_details);
        }
        
        // Update Research Activities statistics
        if (data.publications) animateValue('research-publications', 0, data.publications, 1500);
        if (data.citations) animateValue('research-citations', 0, data.citations, 1500);
        if (data.h_index) animateValue('research-h-index', 0, data.h_index, 1200, false);
        if (data.most_cited) animateValue('research-most-cited', 0, data.most_cited, 1500);
        if (data.coauthors) animateValue('research-coauthors', 0, data.coauthors, 1500);
        if (data.influential_citations !== undefined) animateValue('research-influential', 0, data.influential_citations, 1500, false);
        if (data.years_active) animateValue('research-years', 0, data.years_active, 1200, false);
        if (data.avg_citations) animateValueDecimal('research-avg-citations', 0, data.avg_citations, 1500);
        
        // Update co-authors count if available
        if (data.coauthors) {
            const coauthorsEl = document.getElementById('stat-coauthors');
            if (coauthorsEl) {
                animateValue('stat-coauthors', 0, data.coauthors, 1500);
            }
        }
        
        // Update "Last update" dates from stats.json
        if (data.last_updated) {
            const lastUpdateDate = new Date(data.last_updated);
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
        }
        
        console.log('📊 Stats loaded from Semantic Scholar (updated:', data.last_updated + ')');
        if (data.github) {
            console.log('🐙 GitHub stats loaded');
        }
    })
    .catch(error => {
        console.log('ℹ️ Using default stats');
    });

// Counter animation function
function animateValue(id, start, end, duration, showPlus = true) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (showPlus ? '+' : '');
    }, 16);
}

// Counter animation for decimal values
function animateValueDecimal(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(1);
    }, 16);
}

// Update paper citations from stats.json
function updatePaperCitations(publications) {
    // Mapping between paper keys and titles in stats.json
    const paperMapping = {
        'deepfeaturex-sn': 'DeepFeatureX-SN',
        'wild': 'WILD',
        'deepfeaturex-net': 'DeepFeatureX Net',
        'dct-traces': 'DCT-Traces'
    };
    
    // Get all timeline items with citation badges
    const timelineItems = document.querySelectorAll('.src_timeline-item[data-paper-key]');
    
    timelineItems.forEach(item => {
        const paperKey = item.getAttribute('data-paper-key');
        const citationBadge = item.querySelector('.citation-badge');
        
        if (!citationBadge || !paperKey) return;
        
        // Find matching publication in stats.json by title pattern
        const publication = publications.find(pub => {
            const pubTitle = pub.title.toLowerCase();
            const searchKey = paperMapping[paperKey];
            
            if (!searchKey) return false;
            
            return pubTitle.includes(searchKey.toLowerCase());
        });
        
        if (publication) {
            const citations = publication.citations || 0;
            const citationText = citations === 1 ? '1 citation' : `${citations} citations`;
            citationBadge.innerHTML = `<i class="fas fa-quote-right"></i> ${citationText}`;
            
            // Add animation
            citationBadge.style.opacity = '0';
            setTimeout(() => {
                citationBadge.style.transition = 'opacity 0.5s ease';
                citationBadge.style.opacity = '1';
            }, 100);
        }
    });
    
    console.log('✅ Paper citations updated from Semantic Scholar');
}

// Load and display featured projects
function loadFeaturedProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container || !projects.length) return;
    
    container.innerHTML = '';
    
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Limit topics to first 4
        const topicsHTML = project.topics && project.topics.length > 0
            ? project.topics.slice(0, 4).map(topic => 
                `<span class="project-topic">${topic}</span>`
              ).join('')
            : '';
        
        card.innerHTML = `
            <div class="project-header">
                <div class="project-title">
                    <h4>${project.name.replace(/-/g, ' ')}</h4>
                </div>
                ${project.language ? `<span class="project-language">${project.language}</span>` : ''}
            </div>
            <p class="project-description">${project.description || 'No description available'}</p>
            <div class="project-footer">
                ${topicsHTML ? `<div class="project-topics">${topicsHTML}</div>` : '<div class="project-topics"></div>'}
                <div class="project-stats">
                    <div class="project-stat-group">
                        <span class="project-stat">
                            <i class="fas fa-star"></i> ${project.stars}
                        </span>
                        <span class="project-stat">
                            <i class="fas fa-code-fork"></i> ${project.forks}
                        </span>
                    </div>
                    <a href="${project.url}" class="project-link" target="_blank" rel="noopener noreferrer">
                        GitHub <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        // Animate card entrance
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Load and display language distribution
function loadLanguageDistribution(languages) {
    const container = document.getElementById('languages-chart');
    if (!container || !languages) return;
    
    container.innerHTML = '';
    
    // Get language class name for icon
    function getLanguageClass(lang) {
        return lang.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'p');
    }
    
    // Handle both array format [{name, percentage}] and object format {lang: percentage}
    let sortedLangs;
    if (Array.isArray(languages)) {
        sortedLangs = languages
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 10)  // Top 10 languages
            .map(lang => [lang.name, lang.percentage]);
    } else {
        sortedLangs = Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);  // Top 10 languages
    }
    
    sortedLangs.forEach(([language, percentage], index) => {
        const bar = document.createElement('div');
        bar.className = 'language-bar';
        
        const langClass = getLanguageClass(language);
        
        bar.innerHTML = `
            <div class="language-header">
                <div class="language-name">
                    <span class="language-icon ${langClass}"></span>
                    ${language}
                </div>
                <span class="language-percent">${percentage}%</span>
            </div>
            <div class="language-progress">
                <div class="language-progress-bar" data-percentage="${percentage}" style="width: 0%"></div>
            </div>
        `;
        
        container.appendChild(bar);
        
        // Animate progress bar
        setTimeout(() => {
            const progressBar = bar.querySelector('.language-progress-bar');
            progressBar.style.width = percentage + '%';
        }, (index + 1) * 200);
    });
}

// Load and display topics cloud
function loadTopicsCloud(projects) {
    const container = document.getElementById('topics-cloud');
    if (!container || !projects) return;
    
    container.innerHTML = '';
    
    // Extract and count all topics
    const topicsCount = {};
    projects.forEach(project => {
        if (project.topics && Array.isArray(project.topics)) {
            project.topics.forEach(topic => {
                topicsCount[topic] = (topicsCount[topic] || 0) + 1;
            });
        }
    });
    
    // Sort topics by count
    const sortedTopics = Object.entries(topicsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Show top 10 topics
    
    if (sortedTopics.length === 0) {
        container.innerHTML = '<p style="color: var(--text-black-700); text-align: center; width: 100%;">No topics found</p>';
        return;
    }
    
    // Get max count for sizing
    const maxCount = sortedTopics[0][1];
    
    sortedTopics.forEach(([topic, count], index) => {
        const tag = document.createElement('div');
        tag.className = 'topic-tag';
        
        // Add size class based on count
        if (count >= maxCount * 0.7) {
            tag.classList.add('size-lg');
        } else if (count >= maxCount * 0.4) {
            tag.classList.add('size-md');
        } else {
            tag.classList.add('size-sm');
        }
        
        tag.innerHTML = `
            <span class="topic-name">${topic}</span>
            <span class="topic-count">${count}</span>
        `;
        
        // Add animation delay
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        
        container.appendChild(tag);
        
        // Animate tag entrance
        setTimeout(() => {
            tag.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
        }, index * 50);
    });
}

// Load quick insights
function loadQuickInsights(projects, languages) {
    // Most starred project
    const mostStarred = projects.reduce((max, project) => 
        project.stars > max.stars ? project : max, projects[0]);
    
    const mostStarredEl = document.getElementById('insight-most-starred');
    if (mostStarredEl && mostStarred) {
        mostStarredEl.innerHTML = `
            <span>${mostStarred.name.replace(/-/g, ' ')}</span>
            <i class="fas fa-star" style="font-size: 0.9rem;"></i>
            <span style="font-size: 1rem; color: var(--bg-second);">${mostStarred.stars}</span>
        `;
    }
    
    // Primary language
    const primaryLangEl = document.getElementById('insight-primary-lang');
    if (primaryLangEl && languages) {
        let primaryLang;
        if (Array.isArray(languages)) {
            primaryLang = languages[0]?.name || 'N/A';
        } else {
            const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);
            primaryLang = sorted[0]?.[0] || 'N/A';
        }
        primaryLangEl.textContent = primaryLang;
    }
    
    // Top topic
    const topicsCount = {};
    projects.forEach(project => {
        if (project.topics && Array.isArray(project.topics)) {
            project.topics.forEach(topic => {
                topicsCount[topic] = (topicsCount[topic] || 0) + 1;
            });
        }
    });
    
    const topTopicEl = document.getElementById('insight-top-topic');
    if (topTopicEl) {
        const sortedTopics = Object.entries(topicsCount).sort((a, b) => b[1] - a[1]);
        if (sortedTopics.length > 0) {
            topTopicEl.innerHTML = `
                <span>${sortedTopics[0][0]}</span>
                <span style="font-size: 0.9rem; color: var(--bg-second);">(${sortedTopics[0][1]} repos)</span>
            `;
        } else {
            topTopicEl.textContent = 'N/A';
        }
    }
}

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

/* ============================== Publications Filters ============================ */
const filterButtons = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.src_timeline-item');

if (filterButtons.length > 0 && timelineItems.length > 0) {
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
}

/* ============================== Scroll to Top Button ============================ */
const scrollToTopBtn = document.querySelector('.scroll-to-top');

if (scrollToTopBtn) {
    
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
}

} // End of initializeWebsite function

/* ============================== Call Initialization ============================ */
// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    
    // Handle Activities internal navigation
    const activitiesNavLinks = document.querySelectorAll('.activities-nav .nav-item');
    
    if (activitiesNavLinks.length > 0) {
        activitiesNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Navigation link clicked:', this.getAttribute('href')); // Debug log
                
                const targetHref = this.getAttribute('href');
                const activitiesSection = document.getElementById('activities');
                const targetElement = document.querySelector(targetHref);
                
                if (!activitiesSection || !targetElement) {
                    console.error('Section or target element not found!');
                    return;
                }
                
                // Check if activities section is already active
                const alreadyActive = activitiesSection.classList.contains('active');
                
                if (!alreadyActive) {
                    // Activate activities section first
                    document.querySelectorAll('.section').forEach(section => {
                        section.classList.remove('active');
                        section.classList.remove('back-section');
                    });
                    activitiesSection.classList.add('active');
                    
                    // Update nav
                    document.querySelectorAll('.nav a').forEach(navLink => {
                        navLink.classList.remove('active');
                        navLink.removeAttribute('aria-current');
                    });
                    const activitiesNavLink = document.querySelector('.nav a[href="#activities"]');
                    if (activitiesNavLink) {
                        activitiesNavLink.classList.add('active');
                        activitiesNavLink.setAttribute('aria-current', 'page');
                    }
                }
                
                // Scroll to target element within the section
                // Use a small delay to ensure section is rendered if it was just activated
                const delay = alreadyActive ? 0 : 200;
                setTimeout(() => {
                    const targetPosition = targetElement.offsetTop;
                    console.log('Scrolling to position:', targetPosition); // Debug log
                    
                    // Scroll the section container to the target element
                    activitiesSection.scrollTo({
                        top: targetPosition - 100, // 100px offset from top
                        behavior: 'smooth'
                    });
                }, delay);
            });
        });
    }
    
    // Handle CTA buttons in home section
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    ctaButtons.forEach(button => {
        if (button.getAttribute('href') && button.getAttribute('href').startsWith('#')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Hide all sections
                    document.querySelectorAll('.section').forEach(section => {
                        section.classList.remove('active');
                        section.classList.remove('back-section');
                    });
                    
                    // Show target section
                    targetSection.classList.add('active');
                    
                    // Update navigation
                    document.querySelectorAll('.nav a').forEach(navLink => {
                        navLink.classList.remove('active');
                        navLink.removeAttribute('aria-current');
                    });
                    
                    const navLink = document.querySelector(`.nav a[href="#${targetId}"]`);
                    if (navLink) {
                        navLink.classList.add('active');
                        navLink.setAttribute('aria-current', 'page');
                    }
                    
                    // Close mobile menu if open
                    if (window.innerWidth < 1200) {
                        const aside = document.querySelector('.aside');
                        const navToggler = document.querySelector('.nav-toggler');
                        const overlay = document.querySelector('.overlay');
                        
                        aside.classList.remove('open');
                        navToggler.classList.remove('open');
                        navToggler.setAttribute('aria-expanded', 'false');
                        overlay.classList.remove('active');
                    }
                    
                    // Scroll to top of section
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }
            });
        }
    });
});

// Make toggleAbstract globally available
window.toggleAbstract = function(abstractId) {
    const abstractContent = document.getElementById(abstractId);
    const button = document.querySelector(`[onclick="toggleAbstract('${abstractId}')"]`);
    
    if (abstractContent && button) {
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
};
/* ============================== Timeline Interactive Features ============================ */
// Timeline filters
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.timeline-filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter timeline items
            timelineItems.forEach(item => {
                const type = item.getAttribute('data-type');
                
                if (filter === 'all' || filter === type) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
    
    // Timeline item expand/collapse
    timelineItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('expanded');
        });
    });
});
