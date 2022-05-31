import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/login';
import HomeScreen from './src/screens/home';
import TabsManager from './src/TabsManager/TabsManager';

const Stack = createNativeStackNavigator();

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isStarting: true,
			uid: ''
		};
	}
	render() {
		return this.state.uid === '' ? (
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
					<Stack.Screen name="Home" component={HomeScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		) : (
			<NavigationContainer>
				<TabsManager />
			</NavigationContainer>
		);
	}
}

export default Main;
