import React, { useCallback } from "react";
import { BaseEdge, EdgeLabelRenderer } from "@xyflow/react";

const pointRadius = 6;

export default function EditableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
  selected,
}) {
  const points = data?.points || [];

  const fullPathPoints = [
    { x: sourceX, y: sourceY },
    ...points,
    { x: targetX, y: targetY },
  ];

  const path = `M ${fullPathPoints
    .map((p) => `${p.x},${p.y}`)
    .join(" L ")}`;

  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} />

      {selected &&
        points.map((p, index) => (
          <circle
            key={index}
            cx={p.x}
            cy={p.y}
            r={pointRadius}
            fill="#fff"
            stroke="#002060"
            style={{ cursor: "move" }}
            onMouseDown={(e) => data.onPointDragStart(e, id, index)}
            onDoubleClick={() => data.onPointDelete(id, index)}
          />
        ))}
    </>
  );
}