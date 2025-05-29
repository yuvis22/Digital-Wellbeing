import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Camera, RotateCcw } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';

interface PrescriptionScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanComplete: (results: any) => void;
}

const PrescriptionScanner = ({
  visible,
  onClose,
  onScanComplete,
}: PrescriptionScannerProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const cameraRef = useRef<any>(null);
  
  // Check camera permissions
  if (!permission) {
    // Camera permissions are still loading
    return null;
  }
  
  // Request permissions if not granted
  if (!permission.granted) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.gray[700]} />
            </TouchableOpacity>
            <Text style={styles.title}>Camera Access</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              We need camera permission to scan your prescription.
            </Text>
            <Button
              title="Grant Permission"
              onPress={requestPermission}
              style={styles.permissionButton}
            />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
  
  // Toggle camera facing
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };
  
  // Take a picture and process it
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        
        // Here in a real app, we would send the image to a processing service
        // For now, we'll simulate a response with mock data
        setTimeout(() => {
          // Simulate OCR processing
          const mockResults = {
            name: 'Lisinopril',
            dosage: '10mg',
            notes: 'Take once daily with water.',
          };
          
          setLoading(false);
          onScanComplete(mockResults);
        }, 2000);
        
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
        console.error(error);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Scan Prescription</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            enableZoomGesture
          >
            <View style={styles.scanOverlay}>
              <View style={styles.scanArea} />
            </View>
            
            <View style={styles.instructions}>
              <Text style={styles.instructionsText}>
                Position your prescription label within the frame
              </Text>
            </View>
          </CameraView>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <RotateCcw size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.capturingIndicator} />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
          
          <View style={{ width: 50 }} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: 'white',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    width: 200,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  instructions: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },
  capturingIndicator: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 6,
    borderColor: 'white',
    borderTopColor: Colors.primary,
  },
});

export default PrescriptionScanner;