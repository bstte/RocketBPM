import { memo, useState } from 'react';

const PublishArrowBoxNode = ({ data,}) => {

  const [isClickable, setIsClickable] = useState(false);

  const handleClick = () => {
    setIsClickable(!isClickable);
  };

  return (
    <div
      style={styles.wrapper}
      onClick={handleClick}
    >
      <div
        className="borderBox"
        style={{
          ...styles.arrowBox,
          minWidth:  data.width_height ? data.width_height.width : '520px',
          minHeight:  data.width_height ? data.width_height.height : '150px',
        }}
      >
        <div style={{ cursor: 'pointer' }}>
            <span style={{fontSize:"18px", fontFamily: "'Poppins', sans-serif",color:"white"}}> {data.label}</span>
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
    clipPath: 'polygon(40px 50%, 0 0, calc(100% - 40px) 0, 100% 50%, calc(100% - 40px) 100%, 0 100%)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    border: 'none',
  },

  
};

export default memo(PublishArrowBoxNode);
