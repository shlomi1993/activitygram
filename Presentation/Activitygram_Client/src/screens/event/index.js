import React from 'react'
import PropTypes from 'prop-types'

import eventData from './event.json'

import { NavAbsolute } from '../../Nav'
import Event from './Event'

const EventScreen = (props) => {
    props.navigation.setOptions({
        header: ({ navigation }) => ( <
            NavAbsolute navigation = { navigation }
            title = { eventData.name }
            subTitle = { eventData.date }
            />
        ),
    })

    return <Event {...eventData } {...props }
    />
}

export default EventScreen