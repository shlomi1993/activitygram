import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ListItem, Avatar, Card, Image, Button, SearchBar, Header } from "react-native-elements";
import Icon from "react-native-vector-icons/dist/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";


class JoinEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Card containerStyle={{width: "100%", height: "100%"}} wrapperStyle={{}}>
          <Card.Title style={{fontSize: 24}}>Discover</Card.Title>
          <Card.Divider />
          <View
            style={{
              position: "relative",
              alignItems: "center"
            }}
          >
          <SearchBar
            platform="default"
            containerStyle={{width: "100%", marginBottom: 10}}
            inputContainerStyle={{}}
            inputStyle={{}}
            leftIconContainerStyle={{}}
            rightIconContainerStyle={{}}
            loadingProps={{}}
            onChangeText={(newVal) => this.setState({value: newVal})}
            onClearText={() => console.log(onClearText())}
            placeholder="Type query here..."
            placeholderTextColor="#888"
            cancelButtonTitle="Cancel"
            cancelButtonProps={{}}
            onCancel={() => console.log(onCancel())}
            value={this.state.value}
          />
          <Button buttonStyle={{ width: 150 }}
            containerStyle={{ margin: 5, borderWidth: 2 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F"
            }}
            disabledTitleStyle={{ color: "#00F" }}
            linearGradientProps={null}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => alert("click")}
            title="Sport"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
            type="outline">
          </Button>
          <Button buttonStyle={{ width: 150 }}
            containerStyle={{ margin: 5, borderWidth: 2 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F"
            }}
            disabledTitleStyle={{ color: "#00F" }}
            linearGradientProps={null}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => alert("click")}
            title="Lecture"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
            type="outline">
          </Button>
          <Button buttonStyle={{ width: 150 }}
            containerStyle={{ margin: 5, borderWidth: 2 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F"
            }}
            disabledTitleStyle={{ color: "#00F" }}
            linearGradientProps={null}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => alert("click")}
            title="Party"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
            type="outline">
          </Button>
          <Button buttonStyle={{ width: 150 }}
            containerStyle={{ margin: 5, borderWidth: 2 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F"
            }}
            disabledTitleStyle={{ color: "#00F" }}
            linearGradientProps={null}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => alert("click")}
            title="Other"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
            type="outline">
          </Button>
      </View>
    </Card>

          
        </View>
    );
  }

}

export default JoinEvent;
