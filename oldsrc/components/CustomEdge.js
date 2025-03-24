import React from "react";
import { BaseEdge, getSmoothStepPath } from "@xyflow/react";

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style }) => {
  let edgePath;

  // Define a proper step-wise logic for smooth transitions
  if (Math.abs(sourceX - targetX) < 50 || Math.abs(sourceY - targetY) < 50) {
    edgePath = `M${sourceX},${sourceY} L${targetX},${targetY}`;
  } else {
    [edgePath] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      borderRadius: 20, // Smooth step corners
    });
  }

  return (
    <>
      {/* Edge Path with better styling */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: "#4A90E2", // Soft blue color
          strokeWidth: 2.5, // Thicker for better visibility
          strokeDasharray: "4 2", // Dashed effect for better design
          ...style,
        }}
      />

      {/* Custom Icon at End */}
      <foreignObject
        x={targetX - 12}
        y={targetY - 12}
        width={24}
        height={24}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/128/7030/7030537.png"
          alt="custom-icon"
          width="24"
          height="24"
          style={{ pointerEvents: "none" }} // Prevent click interference
        />
      </foreignObject>
    </>
  );
};

export default CustomEdge;
