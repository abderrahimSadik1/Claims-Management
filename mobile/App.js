import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterComponent from './Pages/Register'; // Import the RegisterComponent
import LoginComponent from './Pages/Login'; // Import the LoginComponent
import SettingsComponent from './Pages/Settings'; // Import the SettingsComponent
import ClaimDetailsComponent from './components/ClaimDetails'; // Import the ClaimDetailsComponent
import AddClaimComponent from './components/AddClaim'; // Import the AddClaimComponent
import Claims from './components/Claims'; // Import the ClaimsComponent
import UpdateClaimComponent from './components/UpdateClaim'; // Import the UpdateClaimComponent
import { AuthProvider } from './api/AuthContext';

const Stack = createStackNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginComponent}
            options={{ 
              title: 'Login',
            }}
          />
          <Stack.Screen
            name="Claims"
            component={Claims}
            options={{ 
              title: 'Claims',
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterComponent}
            options={{ 
              title: 'Register',
            }}
          />
          <Stack.Screen
            name="ClaimDetails"
            component={ClaimDetailsComponent} // Add ClaimDetailsComponent as a screen
            options={{ title: 'Claim Details' }}
          />
          <Stack.Screen
            name="AddClaim"
            component={AddClaimComponent} // Add AddClaimComponent as a screen
            options={{ title: 'Add Claim' }}
          />
          <Stack.Screen
            name="UpdateClaim"
            component={UpdateClaimComponent} // Add UpdateClaimComponent as a screen
            options={{ title: 'Update Claim' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsComponent} // Add SettingsComponent as a screen
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
