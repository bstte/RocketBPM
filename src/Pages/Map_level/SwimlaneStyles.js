
const wheight = window.innerHeight;

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: wheight - 125,
    backgroundColor: '#fff',
  },
  scrollableWrapper: {
    flex: 1,
    overflowY: 'auto', 
    overflowX: 'hidden', 
    borderLeft: '2px solid red',
    borderRight: '2px solid red',
    borderBottom: '2px solid red',
  },
  reactFlowNodeGroup: {
    borderRadius: 0,
  },
  rfStyle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
};

export default styles;
