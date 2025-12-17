import React, { memo, useEffect, useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';

const SwimlineRightsideBox = ({ data}) => {
  const [title, setTitle] = useState(data.details.title);
  const contentEditableRef = useRef(null); 

  const [autoFocus, setAutoFocus] = useState(data.autoFocus);

  useEffect(() => {
    setTitle(data.details.title);
  }, [data.details.title]);
  
  const handleChange = (e) => {
    setTitle(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };

  // useEffect(() => {
  //   if (autoFocus && contentEditableRef.current) {
  //     setTimeout(() => {
  //       contentEditableRef.current.focus();
  //       setAutoFocus(false); 
  //     }, 0);
  //   }
  // }, [autoFocus]);


    useEffect(() => {
    if (autoFocus && contentEditableRef.current) {
      setTimeout(() => {
        const el = contentEditableRef.current;
        el.focus();

        // Move caret to the end of the content
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        setAutoFocus(false);
      }, 0);
    }
  }, [autoFocus]);


  // const handleBoxClick = () => {
  
  //   setTimeout(() => {
  //     contentEditableRef.current?.focus();
  //   }, 0);
  // };


    const handleBoxClick = () => {
    if (contentEditableRef.current) {
      setTimeout(() => {
        const el = contentEditableRef.current;
        el.focus();

        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false); // Move caret to end
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }, 0);
    }
  };

  const handleBlur = () => {
    // if (data.onLabelChange) {
    //   data.onLabelChange(title);
    // }
  };

  const handleFocus = (e) => {
    const selection = window.getSelection();
    const range = document.createRange();
  
    if (e.target.firstChild) {
      range.setStart(e.target.firstChild, e.target.selectionStart || 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  

  return (
    <div style={styles.wrapper} onClick={handleBoxClick}>
      <div className="borderBox" style={styles.box}>
        <ContentEditable
          innerRef={contentEditableRef} 
          html={title} 
          onFocus={handleFocus}
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
    width: "80%",
    height: "72%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'red',
    color: '#002060',
    // border: '1px solid #002060',
    width: '100%',
    height: '100%',
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
