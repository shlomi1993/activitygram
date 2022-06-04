import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { Search } from '../../newScreens';

export const url = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';


const Search = () => {
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
					onPressSearch(json);
				}}
				title="Search"
				color="#841584"
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.search({
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10
	}
});

export default Search;