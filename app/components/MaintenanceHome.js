import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useApi } from '../services/api';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';

const MaintenanceHome = ({ navigation }) => {
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { logout, user, token } = useAuth();
  const api = useApi();
  useEffect(() => {
    console.log('MaintenanceHome - Auth State:');
    console.log('  User:', user);
    console.log('  Token exists:', !!token);
    console.log('  Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
  }, [user, token]);
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
        <View style={styles.backbutton}>
        <TouchableOpacity onPress={handleLogout} style={styles.backbuttontext}>
          <Text style={styles.backbuttontext}>Log Out</Text>
        </TouchableOpacity>
        </View>
      ),
      });
    }, 
    [navigation]);

  useEffect(() => {
    fetchJobCards();
  }, []);

  const fetchJobCards = async () => {
    console.log('Fetching job cards...');
    
    try {
      const response = await api.get('/inspection/jobcards/');
      
      console.log('Job cards response received:', response);
      
      // Handle both response formats (direct array or nested in data)
      const jobCardsData = Array.isArray(response) ? response : response.data || [];
      
      // Filter only open job cards (closed_at is null)
      const openJobCards = jobCardsData.filter(job => job.closed_at === null);
      
      console.log('Total job cards:', jobCardsData.length);
      console.log('Open job cards:', openJobCards.length);
      
      setJobCards(openJobCards);
    } catch (error) {
      console.error('Fetch job cards error:', error);
      
      if (error.message.includes('401')) {
        console.log('401 error detected - logging out');
        Alert.alert('Session Expired', 'Please login again');
        handleLogout();
      } else {
        Alert.alert('Error', 'Failed to fetch job cards');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing job cards...');
    setRefreshing(true);
    fetchJobCards();
  };

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        console.log('Navigating to job card detail:', item.id);
        navigation.navigate('MaintenanceJobCardDetail', { jobCard: item });
      }}
    >
      <Text style={styles.cardTitle}>Job Card #{item.id}</Text>
      <Text style={styles.cardText}>Train ID: {item.train}</Text>
      <Text style={styles.cardText}>Created: {new Date(item.created_at).toLocaleDateString()}</Text>
      <Text style={styles.cardText} numberOfLines={2}>
        Description: {item.description}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading job cards...</Text>
      </View>
      
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.username}</Text>
      <Text style={styles.subtitle}>Open Job Cards</Text>
      
      {/* Debug info - remove this in production */}

      
      {jobCards.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noDataText}>No open job cards found</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        
      ) : (
        <FlatList
          data={jobCards}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={handleRefresh}
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
    textAlign: 'left',
    marginTop: 20,
    color: colors.text,
    fontFamily: 'sans-serif-medium',
    padding: 15
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    color: colors.textSecondary,
    paddingRight: 15, 
    paddingTop: 15
  },
  subtitle: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.textPrimary,
  },
  debugContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#d32f2f',
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary,
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
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF5C5C',
    borderRadius: 200,
    paddingTop: 30,
    alignItems: 'center',
    margin: 20,
  },
  logoutButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutContainer: {
    alignItems: 'flex-end',
    paddingBottom: 30
  },
  backbutton: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingRight: 15,
      marginLeft: 10,
    },
    backbuttontext: {
      textAlign: 'center',
      color: colors.white,
      fontWeight: 'bold',
      fontSize: 16,
    }
});

export default MaintenanceHome;