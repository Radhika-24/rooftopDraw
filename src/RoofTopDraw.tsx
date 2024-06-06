import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { Stage, Layer, Line, Image } from "react-konva";
import useImage from "use-image";

import rooftop from "./rooftop.jpg";
import { download } from "./shared/downloadFile";

const RoofTopDraw = () => {
  const [lines, setLines] = useState<number[][]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const drawRef = useRef(null);
  const [backgroundImage] = useImage(rooftop);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    setIsDrawing(true);

    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      setLines([...lines, [pos.x, pos.y]]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) {
      // skip action if mouse is up
      return;
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    if (point) {
      lastLine = lastLine.concat([point.x, point.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat()); // create a continuous line
    }
  };

  const handleDownload = () => {
    if (drawRef?.current) {
      const uri = (drawRef.current as Konva.Stage).toDataURL();
      download(uri, "image.png");
    }
  };

  const handleClear = () => {
    setLines([]);
  };

  return (
    <>
      <div style={{ margin: "8px" }}>
        <h3>Click and draw your rooftop</h3>
        <p> Click the button to download the rooftop image</p>
        <button style={{ padding: "8px" }} onClick={handleDownload}>
          Download
        </button>
        <button
          style={{ padding: "8px", marginLeft: "5px" }}
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
      <Stage
        width={window.innerWidth * 0.99}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {backgroundImage && (
            <Image
              image={backgroundImage}
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerHeight * 0.9}
            />
          )}
        </Layer>
        <Layer ref={drawRef}>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line}
              stroke="red"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default RoofTopDraw;
