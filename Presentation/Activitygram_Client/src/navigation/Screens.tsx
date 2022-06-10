import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from '../components'
import { Components, Home, Profile, Post, Search, ForYou, Activity, ActivityCreatedSuccessfully } from '../screens';
import { useScreenOptions, useTranslation, useTheme } from '../hooks';
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const ComponentsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const PostStack = createStackNavigator();
const SearchStack = createStackNavigator();
const ForYouStack = createStackNavigator();
const Tab = createBottomTabNavigator();
// const {t} = useTranslation();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Activity" component={Activity} />
    </HomeStack.Navigator>
  )
}

function ComponentsStackScreen() {
  return (
    <ComponentsStack.Navigator>
      <ComponentsStack.Screen name="Components" component={Components} />
    </ComponentsStack.Navigator>
  )
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={Profile} />
    </ProfileStack.Navigator>
  )
}

function PostStackScreen() {
  return (
    <PostStack.Navigator>
      <PostStack.Screen name="Post" component={Post} />
      <PostStack.Screen name="PostSuccess" component={ActivityCreatedSuccessfully} />
    </PostStack.Navigator>
  )
}

function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={Search} />
    </SearchStack.Navigator>
  )
}

function ForYouStackScreen() {
  return (
    <ForYouStack.Navigator>
      <ForYouStack.Screen name="For You" component={ForYou} />
    </ForYouStack.Navigator>
  )
}

export default () => {
  const { t } = useTranslation();
  const screenOptions = useScreenOptions();
  const { assets, colors, gradients, sizes } = useTheme();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true, tabBarStyle: { height: 60 } }} >
      <Tab.Screen name="Home" component={HomeStackScreen}
        options={{
          tabBarIcon: () => (<Image source={assets.home} height={30} width={30} color={colors.black} />)
        }} />
      <Tab.Screen name="For You" component={ForYouStackScreen}
        options={{
          tabBarIcon: () => (<Image source={assets.heart} height={30} width={30} color={colors.black} />)
        }} />
      <Tab.Screen name="Post" component={PostStackScreen}
        options={{
          tabBarIcon: () => (<Image source={assets.post} height={30} width={30} color={colors.black} />)
        }} />
      <Tab.Screen name="Search" component={SearchStackScreen}
        options={{
          tabBarIcon: () => (<Image source={assets.search} height={30} width={30} color={colors.black} />)
        }} />
      <Tab.Screen name="Profile" component={ProfileStackScreen}
        options={{
          tabBarIcon: () => (<Image source={assets.user} height={30} width={30} color={colors.black} />)
        }} />
      <Tab.Screen name="Components" component={ComponentsStackScreen} options={screenOptions.components} />
    </Tab.Navigator>
  );
};
