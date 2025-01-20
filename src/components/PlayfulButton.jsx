import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

const PlayfulButton = ({
  children,
  className = "",
  onClick,
  disabled = false,
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const letters = children.trim().split("");
    const div = document.createElement("div");

    letters.forEach((letter, index, array) => {
      const element = document.createElement("span");
      const part = index >= array.length / 2 ? -1 : 1;
      const position =
        index >= array.length / 2
          ? array.length / 2 - index + (array.length / 2 - 1)
          : index;
      const move = position / (array.length / 2);
      const rotate = 1 - move;

      element.innerHTML = !letter.trim() ? "&nbsp;" : letter;
      element.style.setProperty("--move", move);
      element.style.setProperty("--rotate", rotate);
      element.style.setProperty("--part", part);

      div.appendChild(element);
    });

    button.innerHTML = div.outerHTML;
  }, [children]);

  const handleMouseEnter = (e) => {
    if (!disabled && !buttonRef.current.classList.contains("out")) {
      buttonRef.current.classList.add("in");
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && buttonRef.current.classList.contains("in")) {
      buttonRef.current.classList.add("out");
      setTimeout(() => {
        buttonRef.current?.classList.remove("in", "out");
      }, 950);
    }
  };

  return (
    <StyledButton
      ref={buttonRef}
      className={`button ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

const moveKeyframes = keyframes`
  30%, 36% {
    transform: translateY(calc(-6px * var(--move))) translateZ(0) rotate(calc(-13deg * var(--rotate) * var(--part)));
  }
  50% {
    transform: translateY(calc(3px * var(--move))) translateZ(0) rotate(calc(6deg * var(--rotate) * var(--part)));
  }
  70% {
    transform: translateY(calc(-2px * var(--move))) translateZ(0) rotate(calc(-3deg * var(--rotate) * var(--part)));
  }
`;

const moveOutKeyframes = keyframes`
  30%, 36% {
    transform: translateY(calc(6px * var(--move))) translateZ(0) rotate(calc(13deg * var(--rotate) * var(--part)));
  }
  50% {
    transform: translateY(calc(-3px * var(--move))) translateZ(0) rotate(calc(-6deg * var(--rotate) * var(--part)));
  }
  70% {
    transform: translateY(calc(2px * var(--move))) translateZ(0) rotate(calc(3deg * var(--rotate) * var(--part)));
  }
`;

const StyledButton = styled.button`
  --color: #333;
  --color-hover: #ffffff;
  --background: #aef060;
  --background-hover: #2a331f;
  --hover-back: #2a331f;
  --hover-front: #2a331f;
  --disabled-background: #cccccc;
  --disabled-color: #666666;

  padding: 8px 20px;
  min-width: 120px;
  height: 40px;
  border-radius: 20px;
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  position: relative;
  overflow: hidden;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  color: ${(props) =>
    props.disabled ? "var(--disabled-color)" : "var(--c, var(--color))"};
  background: ${(props) =>
    props.disabled
      ? "var(--disabled-background)"
      : "var(--b, var(--background))"};
  transition:
    color 0.2s linear var(--c-d, 0.2s),
    background 0.3s linear var(--b-d, 0.2s);

  &:not(.simple) {
    &:before,
    &:after {
      content: "";
      position: absolute;
      background: ${(props) =>
        props.disabled
          ? "var(--disabled-background)"
          : "var(--pb, var(--hover-back))"};
      top: 0;
      left: 0;
      right: 0;
      height: 200%;
      border-radius: var(--br, 40%);
      transform: translateY(var(--y, 50%));
      transition:
        transform var(--d, 0.4s) ease-in var(--d-d, 0s),
        border-radius 0.5s ease var(--br-d, 0.08s);
    }

    &:after {
      --pb: var(--hover-front);
      --d: 0.44s;
    }
  }

  div {
    z-index: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    span {
      display: inline-block;
      backface-visibility: hidden;
      transform: translateZ(0);
      animation: var(--name, none) 0.7s linear forwards 0.18s;
    }
  }

  &.in {
    --name: ${moveKeyframes};

    &:not(.out) {
      --c: ${(props) =>
        props.disabled ? "var(--disabled-color)" : "var(--color-hover)"};
      --b: ${(props) =>
        props.disabled
          ? "var(--disabled-background)"
          : "var(--background-hover)"};

      &:before,
      &:after {
        --y: ${(props) => (props.disabled ? "50%" : "0")};
        --br: ${(props) => (props.disabled ? "40%" : "5%")};
      }

      &:after {
        --br: ${(props) => (props.disabled ? "40%" : "10%")};
        --d-d: 0.02s;
      }
    }

    &.out {
      --name: ${moveOutKeyframes};

      &:before {
        --d-d: 0.06s;
      }
    }
  }

  &.alternative {
    --color-hover: #091904;
    --background: #362a89;
    --hover-back: #6d58ff;
    --hover-front: #f6f8ff;
  }

  &.simple {
    --background: #275efe;
    --background-hover: #1749db;
  }
`;

export default PlayfulButton;
