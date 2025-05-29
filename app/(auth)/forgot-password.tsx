import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft } from 'lucide-react-native';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';

export default function ForgotPassword() {
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!isLoaded) return;
    
    try {
      setLoading(true);
      setError('');
      
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to send reset password email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient 
      colors={['#4A90E2', '#50E3C2']} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }} 
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Reset Password</Text>
            
            {success ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>
                  If an account exists with this email, you will receive password reset instructions.
                </Text>
                <Button
                  title="Back to Login"
                  onPress={() => router.replace('/login')}
                  style={styles.backToLoginButton}
                />
              </View>
            ) : (
              <>
                <Text style={styles.description}>
                  Enter your email address and we'll send you instructions to reset your password.
                </Text>
                
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
                <FormInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Mail size={20} color="#4A90E2" />}
                />
                
                <Button
                  title="Send Reset Link"
                  onPress={handleResetPassword}
                  loading={loading}
                  style={styles.resetButton}
                />
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heading: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#E53935',
    marginBottom: 16,
  },
  resetButton: {
    marginTop: 24,
  },
  successContainer: {
    alignItems: 'center',
    padding: 16,
  },
  successText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#43A047',
    textAlign: 'center',
    marginBottom: 24,
  },
  backToLoginButton: {
    width: '100%',
  },
});