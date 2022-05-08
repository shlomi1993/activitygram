import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'

import EventStyles from './EventStyle'

const styles = StyleSheet.create({ ...EventStyles })

const PhotoButton = () => (
  <View style={styles.coverMetaContainer}>
    <Button
      color="white"
      title="22 Photos"
      textStyle={{
        fontSize: 16,
        fontWeight: '400',
      }}
      buttonStyle={{
        backgroundColor: 'rgba(128,128,128, 0.7)',
        borderRadius: 5,
        borderWidth: 0,
        elevation: 0,
        paddingLeft: 10,
      }}
      containerStyle={{
        marginBottom: 15,
        marginRight: 15,
        padding: 0,
      }}
    />
  </View>
)

export default PhotoButton