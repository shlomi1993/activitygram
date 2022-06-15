import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, Platform, TouchableOpacity, Dimensions, TextInput, StatusBar, StyleSheet} from 'react-native';
import { Button, Text as TextComp } from '../components';
import Menu from './Menu';
import {useData, ThemeProvider, TranslationProvider, useTheme} from '../hooks';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {Block, Image} from '../components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Feather } from '@expo/vector-icons';
import {auth} from '../../firebase';
import * as Animatable from 'react-native-animatable';
import SignInScreen from '../loginScreens/SignInScreen'
import SignUpScreen from '../loginScreens/SignUpScreen'

export const AuthContext = React.createContext(undefined as any);

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
export default () => {
  const {isDark, theme, setTheme} = useData();
  const [user, setUser] = React.useState('');

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken')
      } catch (e) {
        console.log(e)
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const handleSignIn = (email, password) => {
    const token = email.replace('@', '.')
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
        setUser(user.uid)
        return user;
      })
      .catch(error => alert(error.message));
    return token;
  };
  
  const handleSignUp = (email, password) => {
    const token = email.replace('@', '.')
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log(userCredentials.user.getIdToken)
        console.log('Registered with:', user.email);
        return user.uid
      })
      .catch(error => alert(error.message));
    return token;
  
  };



  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }

    },
    {
      isLoading: true,
      // isSignout: false,
      userToken: null,
    }
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        console.log('signed in')
        const userToken = handleSignIn(data.email, data.password)
        try {
          await AsyncStorage.setItem('userToken', userToken);
        } catch(e) {
          console.log(e)
        }
        dispatch({ type: 'SIGN_IN', token: userToken });
      },
      signOut: async () => {
        auth.signOut()
        .then(() => console.log('signed out'))
        try {
          await AsyncStorage.removeItem('userToken');
        } catch(e) {
          console.log(e)
        }
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async (data) => {
        console.log('signed up')
        const userToken = handleSignUp(data.email, data.password)
        try {
          await AsyncStorage.setItem('userToken', userToken);
        } catch(e) {
          console.log(e)
        }
        dispatch({ type: 'SIGN_IN', token: userToken });
      },
    }),
    []
  );

  // load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenSans-Light': theme.assets.OpenSansLight,
    'OpenSans-Regular': theme.assets.OpenSansRegular,
    'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
    'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
    'OpenSans-Bold': theme.assets.OpenSansBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: 'rgba(0,0,0,0)',
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      <TranslationProvider>
        <ThemeProvider theme={theme} setTheme={setTheme}>
          <NavigationContainer theme={navigationTheme}>
            {state.userToken == null ?
            (<RootStackScreen/>)
            : (<Menu />)}
          </NavigationContainer>
      </ThemeProvider>
    </TranslationProvider>
    </AuthContext.Provider>
  );
};
