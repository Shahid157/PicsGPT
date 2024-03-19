import React from 'react';
import {Text, TextProps} from 'react-native';
import {colors, fonts} from '../../assets';
import {normalize} from '../../styles/responsiveScreen';

type FontTextProps = TextProps & {
  color: string;
  pureColor?: string;
  size: number;
  name?: string;
  lineHeightFactor: any;
  lines: number;
  opacity: number;
  pTop: number;
  pLeft: number;
  pRight: number;
  pBottom: number;
  textAlign?: 'auto' | 'center' | 'right' | 'left' | 'justify';
  textDecoration?:
    | 'none'
    | 'underline'
    | 'line-through'
    | 'underline line-through';
  fontWeight?: number;
};

const FontText = ({
  children,
  style,
  color,
  pureColor,
  size,
  name,
  lineHeightFactor,
  lines,
  opacity,
  pTop,
  pLeft,
  pRight,
  pBottom,
  textAlign,
  textDecoration,
  fontWeight,
  onLayout,
}: FontTextProps) => {
  const fontSize = size;
  const textStyle = {
    fontSize,
    fontFamily: fonts[name],
    color: pureColor || color,
    lineHeight: fontSize * lineHeightFactor,
    opacity,
    paddingTop: pTop,
    paddingLeft: pLeft,
    paddingRight: pRight,
    paddingBottom: pBottom,
    textAlign,
    fontWeight,
    textDecorationLine: textDecoration,
    textDecorationColor: textDecoration ? pureColor || color : null,
    textDecorationStyle: textDecoration ? 'solid' : null,
  };
  return (
    <Text
      allowFontScaling={false}
      numberOfLines={lines}
      onLayout={onLayout}
      style={[textStyle, style]}>
      {children}
    </Text>
  );
};

FontText.defaultProps = {
  size: normalize(14),
  name: 'regular',
  color: colors.black,
  lineHeightFactor: 1.2,
  lines: 0,
  opacity: 1,
  textAlign: 'left',
  pTop: 0,
  pLeft: 0,
  pRight: 0,
  pBottom: 0,
  textDecoration: null,
};

export default FontText;
