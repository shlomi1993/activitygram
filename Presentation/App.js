import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

// IMPLEMENT NOTIFICATIONS: https://www.youtube.com/watch?v=z6DEJXYQpP4&ab_channel=AdrianTwarog
export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <Block style={styles.container}>
      <Button onPress={ () => console.log("pressed") }>
        <Block row middle>
          <Text size={16} >TEST PRESS</Text>
        </Block>
      </Button>
      <Button onPress={() => {
        console.log("post sent")

        // Set IP to your local IPv4.
        fetch('http://172.16.28.12:8080/TEST', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              param1: 'stringParam',
              param2: 12
            })
        });
      }}>
        <Block row middle>
          <Text size={16} >TEST POST</Text>
        </Block>
      </Button>
    </Block>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
