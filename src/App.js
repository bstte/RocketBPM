import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Controls,
  Background,
  useEdgesState,
  useNodesState,
  SmoothStepEdge,
  BezierEdge,
  StraightEdge,
} from '@xyflow/react'; // Ensure this is the correct import path
import '@xyflow/react/dist/style.css';
import './App.css';

import { FaArrowRight, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { GiHexagonalNut } from 'react-icons/gi';
import ArrowBoxNode from './ArrowBoxNode';
import PentagonNode from './PentagonNode';

const ResizableArrowBoxNode = (props) => <ArrowBoxNode {...props} />;
const ResizablePentagonNode = (props) => <PentagonNode {...props} />;
const nodeTypes = {

  pentagon: ResizablePentagonNode,
  progressArrow: ResizableArrowBoxNode, // Add the new node type

};

const edgeTypes = {
  smoothstep: SmoothStepEdge,
  bezier: BezierEdge,
  straight: StraightEdge,
};

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [popupTitle, setPopupTitle] = useState('');

  const [showShapes, setShowShapes] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  // Dragging state for the popup
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Define custom edge types
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: 'smoothstep' }, eds)
      ),
    [setEdges]
  );

  const addNode = (type, position) => {
  

    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `${type} Node`, shape: type, },
      type: type,
      position: position || { x: Math.random() * 250, y: Math.random() * 250 },
    
      draggable: true, // Ensure node is draggable
      isNew: true,
      animated: true,
    };

    setNodes((nds) => nds.concat(newNode));

    // Remove the 'isNew' flag after a short delay
    setTimeout(() => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === newNode.id ? { ...node, isNew: false } : node
        )
      );
    }, 1000);
  };

  const deleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode));
      setEdges((eds) =>
        eds.filter(
          (edge) => edge.source !== selectedNode && edge.target !== selectedNode
        )
      );
      setSelectedNode(null);
      setShowPopup(false);
    }
  }, [selectedNode, setNodes, setEdges]);

  const handleNodeRightClick = (event, node) => {
    event.preventDefault();
    setSelectedNode(node.id);
    setPopupTitle(node.data.label || 'Node Actions');
    const { clientX, clientY } = event;
    const flowContainer = document.querySelector('.flow-container');
    const containerRect = flowContainer.getBoundingClientRect();

    setPopupPosition({
      x: clientX - containerRect.left,
      y: clientY - containerRect.top,
    });
    setShowPopup(true);
  };



  const handleCreateNewNode = () => {
    if (selectedNode) {
      const sourceNode = nodes.find((node) => node.id === selectedNode);
      if (sourceNode) {
        const newNodePosition = {
          x: sourceNode.position.x + 200, // Adjust the offset as needed
          y: sourceNode.position.y + 100,
        };

        const newNodeType = sourceNode.type || 'ellipse';
        addNode(newNodeType, newNodePosition);

        const newNodeId = (nodes.length + 1).toString();

        // Create a new edge from the selected node to the new node
        setEdges((eds) =>
          addEdge(
            {
              id: `e${sourceNode.id}-${newNodeId}`,
              source: sourceNode.id,
              target: newNodeId,
              animated: true, // Optional: animate the edge
              type: 'smoothstep',
            },
            eds
          )
        );

        setShowPopup(false);
      }
    }
  };

  // Close popup when clicking outside
  const handleClickOutside = useCallback(
    (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    },
    [setShowPopup]
  );

  useEffect(() => {
    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup, handleClickOutside]);

  // Drag Handlers for Popup
  const startDrag = (event) => {
    if (event.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragOffset({
      x: event.clientX - popupPosition.x,
      y: event.clientY - popupPosition.y,
    });
  };

  const onMouseMove = useCallback(
    (event) => {
      if (!isDragging) return;
      const flowContainer = document.querySelector('.flow-container');
      const containerRect = flowContainer.getBoundingClientRect();

      let newX = event.clientX - containerRect.left - dragOffset.x;
      let newY = event.clientY - containerRect.top - dragOffset.y;

      // Prevent the popup from going outside the flow-container
      const popupWidth = 220;
      const popupHeight = 300;

      newX = Math.max(0, Math.min(newX, containerRect.width - popupWidth));
      newY = Math.max(0, Math.min(newY, containerRect.height - popupHeight));

      setPopupPosition({ x: newX, y: newY });
    },
    [isDragging, dragOffset]
  );

  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', endDrag);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', endDrag);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', endDrag);
    };
  }, [isDragging, onMouseMove, endDrag]);

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  // Keyboard shortcut for deletion
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' && selectedNode) {
        deleteNode();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode, deleteNode]);

  return (
  
    <ReactFlowProvider>
    <div className="app-container" style={styles.appContainer}>
      {/* Header */}
      <header className="app-header" style={styles.header}>
        <h1 style={styles.headerTitle}>PROCESS MAP (LEVEL 0)</h1>
      </header>
  
      {/* Content: Sidebar + Flow Area */}
      <div className="content-wrapper" style={styles.contentWrapper}>
        
        {/* Sidebar Section */}
        <aside className="sidebar" onClick={(e) => e.stopPropagation()} style={styles.sidebar}>
          <button onClick={() => setShowShapes(!showShapes)} style={styles.generalButton}>
            General {showShapes ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {showShapes && (
            <div className="shape-icons" style={styles.shapeIcons}>
              <button onClick={() => addNode('pentagon')} style={styles.shapeButton}>
                <GiHexagonalNut style={styles.iconStyle} /> Pentagon
              </button>
              <button onClick={() => addNode('progressArrow')} style={styles.shapeButton}>
                <FaArrowRight style={styles.iconStyle} /> Arrow
              </button>
            </div>
          )}
        </aside>
  
        {/* Flow Area */}
        <div className="flow-container" style={styles.flowContainer}>
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={memoizedNodeTypes}
            edgeTypes={memoizedEdgeTypes}
            onNodeContextMenu={handleNodeRightClick}
            
            style={styles.reactFlowStyle}
          >
            <Background variant="lines" />
            <Controls />
          </ReactFlow>
        

{showPopup && (
  <div
    className="popup"
    style={{
      ...styles.popup,
      left: `${popupPosition.x}px`,
      top: `${popupPosition.y}px`,
    }}
    ref={popupRef}
    onMouseDown={startDrag} // Start dragging on mouse down
  >
    <span onClick={() => setShowPopup(false)} style={styles.closeIcon}>
      <FaTimes />
    </span>
    <h3 style={styles.popupTitle}>{popupTitle}</h3>
    <button onClick={handleCreateNewNode} style={styles.popupButton}>
    {`Create ${popupTitle}`}
    </button>
    <button onClick={deleteNode} style={styles.popupButton}>
       
      {`Delete ${popupTitle}`}
    </button>
  </div>
)}

        </div>
      </div>
    </div>
  </ReactFlowProvider>
  
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    borderLeft: '1px solid rgb(166 160 160)',
    borderRight: '1px solid rgb(166 160 160)', // Change this to your desired border color and width

  },
  header: {
    padding: '15px',
    border: '1px solid rgb(166 160 160)', // Add a border at the bottom
    color: '#343a40', // Change text color to match the desired theme
    display: 'flex',
    justifyContent: 'space-between', // Align items to space out
    alignItems: 'center', // Center align items vertically
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px', // Set a larger font size for the title
    fontWeight: 'bold', // Bold font for emphasis
  },
  contentWrapper: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '200px',
    padding: '10px',
    backgroundColor: '#f1f3f5',
    borderRight: '1px solid #dee2e6',
  },
  generalButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  shapeIcons: {
    marginTop: '10px',
  },
  shapeButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '8px',
    width: '100%',
    justifyContent: 'space-between',
  },
  iconStyle: {
    marginRight: '5px',
  },
  flowContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  reactFlowStyle: {
    width: '100%',
    height: '100%',
  },
  popup: {
    position: 'absolute',
    background: '#fff',
    border: '1px solid #007bff',
    borderRadius: '4px',
    padding: '1rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    minWidth: '200px', // Set a minimum width for better appearance
  },
  popupTitle: {
    margin: '0 0 1rem 0',
    fontSize: '16px', // Adjust font size for better readability
  },
  popupButton: {
    display: 'block',
    width: '100%',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem',
    cursor: 'pointer',
    marginBottom: '0.5rem',
    transition: 'background 0.2s',
  },
  closeIcon: {
    position: 'absolute',
    top: '5px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#007bff', // Icon color
  },
  popupButtonHover: {
    background: '#0056b3', // Hover effect
  },
};

export default App;

