import React from "react";
import { StyleSheet, View } from "react-native";

const EventListBlock = (props) => {
  return <View {...props} style={styles.block} />;
};

const styles = StyleSheet.create({
  block: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
});

export default EventListBlock;