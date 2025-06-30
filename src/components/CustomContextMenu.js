import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const CustomContextMenu = ({
    showContextMenu,
    contextMenuPosition,
    handleContextMenuOptionClick,
}) => {
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

    return (
        <div
            id="custom-context-menu"
            style={{
                position: 'absolute',
                top: `${contextMenuPosition.y}px`,
                left: `${contextMenuPosition.x}px`,
                background: '#f5f5f5', 
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 10px",
                zIndex: 1000,
                minWidth: '100px',
                width: '300px'
            }}
        >
            <button className='menuitems' onClick={() => handleContextMenuOptionClick('progressArrow')}>Add Value Adding Process</button>
            <button className='menuitems' onClick={() => handleContextMenuOptionClick('pentagon')}>Add Steer & Enable Process </button>
            <button className='menuitems' onClick={() => handleContextMenuOptionClick('StickyNote')}>Sticky Note</button>

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
