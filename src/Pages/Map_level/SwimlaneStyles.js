
// const wheight = window.innerHeight;

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    // height: wheight - 125,
    backgroundColor: '#fff',
  },
  scrollableWrapper: {
    flex: 1,
    overflow: 'hidden', 
    borderLeft: "1px solid #002060",
    borderRight: "1px solid #002060",
    borderBottom: "1px solid #002060",

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