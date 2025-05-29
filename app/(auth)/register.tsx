import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Phone } from 'lucide-react-native';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { Animation } from '@/components/ui/Animation';

export default function Register() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (!isLoaded) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Create a new user
      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        phoneNumber: phone,
        password,
      });

      // Prepare user for verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      // Set the user as active
      await setActive({ session: result.createdSessionId });
      
      // Navigate to the main app
      router.replace('/(tabs)/');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to sign up. Please try again.');
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
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.logoContainer}>
              <Animation name="medication" />
              <Text style={styles.title}>MedTracker</Text>
              <Text style={styles.subtitle}>Your personal medication assistant</Text>
            </View>
            
            <View style={styles.formContainer}>
              <Text style={styles.heading}>Create Account</Text>
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <FormInput
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="John"
                    icon={<User size={20} color="#4A90E2" />}
                  />
                </View>
                <View style={styles.nameField}>
                  <FormInput
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Doe"
                    icon={<User size={20} color="#4A90E2" />}
                  />
                </View>
              </View>
              
              <FormInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Mail size={20} color="#4A90E2" />}
              />
              
              <FormInput
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 (555) 123-4567"
                keyboardType="phone-pad"
                icon={<Phone size={20} color="#4A90E2" />}
              />
              
              <FormInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                icon={<Lock size={20} color="#4A90E2" />}
              />
              
              <Button
                title="Create Account"
                onPress={handleSignUp}
                loading={loading}
                style={styles.signUpButton}
              />
              
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signInText}>Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </ScrollView>
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heading: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 24,
    color: '#333',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#E53935',
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameField: {
    width: '48%',
  },
  signUpButton: {
    marginTop: 24,
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