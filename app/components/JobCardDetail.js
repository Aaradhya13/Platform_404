import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image, ScrollView } from 'react-native';
import { useApi } from '../services/api';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

const JobCardDetail = ({ route, navigation }) => {
  const { jobCard } = route.params;
  const [description, setDescription] = useState(jobCard.description || '');
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const api = useApi();
  const { logout } = useAuth();

  React.useLayoutEffect(() => {
    navigation.setOptions({
    });
  }, [navigation]);

  const updateDescription = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Description cannot be empty');
      return;
    }

    setUpdating(true);
    try {
      console.log('Updating job card:', jobCard.id, 'with description:', description);
      const updateData = {
        id: jobCard.id,
        description: description.trim(),
      };

      const response = await api.put('/inspection/jobcards/', updateData);
      console.log('Update response:', response);

      Alert.alert('Success', 'Description updated successfully');
      setEditing(false);
      jobCard.description = description.trim();
      
    } catch (error) {
      console.error('Update description error:', error);
      if (error.message.includes('401') || error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        logout();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        const errorMessage = error.response?.data?.message || 
          error.message || 
          'Failed to update description. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setUpdating(false);
    }
  };

  const deleteJobCard = async () => {
    Alert.alert(
      'Delete Job Card',
      'Are you sure you want to delete this job card? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              console.log('Deleting job card:', jobCard.id);
              
              await api.delete('/inspection/jobcards/', {
                data: { id: jobCard.id }
              });

              Alert.alert('Success', 'Job card deleted successfully');
              navigation.goBack();
              
            } catch (error) {
              console.error('Delete job card error:', error);
              if (error.message.includes('401') || error.response?.status === 401) {
                Alert.alert('Session Expired', 'Please login again');
                logout();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              } else {
                const errorMessage = error.response?.data?.message || 
                  error.message || 
                  'Failed to delete job card. Please try again.';
                Alert.alert('Error', errorMessage);
              }
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return dateString || 'Unknown';
    }
  };

  const resetDescription = () => {
    setDescription(jobCard.description || '');
    setEditing(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Job Card #{jobCard.id}</Text>
      
      <View style={styles.detailCard}>
        <View style={styles.detailSection}>
          <Text style={styles.label}>Train ID:</Text>
          <Text style={styles.value}>{jobCard.train || 'Not specified'}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, styles.statusText]}>
            {jobCard.status || 'Pending'}
          </Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.label}>Created:</Text>
          <Text style={styles.value}>{formatDate(jobCard.created_at)}</Text>
        </View>

        {jobCard.updated_at && jobCard.updated_at !== jobCard.created_at && (
          <View style={styles.detailSection}>
            <Text style={styles.label}>Last Updated:</Text>
            <Text style={styles.value}>{formatDate(jobCard.updated_at)}</Text>
          </View>
        )}
        
        <View style={styles.detailSection}>
          <Text style={styles.label}>Description:</Text>
          {editing ? (
            <TextInput
              style={[styles.value, styles.input]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholder="Enter description..."
              maxLength={500}
            />
          ) : (
            <Text style={styles.value}>
              {jobCard.description || 'No description available'}
            </Text>
          )}
          {editing && (
            <Text style={styles.characterCount}>
              {description.length}/500 characters
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.imageContainer}>
        <Text style={styles.sectionTitle}>Photo</Text>
        {jobCard.photo ? (
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: jobCard.photo }} 
              style={styles.image}
              resizeMode="contain"
              onError={(error) => console.log('Image failed to load:', jobCard.photo, error)}
            />
          </View>
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Text style={styles.noImageText}>📷</Text>
            <Text style={styles.noImageText}>No photo available</Text>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        {editing ? (
          <View style={styles.editButtonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={resetDescription}
              disabled={updating}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton, updating && styles.disabledButton]} 
              onPress={updateDescription}
              disabled={updating}
            >
              <Text style={styles.buttonText}>
                {updating ? 'Updating...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.editButton]} 
              onPress={() => setEditing(true)}
              disabled={deleting}
            >
              <Text style={styles.buttonText}>Edit Description</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton, deleting && styles.disabledButton]} 
              onPress={deleteJobCard}
              disabled={deleting}
            >
              <Text style={styles.buttonText}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.text,
  },
  detailCard: {
    backgroundColor: '#F4F6F8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailSection: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  statusText: {
    fontWeight: '600',
    color: colors.primary,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    color: colors.text,
    fontSize: 16,
  },
  characterCount: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 5,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageWrapper: {
    backgroundColor: '#F4F6F8',
    borderRadius: 10,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  noImage: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
  editButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 200,
    alignItems: 'center',
    flex: 1,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 200,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 200,
  },
  cancelButton: {
    backgroundColor: '#D62828',
    borderRadius: 200,
  },
  deleteButton: {
    backgroundColor: '#D62828', // Red color for delete
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default JobCardDetail;