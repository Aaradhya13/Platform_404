import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useApi } from '../services/api';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

const ViewJobCards = ({ navigation }) => {
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi(); 
  const { logout } = useAuth();

  React.useLayoutEffect(() => {
    navigation.setOptions({
    });
  }, [navigation]);

  useEffect(() => {
    fetchJobCards();
  }, []);

  const fetchJobCards = async () => {
    try {
      const response = await api.get('/inspection/jobcards/');
      
      const jobCardsData = Array.isArray(response) ? response : response.data || [];
      
      const openJobCards = jobCardsData.filter(job => job.closed_at === null);
      setJobCards(openJobCards);
    } catch (error) {
      console.error('Fetch job cards error:', error);
      if (error.message.includes('401')) {
        Alert.alert('Session Expired', 'Please login again');
        logout();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        Alert.alert('Error', 'Failed to fetch job cards');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('JobCardDetail', { jobCard: item })}
    >
      <Text style={styles.cardTitle}>Job Card #{item.id}</Text>
      <Text style={styles.cardText}>Train ID: {item.train}</Text>
      <Text style={styles.cardText}>Created: {new Date(item.created_at).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Open Job Cards</Text>
      {jobCards.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noDataText}>No open job cards found</Text>
        </View>
      ) : (
        <FlatList
          data={jobCards}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: colors.text,
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#F4F6F8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default ViewJobCards;