import React from 'react'
import PropTypes from 'prop-types'

import EventList from './eventList'

const EventListScreen = () => <EventList />

EventListScreen.navigationOptions = () => ({
  header: null,
})

EventListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default EventListScreen