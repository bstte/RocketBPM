import React, { useCallback, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/userSlice'; // Action to set the user
import Login from './Pages/Login/Login';
import { BreadcrumbsProvider } from './context/BreadcrumbsContext';
import { CurrentUser } from './API/api';
import Dashboard from './Pages/Dashboard/Dashboard';
import Profile from './Pages/Profile/Profile';
import MapLevel from './Pages/Map_level/MapLevel';
import ProcessTitle from './Pages/Map_level/ProcessTitle';
import ListProcessTitle from './Pages/Map_level/ListProcessTitle';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
<<<<<<< HEAD
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
  
=======
  return (
    <BreadcrumbsProvider>
      <Router>
        <AppContent />
      </Router>
    </BreadcrumbsProvider>
>>>>>>> dd83d24 (Update project with latest changes)
  );
};

const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasCheckedToken = useRef(false); // Use a ref to track if checkToken has been called

  const checkToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await CurrentUser(token); // Fetch current user
        dispatch(setUser(response)); // Save user to Redux
        navigate('/dashboard'); // Navigate to dashboard after fetching user
      } catch (error) {
        console.error('Error fetching current user:', error);
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login'); // Redirect to login page
      }
    } else {
      navigate('/login'); // Redirect to login page if no token
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!hasCheckedToken.current) {
      checkToken(); // Check token when the app loads
      hasCheckedToken.current = true; // Set the ref to true after the first check
    }
  }, [checkToken]); // Include checkToken in the dependency array

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/Map_level" element={<PrivateRoute><MapLevel /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> 
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> 
      <Route path="/Add-process-title" element={<PrivateRoute><ProcessTitle /></PrivateRoute>} /> 
      <Route path="/List-process-title" element={<PrivateRoute><ListProcessTitle /></PrivateRoute>} /> 
      <Route path="/level/:level/:parentId/*" element={<PrivateRoute><MapLevel /></PrivateRoute>} />
    </Routes>
  );
};

export default App;
