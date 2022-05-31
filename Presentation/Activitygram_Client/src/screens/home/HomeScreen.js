import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../../firebase';
import TabsManager from '../../TabsManager/TabsManager';
import { NavigationContainer } from '@react-navigation/native';

<style>@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');</style>;

const HomeScreen = () => {
	const navigation = useNavigation();

	const handleSignOut = () => {
		auth
			.signOut()
			.then(() => {
				navigation.replace('Login');
			})
			.catch((error) => alert(error.message));
	};

	return (
        <NavigationContainer independent={true}>
            <TabsManager />
            <Text>Email: {auth.currentUser?.email}</Text>
            <TouchableOpacity onPress={handleSignOut} style={styles.button}>
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
        </NavigationContainer>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		backgroundColor: '#0782F9',
		width: '60%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 40
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16
	}
});
