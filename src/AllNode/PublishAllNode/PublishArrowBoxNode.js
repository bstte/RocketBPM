import { memo, useEffect, useState } from 'react';

const PublishArrowBoxNode = ({ data, isRTL }) => {

  const width = data.width_height?.width || 326;
  const height = data.width_height?.height || 90;
  const [clipPath, setClipPath] = useState("");

  const calculateClipPath = (w, h, rtl) => {
    const arrowWidth = 24;

    // RTL: Flip the arrow to point right
    if (rtl) {
      return `polygon(calc(${w}px - 20px) 50%, ${w}px 0, ${arrowWidth}px 0, 0 50%, ${arrowWidth}px 100%, ${w}px 100%)`;
    }

    // LTR: Arrow points left (original)
    return `polygon(20px 50%, 0 0, calc(${w}px - ${arrowWidth}px) 0, ${w}px 50%, calc(${w}px - ${arrowWidth}px) 100%, 0 100%)`;
  };

  useEffect(() => {
    setClipPath(calculateClipPath(width, height, isRTL));
  }, [width, height, isRTL]);

  return (
    <div
      style={{
        ...styles.wrapper,
        filter:
          data.hasNextLevel
            ? "drop-shadow(0px 0px 10px #0000004f)"
            : "none",
      }}
    >


      <div
        className="borderBox"
        style={{
          ...styles.arrowBox,
          width: `${width}px`,
          height: `${height}px`,
          clipPath: clipPath,

        }}
      >
        <div style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: "12px", lineHeight: "1.1", fontFamily: "'Poppins', sans-serif", color: "white" }}> {data.label}</span>
        </div>
      </div>


    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  }
  ,
  arrowBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    textAlign: 'center',
    backgroundColor: 'red',
    color: '#002060',
    width: '100%',
    height: '100%',
    clipPath: 'polygon(20px 50%, 0px 0px, calc(302px) 0px, 326px 50%, calc(302px) 100%, 0px 100%)',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    border: 'none',
  },


};

export default memo(PublishArrowBoxNode);
