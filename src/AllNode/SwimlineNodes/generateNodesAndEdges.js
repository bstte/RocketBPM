const generateNodesAndEdges = (windowWidth, windowHeight,BorderCondiction,height,appheaderheight,remainingHeight) => {
    const nodes = [];
    const edges = [];

    const rflight = document.querySelector(".app-header");
    const rfWidth = rflight ? rflight.offsetWidth : windowWidth; 

    const totalRows = 7; 
    const totalColumns = 11;
    const groupWidth = rfWidth / totalColumns;
    const groupHeight = remainingHeight / totalRows - 0.3;

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
            bordertop: '0px',
            borderLeft:BorderCondiction==='viewmode'? '0px solid #ececec':'1px solid #ececec',
            borderBottom: '0px solid #002060',
            borderRight: col === 0 ? '1px solid #002060' : '#ececec',
            borderRadius: '0',
          },
        });
      }
    }
  
    return { nodes, edges };
  };
  

  export default generateNodesAndEdges; 
