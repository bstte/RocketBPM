import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../hooks/useTranslation';

const CustomContextMenu = ({
    showContextMenu,
    contextMenuPosition,
    handleContextMenuOptionClick,
}) => {

    const t = useTranslation(); // ✅ Hook moved to the top

    useEffect(() => {
        const handleClickOutside = (event) => {
            const contextMenu = document.getElementById('custom-context-menu');
            if (contextMenu && !contextMenu.contains(event.target)) {
            }
        };

        if (showContextMenu) {
            window.addEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [showContextMenu]);

    if (!showContextMenu) return null;
    // Menu dimensions (adjust to your style)
    const container = document.querySelector(".flow-container");
    const containerRect = container?.getBoundingClientRect();

    if (!containerRect) return null;

    // Convert to container-relative coordinates
    let x = contextMenuPosition.x - containerRect.left + 10;
    let y = contextMenuPosition.y - containerRect.top + 10;

    const menuWidth = 300;
    const menuHeight = 120;

    // Boundaries (stay inside container)
    const maxX = containerRect.width - menuWidth - 10;
    const maxY = containerRect.height - menuHeight - 10;

    // Clamp final position
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;
    if (x < 10) x = 10;
    if (y < 10) y = 10;

    return (
        <div
            id="custom-context-menu"
            style={{
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                background: '#f5f5f5',
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 10px",
                zIndex: 1000,
                minWidth: '100px',
                width: '300px'
            }}
        >
            <button className='menuitems' onClick={() => handleContextMenuOptionClick('progressArrow')}>{t("add_value_adding_process")}</button>
            <button className='menuitems' onClick={() => handleContextMenuOptionClick('pentagon')}>{t("add_steer_enable_process")}</button>
            <button className='menuitems' onClick={() => handleContextMenuOptionClick('StickyNote')}>{t("add_sticky_not")}</button>

        </div>
    );
};

CustomContextMenu.propTypes = {
    showContextMenu: PropTypes.bool.isRequired,
    contextMenuPosition: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }).isRequired,
    handleContextMenuOptionClick: PropTypes.func.isRequired,
};

export default CustomContextMenu;
