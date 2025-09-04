// Wedding Slideshow Application - Enhanced Version
class WeddingSlideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length; // Exactly 12 slides
        this.slideInterval = null;
        this.slideDuration = 3700; // 3.7 seconds per slide for 44 second total (12 × 3.7 ≈ 44)
        this.isPlaying = true;
        this.isPaused = false;
        this.tempPaused = false;
        this.modalPaused = false;
        this.startTime = Date.now();
        
        // Control elements - ENHANCED
        this.prevBtn = document.getElementById('prevBtn');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.progressFill = document.querySelector('.progress-fill');
        this.currentSlideSpan = document.querySelector('.current-slide');
        this.totalSlidesSpan = document.querySelector('.total-slides');
        
        // Modal elements
        this.downloadModal = document.getElementById('downloadModal');
        this.closeModal = document.getElementById('closeModal');
        this.saveInvitation = document.getElementById('saveInvitation');
        
        this.init();
    }
    
    init() {
        this.preloadImages();
        this.applyGhibliBackgrounds();
        this.setupEventListeners();
        this.setupTouchSupport();
        this.updateProgressBar();
        this.updateSlideCounter();
        this.startSlideshow();
        this.ensureControlsVisible();
        
        // Log slide order for debugging
        console.log('Total slides:', this.totalSlides);
        console.log('Slide order verification:');
        this.slides.forEach((slide, index) => {
            const slideText = slide.querySelector('h1')?.textContent || slide.querySelector('.event-title')?.textContent || `Slide ${index + 1}`;
            console.log(`Slide ${index + 1}: ${slideText}`);
        });
    }
    
    preloadImages() {
        const imageUrls = [
            // Mobile-optimized images for first 3 slides - CORRECTED ORDER
            'ghibli-college-mobile.png', // College
            'ghibli-office-mobile.png', // Office
            'ghibli-coffee.png', // Coffee
            // Existing images for other slides
            'ghibli-intro-walk.png',//walk
            'ghibli-intro-sunset.png',//sunset
            'ghibli-palace.png',
            'ghibli-haldi-river.png',//Haldi
            'ghibli-ring-ceremony.png',//ring
            'ghibli-wedding-night.png',//wedding
            'ghibli-reception.png',//reception
            'ghibli-welcome-scene.png',//welcome
            'ghibli-thank_2.png'
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    applyGhibliBackgrounds() {
        // Ensure all 12 Ghibli backgrounds are properly applied in CORRECTED ORDER
        const ghibliImages = [
            'ghibli-college-mobile.png', // College
            'ghibli-office-mobile.png', // Office
            'ghibli-coffee.png', // Coffee
            // Existing images for other slides
            'ghibli-intro-walk.png',//walk
            'ghibli-intro-sunset.png',//sunset
            'ghibli-palace.png',
            'ghibli-haldi-river.png',//Haldi
            'ghibli-ring-ceremony.png',//ring
            'ghibli-wedding-night.png',//wedding
            'ghibli-reception.png',//reception
            'ghibli-welcome-scene.png',//welcome
            'ghibli-thank_2.png'
        ];
        
        const scenes = [
            '.college-scene',    // Slide 1
            '.office-scene',     // Slide 2
            '.coffee-scene',     // Slide 3
            '.walking-scene',    // Slide 4
            '.sunset-scene',     // Slide 5
            '.names-scene',      // Slide 6 (gradient)
            '.ring-ceremony-scene', // Slide 7
            '.haldi-scene',      // Slide 8
            '.wedding-night-scene', // Slide 9
            '.reception-scene',  // Slide 10
            '.welcome-scene',    // Slide 11
            '.thanks-scene'      // Slide 12
        ];
        
        scenes.forEach((sceneClass, index) => {
            const sceneElements = document.querySelectorAll(sceneClass);
            if (ghibliImages[index]) {
                sceneElements.forEach(scene => {
                    scene.style.backgroundImage = `url('${ghibliImages[index]}')`;
                    scene.style.backgroundSize = 'cover';
                    scene.style.backgroundPosition = 'center';
                });
            }
        });
    }
    
    setupEventListeners() {
        // Ensure controls are visible and functional
        this.ensureControlsVisible();
        
        // Previous button - NEW
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousSlide();
            });
        }
        
        // Next button - NEW
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextSlide();
            });
        }
        
        // Play/Pause button
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.togglePlayPause();
            });
        }
        
        // Restart button
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.restart();
            });
        }
        
        // Fullscreen button
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleFullscreen();
            });
        }
        
        // Download button
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showDownloadModal();
            });
        }
        
        // Modal events
        if (this.closeModal) {
            this.closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.hideDownloadModal();
            });
        }
        
        if (this.saveInvitation) {
            this.saveInvitation.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.downloadInvitation();
            });
        }
        
        // Close modal when clicking outside
        if (this.downloadModal) {
            this.downloadModal.addEventListener('click', (e) => {
                if (e.target === this.downloadModal) {
                    this.hideDownloadModal();
                }
            });
        }
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                case 'Spacebar':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.restart();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.showDownloadModal();
                    break;
                case 'Escape':
                    this.hideDownloadModal();
                    break;
            }
        });
        
        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        
        // Page visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isPlaying && !this.isPaused) {
                this.tempPaused = true;
                this.isPaused = true;
            } else if (!document.hidden && this.tempPaused) {
                this.tempPaused = false;
                this.isPaused = false;
            }
        });
        
        // Setup slide click navigation
        this.setupSlideNavigation();
    }
    
    ensureControlsVisible() {
        // Make sure all control buttons are visible and properly positioned
        const controls = document.querySelector('.controls');
        const progressContainer = document.querySelector('.progress-container');
        
        if (controls) {
            controls.style.position = 'fixed';
            controls.style.bottom = '20px';
            controls.style.left = '50%';
            controls.style.transform = 'translateX(-50%)';
            controls.style.display = 'flex';
            controls.style.visibility = 'visible';
            controls.style.opacity = '1';
            controls.style.zIndex = '100';
            controls.style.pointerEvents = 'auto';
        }
        
        if (progressContainer) {
            progressContainer.style.position = 'fixed';
            progressContainer.style.bottom = '80px';
            progressContainer.style.left = '50%';
            progressContainer.style.transform = 'translateX(-50%)';
            progressContainer.style.display = 'block';
            progressContainer.style.visibility = 'visible';
            progressContainer.style.opacity = '1';
            progressContainer.style.zIndex = '99';
        }
        
        // Ensure all buttons are clickable and prevent event bubbling
        const buttons = document.querySelectorAll('.control-btn');
        buttons.forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.style.cursor = 'pointer';
            btn.style.position = 'relative';
            btn.style.zIndex = '101';
        });
    }
    
    setupSlideNavigation() {
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                // Only navigate if clicking on the slide content area, not controls
                if (!e.target.closest('.controls') && 
                    !e.target.closest('.progress-container') && 
                    !e.target.closest('.modal') &&
                    !e.target.closest('.control-btn')) {
                    if (this.currentSlide < this.totalSlides - 1) {
                        this.nextSlide();
                    } else {
                        this.restart();
                    }
                }
            });
        });
    }
    
    setupTouchSupport() {
        let startX = 0;
        let startY = 0;
        let isSwipe = false;
        let startTime = 0;
        
        const container = document.querySelector('.slideshow-container');
        
        container.addEventListener('touchstart', (e) => {
            // Don't interfere with control interactions
            if (e.target.closest('.controls') || e.target.closest('.modal') || e.target.closest('.control-btn')) return;
            
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
            isSwipe = false;
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const diffX = Math.abs(e.touches[0].clientX - startX);
            const diffY = Math.abs(e.touches[0].clientY - startY);
            
            if (diffX > diffY && diffX > 30) {
                isSwipe = true;
            }
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            const endTime = Date.now();
            const swipeTime = endTime - startTime;
            
            if (!isSwipe || swipeTime > 500) {
                startX = 0;
                startY = 0;
                isSwipe = false;
                return;
            }
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.previousSlide();
                }
            }
            
            startX = 0;
            startY = 0;
            isSwipe = false;
        }, { passive: true });
    }
    
    startSlideshow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        
        this.startTime = Date.now();
        
        // Use requestAnimationFrame for more precise timing
        const slideTimer = () => {
            if (this.isPlaying && !this.isPaused) {
                const elapsed = Date.now() - this.startTime;
                if (elapsed >= this.slideDuration) {
                    this.nextSlide();
                    this.startTime = Date.now();
                }
            }
            if (this.isPlaying) {
                requestAnimationFrame(slideTimer);
            }
        };
        
        requestAnimationFrame(slideTimer);
        
        // Backup interval timer
        this.slideInterval = setInterval(() => {
            if (this.isPlaying && !this.isPaused) {
                this.nextSlide();
            }
        }, this.slideDuration);
    }
    
    nextSlide() {
        // Clear previous slide completely
        this.slides[this.currentSlide].classList.remove('active');
        
        // Move to next slide
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        
        // Set new active slide
        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
        }, 50);
        
        this.updateProgressBar();
        this.updateSlideCounter();
        this.addSlideAnimation();
        this.startTime = Date.now(); // Reset timer
        
        // If we've completed all slides, show completion notification
        if (this.currentSlide === 0 && this.isPlaying) {
            this.showCompletionNotification();
        }
    }
    
    previousSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        
        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
        }, 50);
        
        this.updateProgressBar();
        this.updateSlideCounter();
        this.addSlideAnimation();
        this.startTime = Date.now(); // Reset timer
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides && index !== this.currentSlide) {
            this.slides[this.currentSlide].classList.remove('active');
            this.currentSlide = index;
            
            setTimeout(() => {
                this.slides[this.currentSlide].classList.add('active');
            }, 50);
            
            this.updateProgressBar();
            this.updateSlideCounter();
            this.addSlideAnimation();
            this.startTime = Date.now(); // Reset timer
        }
    }
    
    addSlideAnimation() {
        const currentSlideContent = this.slides[this.currentSlide].querySelector('.slide-content');
        if (currentSlideContent) {
            currentSlideContent.style.animation = 'none';
            setTimeout(() => {
                currentSlideContent.style.animation = 'slideIn 0.8s ease-out';
            }, 10);
        }
    }
    
    togglePlayPause() {
        this.isPaused = !this.isPaused;
        
        const playIcon = this.playPauseBtn?.querySelector('.play-icon');
        const pauseIcon = this.playPauseBtn?.querySelector('.pause-icon');
        
        if (this.isPaused) {
            if (playIcon) playIcon.classList.remove('hidden');
            if (pauseIcon) pauseIcon.classList.add('hidden');
            this.showNotification('Slideshow paused ⏸️', 'info');
        } else {
            if (playIcon) playIcon.classList.add('hidden');
            if (pauseIcon) pauseIcon.classList.remove('hidden');
            this.showNotification('Slideshow resumed ▶️', 'success');
            this.startTime = Date.now(); // Reset timer when resuming
        }
    }
    
    restart() {
        // Clear all intervals
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        
        // Reset state
        this.isPaused = false;
        this.isPlaying = true;
        
        // Go to first slide
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = 0;
        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
        }, 50);
        
        this.updateProgressBar();
        this.updateSlideCounter();
        this.addSlideAnimation();
        
        // Restart slideshow
        this.startSlideshow();
        
        // Update play/pause button
        const playIcon = this.playPauseBtn?.querySelector('.play-icon');
        const pauseIcon = this.playPauseBtn?.querySelector('.pause-icon');
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
        
        this.showNotification('Slideshow restarted! 💕', 'success');
    }
    
    updateProgressBar() {
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
    }
    
    updateSlideCounter() {
        if (this.currentSlideSpan) {
            this.currentSlideSpan.textContent = this.currentSlide + 1;
        }
        if (this.totalSlidesSpan) {
            this.totalSlidesSpan.textContent = this.totalSlides;
        }
    }
    
    toggleFullscreen() {
        const container = document.querySelector('.slideshow-container');
        
        try {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
                // Enter fullscreen
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                } else {
                    this.showNotification('Fullscreen not supported', 'error');
                }
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
            this.showNotification('Could not toggle fullscreen', 'error');
        }
    }
    
    handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
        
        if (this.fullscreenBtn) {
            if (isFullscreen) {
                this.fullscreenBtn.innerHTML = '🗗'; // Exit fullscreen icon
                this.fullscreenBtn.title = 'Exit Fullscreen';
                this.showNotification('Entered fullscreen mode 🖥️', 'info');
            } else {
                this.fullscreenBtn.innerHTML = '⛶'; // Enter fullscreen icon
                this.fullscreenBtn.title = 'Fullscreen';
            }
        }
    }
    
    showDownloadModal() {
        if (this.downloadModal) {
            this.downloadModal.classList.remove('hidden');
            // Pause slideshow while modal is open
            this.modalPaused = !this.isPaused;
            this.isPaused = true;
        }
    }
    
    hideDownloadModal() {
        if (this.downloadModal) {
            this.downloadModal.classList.add('hidden');
            // Resume slideshow if it wasn't paused before modal
            if (this.modalPaused) {
                this.isPaused = false;
                this.modalPaused = false;
                this.startTime = Date.now(); // Reset timer when resuming
            }
        }
    }
    
    downloadInvitation() {
        try {
            const htmlContent = this.generateDownloadableHTML();
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Pratibha-Abhishek-Wedding-Invitation.html';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.hideDownloadModal();
            this.showNotification('Wedding invitation downloaded successfully! 💕', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            this.showNotification('Download failed. Please try again.', 'error');
        }
    }
    
    generateDownloadableHTML() {
        const currentHTML = document.documentElement.outerHTML;
        
        // Remove the modal and make some adjustments for standalone use
        let downloadableHTML = currentHTML
            .replace(/<div class="modal[^>]*>[\s\S]*?<\/div>/g, '')
            .replace(/class="modal-backdrop[^"]*"/g, 'class="modal-backdrop hidden"');
        
        // Add auto-start script and remove download functionality
        const autoStartScript = `
        <script>
        // Auto-start slideshow when downloaded file is opened
        document.addEventListener('DOMContentLoaded', function() {
            // Remove download button for standalone version
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn) {
                downloadBtn.style.display = 'none';
            }
            
            // Initialize slideshow
            if (typeof WeddingSlideshow !== 'undefined') {
                window.slideshow = new WeddingSlideshow();
            }
        });
        </script>`;
        
        downloadableHTML = downloadableHTML.replace('</body>', autoStartScript + '</body>');
        
        return downloadableHTML;
    }
    
    showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        });
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Set colors based on type
        let bgColor, textColor;
        switch(type) {
            case 'success':
                bgColor = 'var(--color-success)';
                textColor = 'var(--color-btn-primary-text)';
                break;
            case 'error':
                bgColor = 'var(--color-error)';
                textColor = 'var(--color-white)';
                break;
            case 'info':
            default:
                bgColor = 'var(--color-info)';
                textColor = 'var(--color-white)';
                break;
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: ${textColor};
            padding: var(--space-12) var(--space-20);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all var(--duration-normal) var(--ease-standard);
            font-weight: var(--font-weight-medium);
            font-size: var(--font-size-md);
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    showCompletionNotification() {
        setTimeout(() => {
            this.showNotification('✨ Complete love story! Starting again... 💕', 'success');
        }, 1000);
    }
    
    // Method to get current slide info
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide + 1,
            total: this.totalSlides,
            isPlaying: this.isPlaying && !this.isPaused,
            progress: ((this.currentSlide + 1) / this.totalSlides) * 100,
            slideDuration: this.slideDuration,
            totalDuration: this.totalSlides * this.slideDuration
        };
    }
}

// Initialize the slideshow when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth loading animation
    const container = document.querySelector('.slideshow-container');
    if (container) {
        container.style.opacity = '0';
        
        setTimeout(() => {
            container.style.transition = 'opacity 1s ease-in-out';
            container.style.opacity = '1';
            
            // Initialize slideshow after fade in
            setTimeout(() => {
                window.slideshow = new WeddingSlideshow();
                
                // Preload optimization
                const slides = document.querySelectorAll('.slide');
                slides.forEach(slide => {
                    slide.style.willChange = 'opacity';
                });
                
                // Welcome message
                setTimeout(() => {
                    if (window.slideshow) {
                        window.slideshow.showNotification('Welcome to Pratibha & Abhishek\'s Wedding Invitation! 💕', 'success');
                    }
                }, 1500);
            }, 500);
        }, 100);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const bgMusic = document.getElementById("bgMusic");
    const toggleBtn = document.getElementById("toggleMusic");

    // Ensure autoplay after first click anywhere
    const enableMusic = () => {
        bgMusic.muted = false;
        bgMusic.play().catch(err => console.log("Autoplay blocked:", err));
        updateIcon();
        document.removeEventListener("click", enableMusic); // only once
    };
    document.addEventListener("click", enableMusic);

    // Update button icon
    const updateIcon = () => {
        toggleBtn.textContent = bgMusic.muted ? "🎵" : "🔇";
    };

    // Initial state
    updateIcon();

    // Toggle mute/unmute
    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent conflict with slideshow click
        bgMusic.muted = !bgMusic.muted;
        if (!bgMusic.paused) {
          updateIcon();
        } else {
          bgMusic.play().then(updateIcon);
        }
    });
});

// Handle page beforeunload
window.addEventListener('beforeunload', function() {
    if (window.slideshow && window.slideshow.slideInterval) {
        clearInterval(window.slideshow.slideInterval);
    }
});

// Export for global access
window.WeddingSlideshow = WeddingSlideshow;