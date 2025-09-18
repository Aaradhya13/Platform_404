import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/colors';

const Home = ({ navigation }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

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
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.username}</Text>
      
      <TouchableOpacity 
        style={styles.optionCard}
        onPress={() => navigation.navigate('RaiseJobCard')}
      >
        <Text style={styles.optionText}>Raise Job-Card</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.optionCard}
        onPress={() => navigation.navigate('ViewJobCards')}
      >
        <Text style={styles.optionText}>View Job-Cards</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
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
    color: colors.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  optionCard: {
    backgroundColor: '#F4F6F8',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
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

export default Home;