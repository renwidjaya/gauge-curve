/**
 * @dev renwidjaya
 * @version V.1.0.4
 * @email renwidjaya@gmail.com
 */
import React from "react";
import Svg, { Path, Text, LinearGradient, Stop, Defs } from "react-native-svg";
import { validateValue } from "../utils/helpers";

interface GaugeCurveProps {
  value: number;
  gaugeColor?: string;
  gaugeValueColor?: string[];
  gaugeStroke?: number;
  gaugeValueStroke?: number;
  insideTextColor?: string;
  size?: number;
  children?: React.ReactNode;
}

/**
 * @param
 * @returns
 */
const GaugeCurve: React.FC<GaugeCurveProps> = ({
  value,
  gaugeColor = "#ff0",
  gaugeValueColor = ["#0000ff"],
  gaugeStroke = 2,
  gaugeValueStroke = 2.5,
  children,
  insideTextColor = "#999",
  size = 150,
}) => {
  const validatedValue = validateValue(value, 0, 100);
  const opts = {
    dialRadius: 40 - Math.max(gaugeStroke, gaugeValueStroke) / 2,
    dialStartAngle: 180, // Mulai dari jam 6 (di SVG, 270 derajat)
    dialEndAngle: 360, // Berakhir di jam 12 (0 atau 360 derajat di SVG)
    strokeWidth: 4,
  };

  function getAngle(gaugeSpanAngle: number): number {
    return (validatedValue * gaugeSpanAngle) / 100;
  }

  function getCartesian(
    cx: number,
    cy: number,
    radius: number,
    angle: number
  ): { x: number; y: number } {
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.round((cx + radius * Math.cos(rad)) * 1000) / 1000,
      y: Math.round((cy + radius * Math.sin(rad)) * 1000) / 1000,
    };
  }

  function getDialCoords(
    radius: number,
    startAngle: number,
    endAngle: number
  ): { start: { x: number; y: number }; end: { x: number; y: number } } {
    const cx = 50,
      cy = 50;
    return {
      end: getCartesian(cx, cy, radius, endAngle),
      start: getCartesian(cx, cy, radius, startAngle),
    };
  }

  function updateGauge(): string {
    const gaugeSpanAngle = Math.abs(opts.dialEndAngle - opts.dialStartAngle),
      angle = getAngle(gaugeSpanAngle),
      flag = angle <= 180 ? 0 : 1;

    return pathString(
      opts.dialRadius,
      opts.dialStartAngle,
      opts.dialStartAngle + angle,
      flag
    );
  }

  function pathString(
    radius: number,
    startAngle: number,
    endAngle: number,
    largeArc?: number
  ): string {
    const coords = getDialCoords(radius, startAngle, endAngle),
      start = coords.start,
      end = coords.end,
      largeArcFlag = typeof largeArc === "undefined" ? 0 : largeArc; // Untuk sudut yang kurang dari 180 derajat, largeArcFlag ini harus 0

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      end.x,
      end.y,
    ].join(" ");
  }

  return (
    <Svg height={size} width={size} viewBox="0 0 100 100">
      {/* ClipPath dan Defs tidak diperlukan jika menggambar separuh lingkaran tanpa memotong path */}

      {/* Draw the gauge background */}
      <Path
        fill="none"
        stroke={gaugeColor}
        strokeWidth={gaugeStroke}
        d={pathString(opts.dialRadius, opts.dialStartAngle, opts.dialEndAngle)}
        strokeLinecap="round"
      />

      {/* Draw the gauge value */}
      <Path
        fill="none"
        stroke={`url(#gaugeValueGradient)`}
        strokeWidth={gaugeValueStroke}
        strokeLinecap="round"
        d={updateGauge()}
      />

      {/* LinearGradient definition */}
      <Defs>
        <LinearGradient
          id="gaugeValueGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          {gaugeValueColor.map((color, index) => (
            <Stop
              key={index}
              offset={`${(index / (gaugeValueColor.length - 1)) * 100}%`}
              stopColor={color}
            />
          ))}
        </LinearGradient>
      </Defs>

      {/* Optional children or default text */}
      {!!children ? (
        children
      ) : (
        <Text
          x={50}
          y={50}
          fill={insideTextColor}
          textAnchor="middle"
          fontSize="10"
        >
          {`${validatedValue}%`}
        </Text>
      )}
    </Svg>
  );
};

export default GaugeCurve;
