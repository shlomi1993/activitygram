import React, {useCallback, useEffect, useRef, useState, useContext} from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity, Dimensions, TextInput, StatusBar} from 'react-native';
import { Button, Text as TextComp } from '../components';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useData, useTheme, useTranslation} from '../hooks';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SignUpScreen from './SignUpScreen';
import {auth} from '../../firebase';
import { AuthContext } from '../navigation/App';

const SignInScreen = () => {
  const {gradients, sizes} = useTheme();
  const navigation = useNavigation();
  const [data, setData] = useState({
      email: '',
      password: '',
      check_textInputChange: false,
      secureTextEntry: true
  })

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => {
//       if (user) {
//         console.log('onAuthStateChanged')
//         // navigation.navigate('Home');
//       }
//     });

//     return unsubscribe;
//   }, []);

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

 const handleSignIn = () => {
    auth
      .signInWithEmailAndPassword(data.email, data.password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message));
  };

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor='#0abde3' barStyle='light-content'></StatusBar>
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
                <Button info onPress={() => {handleSignIn()}} style={styles.signIn}>
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

export default SignInScreen;
