import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './context/AuthContext';

import Login from './components/Login';
import Home from './components/Home';
import RaiseJobCard from './components/RaiseJobCard';
import ViewJobCards from './components/ViewJobCards';
import JobCardDetail from './components/JobCardDetail';
import MaintenanceHome from './components/MaintenanceHome';
import MaintenanceJobCardDetail from './components/MaintenanceJobCardDetail';
import colors from './constants/colors';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="InspectionHome" 
          component={Home} 
          options={{ title: 'Inspection Dashboard'}} 
        />
        <Stack.Screen 
          name="RaiseJobCard" 
          component={RaiseJobCard} 
          options={{ title: 'Raise Job Card' }} 
        />
        <Stack.Screen 
          name="ViewJobCards" 
          component={ViewJobCards} 
          options={{ title: 'View Job Cards' }} 
        />
        <Stack.Screen 
          name="JobCardDetail" 
          component={JobCardDetail} 
          options={{ title: 'Job Card Details' }} 
        />
        <Stack.Screen 
          name="MaintenanceHome" 
          component={MaintenanceHome} 
          options={{ title: 'Maintenance Dashboard'}} 
        />
        <Stack.Screen 
          name="MaintenanceJobCardDetail" 
          component={MaintenanceJobCardDetail} 
          options={{ title: 'Job Card Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}