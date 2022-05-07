// import React from 'react';
// import { Button, Block } from 'galio-framework';
// import { View } from 'react-native';
// import CreateEvent from './CreateEvent/CreateEvent';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// function HomeScreen() {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Home Screen</Text>
//       </View>
//     );
//   }

// const Stack = createNativeStackNavigator();

// function App() {
//     return (
//       <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen name="Home" component={HomeScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }
  
//   export default App;

// // class HomeScreen extends React.Component {
// //     onClickCreateEvent = () => {

// //     }

// //     onClickTestPost = () => {
// //         {
// //             console.log("post sent")
    
// //             // Set IP to your local IPv4.
// //             fetch('http://172.16.28.12:8080/TEST', {
// //               method: 'POST',
// //               headers: {
// //                 Accept: 'application/json',
// //                 'Content-Type': 'application/json'
// //               },
// //               body: JSON.stringify({
// //                   param1: 'stringParam',
// //                   param2: 12
// //                 })
// //             });
// //         }
// //     }
// //     render() {
// //         <Block>
// //         <Button onPress={ () => console.log("pressed") }>
// //             Test Press
// //         </Button>
// //         <Button onPress={ onClickTestPost() }>
// //             Test Post
// //       </Button>
// //         <Button onClick= {onClickCreateEvent()} >
// //             Create Event
// //         </Button>
// //     </Block>
// //     }
// // };