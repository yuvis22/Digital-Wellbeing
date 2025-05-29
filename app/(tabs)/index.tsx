import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Plus, Filter } from 'lucide-react-native';
import { fetchMedications } from '@/services/medicationService';
import FormInput from '@/components/ui/FormInput';
import MedicationCard from '@/components/medications/MedicationCard';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useMedications } from '@/hooks/useMedications';
import EmptyState from '@/components/ui/EmptyState';

export default function Home() {
  const router = useRouter();
  const { medications, loading, error, refreshMedications } = useMedications();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const filteredMedications = medications.filter(medication => 
    medication.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshMedications();
    setRefreshing(false);
  };

  // Navigate to medication details
  const handleMedicationPress = (id: string) => {
    router.push(`/medication/${id}`);
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
          <Text style={styles.title}>MedTracker</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Filter size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/add-medication')}
            >
              <Plus size={20} color="white" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.searchContainer}>
        <FormInput
          placeholder="Search medications..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Search size={20} color={Colors.gray[400]} />}
          style={styles.searchInput}
        />
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Try Again" 
            onPress={refreshMedications} 
            style={styles.errorButton}
          />
        </View>
      ) : (
        <FlatList
          data={filteredMedications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MedicationCard
              medication={item}
              onPress={() => handleMedicationPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                title="No medications yet"
                description="Add your first medication to get started"
                buttonTitle="Add Medication"
                onButtonPress={() => router.push('/add-medication')}
                illustration="empty-meds"
              />
            ) : null
          }
        />
      )}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    marginLeft: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchInput: {
    backgroundColor: '#F0F2F5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    width: 150,
  },
});