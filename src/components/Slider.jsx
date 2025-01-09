import styled from "styled-components";
import { useRef } from "react";

const StyledSlider = styled.div`
  position: relative;
  border-radius: 3px;
  background: #dddddd;
  height: 15px;
`;

const StyledThumb = styled.div`
  width: 10px;
  height: 25px;
  border-radius: 3px;
  position: relative;
  top: -5px;
  opacity: 0.5;
  background: #834eb7;
  cursor: pointer;
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const getPercentage = (current, max) => (100 * current) / max;
const getValue = (percentage, max) => (max / 100) * percentage;
const getLeft = (percentage) => `calc(${percentage}% - 5px)`;

export default function Slider({
  initial,
  max,
  formatFn = (number) => number.toFixed(0),
  onChange,
}) {
  const initialPercentage = getPercentage(initial, max);

  const currentRef = useRef();
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);

  const diff = useRef(0);

  const handleMouseMove = (event) => {
    let newX =
      event.clientX -
      diff.current -
      sliderRef.current.getBoundingClientRect().left;

    const end = sliderRef.current.offsetWidth - thumbRef.current.offsetWidth;
    const start = 0;

    // newX = Math.max(start, Math.min(newX, end));

    if (newX < start) {
      newX = 0;
    }

    if (newX > end) {
      newX = end;
    }

    const newPercentage = getPercentage(newX, end);
    const newValue = getValue(newPercentage, max);

    thumbRef.current.style.left = getLeft(newPercentage);
    currentRef.current.textContent = formatFn(newValue);

    onChange(newValue);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
  };

  const handleMouseDown = (event) => {
    diff.current =
      event.clientX - thumbRef.current.getBoundingClientRect().left;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <SliderHeader>
        <strong ref={currentRef}>{formatFn(initial)}</strong>
        &nbsp;&nbsp;
        {formatFn(max)}
      </SliderHeader>
      <StyledSlider ref={sliderRef}>
        <StyledThumb
          style={{ left: getLeft(initialPercentage) }}
          ref={thumbRef}
          onMouseDown={handleMouseDown}
        />
      </StyledSlider>
    </>
  );
}
