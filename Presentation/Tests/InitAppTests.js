import React from 'react';
import { Button, Block } from 'galio-framework';
import { StyleSheet, View } from 'react-native';

export default function CreateEvent() {
    function onClickCreateEvent() {

    }

    function onClickTestPost() {
        {
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
        }
    }
    return(
        <Block>
            <Button onPress={ () => console.log("pressed") }>
                Test Press
            </Button>
            <Button onPress={ onClickTestPost() }>
                Test Post
          </Button>
            <Button onClick= {onClickCreateEvent()} >
                Create Event
            </Button>
            <Button onClick= {onClickCreateEvent()} >
                Join Event
            </Button>
        </Block>
    )
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
})};