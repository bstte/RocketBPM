import { memo, useState } from 'react';
const PublishPentagonNode = ({ data, }) => {


  const [isClickable, setIsClickable] = useState(false);


  const handleClick = () => {
    setIsClickable(!isClickable);
  };

  return (
    <div style={styles.wrapper} onClick={handleClick}>
      {/* Pentagon Box */}
      <div
        style={{
          ...styles.pentagonBox,
          minWidth:  data.width_height ? data.width_height.width : '150px',
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
  pentagonBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'red',
    color: '#000000',
    width: '100%',
    height: '100%',
    clipPath: 'polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    border: 'none',
  },

  
};

export default memo(PublishPentagonNode);
