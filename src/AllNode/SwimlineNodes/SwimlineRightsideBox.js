import React, { memo, useEffect, useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import RoleGroupTooltip from '../../Pages/Map_level/components/RoleGroupTooltip';

const SwimlineRightsideBox = ({ data, processDefaultlanguage_id, langMap }) => {
  const [title, setTitle] = useState(data.details?.title || data.label || "");
  const contentEditableRef = useRef(null);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setTitle(data.details?.title || data.label || "");
  }, [data.details?.title, data.label]);

 useEffect(() => {
  if (!autoFocus) return;

  const el = contentEditableRef.current;
  if (!el) return;

  requestAnimationFrame(() => {
    if (!contentEditableRef.current) return;

    const el = contentEditableRef.current;
    el.focus();

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    setAutoFocus(false);
  });
}, [autoFocus]);


  const handleChange = (e) => {
    setTitle(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };


const handleBoxClick = () => {
  requestAnimationFrame(() => {
    const el = contentEditableRef.current;
    if (!el) return;

    el.focus();

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
};


  const handleBlur = () => {
    // if (data.onLabelChange) {
    //   data.onLabelChange(title);
    // }
  };

const handleFocus = () => {
  const el = contentEditableRef.current;
  if (!el) return;

  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);

  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

  return (
    <div
      style={{
        ...styles.wrapper,

      }}
      onClick={handleBoxClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="borderBox" style={{
        ...styles.box,

      }}>
        <ContentEditable
          innerRef={contentEditableRef}
          html={title}
          onFocus={handleFocus}
          onChange={(e) => handleChange({ target: { value: e.target.value } })}
             onBlur={handleBlur}
          placeholder="Type ..."
          style={styles.contentEditable}
        />
      </div>
      {data.isRoleGroup && isHovered && data.roles && (
        <RoleGroupTooltip
          roles={data.roles}
          langMap={langMap}
          processDefaultlanguage_id={processDefaultlanguage_id}
        />
      )}

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
