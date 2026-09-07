// Create theme toggle
const themeToggle = document.createElement("button");

themeToggle.id = "themeToggle";
themeToggle.className = "theme-toggle";
themeToggle.setAttribute("aria-label", "Toggle theme");
themeToggle.setAttribute("data-tooltip", "Toggle theme");

themeToggle.innerHTML = `
    <svg class="theme-icon sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true">
        <path
            d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z" />
    </svg>

    <svg class="theme-icon moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true">
        <path
            d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z" />
    </svg>
`;


// Add styling
const themeStyle = document.createElement("style");

themeStyle.textContent = `
    /* Theme button */

    .theme-toggle {
        position: fixed;
        right: 16px;
        bottom: 16px;

        width: 40px;
        height: 40px;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0;

        border: 1px solid var(--border);
        border-radius: 50%;

        background: var(--surface);
        color: var(--accent);

        cursor: pointer;

        z-index: 100;
    }

    .theme-toggle:hover {
        background: var(--button-hover);
    }

    .theme-icon {
        width: 21px;
        height: 21px;

        fill: currentColor;
    }


    /* Default icon */

    .moon-icon {
        display: none;
    }


    /* Light system theme */

    @media (prefers-color-scheme: light) {
        .sun-icon {
            display: none;
        }

        .moon-icon {
            display: block;
        }
    }


    /* Explicit theme choices */

    :root[data-theme="dark"] .sun-icon {
        display: block;
    }

    :root[data-theme="dark"] .moon-icon {
        display: none;
    }

    :root[data-theme="light"] .sun-icon {
        display: none;
    }

    :root[data-theme="light"] .moon-icon {
        display: block;
    }
`;


// Add everything to the page
document.head.appendChild(themeStyle);
document.body.appendChild(themeToggle);


// Read the theme var and apply it
const savedTheme =
    localStorage.getItem("markdown-editor-theme");

if (savedTheme) {
    document.documentElement.dataset.theme =
        savedTheme;
}


// Toggle theme
themeToggle.addEventListener("click", () => {

    const current =
        document.documentElement.dataset.theme;

    const systemDark =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    const isDark =
        current
            ? current === "dark"
            : systemDark;

    const next =
        isDark
            ? "light"
            : "dark";

    const setText =
        isDark
            ? "Dark Mode"
            : "Light Mode";

    document.documentElement.dataset.theme = next;

    themeToggle.setAttribute(
        "data-tooltip",
        setText
    );

    localStorage.setItem(
        "markdown-editor-theme",
        next
    );
});