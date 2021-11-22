new VanillaContextMenu({
    scope: document.querySelector('.beatmap-selector'),
    menuItems: [{
            label: 'Copy',
            callback: () => {
                // ? your code here
            },
        },
        'hr',
        {
            label: 'Paste',
            callback: pasteFunction,
        },
    ],
});