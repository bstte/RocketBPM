import { memo, useState, useEffect } from "react";

const PublishPentagonNode = ({ data }) => {
  const width = data.width_height?.width || 150;
  const height = data.width_height?.height || 150;
  const [clipPath, setClipPath] = useState("");

  const calculateClipPath = (w, h) => {
    // Pentagon top: 50% width, 0% height; etc
    return `polygon(50% 0%, ${w}px 30%, ${w}px ${h}px, 0% ${h}px, 0% 30%)`;
  };

  useEffect(() => {
    setClipPath(calculateClipPath(width, height));
  }, [width, height]);

  return (
    <div
      style={{
        ...styles.wrapper,
        filter: data.hasNextLevel
          ? "drop-shadow(0px 0px 10px #0000004f)"
          : "none",
      }}
    >
      {/* Pentagon Box */}
      <div
        style={{
          ...styles.pentagonBox,
          width: `${width}px`,
          height: `${height}px`,
          clipPath: clipPath,
        }}
      >
        <div
          style={{
            cursor: "pointer",
            fontSize: "1rem",
            fontFamily: "'Poppins', sans-serif",
            color: "white",
            textAlign: "center",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: data.label }}
        />
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  pentagonBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "red",
    color: "#002060",
    padding: "10px",
    boxSizing: "border-box",
    overflow: "hidden",
    border: "none",
  },
};

export default memo(PublishPentagonNode);
