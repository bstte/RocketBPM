import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  SmoothStepEdge,
  BezierEdge,
  StraightEdge,
  Background,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import Header from '../../components/Header'; // Ensure you have this component
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for unique node ids
import LabelNode from '../../AllNode/LabelNode';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import api from '../../API/api';
import "./SwimlaneStyles.css"
import YesNode from '../../AllNode/YesNode';
import NoNode from '../../AllNode/NoNode';
import CustomContextPopup from '../../components/CustomContextPopup';
import DetailsPopup from '../../components/DetailsPopup';
import SwimlinePentagonNode from '../../AllNode/SwimlineNodes/SwimlinePentagonNode';
import SwimlineArrowBoxNode from '../../AllNode/SwimlineNodes/SwimlineArrowBoxNode';
import SwimlineBoxNode from '../../AllNode/SwimlineNodes/SwimlineBoxNode';
import SwimlineDiamondNode from '../../AllNode/SwimlineNodes/SwimlineDiamondNode';
import SwimlineRightsideBox from '../../AllNode/SwimlineNodes/SwimlineRightsideBox';


const rfStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#fff',
};

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#fff',

  },
  scrollableWrapper: {
    flex: 1,
    overflowY: 'auto', // Allows vertical scroll
    overflowX: 'hidden', // Prevents horizontal scroll
    borderLeft: '2px solid red',
    borderRight: '2px solid red',
    borderBottom: '2px solid red',

  },
  reactFlowNodeGroup: {
    borderRadius: 0,
  }
};

const generateNodesAndEdges = (windowWidth, windowHeight) => {
  const nodes = [];
  const edges = [];

  const totalRows = 8; // Fixed number of rows
  const totalColumns = 11; // Fixed number of columns
  const groupWidth = windowWidth / totalColumns - 5; // Adjust node width dynamically
  const groupHeight = windowHeight / totalRows - 4; // Adjust node height dynamically

  // Creating nodes
  for (let row = 0; row < totalRows; row++) {
    for (let col = 0; col < totalColumns; col++) {
      const xPos = col * groupWidth; // Calculate x position
      const yPos = row * groupHeight; // Calculate y position

      // Create a new group node with default border styles
      nodes.push({
        id: `group-${row * totalColumns + col}`,
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


function Flow() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const location = useLocation(); // Access location object

  const navigate = useNavigate(); // Initialize navigate hook

  const { id, title, Editable, user, parentId, level } = location.state || {}; // Destructure state safely
  const headerTitle=`${title} (LEVEL ${level})`;
  const currentParentId = parentId || null;
  const currentLevel = level ? parseInt(level, 10) : 0; // Default to Level 0
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Initial position
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSimpleAddRolePopupOpen, setIsSimpleAddRolePopupOpen] = useState(false);

  const { nodes: initialNodes, } = useMemo(() => generateNodesAndEdges(windowSize.width, windowSize.height), [windowSize]);

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [ChildNodes, setChiledNodes] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [detailschecking, setdetailschecking] = useState(null);



  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  const nodeTypes = {
    pentagon: SwimlinePentagonNode,
    progressArrow: SwimlineArrowBoxNode,
    diamond: SwimlineDiamondNode,
    box: SwimlineBoxNode,
    SwimlineRightsideBox: SwimlineRightsideBox,
    label: LabelNode,
    Yes: YesNode,
    No: NoNode,
  };

  const edgeTypes = {
    smoothstep: SmoothStepEdge,
    bezier: BezierEdge,
    straight: StraightEdge,
  };


  useEffect(() => {
    const handleRefresh = (event) => {
      const userConfirmed = window.confirm(
        'You have unsaved changes. Do you really want to leave?'
      );

      console.log("confirm data", userConfirmed)
      if (userConfirmed) {
        navigate('/List-process-title'); // Redirect to the desired route
      } else {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleRefresh);

    return () => {
      window.removeEventListener('beforeunload', handleRefresh);
    };
  }, [navigate]);



  const handleLabelChange = useCallback((nodeId, newLabel) => {
    setChiledNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
    console.log('Label changed for node:', nodeId, 'New label:', newLabel);
  }, [setChiledNodes]);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        // console.log("check user ,", user);
        const levelParam = currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`;
        const user_id = user ? user.id : null;
        const Process_id = id ? id : null;
        const data = await api.getNodes(levelParam, parseInt(user_id), Process_id);
        console.log("api data", data)
        // Dynamically calculate groupWidth and groupHeight
        const totalRows = 8;
        const totalColumns = 11;
        const groupWidth = windowSize.width / totalColumns - 14;
        const groupHeight = windowSize.height / totalRows - 14;

        const parsedNodes = data.nodes.map((node) => {
          const parsedData = JSON.parse(node.data);
          const parsedPosition = JSON.parse(node.position);
          const parsedMeasured = JSON.parse(node.measured);

          return {
            ...node,
            data: {
              ...parsedData,
              onLabelChange: (newLabel) => handleLabelChange(node.node_id, newLabel),
              width_height: parsedMeasured,
              Editable: Editable,
              defaultwidt: '40px',
              defaultheight: '40px',
              nodeResize: false,
            },
            type: node.type,
            id: node.node_id,
            parentId: node.parentId,
            extent: 'parent',
            measured: parsedMeasured,
            position: parsedPosition,
            draggable: Boolean(node.draggable),
            animated: Boolean(node.animated),
            style: {
              width: groupWidth,
              height: groupHeight,
            },
          };
        });

        const parsedEdges = data.edges.map((edge) => ({
          ...edge,
          animated: Boolean(edge.animated),
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { stroke: '#000', strokeWidth: 2 },
          type: 'step',
        }));

        setChiledNodes(parsedNodes);
        setEdges(parsedEdges);
      } catch (error) {
        console.error('Error fetching nodes:', error);
        alert('Failed to fetch nodes. Please try again.');
      }
    };

    fetchNodes();
  }, [currentLevel, handleLabelChange, setNodes, setEdges, currentParentId, user, Editable, id, windowSize]);


  const onNodesChange = useCallback(
    (changes) => setChiledNodes((nds) => applyNodeChanges(changes, nds)),
    [setChiledNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {

      setEdges((eds) =>
        addEdge({
          ...params,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { stroke: '#000', strokeWidth: 2 },
          Level: currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`,
          user_id: user && user.id,
          Process_id: id && id,
          type: 'step',
          Page: "Swimlane",

        }, eds)
      );
    },

    [setEdges, currentLevel, currentParentId, user, id]
  );

  const handleNodeClick = useCallback(
    (event, node) => {
      // Check if the clicked node is a group and belongs to the first column
      if (node.type === 'group' && node.style.borderRight.includes('#022261')) {

        // Set the popup state to open and align it with the clicked node's position
        const rect = event.target.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.top });
        setIsSimpleAddRolePopupOpen(true);
        setSelectedGroupId(node.id);
      } else if (node.type === 'group') {
        setSelectedGroupId(node.id);
        setIsSimpleAddRolePopupOpen(false);

        setChiledNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? {
                ...n,
                style: {
                  ...n.style,
                },
              }
              : {
                ...n,
                style: {
                  ...n.style,
                },
              }
          )
        );
      }
    },
    [setChiledNodes]
  );



  const addNode = (type, position) => {

    if (type === "Yes" || type === "No") {
      if (!position) {
        alert('Position not defind');
        return;
      }

      const newNodeId = uuidv4();
      const newNode = {
        id: currentParentId !== null ? `Level${currentLevel}_${newNodeId}_${currentParentId}` : `Level${currentLevel}_${newNodeId}`,

        data: {
          label: '',
          shape: type,
          onLabelChange: (newLabel) => handleLabelChange(newNodeId, newLabel),
          Editable: Editable,
          defaultwidt: '40px',
          defaultheight: '40px',
          nodeResize: false

        },
        type: type,
        position: position || { x: Math.random() * 250, y: Math.random() * 250 },
        draggable: true,
        isNew: true,
        animated: true,
        Page_Title: "Swimlane",
        Level: currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`,
        user_id: user && user.id,
        Process_id: id && id,

      };

      setChiledNodes((nds) => [...nds, newNode]);
    } else if (selectedGroupId) {
      const selectedGroup = nodes.find((node) => node.id === selectedGroupId);
      const groupWidth = selectedGroup?.style?.width || 100; // Default width if group not found
      const groupHeight = selectedGroup?.style?.height || 100; // Default height if group not found
      // Calculate dynamic width and height for the child node
      const childWidth = groupWidth * 0.9; // 80% of the group width
      const childHeight = groupHeight * 0.9; // 80% of the group height
      const newNodeId = uuidv4();
      const newNode = {
        id: currentParentId !== null ? `Level${currentLevel}_${newNodeId}_${currentParentId}` : `Level${currentLevel}_${newNodeId}`,
        node_id: currentParentId !== null ? `Level${currentLevel}_${newNodeId}_${currentParentId}` : `Level${currentLevel}_${newNodeId}`,

        parentId: selectedGroupId,
        extent: 'parent',
        data: {
          label: '',
          details: { title: "", content: "" },
          shape: type,
          onLabelChange: (newLabel) => handleLabelChange(newNodeId, newLabel),
          Editable: Editable,
          defaultwidt: '40px',
          defaultheight: '40px',
          nodeResize: false

        },
        type: type,
        position: position || { x: Math.random() * 250, y: Math.random() * 250 },
        draggable: false,
        isNew: true,
        animated: true,
        Page_Title: "Swimlane",
        Level: currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`,
        user_id: user && user.id,
        Process_id: id && id,
        style: {
          width: childWidth,
          height: childHeight,
        },
      };

      setChiledNodes((nds) => [...nds, newNode]);
    } else {
      alert('Please select a group node first!');
    }
  };


  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);


  const handleSaveNodes = async () => {

    try {
      const response = await api.saveNodes({
        nodes: ChildNodes.map(({ id, data, type, position, draggable, animated, measured, Level, user_id, Process_id, Page_Title, parentId }) => ({
          id,
          data,
          type,
          position,
          draggable,
          animated,
          measured,
          Level,
          user_id,
          Process_id,
          Page_Title,
          parentId

        })),
        edges: edges.map(({ id, source, target, markerEnd, animated, Level, sourceHandle, targetHandle, user_id, Process_id, Page_Title }) => ({
          id,
          source,
          sourceHandle,
          target,
          targetHandle,
          markerEnd,
          animated,
          Level,
          user_id,
          Process_id,
          Page_Title
        })),
      });
      // if (!hasUnsavedChanges) {

      alert(response.message);
      // }

    } catch (error) {
      console.error('Error saving nodes:', error);
      if (error.response && error.response.data) {
        console.error(`Failed to save nodes: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('Failed to save nodes. Please try again.');
      }
    }
  };


  const openPopup = () => {
    setIsPopupOpen(true)
  };
  const closePopup = () => {
    setIsPopupOpen(false)
    setSelectedNodeId(null)

  };

  const updateNodeDetails = (nodeId, newDetails) => {
    setChiledNodes((nodes) =>
      nodes.map((node) =>
        node.node_id === nodeId
          ? {
            ...node,
            data: {
              ...node.data, // Ensure you spread the existing data
              details: {
                title: newDetails.title,
                content: newDetails.content,
              },
            },
          }
          : node
      )
    );
  };



  const saveDetails = (details) => {

    if (selectedNodeId) {
      updateNodeDetails(selectedNodeId, details);

      setSelectedNodeId(null)
      // alert("Details saved!");
    }
    closePopup();
  };


  const handlePopupAction = (action) => {

    const { x, y } = contextMenu;

    if (action === 'Yes') {
      addNode('Yes', { x: x - 30, y: y - 125 });
    } else if (action === 'No') {
      addNode('No', { x: x - 70, y: y - 125 });
      // Your logic for adding a level
    } else if (action === 'addDetails') {
      openPopup()
    }
    setContextMenu(null); // Close the context menu
  };


  const handleClosePopup = () => {
    setContextMenu(null);
    setSelectedNode(null);
    setdetailschecking(null);
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      const confirmDeletion = window.confirm("Are you sure you want to delete this nodes?");
      if (!confirmDeletion) return;

      setChiledNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      handleClosePopup();
    }
  };


  const handleNodeRightClick = (event, node) => {
    // console.log("nodes",node.Page_Title)
    if (node.Page_Title === "Swimlane") {
      setSelectedNodeId(node.node_id)
      setdetailschecking(node)
      event.preventDefault(); // Prevent default context menu
      setSelectedNode(node);
      setPosition({ x: event.clientX, y: event.clientY }); // Update position

      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
      });
    }

  };
  console.log("detailschecking", detailschecking);

  // Construct menuItems based on selectedNodeId
  const menuItems = [
    ...(detailschecking?.type === "diamond" ? [
      {
        label: 'Add yes label',
        action: () => handlePopupAction('Yes'),
        borderBottom: true,
      },
      {
        label: 'Add no label',
        action: () => handlePopupAction('No'),
        borderBottom: true,
      },
    ] : []),
    ...(detailschecking?.type !== "SwimlineRightsideBox" ? [
      {
        label: detailschecking &&
          (
            (!detailschecking?.data?.details?.title || detailschecking?.data?.details?.title === "") &&
            (!detailschecking?.data?.details?.content || detailschecking?.data?.details?.content === "")
          )
          ? 'Add details'
          : 'Edit details',
        action: () => handlePopupAction('addDetails'),
        borderBottom: true,
      },
    ] : []),
    {
      label: 'Delete',
      action: handleDeleteNode,
      borderBottom: false,
    },
  ];


  const handleAddRole = () => {
    addNode('SwimlineRightsideBox'); 

    setIsSimpleAddRolePopupOpen(false); 
  };

  const iconNames = {
    progressArrow: 'Arrow Node',
    diamond: 'Diamond Node',
    box: 'Box Node',

  };

  return (
    <div style={styles.appContainer}>
      <ReactFlowProvider>
        <Header
          title={headerTitle}
          onSave={handleSaveNodes}
          addNode={addNode}
          handleBackdata={() => console.log('Back Clicked')}
          iconNames={iconNames}
        />
        <div style={styles.scrollableWrapper}>
          <ReactFlow
            nodes={[...nodes, ...ChildNodes]}

            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onNodeContextMenu={handleNodeRightClick} // Right-click handler

            nodeTypes={memoizedNodeTypes}
            edgeTypes={memoizedEdgeTypes}
            minZoom={0}
            zoomOnScroll={false}
            zoomOnPinch={false}
            panOnDrag={false}
            panOnScroll={false}
            maxZoom={1}
            style={rfStyle}
          >
            <Background color="#fff" gap={16} />
          </ReactFlow>

          <CustomContextPopup
            isVisible={!!contextMenu}
            position={contextMenu || { x: 0, y: 0 }}
            menuItems={menuItems}
            onClose={handleClosePopup}

          />


          {isSimpleAddRolePopupOpen && (
            <div
              className="add-role-popup"
              onClick={(e) => {
                e.stopPropagation(); // Prevents click event from propagating
                handleAddRole();
              }}
              style={{
                position: 'absolute',
                top: position.y + 30,
                left: position.x + 60,
                background: '#f8f8f8',
                border: '1px solid #ccc',
                paddingLeft: '15px',
                paddingRight: '15px',

                borderRadius: '5px',
              }}
            >
              Add Role
            </div>
          )}


          <DetailsPopup
            isOpen={isPopupOpen}
            onClose={closePopup}
            onSave={saveDetails}
            Details={ChildNodes.find(node => node.node_id === selectedNodeId) || null}
          />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default Flow;
