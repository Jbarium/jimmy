// Mobile navigation toggle with improved touch handling
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Check if elements exist before adding event listeners
if (menuToggle && navLinks) {
    // Add touch event handling for better mobile experience
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isActive = navLinks.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        
        // Prevent body scroll when menu is open
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navLinks.contains(e.target) || menuToggle.contains(e.target);
        if (!isClickInsideNav && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// Enhanced smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu if it exists
        if (navLinks && menuToggle) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Calculate offset for mobile devices
            const isMobile = window.innerWidth <= 768;
            const offset = isMobile ? 80 : 70;
            
            window.scrollTo({
                top: targetSection.offsetTop - offset,
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

if (blogToggle && blogPosts && toggleText && toggleIcon) {
    blogToggle.addEventListener('click', () => {
        const isVisible = blogPosts.classList.contains('visible');
        
        blogPosts.classList.toggle('visible');
        
        if (!isVisible) {
            toggleText.textContent = 'Hide Posts';
            toggleIcon.textContent = '▲';
            blogToggle.setAttribute('aria-expanded', 'true');
            
            // Smooth scroll to blog section on mobile
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    blogPosts.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 300);
            }
        } else {
            toggleText.textContent = 'Show Posts';
            toggleIcon.textContent = '▼';
            blogToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Enhanced animation for posts with intersection observer
const posts = document.querySelectorAll('.post');

if (posts.length > 0) {
    // Set initial state for posts
    posts.forEach(post => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';
        post.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Create intersection observer for better performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const postObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && blogPosts && blogPosts.classList.contains('visible')) {
                const post = entry.target;
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all posts
    posts.forEach(post => {
        postObserver.observe(post);
    });

    // Fallback scroll-based animation for older browsers
    function checkScroll() {
        if (blogPosts && blogPosts.classList.contains('visible')) {
            posts.forEach(post => {
                const postTop = post.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (postTop < windowHeight - 100) {
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                }
            });
        }
    }

    // Use intersection observer if supported, otherwise fall back to scroll events
    if (!window.IntersectionObserver) {
        window.addEventListener('load', checkScroll);
        window.addEventListener('scroll', checkScroll);
    }
}