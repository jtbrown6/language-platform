// Spanish Learning Platform v2.0 - Interactive Features
// Simple JavaScript for mock functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Spanish Learning Platform v2.0 - Immersive Flow Mock Loaded');
    
    // Tab Switching Functionality
    initializeTabs();
    
    // Theme Toggle
    initializeThemeToggle();
    
    // Achievement Toast Auto-hide
    initializeAchievementToast();
});

/**
 * Initialize Tab Switching
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Add animation effect
            targetContent.style.animation = 'none';
            setTimeout(() => {
                targetContent.style.animation = 'fadeIn 0.3s ease';
            }, 10);
        });
    });
}

/**
 * Initialize Theme Toggle (Dark/Light Mode)
 */
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    let isDark = false;
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            isDark = !isDark;
            
            if (isDark) {
                this.textContent = '☀️';
                document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
                
                // Update glass panels for dark mode
                const glassPanels = document.querySelectorAll('.glass-panel');
                glassPanels.forEach(panel => {
                    panel.style.background = 'rgba(30, 30, 50, 0.7)';
                    panel.style.color = '#e0e0e0';
                });
                
                // Update dashboard header
                const header = document.querySelector('.dashboard-header');
                if (header) {
                    header.style.background = 'rgba(20, 20, 30, 0.95)';
                    header.style.color = '#e0e0e0';
                }
                
                // Update highlights banner
                const highlights = document.querySelectorAll('.highlight-item');
                highlights.forEach(item => {
                    item.style.background = 'linear-gradient(135deg, rgba(50, 50, 70, 0.9), rgba(40, 40, 60, 0.7))';
                    item.style.color = '#e0e0e0';
                });
            } else {
                this.textContent = '🌙';
                document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
                
                // Reset to light mode
                const glassPanels = document.querySelectorAll('.glass-panel');
                glassPanels.forEach(panel => {
                    panel.style.background = 'rgba(255, 255, 255, 0.7)';
                    panel.style.color = '';
                });
                
                const header = document.querySelector('.dashboard-header');
                if (header) {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.color = '';
                }
                
                const highlights = document.querySelectorAll('.highlight-item');
                highlights.forEach(item => {
                    item.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))';
                    item.style.color = '';
                });
            }
            
            // Add transition effect
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    }
}

/**
 * Initialize Achievement Toast
 */
function initializeAchievementToast() {
    const toast = document.querySelector('.achievement-toast');
    
    if (toast) {
        // Auto-hide toast after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 500);
        }, 5000);
        
        // Click to dismiss
        toast.addEventListener('click', function() {
            this.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                this.style.display = 'none';
            }, 500);
        });
    }
}

// Add slideOutRight animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Optional: Add hover effects to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });
});

// Console welcome message
console.log('%c¡Bienvenido a Spanish Learning Platform v2.0!', 
    'color: #6366F1; font-size: 20px; font-weight: bold;');
console.log('%cImmersive Flow - Modern Glassmorphism Design', 
    'color: #A855F7; font-size: 14px;');
