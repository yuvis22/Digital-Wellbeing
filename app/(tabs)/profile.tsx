import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, ChevronRight, Bell, Shield, LogOut, CircleHelp as HelpCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/login');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={['#4A90E2', '#50E3C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user?.profileImageUrl ? (
                <Image 
                  source={{ uri: user.profileImageUrl }} 
                  style={styles.avatar} 
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={30} color="#4A90E2" />
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.userEmail}>{user?.emailAddress}</Text>
            </View>
            
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <Bell size={20} color={Colors.gray[600]} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Notification Settings</Text>
            </View>
            <ChevronRight size={20} color={Colors.gray[400]} />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.gray[300], true: Colors.primary }}
              thumbColor="white"
              ios_backgroundColor={Colors.gray[300]}
            />
          </View>
        </View>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          
          <View style={styles.settingItem}>
            <Shield size={20} color={Colors.gray[600]} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Privacy Settings</Text>
            </View>
            <ChevronRight size={20} color={Colors.gray[400]} />
          </View>
          
          <View style={styles.settingItem}>
            <Shield size={20} color={Colors.gray[600]} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Change Password</Text>
            </View>
            <ChevronRight size={20} color={Colors.gray[400]} />
          </View>
        </View>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.settingItem}>
            <HelpCircle size={20} color={Colors.gray[600]} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Help Center</Text>
            </View>
            <ChevronRight size={20} color={Colors.gray[400]} />
          </View>
          
          <View style={styles.settingItem}>
            <HelpCircle size={20} color={Colors.gray[600]} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Contact Support</Text>
            </View>
            <ChevronRight size={20} color={Colors.gray[400]} />
          </View>
        </View>
        
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          type="outline"
          style={styles.signOutButton}
          textStyle={styles.signOutButtonText}
          leftIcon={<LogOut size={18} color={Colors.error} />}
        />
        
        <Text style={styles.versionText}>MedTracker v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
  },
  settingsButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EBF2FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.gray[800],
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
    marginTop: 4,
  },
  editProfileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editProfileText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.gray[800],
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  settingIcon: {
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.gray[700],
  },
  signOutButton: {
    marginBottom: 24,
    borderColor: Colors.error,
    backgroundColor: 'white',
  },
  signOutButtonText: {
    color: Colors.error,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
    textAlign: 'center',
    marginTop: 8,
  },
});