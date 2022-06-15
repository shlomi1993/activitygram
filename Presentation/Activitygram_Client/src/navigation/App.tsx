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


export const AuthContext = React.createContext(undefined as any);


const SignInScreen = () => {
  const {gradients, sizes} = useTheme();
  const navigation = useNavigation();
  const [data, setData] = React.useState({
      email: '',
      password: '',
      check_textInputChange: false,
      secureTextEntry: true
  })
  const { signIn } = React.useContext(AuthContext);

  const textInputChange = (val) => {
      if(val.length !== 0) {
          setData({
              ...data,
              email: val,
              check_textInputChange: true
          })
      } else {
        setData({
            ...data,
            email: val,
            check_textInputChange: true
        })
      }
  } 

  const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val,
            check_textInputChange: true
        })
    } 

 const updateSecureTextEntry = () => {
    setData({
        ...data,
        secureTextEntry: !data.secureTextEntry
    })
 }

 const callToSignIn = () => {
    const email = data.email;
    const password = data.password;
    signIn({email, password })
};

  return (
      <View style={styles.container}>
        {/* <StatusBar backgroundColor='#fff' barStyle='light-content'></StatusBar> */}
        <View style={styles.header}>
            <Text style={styles.text_header}>Welcome</Text>
        </View>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            <Text style={styles.text_footer}>Email</Text>
            <View style={styles.action}>
                <FontAwesome name="user-o" color='#05375a' size={20}/>
                <TextInput placeholder='Your Email' style={styles.textInput} autoCapitalize='none' 
                 onChangeText={(val)=>textInputChange(val)}/>
                {data.check_textInputChange ? 
                <Animatable.View animation="bounceIn">
                    <Feather name='check-circle' color='green' size={20}/> 
                </Animatable.View>
                
                : null}
                
            </View>
            <Text style={[styles.text_footer, { marginTop: 35}]}>Password</Text>
            <View style={styles.action}>
                <FontAwesome name="lock" color='#05375a' size={20}/>
                <TextInput placeholder='Your Password' style={styles.textInput} autoCapitalize='none' secureTextEntry={data.secureTextEntry ? true : false}
                 onChangeText={(val)=>handlePasswordChange(val)}/>
                 <TouchableOpacity onPress={updateSecureTextEntry}>
                     {data.secureTextEntry ? <Feather name='eye-off' color='grey' size={20}/>
                     : <Feather name='eye' color='grey' size={20}/>}
                 </TouchableOpacity>         
            </View>
            <View style={styles.button}>
                <Button info onPress={() => callToSignIn()} style={styles.signIn}>
                    <TextComp h5 white semibold>Sign In</TextComp>
                </Button>
                <Button white onPress={() => navigation.navigate('SignUpScreen')} style={styles.signIn} marginTop={sizes.sm}>
                    <TextComp h5 info semibold>Sign Up</TextComp>
                </Button>     
            </View>
        </Animatable.View>
    </View>

  );
};

const SignUpScreen = () => {
  const {gradients, sizes} = useTheme();
  const navigation = useNavigation();
  const [data, setData] = React.useState({
      email: '',
      password: '',
      confirm_password: '',
      check_textInputChange: false,
      secureTextEntry: true,
      confirm_secureTextEntry: true,
  })
  const { signUp } = React.useContext(AuthContext);

  const callToSignUp = () => {
    const email = data.email;
    const password = data.password;
    signUp({ email, password })
  };

  const textInputChange = (val) => {
      if(val.length !== 0) {
          setData({
              ...data,
              email: val,
              check_textInputChange: true
          })
      } else {
        setData({
            ...data,
            email: val,
            check_textInputChange: true
        })
      }
  } 

  const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val,
            check_textInputChange: true
        })
    } 

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val,
            check_textInputChange: true
        })
    } 

 const updateSecureTextEntry = () => {
    setData({
        ...data,
        secureTextEntry: !data.secureTextEntry
    })
 }


 const updateConfirmSecureTextEntry = () => {
    setData({
        ...data,
        confirm_secureTextEntry: !data.confirm_secureTextEntry
    })
 }

  return (
    <View style={styles.container}>
        {/* <StatusBar backgroundColor='#fff' barStyle='light-content'></StatusBar> */}
        <View style={styles.header}>
            <Text style={styles.text_header}>Register now</Text>
        </View>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            <Text style={styles.text_footer}>Email</Text>
            <View style={styles.action}>
                <FontAwesome name="user-o" color='#05375a' size={20}/>
                <TextInput placeholder='Your Email' style={styles.textInput} autoCapitalize='none' 
                 onChangeText={(val)=>textInputChange(val)}/>
                {data.check_textInputChange ? 
                <Animatable.View animation="bounceIn">
                    <Feather name='check-circle' color='green' size={20}/> 
                </Animatable.View>
                
                : null}
                
            </View>
            <Text style={[styles.text_footer, { marginTop: 35}]}>Password</Text>
            <View style={styles.action}>
                <FontAwesome name="lock" color='#05375a' size={20}/>
                <TextInput placeholder='Your Password' style={styles.textInput} autoCapitalize='none' secureTextEntry={data.secureTextEntry ? true : false}
                 onChangeText={(val)=>handlePasswordChange(val)}/>
                 <TouchableOpacity onPress={updateSecureTextEntry}>
                     {data.secureTextEntry ? <Feather name='eye-off' color='grey' size={20}/>
                     : <Feather name='eye' color='grey' size={20}/>}
                 </TouchableOpacity>         
            </View>
            <Text style={[styles.text_footer, { marginTop: 35}]}>Confirm password</Text>
            <View style={styles.action}>
                <FontAwesome name="lock" color='#05375a' size={20}/>
                <TextInput placeholder='Confirm Your Password' style={styles.textInput} autoCapitalize='none' secureTextEntry={data.secureTextEntry ? true : false}
                 onChangeText={(val)=>handleConfirmPasswordChange(val)}/>
                 <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
                     {data.secureTextEntry ? <Feather name='eye-off' color='grey' size={20}/>
                     : <Feather name='eye' color='grey' size={20}/>}
                 </TouchableOpacity>         
            </View>
            <View style={styles.button}>
                <Button info onPress={() => callToSignUp()} style={styles.signIn}>
                    <TextComp h5 white semibold>Sign Up</TextComp>
                </Button>
                <Button white onPress={() => navigation.goBack()} style={styles.signIn} marginTop={sizes.sm}>
                    <TextComp h5 info semibold>Sign In</TextComp>
                </Button>     
            </View>
        </Animatable.View>
    </View>
  );
};

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

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#0abde3'
  },
  header: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 50
  },
  footer: {
      flex: 3,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30
  },
  text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 30
  },
  text_footer: {
      color: '#05375a',
      fontSize: 18
  },
  action: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5
  },
  textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#05375a'
  },
  button: {
      alignItems: 'center',
      marginTop: 50
  },
  signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
  },
  textSign: {
      fontSize: 18,
      fontWeight: 'bold'
  }
})
