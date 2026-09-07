/*
 * tooltips.js
 *
 * Only elements with [data-tooltip] receive custom tooltips.
 */

(() => {
    const TOOLTIP_CLASS = 'custom-tooltip';

    /* =========================
       CSS
       ========================= */

    const style = document.createElement('style');

    style.textContent = `
        .custom-tooltip {
            position: fixed;
            z-index: 99999;

            padding: 7px 10px;
            border-radius: 7px;

            background: var(--surface);
            color: var(--text);
            border: 1px solid var(--border);

            font-size: 13px;
            line-height: 1.3;
            white-space: nowrap;

            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);

            pointer-events: none;

            opacity: 0;

            transition:
                opacity .12s ease,
                transform .12s ease;
        }

        /*
         * Above / below
         */
        .custom-tooltip.tooltip-top,
        .custom-tooltip.tooltip-bottom {
            transform: translate(-50%, 4px) scale(.98);
        }

        .custom-tooltip.tooltip-top.visible,
        .custom-tooltip.tooltip-bottom.visible {
            transform: translate(-50%, 0) scale(1);
        }

        /*
         * Left / right
         */
        .custom-tooltip.tooltip-left,
        .custom-tooltip.tooltip-right {
            transform: translate(4px, -50%) scale(.98);
        }

        .custom-tooltip.tooltip-left.visible,
        .custom-tooltip.tooltip-right.visible {
            transform: translate(0, -50%) scale(1);
        }

        /*
         * Visible
         */
        .custom-tooltip.visible {
            opacity: 1;
        }
    `;

    document.head.appendChild(style);


    /* =========================
       Tooltip element
       ========================= */

    const tooltip = document.createElement('div');

    tooltip.className = TOOLTIP_CLASS;
    tooltip.setAttribute('role', 'tooltip');

    document.body.appendChild(tooltip);


    let currentElement = null;


    /* =========================
       Position
       ========================= */

    function positionTooltip(element) {
        const rect = element.getBoundingClientRect();

        /*
         * The tooltip needs to be measurable.
         */
        const tooltipRect = tooltip.getBoundingClientRect();

        const gap = 8;
        const margin = 8;

        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;


        /*
         * Available space around the element.
         */

        const spaceTop = rect.top;
        const spaceBottom = viewportHeight - rect.bottom;
        const spaceLeft = rect.left;
        const spaceRight = viewportWidth - rect.right;


        /*
         * Preferred placement:
         *
         * 1. Top
         * 2. Bottom
         * 3. Right
         * 4. Left
         */

        let side;


        if (spaceTop >= tooltipHeight + gap + margin) {
            side = 'top';

        } else if (
            spaceBottom >= tooltipHeight + gap + margin
        ) {
            side = 'bottom';

        } else if (
            spaceRight >= tooltipWidth + gap + margin
        ) {
            side = 'right';

        } else {
            side = 'left';
        }


        /*
         * Remove old positioning classes.
         */

        tooltip.classList.remove(
            'tooltip-top',
            'tooltip-bottom',
            'tooltip-left',
            'tooltip-right'
        );

        tooltip.classList.add(`tooltip-${side}`);


        /*
         * Calculate position.
         */

        let left;
        let top;


        if (side === 'top') {

            /*
             * Center horizontally above element.
             */

            left =
                rect.left +
                rect.width / 2;

            top =
                rect.top -
                tooltipHeight -
                gap;

        }


        else if (side === 'bottom') {

            /*
             * Center horizontally below element.
             */

            left =
                rect.left +
                rect.width / 2;

            top =
                rect.bottom +
                gap;

        }


        else if (side === 'right') {

            /*
             * Center vertically to the right.
             */

            left =
                rect.right +
                gap;

            top =
                rect.top +
                rect.height / 2;

        }


        else {

            /*
             * Center vertically to the left.
             */

            left =
                rect.left -
                tooltipWidth -
                gap;

            top =
                rect.top +
                rect.height / 2;
        }


        /*
         * Keep the tooltip inside the viewport.
         *
         * For top/bottom, clamp horizontally.
         *
         * For left/right, clamp vertically.
         */

        if (side === 'top' || side === 'bottom') {

            left = Math.max(
                margin + tooltipWidth / 2,
                Math.min(
                    left,
                    viewportWidth -
                    margin -
                    tooltipWidth / 2
                )
            );

        } else {

            top = Math.max(
                margin + tooltipHeight / 2,
                Math.min(
                    top,
                    viewportHeight -
                    margin -
                    tooltipHeight / 2
                )
            );
        }


        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }


    /* =========================
       Show
       ========================= */

    function showTooltip(element) {

        /*
         * Only data-tooltip counts.
         *
         * title, aria-label, textContent, etc.
         * are completely ignored.
         */

        if (
            !element ||
            !element.hasAttribute('data-tooltip')
        ) {
            return;
        }

        const text = element.getAttribute('data-tooltip');

        if (!text) {
            return;
        }

        currentElement = element;

        tooltip.textContent = text;

        /*
         * Make sure the tooltip has its new
         * dimensions before positioning it.
         */
        tooltip.classList.remove('visible');

        positionTooltip(element);

        /*
         * Force layout so the transition works.
         */
        tooltip.offsetWidth;

        tooltip.classList.add('visible');
    }


    /* =========================
       Hide
       ========================= */

    function hideTooltip() {
        currentElement = null;
        tooltip.classList.remove('visible');
    }


    /* =========================
       Mouse
       ========================= */

    document.addEventListener('pointerover', event => {

        const element =
            event.target.closest('[data-tooltip]');

        /*
         * No data-tooltip = no custom tooltip.
         */
        if (!element) {
            return;
        }

        /*
         * Ignore movement between children
         * of the same element.
         */
        if (
            event.relatedTarget &&
            element.contains(event.relatedTarget)
        ) {
            return;
        }

        showTooltip(element);
    });


    document.addEventListener('pointerout', event => {

        if (!currentElement) {
            return;
        }

        if (
            event.target === currentElement ||
            currentElement.contains(event.target)
        ) {

            const destination = event.relatedTarget;

            if (
                !destination ||
                !currentElement.contains(destination)
            ) {
                hideTooltip();
            }
        }
    });


    /* =========================
       Movement / resize
       ========================= */

    document.addEventListener('pointermove', () => {

        if (!currentElement) {
            return;
        }

        if (!currentElement.matches(':hover')) {
            hideTooltip();
            return;
        }

        positionTooltip(currentElement);
    });


    window.addEventListener('resize', () => {

        if (currentElement) {
            positionTooltip(currentElement);
        }

    });


    window.addEventListener('scroll', () => {

        if (currentElement) {
            positionTooltip(currentElement);
        }

    }, true);


    /* =========================
   Dynamic content updates
   ========================= */

    const tooltipObserver = new MutationObserver(mutations => {

        for (const mutation of mutations) {

            if (
                mutation.type !== 'attributes' ||
                mutation.attributeName !== 'data-tooltip'
            ) {
                continue;
            }

            /*
             * Only update if this is the element
             * currently displaying the tooltip.
             */
            if (mutation.target !== currentElement) {
                continue;
            }

            const text = mutation.target.getAttribute('data-tooltip');

            /*
             * If the tooltip was removed/emptied,
             * hide it.
             */
            if (!text) {
                hideTooltip();
                return;
            }

            /*
             * Update the content immediately.
             */
            tooltip.textContent = text;

            /*
             * The new text may have a different width,
             * so recalculate its position immediately.
             */
            positionTooltip(currentElement);
        }
    });


    tooltipObserver.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['data-tooltip']
    });





    /* =========================
       Public API
       ========================= */

    window.Tooltips = {
        show: showTooltip,
        hide: hideTooltip
    };

})();