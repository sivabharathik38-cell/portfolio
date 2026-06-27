/* ==========================================================================
   Interactive Particles Background Canvas
   ========================================================================== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null, radius: 120 };

// Resize canvas to match screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off screen boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Mouse hover pushing effect (gentle)
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius && mouse.x !== null) {
            let force = (mouse.radius - dist) / mouse.radius;
            let angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 1.5;
            this.y += Math.sin(angle) * force * 1.5;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    let particleCount = Math.floor((canvas.width * canvas.height) / 11000);
    // Limit range for stability
    if (particleCount < 40) particleCount = 40;
    if (particleCount > 130) particleCount = 130;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    let maxDistance = 110;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
                // Fade opacity based on proximity distance
                let alpha = (1 - (dist / maxDistance)) * 0.18;
                ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
        
        // Connect particles to mouse
        if (mouse.x !== null) {
            let dx = particles[i].x - mouse.x;
            let dy = particles[i].y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                let alpha = (1 - (dist / mouse.radius)) * 0.25;
                ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

// Mouse events listener
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', resizeCanvas);

// Launch Particles
resizeCanvas();
animateParticles();

/* ==========================================================================
   Typewriter Effect (Hero Section)
   ========================================================================== */
const typewriterElement = document.getElementById('typewriter');
const phrases = [
    "B.E. Computer Science Student",
    "Full-Stack Web Developer",
    "Robotics & IoT Developer",
    "UI/UX Design Enthusiast"
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 90;

function handleTypewriter() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40; // delete faster
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 95; // regular typing
    }

    // Finished typing phrase
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 1600; // Pause at end of phrase
    } 
    // Finished deleting phrase
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 300; // Pause before typing next phrase
    }

    setTimeout(handleTypewriter, typeSpeed);
}

// Start Typewriter
setTimeout(handleTypewriter, 1000);

/* ==========================================================================
   Sticky Header & Scrollspy active tracking
   ========================================================================== */
const header = document.querySelector('.header');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    // Add scroll shrink class
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Scrollspy navigation highlight
    let currentId = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 90;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentId = section.getAttribute('id');
        }
    });

    if (currentId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    }
});

/* ==========================================================================
   Responsive Hamburger Toggle
   ========================================================================== */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when links are clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

/* ==========================================================================
   Interactive Skills Bars (Trigger when scrolled into viewport)
   ========================================================================== */
const skillsSection = document.getElementById('skills');
const progressFills = document.querySelectorAll('.progress-fill');

const observerOptions = {
    root: null,
    threshold: 0.15
};

const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            progressFills.forEach(fill => {
                // Get target width from style attribute or set manually
                const targetWidth = fill.style.width;
                fill.style.width = '0%';
                // Force layout reflow
                fill.offsetHeight;
                fill.style.width = targetWidth;
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

skillsObserver.observe(skillsSection);

/* ==========================================================================
   Project Filters logic
   ========================================================================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle active button state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            
            // Animation out
            card.style.transform = 'scale(0.95)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Trigger reflow
                    card.offsetHeight;
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                }
            }, 300);
        });
    });
});

/* ==========================================================================
   Projects Details Database & Modal Controller
   ========================================================================== */
const projectData = {
    sih: {
        title: "SIH: Virtual Herbal Garden",
        category: "Web & IoT Integration",
        tech: "HTML5, CSS3, JavaScript, WebGL (interactive layouts), Plant Database API",
        desc: "Developed an interactive digital web catalog representing Virtual Herbal Gardens during the Smart India Hackathon (SIH). This project aims to digitize and visualize a diverse library of medicinal plants to facilitate education, exploration, and identification of medicinal herbal species.",
        highlights: [
            "Participated as a key developer under the SIH National Hackathon initiative.",
            "Designed a highly responsive search index featuring categorization filters for plant applications, geographical origins, and medicinal benefits.",
            "Built interactive 2.5D visual greenhouse sections representing virtual vegetation hubs.",
            "Integrated user engagement panels with informative infographics explaining extract dosage recipes."
        ]
    },
    fleet: {
        title: "Fleet Management System",
        category: "Full-Stack Software Development",
        tech: "Java, Spring Boot, MySQL, CSS, JavaScript, Leaflet Maps API",
        desc: "Designed and presented a complete Fleet Management application for the Science Day Competition. The software assists organizations in scheduling vehicle routes, monitoring dispatch timelines, tracking fuel logs, and analyzing telemetry databases.",
        highlights: [
            "Showcased at NPR Science Day Competition, receiving high remarks from judges.",
            "Engineered secure Spring Boot endpoints validating multi-role permissions (Admins, Dispatchers, Drivers).",
            "Incorporated Map API routing showing live simulation tracking vectors between depots.",
            "Implemented charts mapping vehicle fuel costs, maintenance logs, and idle timings records."
        ]
    },
    movie: {
        title: "Responsive Movie Search System",
        category: "Frontend Development",
        tech: "HTML5, CSS3, Vanilla JavaScript, OMDb REST API API",
        desc: "Developed a clean, modern, responsive film catalog search portal. Users can input keywords to query cinematic parameters (cast, synopsis, ratings, posters) in real time with high loading speeds.",
        highlights: [
            "Utilized asynchronous JavaScript Fetch routines mapping public IMDb/OMDb rest APIs.",
            "Crafted a mobile-first responsive grid using flexible CSS flex/grid layout patterns.",
            "Engineered typing delay debounce logic to reduce redundant network API requests.",
            "Implemented bookmark lists allowing visitors to cache favorites directly inside browser LocalStorage."
        ]
    },
    "attendance-ai": {
        title: "Smart Attendance (AI Face Recognition)",
        category: "Artificial Intelligence & Web App",
        tech: "Python, OpenCV, face_recognition model, SQLite, HTML5, CSS3, JavaScript",
        desc: "Automated standard class roll-call procedures using vision-based face recognition. Students look at a hardware camera node, which instantly compares facial landmarks against database templates to mark presence status.",
        highlights: [
            "Replaced slow manual attendance logs with instant automated camera scans.",
            "Integrated OpenCV image processing frames to verify facial landmarks in milliseconds.",
            "Connected Python backend data pipelines to a clean web dashboard showing class occupancy charts.",
            "Configured auto-reporting triggers compiling daily attendance sheets into printable tables."
        ]
    },
    "temp-iot": {
        title: "IoT Weather & Climate Monitoring System",
        category: "Robotics & Internet of Things",
        tech: "Arduino, C++, DHT11 Sensor, ESP8266 Wi-Fi Module, ThinkSpeak IoT Cloud, Web API Dashboard",
        desc: "Designed a real-time climate telemetry node using physical microcontrollers. The system gathers temperature/humidity readings from a DHT11 device and broadcasts telemetry metrics via Wi-Fi to a web visualization portal.",
        highlights: [
            "Programmed Arduino hardware logic controlling sensor frequencies and threshold buffers.",
            "Integrated ESP8266 network routing sending HTTP GET request telemetry streams to IoT clouds.",
            "Designed a clean frontend dashboard showing temperature history gauges and humidity cycles.",
            "Coded automated web alert indicators notifying users if room temperatures exceed target bounds."
        ]
    },
    "timer-arduino": {
        title: "Smart Reaction Timer Arcade Game",
        category: "Embedded Hardware & Game Logic",
        tech: "Arduino Uno, Liquid Crystal Display (LCD), LED Arrays, Push Buttons, C++ Logic",
        desc: "Wired an interactive hardware reflex testing game utilizing physical microcontrollers. Players await a randomized LED cue and hit trigger buttons, and the system outputs reaction times in milliseconds on an LCD screen.",
        highlights: [
            "Designed state machine logic inside Arduino firmware managing game cycles (Idle, Cue, Timing, Score).",
            "Configured high-accuracy interrupt routines calculating microsecond push-button latency.",
            "Integrated physical LCD 16x2 panel readouts showing personal high-score records.",
            "Built a structural cardboard enclosure with arcade-style layout buttons."
        ]
    },
    "chatbot-cake": {
        title: "Cake Ordering Dialogflow Agent",
        category: "Conversational Artificial Intelligence",
        tech: "Google Dialogflow, Natural Language Processing, Webhooks Integration",
        desc: "Created a production-ready cake ordering bot with advanced intent matching. The chatbot interprets customer speech requests, queries bakery flavors/sizes, catalogs user delivery details, and confirms invoice values.",
        highlights: [
            "Constructed NLP intent workflows parsing custom variables (Flavor, Size, Shape, Delivery Date).",
            "Configured fallback routes answering user queries (Pricing info, Shop location, allergy concerns).",
            "Implemented structured rich text responses displaying card buttons and order forms.",
            "Simulated CRM webhook connections routing confirmed order invoices to backend logs."
        ]
    },
    "java-management": {
        title: "Student Management ERP System",
        category: "Java Desktop & Database System",
        tech: "Java Swing (GUI), JDBC, MySQL, JasperReports API",
        desc: "Built a robust administrative software managing academic records. The software catalogs student info, marks exams, audits attendance, and handles administrative class schedules safely.",
        highlights: [
            "Constructed a secure local client using Java Swing GUI panels with modular layout designs.",
            "Authored optimized JDBC queries communicating with a structured relational MySQL database.",
            "Created audit tables mapping test marks across semesters and graphing class GPA distributions.",
            "Integrated printing frameworks allowing administration to output official transcripts."
        ]
    },
    "floor-iot": {
        title: "INTELL-FLOOR: Smart Automation",
        category: "Robotics & Smart Building Solutions",
        tech: "Arduino microcontroller, Ultrasonic Sensors, Force Transducers, Active LED Arrays, Piezo Sirens",
        desc: "Developed an intelligent flooring grid for smart building automations. Using arrays of force sensors and distance gauges, the microcontroller tracks human movement locations to trigger lights, alarm security loops, or open automatic doorways.",
        highlights: [
            "Wired physical pressure plates registering room weight thresholds and trigger metrics.",
            "Programmed automated lights that activate only on active step pathways to conserve building electricity.",
            "Designed a safety alert routine firing audio sirens if weight levels indicate falls in elderly care settings.",
            "Configured serial monitoring outputting occupancy charts showing active zones."
        ]
    },
    revora: {
        title: "REVORA: Car Dealership Manager",
        category: "Business ERP & Web Portals",
        tech: "HTML5, CSS3, JavaScript, Java Backend, MySQL Database Integration",
        desc: "Engineered a professional portal optimizing vehicle dealer operations. Sales representatives can query vehicle models, book customer test-drives, log financial sales, and generate invoices reports.",
        highlights: [
            "Engineered catalog search systems filtering vehicles by cost, engine variant, and model years.",
            "Created responsive scheduling tools checking showroom slot availability for test drives.",
            "Integrated MySQL schemas storing client billing histories, sales quotas, and auto inventory assets.",
            "Created dashboard charts tracing dealership revenue trends and high-demand vehicle catalogs."
        ]
    }
};

const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-project-title');
const modalCat = document.getElementById('modal-project-cat');
const modalTech = document.getElementById('modal-project-tech');
const modalDesc = document.getElementById('modal-project-desc');
const modalHighlights = document.getElementById('modal-project-highlights');
const modalBadges = document.getElementById('modal-project-badges');
const modalCloseBtn = document.querySelector('.modal-close');
const projectDetailBtns = document.querySelectorAll('.btn-project-detail');

// Open Modal logic
projectDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        const projectId = card.getAttribute('data-id');
        const data = projectData[projectId];

        if (data) {
            modalTitle.textContent = data.title;
            modalCat.textContent = data.category;
            modalTech.textContent = data.tech;
            modalDesc.textContent = data.desc;

            // Clear previous items
            modalHighlights.innerHTML = '';
            modalBadges.innerHTML = '';

            // Append Highlights
            data.highlights.forEach(point => {
                const li = document.createElement('li');
                li.textContent = point;
                modalHighlights.appendChild(li);
            });

            // Append Tech badges
            const techList = data.tech.split(', ');
            techList.forEach(t => {
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = t;
                modalBadges.appendChild(span);
            });

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        }
    });
});

// Close Modal logic
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Resume scrolling
}

modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Esc Key closes modal
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

/* ==========================================================================
   Interactive Chatbot ("Siva-Bot" Logic)
   ========================================================================== */
const chatWidget = document.querySelector('.chatbot-widget');
const chatToggleBtn = document.querySelector('.chatbot-toggle-btn');
const chatCloseIcon = document.querySelector('.chat-close-icon');
const chatToggleIcon = document.querySelector('.chat-toggle-icon');
const chatMsgContainer = document.getElementById('chatbot-msg-container');
const chatOptsContainer = document.getElementById('chatbot-opts-container');

// Toggle chat window open/closed
chatToggleBtn.addEventListener('click', () => {
    chatWidget.classList.toggle('active');
    
    if (chatWidget.classList.contains('active')) {
        chatToggleIcon.style.display = 'none';
        chatCloseIcon.style.display = 'block';
    } else {
        chatToggleIcon.style.display = 'block';
        chatCloseIcon.style.display = 'none';
    }
});

// Bot Responses Matrix
const botResponses = {
    about: {
        messages: [
            "Sivabharathi is a 4th-year Computer Science Engineering student studying at NPR College of Engineering and Technology. 🎓",
            "She maintains a stellar academic record with a <strong>CGPA of 9.48 / 10</strong>. She is highly passionate about Frontend web designs, Java algorithms, and embedded IoT technologies! 💻"
        ]
    },
    projects: {
        messages: [
            "Here are some of Sivabharathi's outstanding projects: 📂",
            "1️⃣ <strong>SIH: Virtual Herbal Garden</strong> - A national hackathon design exploring plant informatics.<br>2️⃣ <strong>Fleet Management System</strong> - A full-stack Java route optimization tool.<br>3️⃣ <strong>INTELL-FLOOR</strong> - A smart building microcontroller sensor network.",
            "You can inspect these codebases directly on her GitHub: <a href='https://github.com/sivabharathik38-cell' target='_blank' style='color:#22d3ee;text-decoration:underline;'>github.com/sivabharathik38-cell</a> 💻",
            "Would you like to explore their details? You can scroll up to the 'Featured Projects' grid to open detailed reviews for all 10 projects! 🌟"
        ]
    },
    internship: {
        messages: [
            "Sivabharathi has completed two valuable industrial internships: 💼",
            "• <strong>Robotics & IoT (5 weeks)</strong>: Programmed Arduino boards, connected DHT11/Ultrasonic sensors, and ESP8266 Wi-Fi modules.<br>• <strong>Fullstack Java Development</strong>: Developed dynamic MVC APIs using Java Spring Boot, mapped MySQL schemas, and crafted web view portals."
        ]
    },
    contact: {
        messages: [
            "You can easily get in touch with Sivabharathi: 📞",
            "📧 <strong>Email</strong>: sivabharathik583223104105@nprcolleges.com<br>📱 <strong>Phone</strong>: +91 9345674919<br>🔗 <strong>GitHub</strong>: <a href='https://github.com/sivabharathik38-cell' target='_blank' style='color:#22d3ee;text-decoration:underline;'>github.com/sivabharathik38-cell</a><br>🔗 <strong>LinkedIn</strong>: <a href='https://www.linkedin.com/in/sivabharathi-k-180a152a5' target='_blank' style='color:#22d3ee;text-decoration:underline;'>Click here to view profile</a>",
            "You can also use the contact form on this page to send a direct message instantly! ✉️"
        ]
    }
};

// Handle Chatbot choice click
const optionButtons = document.querySelectorAll('.chat-opt-btn');

optionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const intent = e.target.getAttribute('data-intent');
        const userText = e.target.textContent;

        // Disable options buttons during processing
        toggleOptionButtons(false);

        // Append User bubble
        appendChatBubble(userText, 'user');

        // Scroll to bottom
        scrollToBottom();

        // Show typing indicator
        showTypingIndicator();

        // Trigger bot responses
        setTimeout(() => {
            removeTypingIndicator();
            const data = botResponses[intent];
            
            // Queue messages sequentially with slight delays
            if (data && data.messages) {
                let delay = 0;
                data.messages.forEach((msg, idx) => {
                    setTimeout(() => {
                        appendChatBubble(msg, 'bot');
                        scrollToBottom();
                        
                        // Re-enable options after the last message finishes printing
                        if (idx === data.messages.length - 1) {
                            toggleOptionButtons(true);
                        }
                    }, delay);
                    delay += 800; // 0.8s gap between bubble arrivals
                });
            }
        }, 1000);
    });
});

function toggleOptionButtons(enable) {
    const btns = chatOptsContainer.querySelectorAll('.chat-opt-btn');
    btns.forEach(b => {
        b.disabled = !enable;
        b.style.opacity = enable ? '1' : '0.5';
        b.style.pointerEvents = enable ? 'all' : 'none';
    });
}

function appendChatBubble(text, sender) {
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = `chat-msg ${sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = text;

    bubbleWrapper.appendChild(bubble);
    chatMsgContainer.appendChild(bubbleWrapper);
}

function showTypingIndicator() {
    const indicatorWrapper = document.createElement('div');
    indicatorWrapper.className = 'chat-msg bot typing-indicator-wrap';
    indicatorWrapper.id = 'chat-typing-indicator';

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = `
        <div class="typing-dots">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;

    indicatorWrapper.appendChild(bubble);
    chatMsgContainer.appendChild(indicatorWrapper);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('chat-typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    chatMsgContainer.scrollTop = chatMsgContainer.scrollHeight;
}

/* ==========================================================================
   Contact Form Submission & Toast trigger
   ========================================================================== */
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span>Sending...</span>
        <svg class="typing-dots" style="width:16px;height:12px;display:inline-block;" viewBox="0 0 24 24"></svg>
    `;

    // Simulate server response delay
    setTimeout(() => {
        // Trigger Toast Notification
        toast.classList.add('active');
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Reset form inputs
        contactForm.reset();

        // Dismiss Toast
        setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);

    }, 1500);
});
