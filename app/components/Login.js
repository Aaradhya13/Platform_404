import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import  api  from '../services/api';
import colors from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { Image } from 'react-native';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users/login/', {
        username,
        password,
      });

     const { token, department, username: responseUsername, role } = response.data || response;

      if (department === 'inspection' || department === 'Maintainance') {
        login({ username: responseUsername, role, department }, token);
        if (department === 'inspection') {
          navigation.replace('InspectionHome');
        } else {
          navigation.replace('MaintenanceHome');
        }
      } else {
        Alert.alert(
          'Access Denied',
          'Only Inspection and Maintenance Department Personnel are allowed'
        );
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')} 
            style={styles.logoimg}
          />
          <Text style={styles.logoText}>Sancharam</Text>
          <Text style={styles.subtitle}>Platform-404</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.signInText}>Enter Your Credentials</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>.</Text>
          <Text style={styles.weatherText}>.</Text>
          <Text style={styles.weatherText}>.</Text>
          <Text style={styles.weatherText}>.</Text>
          <Text style={styles.weatherText}>.</Text>
          <Text style={styles.weatherText}>.</Text>
          <Text style={styles.weatherText}>.</Text>
          <Text style={styles.weatherText}>.</Text>
          <Text style={styles.weatherText}>.</Text>
          <Text style={styles.weatherText}>.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
    paddingTop: 80
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  signInText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 200,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  weatherContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weatherText: {
    fontSize: 16,
    color: colors.background,
  },
  logoimg: {
    height: 120,
    width: 220,
    marginBottom: 10,
  }
});

export default Login;