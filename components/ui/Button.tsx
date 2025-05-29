import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'outline' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({
  title,
  onPress,
  type = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) => {
  const buttonStyles = [
    styles.button,
    type === 'outline' && styles.outlineButton,
    type === 'secondary' && styles.secondaryButton,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    type === 'outline' && styles.outlineText,
    type === 'secondary' && styles.secondaryText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={type === 'outline' ? Colors.primary : 'white'}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.gray[200],
  },
  disabledButton: {
    backgroundColor: Colors.gray[300],
    borderColor: Colors.gray[300],
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  outlineText: {
    color: Colors.primary,
  },
  secondaryText: {
    color: Colors.gray[700],
  },
  disabledText: {
    color: Colors.gray[500],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button;