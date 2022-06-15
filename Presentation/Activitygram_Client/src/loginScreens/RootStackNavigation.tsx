import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Block, Text, Switch, Button, Image} from '../components';
import {useData, useTheme, useTranslation} from '../hooks';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

const RootStack = createStackNavigator();

/* drawer menu navigation */
const RootStackScreen = () => {
  const {gradients} = useTheme();

  return (
    <Block gradient={gradients.light}>
        <RootStack.Navigator headerMode='none'>
            <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
            <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        </RootStack.Navigator>
    </Block>
  );
};

export default RootStackScreen;
