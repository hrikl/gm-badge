document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const titleSelect = document.getElementById('title');
    const customTitleInput = document.getElementById('customTitle');
    const colorInput = document.getElementById('color');
    const colorPreview = document.getElementById('colorPreview');
    const titleText = document.getElementById('titleText');
    const hexValue = document.getElementById('hexValue');
    const saveButton = document.getElementById('save');
    const testButton = document.getElementById('test');
    const resetColorButton = document.getElementById('resetColor');
    const status = document.getElementById('status');

    chrome.storage.sync.get(['username', 'title', 'customTitle', 'badgeColor'], function(result) {
        if (result.username) usernameInput.value = result.username;
        if (result.title) {
            titleSelect.value = result.title;
            updateTitleDisplay();
        }
        if (result.customTitle) customTitleInput.value = result.customTitle;
        if (result.badgeColor) {
            colorInput.value = result.badgeColor;
            updateColorDisplay();
        }
    });

    titleSelect.addEventListener('change', function() {
        updateTitleDisplay();
    });

    function updateTitleDisplay() {
        const selectedTitle = titleSelect.value;
        if (selectedTitle === 'CUSTOM') {
            customTitleInput.style.display = 'block';
            titleText.textContent = customTitleInput.value || 'CUSTOM';
        } else {
            customTitleInput.style.display = 'none';
            titleText.textContent = selectedTitle;
        }
    }

    customTitleInput.addEventListener('input', function() {
        if (titleSelect.value === 'CUSTOM') {
            titleText.textContent = this.value || 'CUSTOM';
        }
    });

    colorInput.addEventListener('input', function() {
        updateColorDisplay();
    });

    function updateColorDisplay() {
        const color = colorInput.value;
        colorPreview.style.backgroundColor = color;
        hexValue.textContent = color.toUpperCase();
    }

    resetColorButton.addEventListener('click', function() {
        colorInput.value = '#7C2929';
        updateColorDisplay();
    });

    saveButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        
        if (!username) {
            showStatus('Please enter your Chess.com username', 'error');
            return;
        }

        const selectedTitle = titleSelect.value;
        let finalTitle = selectedTitle;
        
        if (selectedTitle === 'CUSTOM') {
            const customTitle = customTitleInput.value.trim();
            if (!customTitle) {
                showStatus('Please enter a custom title', 'error');
                return;
            }
            finalTitle = customTitle;
        }

        const settings = {
            username: username,
            title: finalTitle,
            customTitle: customTitleInput.value.trim(),
            badgeColor: colorInput.value
        };

        chrome.storage.sync.set(settings, function() {
            showStatus('Settings saved successfully!', 'success');
            
            chrome.tabs.query({url: "*://*.chess.com/*"}, function(tabs) {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'updateSettings',
                        settings: settings
                    });
                });
            });
        });
    });

    testButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        
        if (!username) {
            showStatus('Please enter your username first', 'error');
            return;
        }

        const selectedTitle = titleSelect.value;
        let finalTitle = selectedTitle === 'CUSTOM' ? customTitleInput.value.trim() : selectedTitle;
        
        if (!finalTitle) {
            showStatus('Please select or enter a title', 'error');
            return;
        }

        const settings = {
            username: username,
            title: finalTitle,
            customTitle: customTitleInput.value.trim(),
            badgeColor: colorInput.value
        };

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'testBadge',
                settings: settings
            }, function(response) {
                if (chrome.runtime.lastError) {
                    showStatus('Please navigate to Chess.com first', 'error');
                } else {
                    showStatus('Test badge applied!', 'success');
                }
            });
        });
    });

    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.style.display = 'block';
        
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
});
