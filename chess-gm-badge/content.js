// Chess.com GM Badge
(function() {
    'use strict';
    
    // YOUR USERNAME - Change this to your actual Chess.com username
    const YOUR_USERNAME = '#';
    const YOUR_DISPLAY_NAME = '#';
    
  
    const inGameBadgeStyles = {
        fontSize: '10px', 
        fontWeight: '700',
        lineHeight: '10px',
        padding: '2px 3px',
        margin: '0px 4px 0px 0px', 
        borderRadius: '2px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        textTransform: 'uppercase',
        height: '14px', 
        minWidth: '20px', 
        backgroundColor: '#7C2929',
        color: '#FFFFFF'
    };
    
    
    const profileBadgeStyles = {
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: '18px',
        padding: '2px 3px',
        margin: '2px 6px 0px 0px',
        borderRadius: '3px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        textTransform: 'uppercase',
        height: '22px',
        minWidth: '35px',
        backgroundColor: '#7C2929',
        color: '#FFFFFF'
    };
    
    function createBadge(isInGame = false) {
        const badge = document.createElement('span');
        badge.className = 'custom-gm-badge';
        badge.textContent = 'GM';
        
        const styles = isInGame ? inGameBadgeStyles : profileBadgeStyles;
        
        // Base styles
        badge.style.display = 'inline-flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.verticalAlign = 'middle';
        badge.style.boxSizing = 'border-box';
        badge.style.whiteSpace = 'nowrap';
        badge.style.cursor = 'pointer';
        badge.style.fontSmooth = 'antialiased';
        badge.style.webkitFontSmoothing = 'antialiased';
        badge.style.textDecoration = 'none';
        
        // Apply exact measurements
        Object.keys(styles).forEach(property => {
            badge.style[property] = styles[property];
        });
        
        return badge;
    }
    
    function addBadgesToElements() {
        
        document.querySelectorAll('.custom-gm-badge').forEach(badge => badge.remove());
        
        
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            if (element.children.length > 0) return; 
            
            const text = element.textContent || '';
            const isYourUsername = text.includes(YOUR_USERNAME) || 
                                  text.includes(YOUR_DISPLAY_NAME) ||
                                  text.trim() === YOUR_USERNAME ||
                                  text.trim() === YOUR_DISPLAY_NAME;
            
            if (isYourUsername && !element.querySelector('.custom-gm-badge')) {
                
                const computedStyle = window.getComputedStyle(element);
                const isInGameContext = computedStyle.fontSize === '10px' || 
                                       element.closest('[class*="game"], [class*="match"], [class*="history"]') ||
                                       element.closest('.game-component') ||
                                       text.includes('(') || 
                                       element.textContent.length < 20; 
                
                const badge = createBadge(isInGameContext);
                
                
                if (element.firstChild) {
                    element.insertBefore(badge, element.firstChild);
                } else {
                    element.appendChild(badge);
                }
            }
        });
    }
    
    function init() {
        // Check and add badges
        setTimeout(addBadgesToElements, 300);
        setTimeout(addBadgesToElements, 1000);
        setTimeout(addBadgesToElements, 2000);
        
        
        const observer = new MutationObserver(() => {
            setTimeout(addBadgesToElements, 100);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(addBadgesToElements, 500);
            }
        }, 1000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
