import React, { useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Animation } from '@/components/ui/Animation';
import { AuthContext } from '@/contexts/AuthContext';

export default function Login() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  const handleSignIn = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      } else {
        setError('Additional steps required.');
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Sign in failed');
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
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Animation name="medication" />
            <Text style={styles.title}>MedTracker</Text>
            <Text style={styles.subtitle}>
              Your personal medication assistant
            </Text>
          </View>
          <View style={styles.formContainer}>
            {!isAuthenticated ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSignIn}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.signUpLink}
                  onPress={() => router.push('/register')}
                >
                  <Text style={styles.signUpText}>
                    Don't have an account? Sign Up
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.heading}>You're already signed in!</Text>
            )}
          </View>
        </View>
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
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  heading: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 24,
    color: 'white',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  errorText: {
    color: '#E53935',
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    textAlign: 'center',
  },
  signUpLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  signUpText: {
    color: '#4A90E2',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
