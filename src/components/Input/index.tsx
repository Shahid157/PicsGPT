import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {normalize, wp} from '../../styles/responsiveScreen';
import {colors, fonts, SvgIcon} from '../../assets';
import { hp } from '../../constants';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void | string;
  placeholder?: string;
  placeholderTextColor?: string;
  style?: StyleProp<any>;
  inputContainer?: StyleProp<any>;
  inputStyle?: StyleProp<TextStyle>;
  blurOnSubmit?: boolean;
  autoComplete?: string;
  leftIcon?: boolean | undefined;
  secureTextEntry?: boolean;
  onSubmit?: (text: string) => void;
  clearOnSubmit?: boolean;
  returnKeyType?:
    | 'done'
    | 'go'
    | 'next'
    | 'search'
    | 'send'
    | 'none'
    | 'previous';
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'visible-password';
  rightIcon?: boolean | undefined;
  onIconPress?: () => void;
}

export default function Input({
  leftIcon,
  value,
  onChangeText,
  blurOnSubmit,
  inputStyle,
  inputContainer,
  placeholder,
  secureTextEntry,
  onSubmit,
  clearOnSubmit,
  returnKeyType,
  keyboardType,
  rightIcon,
  onIconPress,
}: InputProps) {
  const [inputValue, setValue] = useState(value);

  const onSubmitEditingHandler = () => {
    if (typeof onSubmit === 'function') {
      onSubmit(inputValue);
    }
    if (clearOnSubmit) {
      setValue('');
    }
  };

  const onChangeTextHandler = (text: any) => {
    setValue(text);
    if (typeof onChangeText === 'function') {
      onChangeText(text);
    }
  };

  return (
    <View>
      <View style={[styles.InputWrapper, inputContainer]}>
        {leftIcon ? <SvgIcon.Search /> : null}
        <TextInput
          style={[styles.inputStyle, inputStyle]}
          textContentType="none"
          value={value}
          autoComplete="off"
          autoCorrect={false}
          allowFontScaling={false}
          placeholder={placeholder}
          placeholderTextColor={colors.gray2}
          onChangeText={onChangeTextHandler}
          onSubmitEditing={onSubmitEditingHandler}
          blurOnSubmit={blurOnSubmit}
          returnKeyType={returnKeyType}
          underlineColorAndroid="transparent"
          keyboardType={keyboardType}
          autoCapitalize={'none'}
          secureTextEntry={secureTextEntry}
        />
        {rightIcon ? (
          <TouchableOpacity onPress={onIconPress}>
            {secureTextEntry ? <SvgIcon.HidePassword /> : <SvgIcon.Password />}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    height: wp(8),
    paddingLeft: wp(1),
    paddingRight: wp(2),
    fontSize: normalize(12),
    fontFamily: fonts['regular'],
    color: colors['black'],
    flex: 1,
  },
  InputWrapper: {
    width: wp(46),
    paddingHorizontal: wp(1),
    marginLeft: hp(-2),
    borderWidth: 1,
    borderColor: '#98A2B350',
    borderRadius: wp(1),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
