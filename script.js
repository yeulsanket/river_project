/**
 * River Revive - Community Engagement Program
 * Enhanced JavaScript with error handling, analytics, and UX improvements
 * @version 2.0
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
    officialPortal: "https://puneriverrevival.com"
  },
  messages: {
    contactGreeting: "Hello River Revive team! I want to participate in the river cleaning camp.",
    shareEmoji: "🌊",
    errorMessage: "Unable to open WhatsApp. Please try again."
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
 * @param {string} type - Type of message (success/error)
 */
function showFeedback(message, type = 'success') {
  // Check if feedback element exists, create if not
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
      transition: opacity 0.3s ease;
      pointer-events: none;
      max-width: 300px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(feedback);
  }

  // Set colors based on type
  const colors = {
    success: { bg: '#35b9a6', text: '#fff' },
    error: { bg: '#ef4444', text: '#fff' }
  };

  feedback.style.backgroundColor = colors[type].bg;
  feedback.style.color = colors[type].text;
  feedback.textContent = message;
  feedback.style.opacity = '1';

  // Hide after 3 seconds
  setTimeout(() => {
    feedback.style.opacity = '0';
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
    // Use api.whatsapp.com for better mobile support
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
    
    // Check if popup was blocked
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      showFeedback('Popup blocked. Please allow popups for this site.', 'error');
      // Fallback: try direct navigation
      setTimeout(() => {
        window.location.href = url;
      }, 1000);
    } else {
      showFeedback('Opening WhatsApp...', 'success');
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
    
    // Track share action (can be replaced with actual analytics)
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
    
    // Track contact action
    trackEvent('contact', 'whatsapp', 'direct_message');
  } catch (error) {
    logError('handleContactClick', error);
    showFeedback(CONFIG.messages.errorMessage, 'error');
  }
}

/**
 * Track events (placeholder for analytics)
 * @param {string} action - Action name
 * @param {string} category - Event category
 * @param {string} label - Event label
 */
function trackEvent(action, category, label) {
  // Placeholder for analytics tracking
  // Replace with Google Analytics, Mixpanel, etc.
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
  
  // Log for debugging
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
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.style.background = 'rgba(14, 17, 22, 0.95)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
      header.style.background = 'rgba(14, 17, 22, 0.85)';
      header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
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
    // Handle Escape key to close any modals/overlays
    if (e.key === 'Escape') {
      const feedback = document.getElementById('feedback-toast');
      if (feedback) {
        feedback.style.opacity = '0';
      }
    }
  });
}

// ===========================
// Form Validation (if forms are added)
// ===========================

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
function isValidPhoneNumber(phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
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
    initKeyboardNavigation();

    // Log successful initialization
    console.log('[River Revive] Initialized successfully ✓');
    
  } catch (error) {
    logError('init', error);
  }
}

// ===========================
// Event Listeners
// ===========================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already loaded
  init();
}

// Handle page visibility changes (for analytics)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('[River Revive] Page hidden');
  } else {
    console.log('[River Revive] Page visible');
  }
});

// ===========================
// Export for testing (optional)
// ===========================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    buildShareMessage,
    createWhatsAppShareURL,
    createWhatsAppContactURL,
    isValidPhoneNumber,
    CONFIG
  };
}