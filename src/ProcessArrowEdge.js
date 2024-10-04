// ProcessArrowEdge.js
import React from 'react';
import { getSmoothStepPath } from '@xyflow/react'; // Ensure the import path is correct

const ProcessArrowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  arrowHeadType = 'arrowclosed', // Default arrowhead type
}) => {
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // Define the marker as an SVG marker
  const markerEnd = 'url(#arrowclosed)';

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* Optional: Add edge labels or decorations here */}
    </>
  );
};

export default ProcessArrowEdge;
