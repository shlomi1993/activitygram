import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../../firebase';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

const LoginScreen = () => {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ loggedIn, setloggedIn ] = useState(false);
	const [ userInfo, setuserInfo ] = useState([]);

	const navigation = useNavigation();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				navigation.replace('Home');
			}
		});

		return unsubscribe;
	}, []);

	const handleSignUp = () => {
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				console.log('Registered with:', user.email);
			})
			.catch((error) => alert(error.message));
	};

	const handleLoginWithEmail = () => {
		auth
			.signInWithEmailAndPassword(email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				console.log('Logged in with:', user.email);
			})
			.catch((error) => alert(error.message));
	};

	const handleLoginWithGoogle = async () => {
		try {
			await GoogleSignin.hasPlayServices();
			const { accessToken, idToken } = await GoogleSignin.signIn();
			setloggedIn(true);
		} catch (error) {
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				// user cancelled the login flow
				alert('Cancel');
			} else if (error.code === statusCodes.IN_PROGRESS) {
				alert('Signin in progress');
				// operation (f.e. sign in) is in progress already
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				alert('PLAY_SERVICES_NOT_AVAILABLE');
				// play services not available or outdated
			} else {
				// some other error happened
			}
		}
	};

	// useEffect(() => {
	// 	GoogleSignin.configure({
	// 		scopes: [ 'email' ], // what API you want to access on behalf of the user, default is email and profile
	// 		webClientId: '78872694554-afugbki5ih70igo2lifusdpm6mdd9f5u.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
	// 		offlineAccess: true // if you want to access Google API on behalf of the user FROM YOUR SERVER
	// 	});
	// }, []);

	// const signOut = async () => {
	// 	try {
	// 		await GoogleSignin.revokeAccess();
	// 		await GoogleSignin.signOut();
	// 		setloggedIn(false);
	// 		setuserInfo([]);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };

	return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            
			<View style={styles.inputContainer}>
				<TextInput
					placeholder="Email"
					value={email}
					onChangeText={(text) => setEmail(text)}
					style={styles.input}
				/>
				<TextInput
					placeholder="Password"
					value={password}
					onChangeText={(text) => setPassword(text)}
					style={styles.input}
					secureTextEntry
				/>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity onPress={handleLoginWithEmail} style={styles.button}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleSignUp} style={[ styles.button, styles.buttonOutline ]}>
					<Text style={styles.buttonOutlineText}>Register</Text>
				</TouchableOpacity>
				{/* <GoogleSigninButton
					style={{ width: 192, height: 48 }}
					size={GoogleSigninButton.Size.Wide}
					color={GoogleSigninButton.Color.Dark}
					onPress={this._signIn}
				/> */}
            </View>
            
            {/* <View style={styles.sectionContainer}>
              <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this._signIn}
              />
            </View> */}

		</KeyboardAvoidingView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	inputContainer: {
		width: '80%'
	},
	input: {
		backgroundColor: 'white',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 5
	},
	buttonContainer: {
		width: '60%',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 40
	},
	button: {
		backgroundColor: '#0782F9',
		width: '100%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center'
	},
	buttonOutline: {
		backgroundColor: 'white',
		marginTop: 5,
		borderColor: '#0782F9',
		borderWidth: 2
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16
	},
	buttonOutlineText: {
		color: '#0782F9',
		fontWeight: '700',
		fontSize: 16
	}
});
