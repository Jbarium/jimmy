// Mobile navigation toggle with improved touch handling
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Check if elements exist before adding event listeners
if (menuToggle && navLinks) {
    // Initialize ARIA attributes
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Function to open menu
    function openMenu() {
        navLinks.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        
        // Add visual indicator to hamburger
        menuToggle.classList.add('active');
    }
    
    // Function to close menu
    function closeMenu() {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        // Remove visual indicator from hamburger
        menuToggle.classList.remove('active');
    }
    
    // Toggle menu on click
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navLinks.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navLinks.contains(e.target) || menuToggle.contains(e.target);
        
        if (!isClickInsideNav && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu when clicking on nav links
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
            menuToggle.focus(); // Return focus to toggle button
        }
    });
    
    // Handle window resize - close menu if window becomes large
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Enhanced smooth scroll for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        // Skip if it's just a hash without target
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Calculate offset for mobile devices
            const isMobile = window.innerWidth <= 768;
            const offset = isMobile ? 90 : 80;
            
            // Use smooth scroll
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Blog posts toggle with improved animation
const blogToggle = document.querySelector('.blog-toggle');
const blogPosts = document.querySelector('.blog-posts');
const toggleText = document.querySelector('.toggle-text');
const toggleIcon = document.querySelector('.toggle-icon');

if (blogToggle && blogPosts) {
    // Initialize toggle state
    blogToggle.setAttribute('aria-expanded', 'false');
    
    blogToggle.addEventListener('click', (e) => {
        e.preventDefault();
        
        const isVisible = blogPosts.classList.contains('visible');
        
        blogPosts.classList.toggle('visible');
        
        if (!isVisible) {
            // Opening posts
            if (toggleText) toggleText.textContent = 'Hide Posts';
            if (toggleIcon) toggleIcon.textContent = '▲';
            blogToggle.setAttribute('aria-expanded', 'true');
            
            // Smooth scroll to blog section on mobile with delay for animation
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    const blogSection = document.querySelector('#blog');
                    if (blogSection) {
                        blogSection.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }
                }, 100);
            }
        } else {
            // Closing posts
            if (toggleText) toggleText.textContent = 'Show Posts';
            if (toggleIcon) toggleIcon.textContent = '▼';
            blogToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Enhanced animation for posts with intersection observer
const posts = document.querySelectorAll('.post');

if (posts.length > 0) {
    // Set initial state for posts
    posts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(30px)';
        post.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });

    // Create intersection observer for better performance
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
    };

    const postObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && blogPosts && blogPosts.classList.contains('visible')) {
                const post = entry.target;
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
                
                // Remove observer after animation
                postObserver.unobserve(post);
            }
        });
    }, observerOptions);

    // Function to reset post animations
    function resetPostAnimations() {
        posts.forEach((post, index) => {
            post.style.opacity = '0';
            post.style.transform = 'translateY(30px)';
            postObserver.observe(post);
        });
    }

    // Observe all posts initially
    posts.forEach(post => {
        postObserver.observe(post);
    });

    // Reset animations when blog toggle is clicked
    if (blogToggle) {
        blogToggle.addEventListener('click', () => {
            setTimeout(() => {
                if (blogPosts && blogPosts.classList.contains('visible')) {
                    resetPostAnimations();
                }
            }, 50);
        });
    }

    // Fallback for browsers without intersection observer
    if (!window.IntersectionObserver) {
        function checkScroll() {
            if (blogPosts && blogPosts.classList.contains('visible')) {
                posts.forEach((post, index) => {
                    const postTop = post.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (postTop < windowHeight - 50) {
                        setTimeout(() => {
                            post.style.opacity = '1';
                            post.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });
            }
        }

        window.addEventListener('load', checkScroll);
        window.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
    }
}

// Add touch feedback for mobile devices
if ('ontouchstart' in window) {
    const touchElements = document.querySelectorAll('.nav-links a, .blog-toggle, .contact-link, .post, .social-links a');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }, { passive: true });
        
        element.addEventListener('touchcancel', function() {
            this.style.transform = '';
        }, { passive: true });
    });
}

// Improve scroll performance with throttling
let ticking = false;

function updateOnScroll() {
    // Add any scroll-based animations here
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick, { passive: true });