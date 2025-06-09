// Mobile navigation toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        navLinks.classList.remove('active');
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: 'smooth'
        });
    });
});

// Blog posts toggle
const blogToggle = document.querySelector('.blog-toggle');
const blogPosts = document.querySelector('.blog-posts');
const toggleText = document.querySelector('.toggle-text');
const toggleIcon = document.querySelector('.toggle-icon');

blogToggle.addEventListener('click', () => {
    blogPosts.classList.toggle('visible');
    
    if (blogPosts.classList.contains('visible')) {
        toggleText.textContent = 'Hide Posts';
        toggleIcon.textContent = '▲';
    } else {
        toggleText.textContent = 'Show Posts';
        toggleIcon.textContent = '▼';
    }
});

// Add animation to posts when they come into view
const posts = document.querySelectorAll('.post');

function checkScroll() {
    if (blogPosts.classList.contains('visible')) {
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

// Set initial state for posts
posts.forEach(post => {
    post.style.opacity = '0';
    post.style.transform = 'translateY(20px)';
    post.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Check on load and scroll
window.addEventListener('load', checkScroll);
window.addEventListener('scroll', checkScroll);