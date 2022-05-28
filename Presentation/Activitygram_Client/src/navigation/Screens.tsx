import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Components} from '../newScreens';
import {useScreenOptions, useTranslation} from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>

      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />
    </Stack.Navigator>
  );
};
