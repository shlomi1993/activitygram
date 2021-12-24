import * as React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styles from './CreateEvent'
// createNativeStackNavigator is a function that returns an object containing 2 properties: Screen and Navigator
const Stack = createNativeStackNavigator();

class CreateEvent extends React.Component {
  constructor()
  {
    super();
    this.state={
      name: '',
      email: '',
      password: '',
    }
  }

  submit()
  {
    console.warn(this.state)
  }
    render() {
    return (
      <View style={{margin: 20}}>
        <Text style={{margin: 20, marginTop: 50 }}>Create Event</Text>
        <TextInput
          placeholder='Choose Event type'
          onChangeText={(text) => {this.setState({name: text})}}
          style={{borderWidth: 2, borderColor: 'skyblue', margin: 20}}
        ></TextInput>
        <TextInput
          placeholder='Enter Event name'
          onChangeText={(text) => {this.setState({email: text})}}
          style={{borderWidth: 2, borderColor: 'skyblue', margin: 20}}
        ></TextInput>
        <TextInput
          placeholder='Enter Description'
          onChangeText={(text) => {this.setState({password: text})}}
          style={{borderWidth: 2, borderColor: 'skyblue', margin: 20}}
        ></TextInput>
        <TextInput
          placeholder='Enter Password'
          onChangeText={(text) => {this.setState({password: text})}}
          style={{borderWidth: 2, borderColor: 'skyblue', margin: 20}}
        ></TextInput>
        <TextInput
          placeholder='Enter Password'
          onChangeText={(text) => {this.setState({password: text})}}
          style={{borderWidth: 2, borderColor: 'skyblue', margin: 20}}
        ></TextInput>
        <Button title="Publish" onPress={()=>{this.submit()}} style={styles.submitButton}/>
      </View>
    );
  }

}

export default CreateEvent;
