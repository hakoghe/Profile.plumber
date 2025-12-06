/*

TemplateMo 595 3d coverflow
Plumber version - A Drop of Water

*/

// JavaScript Document

// Coverflow functionality
const items = document.querySelectorAll('.coverflow-item');
const dotsContainer = document.getElementById('dots');
const currentTitle = document.getElementById('current-title');
const currentDescription = document.getElementById('current-description');
const container = document.querySelector('.coverflow-container');
const menuToggle = document.getElementById('menuToggle');
const mainMenu = document.getElementById('mainMenu');
let currentIndex = 0; // start on first plumber project
let isAnimating = false;

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainMenu.classList.toggle('active');
});

// Close mobile menu when clicking on menu items (except external links)
document.querySelectorAll('.menu-item:not(.external)').forEach(item => {
    item.addEventListener('click', (e) => {
        menuToggle.classList.remove('active');
        mainMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target)) {
        menuToggle.classList.remove('active');
        mainMenu.classList.remove('active');
    }
});

// Plumber image/project data with titles and descriptions
const imageData = [
    {
       title: "ITAL Event Technical Services",
       description: "Providing high-quality plumbing services with advanced expertise in installation, troubleshooting, and system optimization."

    },
    {
        title: "Water Heater Installation",
        description: "Tankless water heater installation for improved efficiency and instant hot water"
    },
    {
       title: "Hot-Water Radiator Systems",
description: "Specialized in the installation, maintenance, and optimization of hot-water radiator heating systems for reliable and efficient home comfort."

    },
    {
       title: "PVC Piping Systems",
description: "Experienced in installing, repairing, and assembling PVC pipelines with precision, ensuring durable water distribution and efficient drainage performance."

    },
    {
        title: "Heating & Sanitary Distribution Panel",
description: "Skilled in assembling and configuring distribution panels for heating and sanitary systems, ensuring balanced water flow, safe operation, and optimal system performance."

    },
    {
        title: "Boiler & Heating Maintenance",
        description: "Annual servicing, valve checks and safety inspection for heating systems"
    },
    {
        title: "Pipe Repair & Leak Fix",
        description: "Underground and in-wall leak detection followed by pipe replacement"
    }
];

// Create dots
items.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.onclick = () => goToIndex(index);
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');
let autoplayInterval = null;
let isPlaying = true;
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');

function updateCoverflow() {
    if (isAnimating) return;
    isAnimating = true;

    items.forEach((item, index) => {
        let offset = index - currentIndex;

        if (offset > items.length / 2) {
            offset = offset - items.length;
        } else if (offset < -items.length / 2) {
            offset = offset + items.length;
        }

        const absOffset = Math.abs(offset);
        const sign = Math.sign(offset);

        let translateX = offset * 220;
        let translateZ = -absOffset * 200;
        let rotateY = -sign * Math.min(absOffset * 60, 60);
        let opacity = 1 - (absOffset * 0.2);
        let scale = 1 - (absOffset * 0.1);

        if (absOffset > 3) {
            opacity = 0;
            translateX = sign * 800;
        }

        item.style.transform = `
            translateX(${translateX}px) 
            translateZ(${translateZ}px) 
            rotateY(${rotateY}deg)
            scale(${scale})
        `;
        item.style.opacity = opacity;
        item.style.zIndex = 100 - absOffset;

        item.classList.toggle('active', index === currentIndex);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });

    const currentData = imageData[currentIndex];
    currentTitle.textContent = currentData.title;
    currentDescription.textContent = currentData.description;

    currentTitle.style.animation = 'none';
    currentDescription.style.animation = 'none';
    setTimeout(() => {
        currentTitle.style.animation = 'fadeIn 0.6s forwards';
        currentDescription.style.animation = 'fadeIn 0.6s forwards';
    }, 10);

    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

function navigate(direction) {
    if (isAnimating) return;

    currentIndex = currentIndex + direction;

    if (currentIndex < 0) {
        currentIndex = items.length - 1;
    } else if (currentIndex >= items.length) {
        currentIndex = 0;
    }

    updateCoverflow();
}

function goToIndex(index) {
    if (isAnimating || index === currentIndex) return;
    currentIndex = index;
    updateCoverflow();
}

// Keyboard navigation
container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
});

// Click on items to select
items.forEach((item, index) => {
    item.addEventListener('click', () => goToIndex(index));
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isSwiping = false;

container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isSwiping = true;
}, { passive: true });

container.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;

    const currentX = e.changedTouches[0].screenX;
    const diff = currentX - touchStartX;

    if (Math.abs(diff) > 10) {
        e.preventDefault();
    }
}, { passive: false });

container.addEventListener('touchend', (e) => {
    if (!isSwiping) return;

    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
    isSwiping = false;
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 30;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
        handleUserInteraction();

        if (diffX > 0) {
            navigate(1);
        } else {
            navigate(-1);
        }
    }
}

// Initialize images and reflections
items.forEach((item, index) => {
    const img = item.querySelector('img');
    const reflection = item.querySelector('.reflection');

    img.onload = function() {
        this.parentElement.classList.remove('image-loading');
        reflection.style.setProperty('--bg-image', `url(${this.src})`);
        reflection.style.backgroundImage = `url(${this.src})`;
        reflection.style.backgroundSize = 'cover';
        reflection.style.backgroundPosition = 'center';
    };

    img.onerror = function() {
        this.parentElement.classList.add('image-loading');
    };
});

// Autoplay functionality
function startAutoplay() {
    autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCoverflow();
    }, 4000);
    isPlaying = true;
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    isPlaying = false;
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
}

function toggleAutoplay() {
    if (isPlaying) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
}

function handleUserInteraction() {
    stopAutoplay();
}

// Add event listeners to stop autoplay on manual navigation
items.forEach((item) => {
    item.addEventListener('click', handleUserInteraction);
});

const prevBtn = document.querySelector('.nav-button.prev');
const nextBtn = document.querySelector('.nav-button.next');

if (prevBtn) prevBtn.addEventListener('click', handleUserInteraction);
if (nextBtn) nextBtn.addEventListener('click', handleUserInteraction);

dots.forEach((dot) => {
    dot.addEventListener('click', handleUserInteraction);
});

container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        handleUserInteraction();
    }
});

// Smooth scrolling and active menu item
const sections = document.querySelectorAll('.section');
const menuItems = document.querySelectorAll('.menu-item');
const header = document.getElementById('header');
const scrollToTopBtn = document.getElementById('scrollToTop');

// Update active menu item on scroll
function updateActiveMenuItem() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            menuItems.forEach(item => {
                if (!item.classList.contains('external')) {
                    item.classList.remove('active');
                }
            });
            if (menuItems[index] && !menuItems[index].classList.contains('external')) {
                menuItems[index].classList.add('active');
            }
        }
    });

    // Header background on scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', updateActiveMenuItem);

// Smooth scroll to section
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const targetId = item.getAttribute('href');

        // Check if it's an internal link (starts with #)
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // External links will open normally in new tab
    });
});

// Logo click to scroll to top
document.querySelector('.logo-container').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll to top button
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    alert('Thank you for contacting A Drop of Water! We will get back to you soon.');
    event.target.reset();
}

// Initialize
updateCoverflow();
if (container) container.focus();
startAutoplay();



/* Video modal behavior for Projects section (local files in "vedio/") */
(function() {
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const youtubeWrapper = document.getElementById('youtubeWrapper');
  const youtubeIframe = document.getElementById('youtubeIframe');
  const closeBtn = document.getElementById('modalClose');
  const thumbs = document.querySelectorAll('.video-thumb');

  function openModal(type, src) {
    if (!modal) return;
    // reset players
    try { modalVideo.pause(); } catch(e){}
    modalVideo.removeAttribute('src');
    modalVideo.load && modalVideo.load();
    youtubeIframe.removeAttribute('src');
    youtubeWrapper.style.display = 'none';
    modalVideo.style.display = 'none';

    if (type === 'youtube') {
      youtubeIframe.src = src + '?autoplay=1&rel=0';
      youtubeWrapper.style.display = 'block';
      youtubeWrapper.setAttribute('aria-hidden', 'false');
    } else {
      modalVideo.src = src;
      modalVideo.style.display = 'block';
      modalVideo.setAttribute('aria-hidden', 'false');
      modalVideo.addEventListener('canplay', function once() {
        modalVideo.play().catch(()=>{});
        modalVideo.removeEventListener('canplay', once);
      });
    }

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.load && modalVideo.load();
    }
    if (youtubeIframe) youtubeIframe.removeAttribute('src');
    youtubeWrapper.style.display = 'none';
    document.body.style.overflow = '';
  }

  thumbs.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      const src = btn.getAttribute('data-src');
      openModal(type, src);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') closeModal(); });
})();
// Mute all videos and YouTube iframes on the page (and future ones)
(function() {
  // Mute HTML5 videos right away
  function muteHTMLVideos(root = document) {
    root.querySelectorAll('video').forEach(v => {
      try {
        v.muted = true;
        v.defaultMuted = true; // persists for some browsers
      } catch (e) { /* ignore */ }
    });
  }

  // Add mute param to YouTube embed URLs and try postMessage mute
  function muteIframes(root = document) {
    root.querySelectorAll('iframe').forEach(iframe => {
      try {
        const src = iframe.getAttribute('src') || '';
        const isYouTube = /youtube\.com|youtu\.be/.test(src);
        if (isYouTube) {
          // Ensure embed format and add mute param
          if (!/(&|\?)mute=1/.test(src)) {
            const newSrc = src + (src.indexOf('?') === -1 ? '?mute=1' : '&mute=1');
            iframe.setAttribute('src', newSrc);
          }
          // Try sending the JS API mute command (works if enablejsapi=1)
          try {
            const cmd = JSON.stringify({ event: 'command', func: 'mute', args: [] });
            iframe.contentWindow && iframe.contentWindow.postMessage(cmd, '*');
          } catch (err) { /* ignore cross-origin issues */ }
        }
      } catch (e) { /* ignore */ }
    });
  }

  // Run initial mute
  muteHTMLVideos();
  muteIframes();

  // Ensure modal/local player (if used) is muted when opened
  // If you use an element with id="modalVideo" (as in your modal), mute it on open:
  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest && e.target.closest('.video-thumb');
    if (openBtn) {
      const modalVideo = document.getElementById('modalVideo');
      if (modalVideo) {
        try {
          modalVideo.muted = true;
          modalVideo.defaultMuted = true;
        } catch (err) {}
      }
      // If YouTube iframe modal is used, add mute query param before opening
      const youtubeWrapper = document.getElementById('youtubeWrapper');
      const youtubeIframe = document.getElementById('youtubeIframe');
      if (youtubeIframe && youtubeWrapper && openBtn.getAttribute('data-type') === 'youtube') {
        const src = openBtn.getAttribute('data-src') || youtubeIframe.src || '';
        if (src && !/(&|\?)mute=1/.test(src)) {
          youtubeIframe.src = src + (src.indexOf('?') === -1 ? '?mute=1' : '&mute=1') + '&autoplay=1&rel=0';
        } else {
          youtubeIframe.src = src + (src.indexOf('?') === -1 ? '?autoplay=1&rel=0' : '&autoplay=1&rel=0');
        }
      }
    }
  }, true);

  // Catch videos/iframes added later (e.g., dynamic loads) and mute them
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.matches && node.matches('video, iframe')) {
            muteHTMLVideos(node.parentNode || node);
            muteIframes(node.parentNode || node);
          } else {
            // also check inside newly-added subtree
            muteHTMLVideos(node);
            muteIframes(node);
          }
        });
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Helpful: expose a function to mute programmatically if ever needed
  window.muteAllSiteVideos = () => {
    muteHTMLVideos();
    muteIframes();
  };
})();

