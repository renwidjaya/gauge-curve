/**
 * @dev renwidjaya
 * @version V.1.0.7
 * @email renwidjaya@gmail.com
 * @mode GAUGE CIRCLE
 */
import React from "react";
import Svg, {
  Path,
  Text,
  LinearGradient,
  Stop,
  Defs,
  Circle,
} from "react-native-svg";
import { validateValue } from "../utils/helpers";

interface GaugeCircleProps {
  value: number;
  gaugeColor?: string;
  gaugeValueColor?: string[];
  gaugeStroke?: number;
  gaugeValueStroke?: number;
  insideTextColor?: string;
  size?: number;
  children?: React.ReactNode;
}

const GaugeCircle: React.FC<GaugeCircleProps> = ({
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
    dialRadius: 40,
    dialStartAngle: 90, // Mulai dari jam 6 (di SVG, 90 derajat)
    dialEndAngle: 450, // Berakhir di jam 12 (0 atau 360 derajat di SVG)
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
    const gaugeSpanAngle = Math.abs(opts.dialEndAngle - opts.dialStartAngle);
    const angle = getAngle(gaugeSpanAngle);
    const flag = angle <= 180 ? 0 : 1;

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
    const coords = getDialCoords(radius, startAngle, endAngle);
    const start = coords.start;
    const end = coords.end;
    const largeArcFlag = typeof largeArc === "undefined" ? 0 : largeArc; // Untuk sudut yang kurang dari 180 derajat, largeArcFlag ini harus 0

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
      {/* Draw the gauge background */}
      <Circle
        cx="50"
        cy="50"
        r={opts.dialRadius}
        fill="none" // No fill for the background circle
        stroke={gaugeColor} // Set the stroke color for the background circle
        strokeWidth={gaugeStroke} // Set the stroke width for the background circle
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

export default GaugeCircle;
