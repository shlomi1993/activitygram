import React, { Component, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import { Platform } from "react-native";
import eventData from "./event.json";

import PhotoButton from "./PhotoButton";
import EventStyles from "./EventStyle";

const styles = StyleSheet.create({ ...EventStyles });

export const url = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';

async function onPressRegister() {
  await fetch(url + 'setEvent', {
    method: 'POST',
    headers: {
      Accept: 'application/json', 'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstParam: 'hi',
      secondParam: 'bye'
    })
  }).then((json) => {
    console.log('sent request')
  })
  .catch((error) => {
    console.log('error')
  });
}

function onPressContact() {}

class Event extends Component {
  static propTypes = {
    img: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  };

  static defaultProps = {
    containerStyle: {},
  };

  renderDetail = () => {
    return (
      <View>
        <Text style={styles.detailText}>About the event</Text>
        <Text style={styles.subDetailText}>{eventData.description}</Text>
      </View>
    );
  };

  renderDescription = () => {
    return (
      <View>
        <Text style={styles.priceText}>MY EVENT</Text>
        <Text style={styles.descriptionText}>Purim party</Text>
        <Text style={styles.descriptionText}>Tel Aviv, Israel</Text>
        <Text style={styles.descriptionText}>18+</Text>
      </View>
    );
  };

  renderNavigator = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={[styles.navigatorButton, { flex: 2 }]}>
          <Text style={styles.navigatorText}>DETAILS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navigatorButton, { flex: 2 }]}>
          <Text style={styles.navigatorText}>PARTICIPENTS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navigatorButton, { flex: 1 }]}>
          <Text style={styles.navigatorText}>MAP</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderContactHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.coverContainer}>
          <ImageBackground
            source={{ uri: this.props.img }}
            style={styles.coverImage}
          >
            <PhotoButton />
          </ImageBackground>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.mainViewStyle}>
        <ScrollView style={styles.scroll}>
          <View style={[styles.container, this.props.containerStyle]}>
            <View style={styles.cardContainer}>
              {this.renderContactHeader()}
            </View>
          </View>
          <View style={styles.eventRow}>{this.renderDescription()}</View>
          <View style={styles.eventRow}>{this.renderNavigator()}</View>
          <View style={styles.eventRow}>{this.renderDetail()}</View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.buttonFooter}
            onPress={()=>{onPressRegister()}}
          >
            <Text style={styles.textFooter}>REGISTER</Text>
          </TouchableOpacity>
          <View style={styles.borderCenter} />
          <TouchableOpacity
            style={styles.buttonFooter}
            onPress={onPressContact()}
          >
            <Text style={styles.textFooter}>CONTACT US</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Event;
