// import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import { Button, Block, Text, Input, theme } from 'galio-framework';
// import CreateEvent from './Home/CreateEvent/CreateEvent';
// import HomeScreen from './Home/HomeScreen';
// // IMPLEMENT NOTIFICATIONS: https://www.youtube.com/watch?v=z6DEJXYQpP4&ab_channel=AdrianTwarog
// export default function App() {
//   return (
//     // <View style={styles.container}>
//     //   <Text>Open up App.js to start working on your app!</Text>
//     //   <StatusBar style="auto" />
//     // </View>
//     <Block style={styles.container}>
//       <CreateEvent />
//     </Block>
//   );
  
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// In App.js in a new project

import * as React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateEventScreen from './Home/CreateEvent/CreateEvent'
import JoinEventScreen from './Home/JoinEvent/JoinEvent'
import TestsScreen from './Tests/InitAppTests'
import styles from './App'

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');
</style>

function HomeScreen({ navigation }) {
  return (
    <View style={styles.view}>
      <Text style={{marginBottom: 20}}>Home Screen</Text>
      <Button 
        style={{marginBottom: 20}}
        title="Create Event"
        onPress={() =>
          navigation.navigate('Create')}
      ></Button>
      <Button
        style={{marginBottom: 20}} 
        title="Join Event"
        onPress={() =>
          navigation.navigate('Join')}
      ></Button>
      <Button
        style={{marginBottom: 20}} 
        title="Some Tests"
        onPress={() =>
          navigation.navigate('Tests')}
      ></Button>
    </View>
  );
}

// createNativeStackNavigator is a function that returns an object containing 2 properties: Screen and Navigator
const Stack = createNativeStackNavigator();

/*
PROPS
<Stack.Screen name="Home">
  {props => <HomeScreen {...props} extraData={someData} />}
</Stack.Screen>
*/

class App extends React.Component {

    render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome to Activitygram!' }} />
          <Stack.Screen name="Create" component={CreateEventScreen} />
          <Stack.Screen name="Join" component={JoinEventScreen} />
          <Stack.Screen name="Tests" component={TestsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

}


export default App;
