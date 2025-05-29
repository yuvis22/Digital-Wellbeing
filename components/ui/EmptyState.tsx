import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Animation } from './Animation';
import Button from './Button';
import Colors from '@/constants/Colors';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  illustration: 'empty-meds' | 'empty-reminders' | 'error';
}

const EmptyState = ({
  title,
  description,
  buttonTitle,
  onButtonPress,
  illustration,
}: EmptyStateProps) => {
  // Map illustration type to Animation component name
  const getAnimationName = () => {
    switch (illustration) {
      case 'empty-meds':
        return 'medication';
      case 'empty-reminders':
        return 'reminder';
      case 'error':
        return 'activity';
      default:
        return 'medication';
    }
  };

  return (
    <View style={styles.container}>
      <Animation name={getAnimationName()} size={80} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginVertical: 24,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.gray[800],
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});

export default EmptyState;