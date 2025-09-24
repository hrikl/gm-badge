document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const titleSelect = document.getElementById('title');
    const customTitleInput = document.getElementById('customTitle');
    const colorInput = document.getElementById('color');
    const colorPreview = document.getElementById('colorPreview');
    const titleText = document.getElementById('titleText');
    const hexValue = document.getElementById('hexValue');
    const saveBtn = document.getElementById('save');
    const testBtn = document.getElementById('test');
    const resetColorBtn = document.getElementById('resetColor');
    const status = document.getElementById('status');


    chrome.storage.sync.get(['username', 'finalTitle', 'color'], data => {
        if (data.username) usernameInput.value = data.username;
        if (data.finalTitle) {
            if (['GM','IM','FM','WGM','NM','CM'].includes(data.finalTitle)) {
                titleSelect.value = data.finalTitle;
            } else {
                titleSelect.value = 'CUSTOM';
                customTitleInput.value = data.finalTitle;
                customTitleInput.style.display = 'block';
            }
            titleText.textContent = data.finalTitle;
        }
        if (data.color) {
            colorInput.value = data.color;
            colorPreview.style.backgroundColor = data.color;
            hexValue.textContent = data.color;
        }
    });

   
    titleSelect.addEventListener('change', () => {
        if (titleSelect.value === 'CUSTOM') {
            customTitleInput.style.display = 'block';
            titleText.textContent = customTitleInput.value || 'CUSTOM';
        } else {
            customTitleInput.style.display = 'none';
            titleText.textContent = titleSelect.value;
        }
    });

    customTitleInput.addEventListener('input', () => {
        titleText.textContent = customTitleInput.value;
    });

    // Color picker
    colorInput.addEventListener('input', () => {
        colorPreview.style.backgroundColor = colorInput.value;
        hexValue.textContent = colorInput.value.toUpperCase();
    });

    resetColorBtn.addEventListener('click', () => {
        colorInput.value = '#7C2929';
        colorPreview.style.backgroundColor = '#7C2929';
        hexValue.textContent = '#7C2929';
    });


    saveBtn.addEventListener('click', () => {
        const finalTitle = titleSelect.value === 'CUSTOM' ? customTitleInput.value : titleSelect.value;
        const color = colorInput.value;

        if (!usernameInput.value || !finalTitle) {
            showStatus('Please fill in all fields', 'error');
            return;
        }

        chrome.storage.sync.set({
            username: usernameInput.value,
            finalTitle: finalTitle,
            color: color
        }, () => showStatus('Settings saved!', 'success'));
    });


    testBtn.addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'updateBadges'});
        });
    });

    function showStatus(msg, type) {
        status.textContent = msg;
        status.className = `status ${type}`;
        status.style.display = 'block';
        setTimeout(() => { status.style.display = 'none'; }, 2000);
    }
});
