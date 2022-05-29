import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, Button } from 'react-native';

// function onChangeText(text) {
//   console.log(text)
// }
let title = '';
let startTime = '';
let endTime = '';
let recurrent = false;
let images = [];
let location = '';
let description = '';
let inititator = '';
let managers = [];
let invited = [];
let tags = [];
let qr = '';
let status = '';

export const url = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';

async function onPressCreate(title, description) {
	await fetch(url + 'createTest', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			title: title,
			description: description
		})
	})
		.then((json) => {
			console.log('sent request');
		})
		.catch((error) => {
			console.log('error');
		});
}

const Create = () => {
	// const [ text, onChangeText ] = React.useState('Useless Text');
	// const [ number, onChangeNumber ] = React.useState(null);

	const [ text, setText ] = useState('');

	return (
		<SafeAreaView>
			<TextInput
				style={styles.input}
        onChangeText={(newText) => {
          console.log('inserted')
					title = newText;
				}}
				placeholder="Activity Title"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					description = newText;
				}}
				placeholder="Description"
			/>

			<Button
        onPress={() => {
          console.log('clicked')
          onPressCreate(title, description)
        }}
				title='Create'
				color="#841584"
				accessibilityLabel="Learn more about this purple button"
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10
	}
});

export default Create;
