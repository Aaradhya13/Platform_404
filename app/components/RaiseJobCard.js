import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/colors';
import * as FileSystem from 'expo-file-system';
const CLOUDINARY_CLOUD_NAME = 'divzqeszh';
const CLOUDINARY_UPLOAD_PRESET = 'issueimages';

const RaiseJobCard = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [trainId, setTrainId] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState('camera');
  const [uploading, setUploading] = useState(false);
  
  const api = useApi();
  const { logout } = useAuth();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
    });
  }, [navigation]);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      setPhoto(photo);
      setMode('preview');
    }
  };
  const confirmPhoto = () => {
    setMode('form');
  };

  const retakePhoto = () => {
    setPhoto(null);
    setMode('camera');
  };
const uploadToCloudinary = async (imageUri) => {
  try {
    // Ensure it's a file:// URI
    let fileUri = imageUri;
    if (fileUri.startsWith('content://')) {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      fileUri = fileInfo.uri;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    const data = await response.json();
    console.log('Cloudinary response:', data);

    if (data.secure_url) return data.secure_url;
    console.log('Cloudinary response:', data);
    throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};


  const submitJobCard = async () => {
    if (!trainId || !description) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!photo) {
      Alert.alert('Error', 'Please take a photo first');
      return;
    }

    setUploading(true);
    try {
      console.log('Uploading image to Cloudinary...');
      
      // First upload the image to Cloudinary
      const imageUrl = await uploadToCloudinary(photo.uri);
      console.log('Image uploaded to Cloudinary:', imageUrl);

      // Now submit the job card with the image URL
      const response = await api.post('/inspection/jobcards/', {
        train: parseInt(trainId),
        description: description,
        photo: imageUrl,
      });
      
      console.log('Job card created successfully:', response);
      Alert.alert('Success', 'Job card created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Submit job card error:', error);
      if (error.message.includes('401') || error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        logout();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        Alert.alert('Error', 'Failed to create job card. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Camera permission is required</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === 'camera') {
    return (
      <View style={styles.container}>
        <CameraView 
          style={styles.camera} 
          ref={ref => setCameraRef(ref)}
          facing="back"
        >
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  if (mode === 'preview') {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.preview} />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={retakePhoto}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={confirmPhoto}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Card Details</Text>
      
      {photo && (
        <View style={styles.photoPreview}>
          <Text style={styles.label}>Photo:</Text>
          <Image source={{ uri: photo.uri }} style={styles.smallPreview} />
        </View>
      )}
      
      <View style={styles.form}>
        <Text style={styles.label}>Train ID</Text>
        <TextInput
          style={styles.input}
          value={trainId}
          onChangeText={setTrainId}
          keyboardType="numeric"
          placeholder="Enter train ID"
          maxLength={10}
        />
        
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholder="Describe the issue or maintenance needed"
          maxLength={500}
        />
        
        <TouchableOpacity 
          style={[styles.submitButton, uploading && styles.disabledButton]} 
          onPress={submitJobCard}
          disabled={uploading}
        >
          <Text style={styles.submitButtonText}>
            {uploading ? 'Uploading...' : 'Submit Job Card'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  photoPreview: {
    padding: 20,
    alignItems: 'center',
  },
  smallPreview: {
    width: 200,
    height: 200,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    gap: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 200,
    flex: 1,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#D62828',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: colors.text,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.text,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 200,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RaiseJobCard;