import { memo, useEffect, useState } from 'react';

const PublishArrowBoxNode = ({ data}) => {


  const width=data.width_height?.width || 326
  const height=data.width_height?.height || 90
  const [clipPath, setClipPath] = useState("");

  const calculateClipPath = (w, h) => {
    return `polygon(20px 50%, 0 0, calc(${w}px - 24px) 0, ${w}px 50%, calc(${w}px - 24px) 100%, 0 100%)`;
  };

  useEffect(() => {
    setClipPath(calculateClipPath(width, height));
  }, [width, height]);

  return (
    <div
      style={styles.wrapper}
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
            <span style={{fontSize:"1rem", fontFamily: "'Poppins', sans-serif",color:"white"}}> {data.label}</span>
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
  },
  arrowBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    textAlign: 'center',
    backgroundColor: 'red',
    color: '#000000',
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
