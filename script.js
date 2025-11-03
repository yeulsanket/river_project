/**
 * River Revive - Community Engagement Program
 * Enhanced JavaScript with error handling, analytics, and UX improvements
 * @version 2.1
 */

// ===========================
// Configuration
// ===========================
const CONFIG = {
  event: {
    title: "River Revive – Pune River Cleaning Camp",
    date: "14 November 2025",
    time: "9:00 AM",
    location: "Bhide Bridge, Pune",
    capacity: "Up to 100 participants",
    phone: "+918412011008",
    formattedPhone: "+91 84120 11008"
  },
  links: {
    instagram: "https://www.instagram.com/riverrevive/",
    facebook: "https://www.facebook.com/share/1K8sMSbfWQ/",
    whatsappChannel: "https://chat.whatsapp.com/GNSfS7d4hxWEzAUlZtHUwr?mode=ems_wa_t",
    officialPortal: "https://puneriverrevival.com",
    government: {
      swabhavSwachhata: "https://share.google/0QBSi7Yo1evoMs7Vc",
      swachhBharatMission: "https://share.google/GA1AYB0WM3TCuHJRd",
      swachhBharatMyGov: "https://share.google/s3GcHMqhw7lCmRPof"
    }
  },
  messages: {
    contactGreeting: "Hello River Revive team! I want to participate in the river cleaning camp.",
    shareEmoji: "🌊",
    errorMessage: "Unable to open WhatsApp. Please try again.",
    successShare: "Opening WhatsApp...",
    successContact: "Opening WhatsApp contact...",
    popupBlocked: "Popup blocked. Please allow popups for this site."
  }
};

// ===========================
// Utility Functions
// ===========================

/**
 * Safely log errors to console
 * @param {string} context - Context where error occurred
 * @param {Error} error - Error object
 */
function logError(context, error) {
  console.error(`[River Revive] ${context}:`, error);
}

/**
 * Check if device is mobile
 * @returns {boolean}
 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Show temporary feedback to user
 * @param {string} message - Message to display
 * @param {string} type - Type of message (success/error/info)
 */
function showFeedback(message, type = 'success') {
  let feedback = document.getElementById('feedback-toast');
  
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.id = 'feedback-toast';
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
      max-width: 300px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transform: translateY(-10px);
    `;
    document.body.appendChild(feedback);
  }

  const colors = {
    success: { bg: '#35b9a6', text: '#fff' },
    error: { bg: '#ef4444', text: '#fff' },
    info: { bg: '#2d7df6', text: '#fff' }
  };

  feedback.style.backgroundColor = colors[type].bg;
  feedback.style.color = colors[type].text;
  feedback.textContent = message;
  feedback.style.opacity = '1';
  feedback.style.transform = 'translateY(0)';

  setTimeout(() => {
    feedback.style.opacity = '0';
    feedback.style.transform = 'translateY(-10px)';
  }, 3000);
}

// ===========================
// WhatsApp Functions
// ===========================

/**
 * Build formatted WhatsApp share message
 * @returns {string} Formatted message text
 */
function buildShareMessage() {
  try {
    const lines = [
      `Join the ${CONFIG.event.title} ${CONFIG.messages.shareEmoji}`,
      "",
      `📅 Date: ${CONFIG.event.date}`,
      `⏰ Time: ${CONFIG.event.time}`,
      `📍 Location: ${CONFIG.event.location}`,
      `👥 Capacity: ${CONFIG.event.capacity}`,
      "",
      `📞 Contact: ${CONFIG.event.formattedPhone}`,
      "",
      "🔗 Follow us for updates:",
      `Instagram: ${CONFIG.links.instagram}`,
      `Facebook: ${CONFIG.links.facebook}`,
      `WhatsApp: ${CONFIG.links.whatsappChannel}`,
      "",
      "🇮🇳 Supported by:",
      "Swachh Bharat Mission & Government Initiatives",
      "",
      "Let's make a difference together! 💚"
    ];
    
    return lines.join("\n");
  } catch (error) {
    logError('buildShareMessage', error);
    return `Join River Revive - Pune River Cleaning Camp!\nContact: ${CONFIG.event.formattedPhone}`;
  }
}

/**
 * Create WhatsApp share URL
 * @param {string} text - Message to share
 * @returns {string} WhatsApp URL
 */
function createWhatsAppShareURL(text) {
  try {
    const encodedText = encodeURIComponent(text);
    const baseURL = isMobileDevice() ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
    return `${baseURL}?text=${encodedText}`;
  } catch (error) {
    logError('createWhatsAppShareURL', error);
    return 'https://wa.me/';
  }
}

/**
 * Create WhatsApp direct message URL
 * @param {string} phoneNumber - Phone number to message
 * @param {string} message - Pre-filled message
 * @returns {string} WhatsApp URL
 */
function createWhatsAppContactURL(phoneNumber, message) {
  try {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  } catch (error) {
    logError('createWhatsAppContactURL', error);
    return `https://wa.me/${phoneNumber}`;
  }
}

/**
 * Open URL in new window with fallback
 * @param {string} url - URL to open
 * @param {string} context - Context for analytics/error
 */
function openURL(url, context = 'link') {
  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      showFeedback(CONFIG.messages.popupBlocked, 'error');
      setTimeout(() => {
        window.location.href = url;
      }, 1000);
    } else {
      const message = context === 'share' ? CONFIG.messages.successShare : CONFIG.messages.successContact;
      showFeedback(message, 'success');
    }
  } catch (error) {
    logError(`openURL (${context})`, error);
    showFeedback(CONFIG.messages.errorMessage, 'error');
  }
}

// ===========================
// Event Handlers
// ===========================

/**
 * Handle share button click
 * @param {Event} event - Click event
 */
function handleShareClick(event) {
  event.preventDefault();
  
  try {
    const shareText = buildShareMessage();
    const shareURL = createWhatsAppShareURL(shareText);
    openURL(shareURL, 'share');
    trackEvent('share', 'whatsapp', 'event_details');
  } catch (error) {
    logError('handleShareClick', error);
    showFeedback(CONFIG.messages.errorMessage, 'error');
  }
}

/**
 * Handle contact button click
 * @param {Event} event - Click event
 */
function handleContactClick(event) {
  event.preventDefault();
  
  try {
    const contactURL = createWhatsAppContactURL(
      CONFIG.event.phone,
      CONFIG.messages.contactGreeting
    );
    openURL(contactURL, 'contact');
    trackEvent('contact', 'whatsapp', 'direct_message');
  } catch (error) {
    logError('handleContactClick', error);
    showFeedback(CONFIG.messages.errorMessage, 'error');
  }
}

/**
 * Handle government link clicks
 * @param {Event} event - Click event
 * @param {string} linkName - Name of the government link
 */
function handleGovLinkClick(event, linkName) {
  try {
    trackEvent('click', 'government_link', linkName);
    showFeedback(`Opening ${linkName}...`, 'info');
  } catch (error) {
    logError('handleGovLinkClick', error);
  }
}

/**
 * Track events (placeholder for analytics)
 * @param {string} action - Action name
 * @param {string} category - Event category
 * @param {string} label - Event label
 */
function trackEvent(action, category, label) {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
  
  console.log(`[Analytics] ${category} - ${action} - ${label}`);
}

// ===========================
// Smooth Scroll Enhancement
// ===========================

/**
 * Add smooth scroll behavior to anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#' || targetId === '#participate') {
        e.preventDefault();
        const target = document.querySelector(targetId === '#' ? 'body' : targetId);
        
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          trackEvent('navigation', 'smooth_scroll', targetId);
        }
      }
    });
  });
}

// ===========================
// Header Scroll Effect
// ===========================

/**
 * Add header background on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  function updateHeader() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.style.background = 'rgba(14, 17, 22, 0.95)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
      header.style.background = 'rgba(14, 17, 22, 0.85)';
      header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

// ===========================
// Scroll Reveal Animation
// ===========================

/**
 * Add scroll reveal animations for elements
 */
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll('.card, .gov-card, .faq, .fallback');
  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ===========================
// Accessibility Enhancements
// ===========================

/**
 * Add keyboard navigation support
 */
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const feedback = document.getElementById('feedback-toast');
      if (feedback) {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(-10px)';
      }
    }
  });

  // Add skip to content link
  const skipLink = document.createElement('a');
  skipLink.href = '#participate';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--brand-2);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    z-index: 100;
    border-radius: 0 0 8px 0;
  `;
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
}

// ===========================
// Link Tracking
// ===========================

/**
 * Track all external link clicks
 */
function initLinkTracking() {
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
      const url = this.href;
      const label = this.textContent || this.getAttribute('aria-label') || url;
      trackEvent('click', 'external_link', label);
    });
  });
}

// ===========================
// Government Links Enhancement
// ===========================

/**
 * Add tracking and feedback to government links
 */
function initGovLinks() {
  const govCards = document.querySelectorAll('.gov-card');
  
  govCards.forEach((card, index) => {
    const linkNames = ['SwabhavSwachhata', 'Swachh Bharat Mission', 'Swachh Bharat MyGov'];
    
    card.addEventListener('click', function(e) {
      handleGovLinkClick(e, linkNames[index]);
    });

    // Add keyboard support
    card.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// ===========================
// Performance Monitoring
// ===========================

/**
 * Log page load performance
 */
function logPerformance() {
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`[Performance] Page loaded in ${pageLoadTime}ms`);
        trackEvent('performance', 'page_load', `${pageLoadTime}ms`);
      }, 0);
    });
  }
}

// ===========================
// Initialization
// ===========================

/**
 * Initialize all features when DOM is ready
 */
function init() {
  try {
    // Get button elements
    const shareBtn = document.getElementById('share-whatsapp');
    const contactBtn = document.getElementById('whatsapp-contact');

    // Attach event listeners
    if (shareBtn) {
      shareBtn.addEventListener('click', handleShareClick);
      shareBtn.setAttribute('aria-label', 'Share event on WhatsApp');
    } else {
      logError('init', new Error('Share button not found'));
    }

    if (contactBtn) {
      contactBtn.addEventListener('click', handleContactClick);
      contactBtn.setAttribute('aria-label', 'Contact us on WhatsApp');
    } else {
      logError('init', new Error('Contact button not found'));
    }

    // Initialize enhancements
    initSmoothScroll();
    initHeaderScroll();
    initScrollReveal();
    initKeyboardNavigation();
    initLinkTracking();
    initGovLinks();
    logPerformance();

    console.log('[River Revive] ✓ Initialized successfully');
    console.log('[River Revive] Version 2.1');
    
  } catch (error) {
    logError('init', error);
  }
}

// ===========================
// Event Listeners
// ===========================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    console.log('[River Revive] Page visible');
    trackEvent('page', 'visibility', 'visible');
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  showFeedback('You are back online', 'success');
  trackEvent('connection', 'status', 'online');
});

window.addEventListener('offline', () => {
  showFeedback('You are offline. Some features may not work.', 'error');
  trackEvent('connection', 'status', 'offline');
});

// ===========================
// Export for testing (optional)
// ===========================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    buildShareMessage,
    createWhatsAppShareURL,
    createWhatsAppContactURL,
    CONFIG
  };
}