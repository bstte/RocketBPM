import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const ResizableNode = ({ data, isNew, onLabelChange }) => {
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef(null);

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  useEffect(() => {
    if (isNew && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isNew]);

  const handleChange = (e) => {
    setLabel(e.target.value);
    if (onLabelChange) {
      onLabelChange(e.target.value);
    }
  };

  const handleBlur = () => {
    if (onLabelChange) {
      onLabelChange(label);
    }
  };

  return (
    <>
      <NodeResizer minWidth={100} minHeight={30} />
      <Handle type="target" position={Position.Bottom} />
      <div style={{ padding: 10, textAlign: 'center', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        <input
          ref={inputRef}
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            width: '100%',
            outline: 'none',
            textAlign: 'center',
          }}
        />
      </div>
      <Handle type="source" position={Position.Top} />
    </>
  );
};

export default memo(ResizableNode);
