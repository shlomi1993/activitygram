import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Header } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateEventScreen from './Home/CreateEvent/CreateEvent';
import JoinEventScreen from './Home/JoinEvent/JoinEvent';
import SplashScreen from './SplashScreen/SplashScreen';
import ProfileScreen from './Profile page/ProfilePage';
import TestsScreen from './___tests___/InitAppTests';
import styles from './App'
import Profile from './Profile page/screens/profile'
import Product from './Profile page/screens/product'
import Setting from './Profile page/screens/setting'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';

import SettingOption from './Profile page/screens/setting/Options'
<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');
</style>

const SettingStack = createNativeStackNavigator()
function SettingsStackScreen() {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen name="Settings" component={Setting} />
      <SettingStack.Screen name="Options" component={SettingOption} />
    </SettingStack.Navigator>
  )
}

const ProductStack = createNativeStackNavigator()
function ProductStackScreen() {
  return (
    <ProductStack.Navigator>
      <ProductStack.Screen name="Product" component={Product} />
    </ProductStack.Navigator>
  )
}

const ProfileStack = createNativeStackNavigator()
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <ProfileStack.Screen name="Profile" component={Profile} />
    </ProfileStack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

const HomeIcon = ({ focused, tintColor }) => (
  <Icon
    name="lens"
    type="material"
    size={26}
    color={focused ? '#adacac' : '#ededed'}
  />
)

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
        title="Splash Screen - not in use"
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
        {/* <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome to Activitygram!' }} />
          <Stack.Screen name="Create" component={CreateEventScreen} />
          <Stack.Screen name="Join" component={JoinEventScreen} />
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Tests" component={TestsScreen} />
        </Stack.Navigator> */}
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: props => <HomeIcon {...props}/>
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          showLabel: false,
          showIcon: true,
          indicatorStyle: {
            backgroundColor: 'transparent',
          },
          labelStyle: {
            fontSize: 12,
          },
          iconStyle: {
            width: 30,
            height: 30,
          },
          style: {
            // backgroundColor: 'transparent',
            justifyContent: 'center',
          },
        }}
      >
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
        <Tab.Screen name="Event" component={ProductStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
      </NavigationContainer>
    );
  }

}


export default App;
