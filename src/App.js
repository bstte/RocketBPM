import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Controls,
  Background,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';
import ResizableNode from './ResizableNode';
import DownloadButton from './DownloadButton';
const CircleNode = (props) => (
  <ResizableNode {...props} />
);

const TriangleNode = (props) => (
  <ResizableNode {...props}>
   
  </ResizableNode>
);

const HexagonNode = (props) => (
  <ResizableNode {...props}  />
);

const DiamondNode = (props) => (
  <ResizableNode {...props} />
);

const RectangleNode = (props) => (
  <ResizableNode {...props} />
);

const EllipseNode = (props) => (
  <ResizableNode {...props}  />
);

const PentagonNode = (props) => (
  <ResizableNode {...props}  />
);

const nodeTypes = {

  circle: CircleNode,
  triangle: TriangleNode,
  hexagon: HexagonNode,
  diamond: DiamondNode,
  rectangle: RectangleNode,
  ellipse: EllipseNode,
  pentagon: PentagonNode,
};


const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addNode = (type) => {
    let style = {
      backgroundColor: 'lightgray', // Default background color
    };
  
    switch (type) {
      case 'circle':
        style = {
          ...style,
          padding: 10,
          margin: 20,
          display: "inline-block",
          borderRadius: "50%",
          width: 100,
          height: 100,
        };
        break;
      case 'triangle':
        style = {
          ...style,
          width: 144,
          height: 120,
          borderStyle: 'solid',
          borderLeftWidth: 50,
          borderRightWidth: 50,
          borderBottomWidth: 100,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: 'red',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          textAlign: 'center',
        };
        break;
      case 'hexagon':
        style = {
          ...style,
          width: 130,
          height: 120,
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        };
        break;
      case 'diamond':
        style = {
          ...style,
          width: 185,
          height: 130,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        };
        break;
      case 'rectangle':
        style = {
          ...style,
          width: 140,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        };
        break;
      case 'ellipse':
        style = {
          ...style,
          width: 180,
          height: 140,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        };
        break;
      case 'pentagon':
        style = {
          ...style,
          width: 190,
          height: 160,
          clipPath: 'polygon(50% 0%, 100% 35%, 82% 100%, 18% 100%, 0% 35%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        };
        break;
      default:
        break;
    }
  
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `${type} Node`, shape: type },
      type: type,
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      style: style,
      isNew: true,
    };
  
    setNodes((nds) => nds.concat(newNode));
  
    // Remove the isNew flag after rendering
    setTimeout(() => {
      setNodes((nds) => nds.map((node) => (node.id === newNode.id ? { ...node, isNew: false } : node)));
    }, 1000);
  };
  

  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setSelectedNode(null);
  };

  const handleColorChange = (color) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode) {
            return {
              ...node,
              style: { ...node.style, backgroundColor: color },
            };
          }
          return node;
        })
      );
    }
  };

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    setSelectedNode(node.id);
  };

  const handleCanvasClick = () => {
    setSelectedNode(null); // Deselect node when clicking on the canvas
  };

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  return (
    <ReactFlowProvider>
      <div className="app" onClick={handleCanvasClick}>
        <div className="sidebar" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => addNode('circle')}>Add Circle Node</button>
          {/* <button onClick={() => addNode('triangle')}>Add Triangle Node</button> */}
          <button onClick={() => addNode('hexagon')}>Add Hexagon Node</button>
          <button onClick={() => addNode('diamond')}>Add Diamond Node</button>
          <button onClick={() => addNode('rectangle')}>Add Rectangle Node</button>
          <button onClick={() => addNode('ellipse')}>Add Ellipse Node</button>
          <button onClick={() => addNode('pentagon')}>Add Pentagon Node</button>
          <DownloadButton />
          {selectedNode && (
            <div className="node-controls">
              <button onClick={() => deleteNode(selectedNode)}>Delete Node</button>
              <input
                type="color"
                onChange={(e) => handleColorChange(e.target.value)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          )}
        </div>
        <div className="flow-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={memoizedNodeTypes}
            onNodeClick={handleNodeClick}
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default App;