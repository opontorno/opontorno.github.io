/**
 * Partial Loader - Loads HTML partial files into main container
 * This allows modular organization of sections for better maintainability
 */

(function() {
    'use strict';

    // Configuration
    const PARTIALS_PATH = 'partials/';
    const PARTIALS = {
        home: 'home.html',
        cv: 'cv.html',
        activities: 'activities.html'
    };

    /**
     * Load a partial HTML file
     * @param {string} partialName - Name of the partial to load
     * @param {string} containerId - ID of container to insert content
     * @returns {Promise}
     */
    async function loadPartial(partialName, containerId) {
        try {
            const response = await fetch(PARTIALS_PATH + PARTIALS[partialName]);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${partialName}: ${response.statusText}`);
            }
            
            const html = await response.text();
            const container = document.getElementById(containerId);
            
            if (container) {
                container.innerHTML = html;
                console.log(`✓ Loaded partial: ${partialName}`);
                return true;
            } else {
                console.error(`Container #${containerId} not found`);
                return false;
            }
        } catch (error) {
            console.error(`Error loading partial ${partialName}:`, error);
            return false;
        }
    }

    /**
     * Load all partials in sequence
     */
    async function loadAllPartials() {
        console.log('Starting to load partials...');
        
        // Load all partials in parallel
        await Promise.all([
            loadPartial('home', 'home-section'),
            loadPartial('cv', 'cv-section'),
            loadPartial('activities', 'activities-section')
        ]);

        console.log('✓ All partials loaded successfully');
        
        // Allow some time for DOM to settle
        setTimeout(() => {
            // Reinitialize scripts that depend on DOM content
            if (typeof initializeWebsite === 'function') {
                initializeWebsite();
                console.log('✓ Scripts initialized');
            } else {
                console.warn('initializeWebsite function not found');
            }
        }, 100);
    }

    // Load partials when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllPartials);
    } else {
        loadAllPartials();
    }

})();
