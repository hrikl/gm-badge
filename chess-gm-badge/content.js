(function() {
    'use strict';
    
    // YOUR USERNAME - Change this to your actual Chess.com username
    const YOUR_USERNAME = '#';

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
        color: '#FFFFFF',
        verticalAlign: 'top',
        marginTop: '-1px'
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
        color: '#FFFFFF',
        verticalAlign: 'top',
        marginTop: '-1px'
    };
    
    function createBadge(isInGame = false) {
        const badge = document.createElement('span');
        badge.className = 'custom-gm-badge';
        badge.textContent = 'GM';
        
        const styles = isInGame ? inGameBadgeStyles : profileBadgeStyles;
        
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
        
        Object.keys(styles).forEach(property => {
            badge.style[property] = styles[property];
        });
        
        return badge;
    }
    
    function addBadgesToElements() {

        document.querySelectorAll('.custom-gm-badge').forEach(badge => badge.remove());
        

        const usernameSelectors = [
            'h1.profile-card-username',
            '[class*="username"]',
            '[data-username]',
            '.user-username',
            '.player-username'
        ];
        
        usernameSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const text = element.textContent || '';

                if (text.includes(YOUR_USERNAME) && !element.querySelector('.custom-gm-badge')) {
                    
                    const computedStyle = window.getComputedStyle(element);
                    const isInGameContext = computedStyle.fontSize === '10px' || 
                                           computedStyle.fontSize.includes('10') ||
                                           element.closest('[class*="game"], [class*="match"]');
                    
                    const badge = createBadge(isInGameContext);
                    
                    if (element.firstChild) {
                        element.insertBefore(badge, element.firstChild);
                    } else {
                        element.appendChild(badge);
                    }
                }
            });
        });
    }
    
    function init() {
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
