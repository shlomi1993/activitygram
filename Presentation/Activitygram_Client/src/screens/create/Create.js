import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, ScrollView } from 'react-native';

export const url = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';

async function onPressCreate(params) {
	var formBody = [];
	console.log("in onPressCreate func")
	for (var property in params) {
		var encodedKey = encodeURIComponent(property);
		var encodedValue = encodeURIComponent(params[property]);
		formBody.push(encodedKey + '=' + encodedValue);
	}
	formBody = formBody.join('&');
	await fetch(url + 'search', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: formBody
	})
		.then((res) => {
			console.log('sent request');
			console.log(`res ${JSON.stringify(res)}`)
		})
		.catch((err) => {
			console.log('error');
		});
}

const Create = () => {
	let json = {};
	return (
		<ScrollView>
			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.keyword = newText;
				}}
				placeholder="Search"
			/>


			<Button
				onPress={() => {
					console.log('clicked');
					console.log(json);
					onPressCreate(json);
				}}
				title="Search"
				color="#841584"
			/>
		</ScrollView>
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
