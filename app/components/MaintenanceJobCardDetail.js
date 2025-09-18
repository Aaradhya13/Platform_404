import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { useApi } from '../services/api';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

const MaintenanceJobCardDetail = ({ route, navigation }) => {
  const { jobCard } = route.params;
  const [closing, setClosing] = useState(false);
  const api = useApi();
  const { logout } = useAuth();
  const [why_closed, setwhy_closed, ] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
    });
  }, 
  [navigation]);

  const closeJobCard = async () => {
    if (!why_closed) {
          Alert.alert('Error', 'Please fill the reason for closing the job card.');
          return;
        }
    else {
      Alert.alert(
        'Close Job Card',
        'Are you sure you want to close this job card? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Close',
            style: 'destructive',
            onPress: async () => {
              setClosing(true);
              try {
                console.log('Closing job card with ID:', jobCard.id);
                const response = await api.put('/inspection/jobcards/', { id: jobCard.id, closed_at: new Date().toISOString(), why_closed: why_closed });
                console.log('Close job card response:', response);
                Alert.alert('Success', 'Job card closed successfully');
                navigation.goBack();
              } catch (error) {
                console.error('Close job card error:', error);
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
                    'Failed to close job card. Please try again.';
                  Alert.alert('Error', errorMessage);
                }
              } finally {
                setClosing(false);
              }
            },
          },
        ]
      );
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return dateString || 'Unknown';
    }
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
            {jobCard.closed_at ? 'Closed' : 'Open'}
          </Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.label}>Created:</Text>
          <Text style={styles.value}>{formatDate(jobCard.created_at)}</Text>
        </View>

        {jobCard.closed_at && (
          <View style={styles.detailSection}>
            <Text style={styles.label}>Closed:</Text>
            <Text style={styles.value}>{formatDate(jobCard.closed_at)}</Text>
          </View>
        )}
        
        <View style={styles.detailSection}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>
            {jobCard.description || 'No description available'}
          </Text>
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
            <View style={styles.detailCard}>
        <View style={styles.detailSection}>
          <Text style={styles.label}>Closing Reason:</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={why_closed}
                    onChangeText={setwhy_closed}
                    multiline
                    numberOfLines={4}
                    placeholder="Describe the issue or maintenance needed"
                    maxLength={500}
                  />
        </View>
      </View>
      
      {!jobCard.closed_at && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.closeButton, closing && styles.disabledButton]} 
            onPress={closeJobCard}
            disabled={closing}
          >
            <Text style={styles.closeButtonText}>
              {closing ? 'Closing...' : 'Close Job Card'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {jobCard.closed_at && (
        <View style={styles.closedNotice}>
          <Text style={styles.closedNoticeText}>
            This job card has been closed and cannot be modified.
          </Text>
        </View>
      )}
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
    alignItems: 'flex-end',
  },
  closeButton: {
    backgroundColor: colors.error || '#dc3545',
    padding: 15,
    borderRadius: 200,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
    opacity: 0.6,
  },
  closeButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  closedNotice: {
    backgroundColor: colors.border,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closedNoticeText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  backbutton: {
    backgroundColor: "#D62828", 
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
    marginLeft: 10,
  },
  backbuttontext: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: 'bold',
  }
});

export default MaintenanceJobCardDetail;