function visibilityChecker(el, params = null) {
    if (!el) {
        throw "No element";
    }

    if (!(el instanceof HTMLElement)) {
        throw "Element is not instance of HTMLElement";
    }

    const isVisible = () => {
        const styles = getComputedStyle(el);
        const elWindow = findWindow(el);
        const elRect = el.getBoundingClientRect();

        function checkParents() {
            for (const parent of parents(el)) {
                const isElement = parent === el;
                const style = isElement ? styles : elWindow.getComputedStyle(parent);
                if (style.opacity === '0') {
                    return false;
                }
                if (style.display === 'contents') {
                    continue;
                }
                const rect = isElement ? elRect : parent.getBoundingClientRect();
                if ((rect.width === 0 || rect.height === 0) && styles.overflow === 'hidden') {
                    return false;
                }
            }

            return true;
        }

        return !(
            !!elWindow ||
            styles.display === 'none' ||
            styles.visibility === 'hidden' ||
            styles.width === '0' ||
            styles.height === '0' ||
            (params ? styles.opacity < params.allowedOpacity : styles.opacity < 1) ||
            el.offsetHeight === 0 ||
            el.offsetWidth === 0 ||
            elRect.height === 0 ||
            elRect.width === 0 ||
            el.getClientRects().length === 0 || // TODO: should check more details and add tests
            !checkParents()
        );
    };

    return {
        isVisible: isVisible,
    }
}

function findWindow(el) {
    let doc = el.ownerDocument;
    if (doc === null) {
        doc = el;
    }
    const elWin = doc.defaultView;
    return elWin ? elWin : false;
}

function *parents(el) {
    yield el;
    let parent;
    while ((parent = el.parentNode) !== null && parent.nodeType === parent.ELEMENT_NODE) {
        yield parent;
        el = parent;
    }
}

module.exports = visibilityChecker;
