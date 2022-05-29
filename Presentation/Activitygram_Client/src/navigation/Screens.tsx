import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Components, Home} from '../newScreens';
import {useScreenOptions, useTranslation} from '../hooks';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  function ComponentsStackScreen() {
    return(
    <Stack.Navigator screenOptions={screenOptions.stack}>
      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />
    </Stack.Navigator>
    )
  }

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab. Screen name="Components" component={ComponentsStackScreen} />

    </Tab.Navigator>

  );
};
