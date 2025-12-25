export function getDropdownPosition(clickClientX, clickClientY, menuWidth, menuHeight) {
    const container = document.querySelector(".publishcontainer");
    if (!container) {
        return { x: clickClientX, y: clickClientY };
    }

    const rect = container.getBoundingClientRect();
    const offsetX = clickClientX - rect.left + container.scrollLeft;
    const offsetY = clickClientY - rect.top + container.scrollTop;

    const padding = 8;
    let x = offsetX + 12;
    let y = offsetY + 8;

    const visibleW = container.clientWidth;
    const visibleH = container.clientHeight;

    if (x + menuWidth > visibleW - padding) {
        x = visibleW - menuWidth - padding;
    }

    if (y + menuHeight > visibleH - padding) {
        const aboveY = offsetY - menuHeight - 12; // open above cursor
        if (aboveY >= padding) {
            y = aboveY;
        } else {
            y = Math.max(padding, visibleH - menuHeight - padding);
        }
    }
    x = Math.max(padding, x);
    y = Math.max(padding, y);

    return { x, y };
}

export function getLocalPositionInsideContainer(clickX, clickY, offsetX = 20, offsetY = 20) {
    const container = document.querySelector(".publishcontainer");
    if (!container) return { x: clickX, y: clickY };

    const rect = container.getBoundingClientRect();

    // Convert click to container local coordinates
    let x = clickX - rect.left + offsetX;
    let y = clickY - rect.top + offsetY;

    // STICKY NOTE SIZE (your note has 240x180)
    const NOTE_WIDTH = 240;
    const NOTE_HEIGHT = 180;

    // Clamp horizontally
    x = Math.max(10, Math.min(x, rect.width - NOTE_WIDTH - 10));

    // Clamp vertically (THIS FIXES BOTTOM ISSUE)
    y = Math.max(10, Math.min(y, rect.height - NOTE_HEIGHT - 10));

    return { x, y };
}

export const centerChildInParent = (parentNode, childNode) => {
    if (!parentNode || !parentNode.style) return { x: 0, y: 0 };

    const parentCenterX = parentNode.position.x + parentNode.style.width / 11;
    const parentCenterY = parentNode.position.y + parentNode.style.height / 11;
    const updatedChildPosition = {
        x: parentCenterX - (childNode.style?.childWidth || 0) / 11,
        y: parentCenterY - (childNode.style?.childHeight || 0) / 11,
    };
    return updatedChildPosition;
};

export const getNearestParentNode = (childNode, nodes) => {
    if (!childNode || !childNode.style) {
        return null; // Avoid error by returning null
    }
    return nodes.reduce((nearest, parentNode) => {
        const childCenterX = childNode.position.x + childNode.style.width / 2;
        const childCenterY = childNode.position.y + childNode.style.height / 2;

        const parentLeft = parentNode.position.x;
        const parentRight = parentNode.position.x + parentNode.style.width + 1;
        const parentTop = parentNode.position.y;
        const parentBottom = parentNode.position.y + parentNode.style.height;

        // Check if at least 10% of the node is inside any cell
        const isOverlapping =
            childCenterX > parentLeft + parentNode.style.width * 0.05 &&
            childCenterX < parentRight - parentNode.style.width * 0.05 &&
            childCenterY > parentTop + parentNode.style.height * 0.05 &&
            childCenterY < parentBottom - parentNode.style.height * 0.05;

        if (isOverlapping) {
            return parentNode;
        }
        return nearest;
    }, null);
};
