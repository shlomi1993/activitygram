import React from 'react'
import { SafeAreaView, View } from 'react-native'

import { Nav } from '../../Nav'

const Options = (props) => {
  props.navigation.setOptions({
    header: ({navigation}) => (
      <SafeAreaView>
        <Nav title="Search" navigation={navigation} />
      </SafeAreaView>
    ),
  })

  return <View {...props} />
}

export default Options