import React, { memo, } from 'react';


const NoNode = ({ data }) => {
 
  

  return (
    <div
      style={{
        ...styles.wrapper,
      
      }}
   
    >

      <div
        style={{
          ...styles.labelBox,
       
        }}
      >

          <span  style={styles.text}>
            {/* {label} */}
            No
          </span>
       
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
  labelBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    textAlign: 'center',

    color: '#000',
    borderRadius: '3px',
    width: '100%',
    height: '100%',
    padding: '5px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
 
  text: {
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontWeight: 'medium', // **Added for bold text**
    textTransform: 'uppercase',    fontFamily: "'Poppins', sans-serif",
    fontSize: '16px', // Ensure font size matches input
    wordBreak: 'break-word', // Allow text to wrap
  },

};

// Placeholder styling component
const PlaceholderStyles = () => (
  <style>
    {`
      .textarea-class::placeholder {
        color: #ccc; /* Placeholder text color */
      }
    `}
  </style>
);

// Wrap LabelNode with PlaceholderStyles
const LabelNodeWithPlaceholder = (props) => (
  <>
    <PlaceholderStyles />
    <NoNode {...props} />
  </>
);

export default memo(LabelNodeWithPlaceholder);
