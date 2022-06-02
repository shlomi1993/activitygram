import React from 'react'
import PropTypes from 'prop-types'
import { SafeAreaView } from 'react-native'

import contactData from '../../mocks/contact.json'

import { Nav } from '../../Nav'
import Create from './Create'

const CreateScreen = (props) => {
  props.navigation.setOptions({
    header: ({navigation}) => (
      <SafeAreaView>
        <Nav
          title="Search"
          navigation={navigation}
          leftIcon={{
            type: 'ionicon',
            name: 'md-list',
            size: 26,
          }}
        />
      </SafeAreaView>
    ),
  })

  return <Create {...contactData} {...props} />
}

CreateScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default CreateScreen