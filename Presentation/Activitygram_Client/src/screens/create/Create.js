import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, ScrollView } from 'react-native';

export const url = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';

async function onPressCreate(params) {
	var formBody = [];
	for (var property in params) {
		var encodedKey = encodeURIComponent(property);
		var encodedValue = encodeURIComponent(params[property]);
		formBody.push(encodedKey + '=' + encodedValue);
	}
	formBody = formBody.join('&');
	await fetch(url + 'createActivity', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: formBody
	})
		.then((res) => {
			console.log('sent request');
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
					json.title = newText;
				}}
				placeholder="Activity Title"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.startTime = newText;
				}}
				placeholder="Start time"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.endTime = newText;
				}}
				placeholder="End time"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.recurrent = newText;
				}}
				placeholder="Recurrent"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.location = newText;
				}}
				placeholder="Location"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.description = newText;
				}}
				placeholder="Description"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.interests = newText;
				}}
				placeholder="Interests"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.preconditions = newText;
				}}
				placeholder="Preconditions"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.initiator = newText;
				}}
				placeholder="Initiator"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.managers = newText;
				}}
				placeholder="Managers"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.invited = newText;
				}}
				placeholder="Invited"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.images = newText;
				}}
				placeholder="Images"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.qr = newText;
				}}
				placeholder="QR"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.tags = newText;
				}}
				placeholder="Tags"
			/>

			<TextInput
				style={styles.input}
				onChangeText={(newText) => {
					json.status = newText;
				}}
				placeholder="Status"
			/>

			<Button
				onPress={() => {
					console.log('clicked');
					onPressCreate(json);
				}}
				title="Create"
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
