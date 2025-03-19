
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
    border: '2px solid #FF364A',

  },
  reactFlowNodeGroup: {
    borderRadius: 0,
  },
  rfStyle: {
    width: '100%',
    height: '100vh',
    backgroundColor: '#fff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 9,
    marginBottom: 10,
    width: "90%"
  },
};

export default styles;