import * as React from 'react';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from './Menu';
import {useData, ThemeProvider, TranslationProvider, useTheme} from '../hooks';
import { createStackNavigator } from '@react-navigation/stack';
import {Block} from '../components';
import {auth} from '../../firebase';
import SignInScreen from '../loginScreens/SignInScreen'
import SignUpScreen from '../loginScreens/SignUpScreen'
import { EditProfile } from '../screens'

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
            <RootStack.Screen name="CreateProfile" component={EditProfile}/>
        </RootStack.Navigator>
    </Block>
  );
};
export default () => {
  const {isDark, theme, setTheme, userEmail, setUserEmail} = useData();
  const [savedEmail, setSavedEmail] = React.useState();
  const [token, setToken] = React.useState();
  const [approved, setApproved] = React.useState(false);
  const [logged, setLogged] = React.useState(false);
  let storeUser, storeEmail;

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

  React.useEffect(() => {
    const setAsyncItems = async () => {
      if(!logged && approved && token && savedEmail) {
        try {
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('userEmail', savedEmail);
        } catch (e) {
          console.log(e)
        }
        setLogged(true);
        dispatch({ type: 'SIGN_IN', token: token });
      }
    };
    setAsyncItems();
  });

  const handleSignIn = (email, password) => {
    const token = email.replace('@', '.')
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        setToken(token)
        setSavedEmail(email)
        setApproved(true)
        console.log('Logged in with:', user.email);
        return user;
      })
      .catch(error => alert(error.message));
    return token;
  };
  
  const handleSignUp = (email, password) => {
    const token = email.replace('@', '.');
    storeUser = token;
    storeEmail = email;
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        setToken(token)
        setSavedEmail(email)
        const user = userCredentials.user;
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
        handleSignIn(data.email, data.password)        
      },
      signOut: async () => {
        auth.signOut()
        .then(() => console.log('signed out'))
        setLogged(false)
        setApproved(false)
        setSavedEmail(null)
        setToken(null)
        try {
          await AsyncStorage.removeItem('userEmail');
          await AsyncStorage.removeItem('userToken');
        } catch(e) {
          console.log(e)
        }
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async (data) => {
        handleSignUp(data.email, data.password)
        try {
          await AsyncStorage.setItem('userEmail', data.email);
        } catch(e) {
          console.log(e)
        }
      },
      completeSignUp: async () => {
        try {
          console.log(storeUser);
          setApproved(true)
          setLogged(true);
          await AsyncStorage.setItem('userToken', storeUser);
          
        } catch(e) {
          console.log(e)
        }
        dispatch({ type: 'SIGN_IN', token: storeUser });
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
