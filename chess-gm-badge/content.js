(function() {
    'use strict';
    
    let settings = {
        username: '#',
        title: 'GM',
        customTitle: '',
        badgeColor: '#7C2929'
    };
    
    chrome.storage.sync.get(['username', 'title', 'customTitle', 'badgeColor'], function(result) {
        if (result.username) settings.username = result.username;
        if (result.title) settings.title = result.title;
        if (result.customTitle) settings.customTitle = result.customTitle;
        if (result.badgeColor) settings.badgeColor = result.badgeColor;
        setTimeout(addBadgesToElements, 1000);
    });
    
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'updateSettings') {
            settings = request.settings;
            document.querySelectorAll('.custom-gm-badge').forEach(badge => badge.remove());
            setTimeout(addBadgesToElements, 500);
            sendResponse({success: true});
        } else if (request.action === 'testBadge') {
            const oldSettings = {...settings};
            settings = request.settings;
            document.querySelectorAll('.custom-gm-badge').forEach(badge => badge.remove());
            addBadgesToElements();
            setTimeout(() => {
                settings = oldSettings;
                document.querySelectorAll('.custom-gm-badge').forEach(badge => badge.remove());
                addBadgesToElements();
            }, 5000);
            sendResponse({success: true});
        }
    });
    
    const profileBadgeStyles = {
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: '18px',
        padding: '2px 3px',
        margin: '2px 6px 0px 0px',
        borderRadius: '3px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, Helvetica, Arial, sans-serif',
        textTransform: 'uppercase',
        height: '22px',
        minWidth: '35px',
        color: '#FFFFFF',
        verticalAlign: 'top'
    };
    
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
        color: '#FFFFFF',
        verticalAlign: 'top',
        marginTop: '-1px'
    };
    
    function createBadge(isInGame = false) {
        const badge = document.createElement('span');
        badge.className = 'custom-gm-badge';
        badge.textContent = settings.title;
        
        const styles = isInGame ? inGameBadgeStyles : profileBadgeStyles;
        
        badge.style.display = isInGame ? 'inline-flex' : 'inline-block';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.boxSizing = 'border-box';
        badge.style.whiteSpace = 'nowrap';
        badge.style.cursor = 'pointer';
        badge.style.textDecoration = 'none';
        badge.style.backgroundColor = settings.badgeColor;
        

        Object.keys(styles).forEach(property => {
            badge.style[property] = styles[property];
        });
        
        return badge;
    }
    
    function shouldUseInGameSize(element) {
        if (element.closest('[class*="game"], [class*="match"], [class*="history"], [class*="player"]')) {
            return true;
        }
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.fontSize === '10px' || computedStyle.fontSize.includes('10')) {
            return true;
        }
        if (element.textContent && element.textContent.includes('(') && element.textContent.length < 30) {
            return true;
        }
        return false;
    }
    
    function addBadgesToElements() {
        document.querySelectorAll('.custom-gm-badge').forEach(badge => badge.remove());
        const usernameSelectors = [
            'h1.profile-card-username', 
            '.player-username',         
            '.game-username', 
            '[class*="username"]',
            '[class*="player"]',
            '.user-link',
            '.username'
        ];
        usernameSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const text = element.textContent || '';
                if (text.includes(settings.username) && !element.querySelector('.custom-gm-badge')) {
                    const isInGame = shouldUseInGameSize(element);
                    const badge = createBadge(isInGame);
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
        const observer = new MutationObserver(() => {
            setTimeout(addBadgesToElements, 500);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(addBadgesToElements, 1000);
            }
        }, 2000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
