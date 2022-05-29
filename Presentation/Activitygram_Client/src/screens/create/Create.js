import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, Button } from 'react-native';

export const url = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';

let json = {}

async function onPressCreate() {
	await fetch(url + 'createTest', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: JSON.stringify({
			"user_input": json.description
		})
	})
		.then((res) => {
			console.log('sent request');
		})
		.catch((err) => {
			console.log('error');
		});
}

const Create = () => {
	// const [ text, setText ] = useState('');
	return (
		<SafeAreaView>

			{/* <TextInput
				style={styles.input}
        onChangeText={(newText) => { json.recurrent = newText; }}
				placeholder="Location"
			/>
      "location": json.location,
      "description": json.description,
      "interests": json.interests,
      "preconditions": json.preconditions,
      "initiator": json.initiator,
      "managers": json.managers,
      "invited": json.invited,
      "images": json.images,
      "qr": json.qr,
      "tags": json.tags,
      "status": json.status */}

			<TextInput
				style={styles.input}
				onChangeText={(newText) => { 
					console.log('inserted - ' + newText)
					json.description = newText; 
				}}
				placeholder="Description"
			/>

			<Button
				onPress={() => {
					console.log('clicked')
					onPressCreate(json)
				}}
				title='Search'
				color="#841584"
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
