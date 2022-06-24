import React from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity, TextInput} from 'react-native';
import { Button, Text as TextComp } from '../components';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../hooks';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../navigation/App';

const RootStack = createStackNavigator();


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
      const confirm_password = data.confirm_password;
      if(email === '' || password === '' || confirm_password === '') {
        alert('Please fill email and password');
    } else {
        signUp({ email, password })
        navigation.navigate('CreateProfile')
    }

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
export default SignUpScreen;
