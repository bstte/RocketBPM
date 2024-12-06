import React, { memo, useEffect, useRef, useState } from 'react';

const SwimlineRightsideBox = ({ data, id, isNew }) => {
  const [label, setLabel] = useState(data.label || ''); 
  const textareaRef = useRef(null);

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

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
      <div className='borderBox' style={styles.box}>
        <textarea
          ref={textareaRef}
          value={label} // The value to display
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Type ...."
          style={styles.textarea}
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
  textarea: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '12px',
    width: '100%',
    resize: 'none',
    outline: 'none',
    textAlign: 'center',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontFamily: "'Poppins', sans-serif",
    minHeight: '20px', // Ensure there’s some initial height
  },
};

const BoxNodeWithPlaceholder = (props) => (
  <SwimlineRightsideBox {...props} />
);

export default memo(BoxNodeWithPlaceholder);
