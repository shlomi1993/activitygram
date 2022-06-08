import React, { useEffect, useLayoutEffect, useState, useRef, useContext } from 'react';
import { Platform, FlatList, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { IEventForm } from '../constants/types/forms';
import { useTheme } from '../hooks';
import { Block, Image, Text, Input, Button } from '../components';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import { TextInput } from 'react-native-paper';
import Switch from '../components/Switch'
import Modal from '../components/Modal';
import * as ImagePicker from 'expo-image-picker'
import { userContext } from '../../App'
import { useTranslation } from '../hooks';


export const baseUri = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';
const { t } = useTranslation();

function validateInputs(params: object) {
  if (!params['category'] || params['category'] === t('Post.SelectCategory')) {
    return
  }


}

async function sendNewActivity(params: object) {
  let formBodyArray = [];
  for (var property in params) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(params[property]);
    formBodyArray.push(encodedKey + '=' + encodedValue);
  }
  let formBody = formBodyArray.join('&');
  fetch(baseUri + 'createActivity', {
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

  const initiator = useContext(userContext)

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(t('Post.SelectCategory'));

  const [title, setTitle] = useState('')

  const startDateFocus = useRef();
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState('')
  const startTimeFocus = useRef();
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState('')
  const [startTimeDisable, setStartTimeDisable] = useState(true)
  const [startDateError, setStartDateError] = useState(false)
  const [startTimeError, setStartTimeError] = useState(false)

  const endDateFocus = useRef();
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [endDate, setEndDate] = useState('')
  const endTimeFocus = useRef();
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [endTime, setEndTime] = useState('')
  const [endTimeDisable, setEndTimeDisable] = useState(true)
  const [endDateError, setEndDateError] = useState(false)
  const [endTimeError, setEndTimeError] = useState(false)

  const [recurrentSwitch, setRecurrentSwitch] = useState(false);

  const [geolocationError, setGeolocationError] = useState(false);
  const [geolocation, setGeolocation] = useState(null);

  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);



  useEffect(() => {
    fetch(baseUri + `allInterests`)
      .then((result) => result.json())
      .then((json) => setCategories(json))
      .catch(() => setCategories([]));
  }, []);

  const createDateObject = (date, time) => {
    let dateArray = date.split(', ')[1].split('.')
    let timeArray = time.split(':')
    let sY = Number(dateArray[2])
    let sM = Number(dateArray[1]) - 1
    let sD = Number(dateArray[0])
    let sh = Number(timeArray[0])
    let sm = Number(timeArray[1])
    return new Date(sY, sM, sD, sh, sm)
  }

  const handleStartDateConfirm = (date) => {
    Moment.locale('en');
    if (endDate) {
      let end = createDateObject(endDate, '23:59')
      if (end < date) {
        setStartDateError(true);
        setEndDateError(true);
      } else {
        setStartDateError(false);
        setEndDateError(false);
        setStartTimeDisable(false);
      }
    } else {
      setStartTimeDisable(false);
    }
    let newText = Moment(date).format('ddd, D.M.YYYY');
    setStartDate(newText);
    setStartDatePickerVisibility(false);
  };

  const handleStartTimeConfirm = (time) => {
    Moment.locale('en');
    let newText = Moment(time).format('HH:mm');
    if (endTime) {
      let end = createDateObject(endDate, endTime);
      let start = createDateObject(startDate, newText);
      if (end < start) {
        setStartTimeError(true);
        setEndTimeError(true);
      } else {
        setStartTimeError(false);
        setEndTimeError(false);
      }
    }
    setStartTime(newText);
    setStartTimePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    if (startDate) {
      let start = createDateObject(startDate, '00:00')
      if (start > date) {
        setStartDateError(true);
        setEndDateError(true);
      } else {
        setStartDateError(false);
        setEndDateError(false);
        setEndTimeDisable(false);
      }
    } else {
      setEndTimeDisable(false);
    }
    Moment.locale('en');
    let newText = Moment(date).format('ddd, D.M.YYYY');
    setEndDate(newText);
    setEndDatePickerVisibility(false);
  };

  const handleEndTimeConfirm = (time) => {
    Moment.locale('en');
    let newText = Moment(time).format('HH:mm');
    if (startTime) {
      let end = createDateObject(endDate, newText);
      let start = createDateObject(startDate, endTime);
      if (end < start) {
        setStartTimeError(true);
        setEndTimeError(true);
      } else {
        setStartTimeError(false);
        setEndTimeError(false);
      }
    }
    setEndTime(newText);
    setEndTimePickerVisibility(false);
  };

  async function geocode(address: string) {
    try {
      let res = await fetch(baseUri + `geocode?address=${address}`)
      let json = await res.json();
      setGeolocationError(false)
      setGeolocation({
        'address': address,
        'latitude': json.latitude,
        'longitude': json.longitude
      });
    } catch (error) {
      setGeolocation(null)
      setGeolocationError(true);
    }
  }

  const handleChoosePhoto = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    }).then((data) => {
      // console.log('chosen:', data)
      setPhoto(data);
    });
  }

  return (

    <Block

      color={colors.card}
      paddingTop={sizes.m}
      paddingHorizontal={sizes.padding}>

      <Text p semibold marginBottom={sizes.sm}>{t('Post.PleaseFill')}</Text>

      <Block>

        <Block marginBottom={sizes.sm}>
          <Input value={initiator.uid} editable={false} disabled />
        </Block>

        <Block marginBottom={sizes.sm} marginTop={sizes.xs}>
          <Button row gradient={gradients.dark} onPress={() => setShowCategoryModal(true)}>
            <Block row align="center" justify="space-between" paddingHorizontal={sizes.sm}>
              <Text white bold marginRight={sizes.sm}>{selectedCategory}</Text>
              <Image source={assets.arrow} color={colors.white} transform={[{ rotate: '90deg' }]} />
            </Block>
          </Button>
          <Modal visible={showCategoryModal} onRequestClose={() => setShowCategoryModal(false)}>
            <FlatList keyExtractor={(index) => `${index}`}
              data={categories}
              renderItem={({ item }) => (
                <Button
                  marginBottom={sizes.sm}
                  onPress={() => {
                    setSelectedCategory(item);
                    setShowCategoryModal(false);
                  }}>
                  <Text p white semibold transform="uppercase">{item}</Text>
                </Button>
              )}
            />
          </Modal>
        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label={t('Post.ActivityTitle')} mode='outlined' autoComplete={false}
            onChangeText={(newText) => { setTitle(newText) }} />
        </Block>

        <Block row marginBottom={sizes.sm}>

          <Block marginRight={sizes.sm / 2}>
            <TextInput label='Start date' mode='outlined' value={startDate} error={startDateError} autoComplete={false}
              showSoftInputOnFocus={false} ref={startDateFocus}
              onFocus={() => { setStartDatePickerVisibility(true); startDateFocus.current.blur(); }}
            />
          </Block>

          <Block marginLeft={sizes.sm / 2}>
            <TextInput label='Start time' mode='outlined' value={startTime} error={startTimeError} autoComplete={false}
              showSoftInputOnFocus={false} ref={startTimeFocus} disabled={startTimeDisable}
              onFocus={() => { setStartTimePickerVisibility(true); startTimeFocus.current.blur(); }} />
          </Block>

          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={() => setStartDatePickerVisibility(false)}
          />

          <DateTimePickerModal
            isVisible={isStartTimePickerVisible}
            mode="time"
            onConfirm={handleStartTimeConfirm}
            onCancel={() => setStartTimePickerVisibility(false)}
          />

        </Block>

        <Block row marginBottom={sizes.sm}>

          <Block marginRight={sizes.sm / 2}>
            <TextInput label='End date' mode='outlined' value={endDate} error={endDateError} autoComplete={false}
              showSoftInputOnFocus={false} ref={endDateFocus}
              onFocus={() => { setEndDatePickerVisibility(true); endDateFocus.current.blur(); }} />
          </Block>

          <Block marginLeft={sizes.sm / 2}>
            <TextInput label='End time' mode='outlined' value={endTime} error={endTimeError} autoComplete={false}
              showSoftInputOnFocus={false} ref={endTimeFocus} disabled={endTimeDisable}
              onFocus={() => { setEndTimePickerVisibility(true); endTimeFocus.current.blur(); }} />
          </Block>

          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={() => setEndDatePickerVisibility(false)}
          />

          <DateTimePickerModal
            isVisible={isEndTimePickerVisible}
            mode="time"
            onConfirm={handleEndTimeConfirm}
            onCancel={() => setEndTimePickerVisibility(false)}
          />

        </Block>

        <Block row flex={0} align="center" justify="space-between" marginBottom={sizes.s}>
          <Text>Recurrent:</Text>
          <Block row flex={0}>
            <Text>{recurrentSwitch ? 'Yes   ' : 'No    '}</Text>
            <Switch checked={recurrentSwitch} onPress={(checked) => setRecurrentSwitch(checked)} />
          </Block>

        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label='Location' mode='outlined' error={geolocationError} autoComplete={false}
            onChangeText={(newText) => { geocode(newText) }} />
        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label='Description' mode='outlined' autoComplete={false} multiline={true} numberOfLines={7}
            onChangeText={(newText) => { setDescription(newText) }} />
        </Block>

        <Block>
          {photo && (<Image source={{ uri: photo.uri }} style={{ width: 100, height: 100 }} />)}
          <Block row paddingHorizontal={sizes.xs}>
            <Button flex={1} gradient={gradients.dark} marginBottom={sizes.base}
              onPress={() => { handleChoosePhoto(); }}>
              <Text white bold>Choose Photo</Text>
            </Button>
          </Block>
        </Block>


        {/* <Input placeholder="Preconditions" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, preconditions: newText }));
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
        <Input placeholder="Status" marginBottom={sizes.sm} onChangeText={(newText) => {
          setForm(prevState => ({ ...prevState, status: newText }));
        }} /> */}

        <Block>
          <Button flex={1} gradient={gradients.primary} marginBottom={sizes.base} onPress={() => {
            if (validateInputs) {
              sendNewActivity({
                initiator: initiator.uid,
                category: selectedCategory,
                title: title,
                startDateTime: createDateObject(startDate, startTime),
                endDateTime: createDateObject(endDate, endTime),
                recurrent: recurrentSwitch.toString(),
                geolocation: geolocation,
                description: description
              });
            } else {
              console.warn('some error')
            }

          }}>
            <Text white bold transform="uppercase">Create</Text>
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
