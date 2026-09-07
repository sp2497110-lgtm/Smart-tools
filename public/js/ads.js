/**
 * Smart Tools - Centralized Advertisement Architecture
 * 
 * ALL advertising configuration and slot initialization is controlled here.
 * To enable advertising:
 * 1. Set `enabled: true`
 * 2. Select your ad network or configure zone IDs / script URLs
 * 3. Never edit individual tool pages; the system automatically queries and populates:
 *    - .ad-slot-top
 *    - .ad-slot-between-content
 *    - .ad-slot-sidebar
 *    - .ad-slot-bottom
 */

const AD_CONFIG = {
  // Set to true when ready to serve advertisements in production
  enabled: false,

  // Supported networks: "PropellerAds", "GoogleAdSense", "Custom"
  network: "PropellerAds",

  zones: {
    top: "",            // e.g. "zone-top-123456"
    betweenContent: "", // e.g. "zone-mid-123456"
    sidebar: "",        // e.g. "zone-side-123456"
    bottom: ""          // e.g. "zone-bot-123456"
  },

  // Custom script source if provided by your ad network publisher dashboard
  publisherScriptUrl: "", // e.g. "https://example.com/tag.js"
  publisherId: ""         // e.g. "pub-xxxxxxxx"
};

// Track initialized slots to prevent duplicates
const initializedSlots = new WeakSet();

/**
 * Initialize all registered advertisement slots found in the DOM.
 * Safe to call multiple times (e.g. on route/page changes).
 */
function initAds() {
  if (!AD_CONFIG.enabled) {
    // Development / disabled mode: ensure slots remain invisible or collapsed with zero layout shift
    document.querySelectorAll('.ad-slot-top, .ad-slot-between-content, .ad-slot-sidebar, .ad-slot-bottom').forEach(slot => {
      slot.classList.add('ad-slot-disabled');
    });
    return;
  }

  try {
    const slotDefinitions = [
      { selector: '.ad-slot-top', zone: AD_CONFIG.zones.top, name: 'top' },
      { selector: '.ad-slot-between-content', zone: AD_CONFIG.zones.betweenContent, name: 'between-content' },
      { selector: '.ad-slot-sidebar', zone: AD_CONFIG.zones.sidebar, name: 'sidebar' },
      { selector: '.ad-slot-bottom', zone: AD_CONFIG.zones.bottom, name: 'bottom' }
    ];

    slotDefinitions.forEach(({ selector, zone, name }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (initializedSlots.has(element)) return;

        if (!zone && !AD_CONFIG.publisherId) {
          // If enabled without specific zone or network, keep unobtrusive
          return;
        }

        initializedSlots.add(element);
        element.classList.remove('ad-slot-disabled');
        element.classList.add('ad-slot-active');

        // Clean container setup
        const container = document.createElement('div');
        container.className = 'ad-container ad-' + name;
        container.setAttribute('aria-label', 'Advertisement');
        
        // Placeholder or network injection point
        const scriptContainer = document.createElement('ins');
        scriptContainer.className = 'adsbyzone';
        scriptContainer.setAttribute('data-zone', zone);
        container.appendChild(scriptContainer);

        element.appendChild(container);
      });
    });
  } catch (err) {
    console.warn('Ad initialization skipped or safely failed:', err);
  }
}

// Auto-run when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAds);
  } else {
    initAds();
  }
}

// Expose globally for single-page dynamic view updates
if (typeof window !== 'undefined') {
  window.SmartToolsAds = {
    config: AD_CONFIG,
    init: initAds
  };
}
