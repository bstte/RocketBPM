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
                borderRadius: '8px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                padding: '10px',
                minWidth: '100px',
            }}
        >
            <button
                style={{
                    padding: '10px',
                    background: 'none',
                    border: 'none', 
                    cursor: 'pointer',
                    textAlign: 'left',
                   
                    borderBottom: '1px solid #fff', 
                }}
                onClick={() => handleContextMenuOptionClick('progressArrow')}
            >
                Add Value Adding Process
            </button>
            <button
                style={{
                    padding: '10px',
                    background: 'none',
                    border: 'none', 
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                }}
                onClick={() => handleContextMenuOptionClick('pentagon')}
            >
                Add Steer & Enable Process
            </button>
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
