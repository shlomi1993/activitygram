import React, { useLayoutEffect, useState } from 'react';
import { Platform, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { IEventForm } from '../constants/types/forms';
import { useTheme } from '../hooks';
import { Block, Image, Text, Input, Button } from '../components';
import 'react-native-gesture-handler';
import Modal from '../components/Modal'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';


export const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';

async function onPressCreate(params) {
  let formBody: any;
  for (var property in params) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(params[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');
  await fetch(baseUrl + 'createActivity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
    .then((res) => {
      console.log('sent request');
    })
    .catch((err) => {
      console.log('error');
    });
}

const Form = () => {
  const { assets, colors, sizes, gradients } = useTheme();
  const [form, setForm] = useState<IEventForm>();
  const [showModal, setModal] = useState(false);
  const [quantity, setQuantity] = useState('01');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState('Start Date')

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState('Start Time')

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    Moment.locale('en');
    let newText = Moment(date).format('ddd, D.M.YYYY');
    setStartDate(newText);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    Moment.locale('en');
    let newText = Moment(time).format('HH:MM');
    setStartTime(newText);
    hideTimePicker();
  };

  return (

    <Block
      
      color={colors.card}
      paddingTop={sizes.m}
      paddingHorizontal={sizes.padding}>
      
      <Text p semibold marginBottom={sizes.s}>
        Please fill details below
      </Text>

      <Block>

        <Input placeholder="Activity Title" marginBottom={sizes.sm}
          onChangeText={(newText) => {
            setForm(prevState => ({ ...prevState, title: newText }));
          }} />
        
        <Block row marginBottom={sizes.sm}>

          <Button
            marginRight={sizes.s / 2}
            flex={1}
            row
            gradient={gradients.dark}
            onPress={showDatePicker}>
            <Block
              row
              align="center"
              justify="space-between"
              paddingHorizontal={sizes.sm}>
              <Text white marginRight={sizes.sm}>
                {startDate}
              </Text>
            </Block>
          </Button>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />

          <Button
            marginLeft={sizes.s / 2}
            flex={1}
            row
            gradient={gradients.dark}
            onPress={showTimePicker}>
            <Block
              row
              align="center"
              justify="space-between"
              paddingHorizontal={sizes.sm}>
              <Text white marginRight={sizes.sm}>
                {startTime}
              </Text>
            </Block>
          </Button>

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
          />

        </Block>




        {/* <Input placeholder="Start time" marginBottom={sizes.sm}
          onChangeText={(newText) => {
            setForm(prevState => ({ ...prevState, startTime: newText }));
          }} />
        <Input placeholder="End time" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, endTime: newText }));
        }} />
        <Input placeholder="Recurrent" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, recurrent: newText }));
        }} />
        <Input placeholder="Location" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, location: newText }));
        }} />
        <Input placeholder="Description" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, description: newText }));
        }} />
        <Input placeholder="Interests" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, interests: newText }));
        }} />
        <Input placeholder="Preconditions" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, preconditions: newText }));
        }} />
        <Input placeholder="Initiator" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, initiator: newText }));
        }} />
        <Input placeholder="Managers" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, managers: newText }));
        }} />
        <Input placeholder="Invited" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, invited: newText }));
        }} />
        <Input placeholder="Images" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, images: newText }));
        }} />
        <Input placeholder="QR" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, QR: newText }));
        }} />
        <Input placeholder="Tags" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, tags: newText }));
        }} />
        <Input placeholder="Status" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, status: newText }));
        }} /> */}
        <Block paddingHorizontal={sizes.padding}>
          <Button flex={1} gradient={gradients.info} marginBottom={sizes.base} onPress={() => {
            console.log('clicked');
            onPressCreate(form);
          }}>
            <Text white bold transform="uppercase">
              Create
            </Text>
          </Button>
        </Block>
      </Block>
    </Block >
  );
};

const Post = () => {
  const { assets, sizes } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Image
          radius={0}
          resizeMode="cover"
          width={sizes.width}
          height={headerHeight}
          source={assets.background}
        />
      ),
    });
  }, [assets.background, navigation, sizes.width, headerHeight]);

  return (
    <Block safe>
      <Block scroll>
        <Form />
      </Block>
    </Block>
  );
};

export default Post;
