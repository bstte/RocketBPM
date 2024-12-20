import React, { memo, useEffect, useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';

const SwimlineRightsideBox = ({ data, id, isNew }) => {
  const [label, setLabel] = useState(data.label || ''); 
  const contentEditableRef = useRef(null); 


  useEffect(() => {
    if (data.autoFocus && contentEditableRef.current) {
      setTimeout(() => {
        contentEditableRef.current.focus();
        data.autoFocus = false; 
      }, 0);
    }
  }, [data.autoFocus]);

  const handleChange = (e) => {
    setLabel(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };

  const handleBlur = () => {
    if (data.onLabelChange) {
      data.onLabelChange(label);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div className="borderBox" style={styles.box}>
        <ContentEditable
          innerRef={contentEditableRef} // Attach the ref to ContentEditable
          html={label} 
          onChange={(e) => handleChange({ target: { value: e.target.value } })}
          onBlur={handleBlur}
          placeholder="Type ...."
          style={styles.contentEditable}
        />
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '90%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'red',
    color: '#000000',
    border: '2px solid #000',
    width: '100%',
    height: '100%',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  contentEditable: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '12px',
    width: '100%',
    outline: 'none',
    textAlign: 'center',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontFamily: "'Poppins', sans-serif",
    minHeight: '20px',
  },
};

const BoxNodeWithPlaceholder = (props) => (
  <SwimlineRightsideBox {...props} />
);

export default memo(BoxNodeWithPlaceholder);
