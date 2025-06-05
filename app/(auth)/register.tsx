import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { useSignUp, useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { Animation } from '@/components/ui/Animation';

export default function Register() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (!isLoaded) {
      setError('Sign up system not ready. Please try again in a moment.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp.create({
        emailAddress: email,
        password,
        username,
        phoneNumber,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Sign up error:', err, JSON.stringify(err));
      if (err.errors && Array.isArray(err.errors)) {
        setError(
          err.errors.map((e: any) => e.message || JSON.stringify(e)).join('\n')
        );
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Unknown error: ' + JSON.stringify(err, null, 2));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) {
      setError('Verification system not ready. Please try again in a moment.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });
      console.log(
        'Clerk verification attempt:',
        JSON.stringify(attempt, null, 2)
      );

      if (!attempt) {
        setError('Verification attempt failed. Please try again.');
        return;
      }

      // Check if email is already verified
      if (attempt.verifications?.emailAddress?.status === 'verified') {
        try {
          if (signIn && signIn.create) {
            console.log('Attempting sign in with:', { email });
            const result = await signIn.create({ identifier: email, password });
            console.log('Sign in result:', JSON.stringify(result, null, 2));

            if (result.status === 'complete') {
              await setActive({ session: result.createdSessionId });
              setPendingVerification(false);
              setCode('');
              router.replace('/(tabs)');
              return;
            } else {
              console.log('Sign in incomplete. Status:', result.status);
              setError(`Sign in incomplete. Status: ${result.status}`);
            }
          } else {
            console.log('Sign in not available');
            setError('Sign in system not available. Please try again.');
          }
        } catch (signInErr: any) {
          console.error('Sign in error details:', {
            message: signInErr.message,
            errors: signInErr.errors,
            code: signInErr.code,
            stack: signInErr.stack,
          });
          setError(`Sign in failed: ${signInErr.message || 'Unknown error'}`);
        }
      }

      // Handle verification status
      if (attempt.status === 'complete') {
        if (attempt.createdSessionId) {
          await setActive({ session: attempt.createdSessionId });
          setPendingVerification(false);
          setCode('');
          router.replace('/(tabs)');
        } else {
          setError(
            'Verification succeeded but no session found. Please sign in.'
          );
        }
      } else if (attempt.status === 'missing_requirements') {
        const missingFields = attempt.missingFields || [];
        const unverifiedFields = attempt.unverifiedFields || [];
        setError(
          `Missing requirements: ${[...missingFields, ...unverifiedFields].join(
            ', '
          )}`
        );
      } else {
        setError(
          `Verification incomplete. Status: ${attempt.status || 'unknown'}`
        );
      }
    } catch (err: any) {
      console.error('Verification error details:', {
        message: err.message,
        errors: err.errors,
        code: err.code,
        stack: err.stack,
        status: err.status,
        response: err.response,
      });

      if (
        err.errors?.[0]?.code === 'verification_already_verified' ||
        (err.errors?.[0]?.message &&
          err.errors[0].message.toLowerCase().includes('already verified'))
      ) {
        try {
          if (signIn && signIn.create) {
            console.log('Attempting sign in after verification error');
            const result = await signIn.create({ identifier: email, password });
            console.log(
              'Sign in result after verification error:',
              JSON.stringify(result, null, 2)
            );

            if (result.status === 'complete') {
              await setActive({ session: result.createdSessionId });
              setPendingVerification(false);
              setCode('');
              router.replace('/(tabs)');
              return;
            }
          }
          setError('Email already verified. Please sign in.');
        } catch (signInErr: any) {
          console.error('Sign in error after verification:', {
            message: signInErr.message,
            errors: signInErr.errors,
            code: signInErr.code,
            stack: signInErr.stack,
          });
          setError(`Sign in failed: ${signInErr.message || 'Unknown error'}`);
        }
      } else if (err.errors && Array.isArray(err.errors)) {
        const errorMessages = err.errors.map((e: any) => {
          console.log('Error object:', JSON.stringify(e, null, 2));
          return e.message || JSON.stringify(e);
        });
        setError(errorMessages.join('\n'));
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setError('Verification code resent. Please check your email.');
    } catch (err: any) {
      if (
        err.errors?.[0]?.code === 'verification_already_verified' ||
        (err.errors?.[0]?.message &&
          err.errors[0].message.toLowerCase().includes('already verified'))
      ) {
        if (signUp.createdSessionId) {
          await setActive({ session: signUp.createdSessionId });
          setPendingVerification(false);
          setCode('');
          router.replace('/(tabs)');
          return;
        }
        setError('Email already verified. Logging you in...');
      } else if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors.map((e: any) => e.message).join('\n'));
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to resend code. Please try again.');
      }
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
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Animation name="medication" />
            <Text style={styles.title}>MedTracker</Text>
            <Text style={styles.subtitle}>
              Your personal medication assistant
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Create Account</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {!pendingVerification ? (
              <>
                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <Mail size={20} color="#4A90E2" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#888"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      returnKeyType="next"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Lock size={20} color="#4A90E2" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#888"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      returnKeyType="next"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>@</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Username"
                      placeholderTextColor="#888"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>📱</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Phone Number"
                      placeholderTextColor="#888"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      returnKeyType="done"
                    />
                  </View>
                </View>
                <Button
                  title="Create Account"
                  onPress={handleSignUp}
                  loading={loading}
                  style={styles.signUpButton}
                />
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Already have an account?{' '}
                  </Text>
                  <Link href="/login" asChild>
                    <TouchableOpacity>
                      <Text style={styles.signInText}>Sign In</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.heading}>Verify your email</Text>
                <Text style={styles.infoText}>
                  Enter the code sent to your email address.
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Verification Code"
                    placeholderTextColor="#888"
                    value={code}
                    onChangeText={(text) => setCode(text.trim())}
                    keyboardType="number-pad"
                    returnKeyType="done"
                  />
                </View>
                <Button
                  title="Verify"
                  onPress={handleVerify}
                  loading={loading}
                  style={styles.signUpButton}
                />
                <TouchableOpacity
                  style={{ marginTop: 16, alignItems: 'center' }}
                  onPress={handleResendCode}
                  disabled={loading}
                >
                  <Text
                    style={{
                      color: '#4A90E2',
                      fontFamily: 'Inter-Medium',
                      fontSize: 16,
                    }}
                  >
                    Resend Code
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
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
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  heading: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#E53935',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#222',
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    backgroundColor: 'transparent',
  },
  signUpButton: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  signInText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4A90E2',
  },
});
