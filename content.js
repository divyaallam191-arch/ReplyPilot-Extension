console.log("Email Writer Extension - Content Script");

function createAIButton() {
    const button = document.createElement('div');

    button.className = 'AI-reply-button';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    button.setAttribute('aria-label', 'Generate AI Reply');

    button.innerText = 'AI Reply';


    button.style.cssText = `
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: #1a73e8 !important;
        color: white !important;
        padding: 6px 12px !important;
        margin: 4px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        font-family: Arial, sans-serif !important;
        font-weight: 500 !important;
        min-width: 80px !important;
        height: 32px !important;
        box-sizing: border-box !important;
        z-index: 99999 !important;
        visibility: visible !important;
        opacity: 1 !important;
    `;

    return button;
}

function createToneSelector() {
    const selector = document.createElement('select');

    selector.className = 'AI-reply-tone';
    selector.setAttribute('aria-label', 'Choose reply tone');

    const tones = [
        { label: 'Friendly', value: 'friendly' },
        { label: 'Professional', value: 'professional' },
        { label: 'Casual', value: 'casual' },
        { label: 'Formal', value: 'formal' },
        { label: 'Apologetic', value: 'apologetic' },
        { label: 'Concise', value: 'concise' }
    ];

    tones.forEach(tone => {
        const option = document.createElement('option');
        option.value = tone.value;
        option.textContent = tone.label;
        selector.appendChild(option);
    });

    selector.value = 'friendly';


    selector.style.cssText = `
    display: inline-block !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative !important;
    z-index: 100000 !important;
    width: 130px !important;
    min-width: 130px !important;
    height: 32px !important;
    padding: 4px 8px !important;
    margin: 4px !important;
    border: 1px solid #dadce0 !important;
    border-radius: 4px !important;
    background: #ffffff !important;
    color: #202124 !important;
    font-size: 13px !important;
    cursor: pointer !important;
`;

    return selector;
}


function findComposeToolbar() {
    const editors = document.querySelectorAll(
        '[contenteditable="true"][aria-label="Message Body"]'
    );

    for (const editor of editors) {
        const compose = editor.closest('.M9') || editor.closest('.aoI') || editor.parentElement?.parentElement?.parentElement;

        if (!compose) continue;

        const toolbar = compose.querySelector('.btC');

        if (
            toolbar &&
            toolbar.getClientRects().length > 0
        ) {
            return toolbar;
        }
    }

    return null;
}

function getEmailContent() {
    const bodies = document.querySelectorAll(
        '.adn .a3s, .h7 .a3s, .a3s'
    );

    for (const body of bodies) {
        const text = body.innerText.trim();

        if (text.length > 0 && body.getClientRects().length > 0) {
            return text;
        }
    }

    return null;
}


function injectButton() {

    const existingButton = [...document.querySelectorAll('.AI-reply-button')]
        .find(button => button.getClientRects().length > 0);

    if (existingButton) {
        console.log("AI Reply button already exists");
        return;
    }

    const toolbar = findComposeToolbar();

    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button");

    const button = createAIButton();
    const toneSelector = createToneSelector();

    button.addEventListener('click', async () => {

        try {

            button.innerText = 'Generating...';
            button.style.pointerEvents = 'none';

            const emailContent = getEmailContent();

            if (!emailContent) {
                throw new Error('Email content not found');
            }

            const response = await fetch(
                'https://replypilot-backend-kjxi.onrender.com/api/email/generate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        emailContent: emailContent,
                        tone: toneSelector.value
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    'Backend error:',
                    response.status,
                    errorText
                );

                if (response.status === 503 || response.status === 502) {
                    throw new Error(
                        'AI service is temporarily unavailable. Please try again.'
                    );
                }

                throw new Error(
                    `Request failed with status ${response.status}`
                );
            }
            const generatedReply = await response.text();

            const composeBox = document.querySelector(
                '[role="textbox"][g_editable="true"]'
            );

            if (composeBox) {

                composeBox.focus();

                document.execCommand(
                    'insertText',
                    false,
                    generatedReply
                );

            } else {

                console.error('Compose box was not found');

            }

        } catch (error) {

            console.error('AI Reply Error:', error);

            alert(error.message || 'Failed to generate reply');

        } finally {

            button.innerText = 'AI Reply';
            button.style.pointerEvents = 'auto';

        }
    });


    const controlsContainer = document.createElement('div');

    controlsContainer.style.cssText = `
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    margin: 4px !important;
    visibility: visible !important;
    opacity: 1 !important;
`;

    controlsContainer.appendChild(toneSelector);
    controlsContainer.appendChild(button);

    toolbar.appendChild(controlsContainer);


    console.log(
        "Button in DOM:",
        button,
        button.getBoundingClientRect()
    );
}


const observer = new MutationObserver((mutations) => {

    for (const mutation of mutations) {

        const addedNodes = Array.from(mutation.addedNodes);

        const hasComposeElements = addedNodes.some(node => {

            if (node.nodeType !== Node.ELEMENT_NODE) {
                return false;
            }

            return (
                node.matches('.aDh, .btC, [role="dialog"], .aoI') ||
                node.querySelector(
                    '.aDh, .btC, [role="dialog"], .aoI'
                )
            );

        });

        if (hasComposeElements) {

            console.log("Compose Window Detected");

            setTimeout(() => {
                injectButton();
            }, 1000);
        }
    }
});


observer.observe(document.body, {
    childList: true,
    subtree: true
});