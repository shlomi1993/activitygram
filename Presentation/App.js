import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Header } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateEventScreen from './Home/CreateEvent/CreateEvent';
import JoinEventScreen from './Home/JoinEvent/JoinEvent';
import SplashScreen from './SplashScreen/SplashScreen';
import TestsScreen from './___tests___/InitAppTests';
import styles from './App'

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');
</style>

function HomeScreen({ navigation }) {
  return (
    <View style={styles.view}>
      <Header
      backgroundImageStyle={{}}
      barStyle="default"
      centerComponent={{
        text: "HOME",
        style: { color: "#fff", fontSize: 32 }
      }}
      centerContainerStyle={{}}
      containerStyle={{ width: "100%", marginBottom: 20 }}
      leftComponent={{ icon: "menu", color: "#fff" }}
      leftContainerStyle={{}}
      linearGradientProps={{}}
      placement="center"
      rightComponent={{ icon: "home", color: "#fff" }}
      rightContainerStyle={{}}
      statusBarProps={{}}
    />
      <Button
        containerStyle={{ margin: 5, borderWidth: 2 }} 
        title="Create Event"
        onPress={() =>
          navigation.navigate('Create')}
      ></Button>
      <Button
        containerStyle={{ margin: 5, borderWidth: 2 }}
        title="Join Event"
        onPress={() =>
          navigation.navigate('Join')}
      ></Button>
      <Button
        containerStyle={{ margin: 5, borderWidth: 2 }}
        title="Splash Screen - draft"
        onPress={() =>
          navigation.navigate('Splash')}
      ></Button>
      <Button
        containerStyle={{ margin: 5, borderWidth: 2 }}
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
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Tests" component={TestsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

}


export default App;
