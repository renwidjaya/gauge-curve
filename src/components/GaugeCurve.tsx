import React from 'react';
import Svg, {
  Path,
  Text,
  LinearGradient,
  Stop,
  Defs,
  ClipPath,
  Rect,
} from 'react-native-svg';
import {validateValue} from './utils/helpers';

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

const GaugeCurve: React.FC<GaugeCurveProps> = ({
  value,
  gaugeColor = '#ff0',
  gaugeValueColor = ['#0000ff'],
  gaugeStroke = 2,
  gaugeValueStroke = 2.5,
  children,
  insideTextColor = '#999',
  size = 150,
}) => {
  const validatedValue = validateValue(value, 0, 100);
  const opts = {
    dialRadius: 40,
    dialStartAngle: 135,
  };

  function getAngle(gaugeSpanAngle: number): number {
    return (validatedValue * gaugeSpanAngle) / 100;
  }

  function getCartesian(
    cx: number,
    cy: number,
    radius: number,
    angle: number,
  ): {x: number; y: number} {
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.round((cx + radius * Math.cos(rad)) * 1000) / 1000,
      y: Math.round((cy + radius * Math.sin(rad)) * 1000) / 1000,
    };
  }

  function getDialCoords(
    radius: number,
    startAngle: number,
    endAngle: number,
  ): {start: {x: number; y: number}; end: {x: number; y: number}} {
    const cx = 50,
      cy = 50;
    return {
      end: getCartesian(cx, cy, radius, endAngle),
      start: getCartesian(cx, cy, radius, startAngle),
    };
  }

  function updateGauge(): string {
    const angle = getAngle(360 - Math.abs(136 - 45)),
      flag = angle <= 180 ? 0 : 1;

    return pathString(
      opts.dialRadius,
      opts.dialStartAngle,
      angle + opts.dialStartAngle,
      flag,
    );
  }

  function pathString(
    radius: number,
    startAngle: number,
    endAngle: number,
    largeArc?: number,
  ): string {
    const coords = getDialCoords(radius, startAngle, endAngle),
      start = coords.start,
      end = coords.end,
      largeArcFlag = typeof largeArc === 'undefined' ? 1 : largeArc;

    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      end.x,
      end.y,
    ].join(' ');
  }

  return (
    <Svg height={size} width={size} viewBox="0 0 100 100">
      <Defs>
        <ClipPath id="clip">
          <Rect x="0" y="0" width="100" height="50" />
        </ClipPath>
      </Defs>

      <Path
        fill="none"
        d="M 21.716 78.284 A 40 40 0 0 1 78.284 78.284"
        clipPath="url(#clip)" // Memotong path ini menjadi setengah lingkaran
      />

      {/* Anak-anak */}
      {!!children ? (
        children
      ) : (
        <Text x={50} y={50} fill={insideTextColor} textAnchor="middle">
          {validatedValue}
        </Text>
      )}

      <Path
        strokeDasharray="50,0,20,0"
        fill="none"
        stroke={gaugeColor}
        strokeWidth={gaugeStroke}
        d="M 21.716 78.284 A 40 40 0 1 1 78.284 78.284"
        strokeLinecap="round"
        strokeLinejoin="round" // Menambahkan radius pada sudut-sudut
      />

      <Path
        strokeDasharray="50,0,20,0"
        fill="none"
        stroke={`url(#gaugeValueGradient)`} // Gunakan linier gradient
        strokeWidth={gaugeValueStroke}
        d={updateGauge()}
        strokeLinecap="round"
        strokeLinejoin="round" // Menambahkan radius pada sudut-sudut
      />
      <LinearGradient id="gaugeValueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        {gaugeValueColor.map((color, index) => (
          <Stop
            key={index}
            offset={`${(index / (gaugeValueColor.length - 1)) * 100}%`}
            stopColor={color}
          />
        ))}
      </LinearGradient>
    </Svg>
  );
};

export default GaugeCurve;
