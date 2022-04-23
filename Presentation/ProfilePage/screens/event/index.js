import React from 'react'
import PropTypes from 'prop-types'

import eventData from './event.json'

import { NavAbsolute } from '../../components'
import Product from './Event'

const ProductScreen = (props) => {
  props.navigation.setOptions({
    header: ({ navigation }) => (
        <NavAbsolute
          navigation={navigation}
          title={eventData.title}
          subTitle={eventData.address}
        />
    ),
  })

  return <Product {...eventData} {...props}/>
}

export default ProductScreen