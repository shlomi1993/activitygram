import * as React from "react";
// import * as firebase from "firebase";
import {
  Container,
  Content,
  Header,
  Form,
  Input,
  Item,
  Button,
  Label,
  Text,
} from "native-base";
import DialogInput from "react-native-dialog-input";

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isDialogVisible: false,
    };
  }

  signUpUser = (email, password) => {
    try {
     if(this.state.password.length<6)
     {
      alert("Please enter at least 6 characters")
      return;
     }
//      firebase.auth().createUserWithEmailAndPassword(ema
//    il, password)
      alert("Congratulations, your account has been setup")
    }
    catch(error){
     console.log(error.toString())
    }
   }

   loginUser = (email, password) => {
    try {
//      firebase.auth().signInWithEmailAndPassword(email,
//    password).then((user) =>{
     Alert.alert(
      "Signed In",
      "You have signed in. Well done!",
      [
       {text: "Sign Out", onPress: this.signOutUser},
      ],
      { cancelable: false }
     )
    // })
   }
    catch(error) {
     console.log(error.toString())
    }
   }

   signOutUser = () => {
    // firebase.auth().signOut().then(function (user){
    // }).catch(function(error) {
    //  console.log(error)
    // });
   }

   forgotPassword = () => {
    this.setState({
     isDialogVisible: this.state.isDialogVisible = true
    })
   }

   sendReset = (useremail) => {
//     var auth = firebase.auth();
//     auth.sendPasswordResetEmail(useremail).then(function()
//    {
//      alert("Password reset email has been sent")
//     }).catch(function(error) {
//      console.log(error)
//     });
   }

  render() {
      return (
    <React.Fragment>
        {/* <Container>
          <Text >Login Page</Text>
          <Form>
            <Item>
              <Label>Email</Label>
    onChangeText={(email) =>this.setState({ email })}
              <Input autocorrect={false}  />
            </Item>
            <Item>
              <Label>Password</Label>
    onChangeText={(password) => this.setState({ password })}
              <Input secureTextEntry={true}  />
            </Item>
            <Button style={{ marginTop: 10 }} primary full rounded   onPress={() => this.loginUser(this.state.email, this.state.
      password)}>
              <Text style={{ color: "white" }}>Login</Text>
            </Button>
            <Button style={{ marginTop: 10 }} success full rounded     onPress={() => this.signUpUser(this.state.email, this.state.
      password)}>
              <Text style={{ color: "white" }}>Sign Up</Text>
            </Button>
            <Button style={{ marginTop: 10 }} warning full rounded onPress={() => this.forgotPassword()}>
              <Text style={{ color: "white" }}>Forgot Password</Text>
            </Button>
          </Form>
          <DialogInput isDialogVisible={this.state.
  isDialogVisible}
        title={"Forgot Password"}
        message={"Please input your email address"}
        hintInput ={"john@test.com"}
        submitInput={ (useremail) => {this.
  sendReset(useremail)} }
        closeDialog={ () => { this.setState({
        isDialogVisible: this.state.isDialogVisible = false
        })}}>
       </DialogInput>
        </Container> */}
      </React.Fragment>
      )
    }
}

export default SplashScreen;
