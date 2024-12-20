const generateNodesAndEdges = (windowWidth, windowHeight) => {
    const nodes = [];
    const edges = [];
  
    const totalRows = 7; 
    const totalColumns = 11;
    const groupWidth = windowWidth / totalColumns - 5;
    const groupHeight = windowHeight / totalRows - 18;

    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < totalColumns; col++) {
        const xPos = col * groupWidth; 
        const yPos = row * groupHeight;

        nodes.push({
          id: `group-${row * totalColumns + col}`,
          row_id: `node_${row}_${col}`,
          type: 'group',
          data: { label: `Group ${row * totalColumns + col + 1}` },
          position: { x: xPos, y: yPos },
          draggable: false,
          style: {
            width: groupWidth,
            height: groupHeight,
            borderLeft: '1.5px solid #ececec',
            borderBottom: '1.5px solid #022261',
            borderRight: col === 0 ? '2.5px solid #022261' : '#ececec',
            borderRadius: '0',
          },
        });
      }
    }
  
    return { nodes, edges };
  };
  

  export default generateNodesAndEdges; 
