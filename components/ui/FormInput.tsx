import React, { useState, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { TextInput, View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import Colors from '@/constants/Colors';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  required?: boolean;
  nextFieldRef?: React.RefObject<TextInput>;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
}

const FormInput = forwardRef<TextInput, FormInputProps>(({
  label,
  error,
  icon,
  containerStyle,
  inputStyle,
  required = false,
  nextFieldRef,
  returnKeyType = 'next',
  onSubmitEditing,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Expose focus method to parent
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    // Add other TextInput methods that you might need
    ...(inputRef.current || {})
  } as TextInput));

  const handleSubmitEditing = useCallback(() => {
    if (nextFieldRef?.current) {
      nextFieldRef.current.focus();
    } else if (onSubmitEditing) {
      onSubmitEditing();
    } else {
      // If no next field and no submit handler, dismiss the keyboard
      inputRef.current?.blur();
    }
  }, [nextFieldRef, onSubmitEditing]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            icon ? styles.inputWithIcon : null,
            inputStyle,
          ]}
          placeholderTextColor={Colors.gray[400]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType={returnKeyType}
          onSubmitEditing={handleSubmitEditing}
          blurOnSubmit={!nextFieldRef}
          {...props}
        />
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[700],
  },
  required: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.error,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    backgroundColor: 'white',
  },
  focusedInput: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  errorInput: {
    borderColor: Colors.error,
  },
  iconContainer: {
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[900],
    padding: 12,
    minHeight: 48,
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

// Set display name for better debugging
FormInput.displayName = 'FormInput';

export default React.memo(FormInput);