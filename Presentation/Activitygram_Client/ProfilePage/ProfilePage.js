// import * as React from 'react'
// import { Icon } from 'react-native-elements';
// import { NavigationContainer } from '@react-navigation/native'
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import Profile from './screens/profile'
// import Product from './screens/product'
// import Setting from './screens/setting'

// import SettingOption from './screens/setting/Options'

// const SettingStack = createNativeStackNavigator()
// function SettingsStackScreen() {
//   return (
//     <SettingStack.Navigator>
//       <Setting1Stack.Screen name="Settings" component={Setting} />
//       <Setting1Stack.Screen name="Options" component={SettingOption} />
//     </SettingStack.Navigator>
//   )
// }

// const ProductStack = createNativeStackNavigator()
// function ProductStackScreen() {
//   return (
//     <ProductStack.Navigator>
//       <Produc1Stack.Screen name="Product" component={Product} />
//     </ProductStack.Navigator>
//   )
// }

// const ProfileStack = createNativeStackNavigator()
// function ProfileStackScreen() {
//   return (
//     <ProfileStack.Navigator
//       screenOptions={{
//         headerShown: false
//       }}
//     >
//       <ProfileStack.Screen name="Profile" component={Profile} />
//     </ProfileStack.Navigator>
//   )
// }

// const Tab = createBottomTabNavigator()

// const HomeIcon = ({ focused, tintColor }) => (
//   <Icon
//     name="lens"
//     type="material"
//     size={26}
//     color={focused ? '#adacac' : '#ededed'}
//   />
// )

// export default function ProfilePage() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator 
//         screenOptions={({ route }) => ({
//           tabBarIcon: props => <HomeIcon {...props}/>
//         })}
//         tabBarOptions={{
//           activeTintColor: 'tomato',
//           inactiveTintColor: 'gray',
//           showLabel: false,
//           showIcon: true,
//           indicatorStyle: {
//             backgroundColor: 'transparent',
//           },
//           labelStyle: {
//             fontSize: 12,
//           },
//           iconStyle: {
//             width: 30,
//             height: 30,
//           },
//           style: {
//             // backgroundColor: 'transparent',
//             justifyContent: 'center',
//           },
//         }}
//       >
//         <Tab.Screen name="Profile" component={ProfileStackScreen} />
//         <Tab.Screen name="Product" component={ProductStackScreen} />
//         <Tab.Screen name="Settings" component={SettingsStackScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   )
// }