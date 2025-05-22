
import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterPage from './screens/RegisterPage';
import SignInPage from './screens/SignInPage';



// Placeholder components (create these files later)

const BottomTabNavigator = () => <View><Text>Bottom Nav</Text></View>;
const QRCodeResultScreen = () => <View><Text>QR Result</Text></View>;
const AddBike = () => <View><Text>Add Bike</Text></View>;

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignInPage} options={{ headerShown: false }} />
        <Stack.Screen name="btmNav" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="QRCodeResult" component={QRCodeResultScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Addbike" component={AddBike} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/logo.jpg')}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={() => navigation.navigate('Register')} />
        <Button title="Sign In" onPress={() => navigation.navigate('SignIn')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  image: { width: 300, height: 300, marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '60%' },
});
