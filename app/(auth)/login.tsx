import { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SignedIn, SignedOut, SignIn as ClerkSignIn } from '@clerk/clerk-expo';
import { Animation } from '@/components/ui/Animation';

export default function Login() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return null; // or a loading spinner
  }

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
              <ClerkSignIn 
                signUpUrl="/register"
                redirectUrl="/(tabs)/"
                appearance={{
                  elements: {
                    card: {
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 24,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 5,
                    },
                    headerTitle: {
                      display: 'none',
                    },
                    headerSubtitle: {
                      display: 'none',
                    },
                    formFieldInput: {
                      borderWidth: 1,
                      borderColor: '#E5E7EB',
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                      fontFamily: 'Inter-Regular',
                    },
                    formFieldLabel: {
                      fontFamily: 'Inter-Medium',
                      marginBottom: 4,
                    },
                    formButtonPrimary: {
                      backgroundColor: '#4A90E2',
                      borderRadius: 8,
                      padding: 12,
                    },
                    footerActionText: {
                      color: '#4A90E2',
                      fontFamily: 'Inter-Medium',
                    },
                  },
                }}
              />
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
});
