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
    const menuWidth = 300;
    const menuHeight = 100;

    // Prevent menu overflow
    let x = contextMenuPosition.x;
    let y = contextMenuPosition.y;
    const { innerWidth, innerHeight } = window;

    if (x + menuWidth > innerWidth) x = innerWidth - menuWidth - 20;
    if (y + menuHeight > innerHeight) y = innerHeight - menuHeight - 40;

    return (
        <div
            id="custom-context-menu"
            style={{
               position: 'fixed',
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
