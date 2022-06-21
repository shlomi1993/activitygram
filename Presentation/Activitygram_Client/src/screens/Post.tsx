import React, { useEffect, useLayoutEffect, useState, useRef, useContext } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Image, Text, Input, Button, Switch, Modal } from '../components';
import { BASE_URL } from '../constants/appConstants';

import { TextInput } from 'react-native-paper';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import * as ImagePicker from 'expo-image-picker'
import Toast from 'react-native-toast-message'

function isIn(obj: any, arr: any[]) {
  for (const element of arr) {
    if (element === obj) {
      return true;
    }
  }
  return false;
}

async function sendNewActivity(params: object) {
  // let formBodyArray = [];
  // for (var property in params) {
  //   var encodedKey = encodeURIComponent(property);
  //   var encodedValue = encodeURIComponent(params[property]);
  //   formBodyArray.push(encodedKey + '=' + encodedValue);
  // }
  // let formBody = formBodyArray.join('&');
  fetch(BASE_URL + 'createActivity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: encodeURIComponent(JSON.stringify(params))
  })
    .then((res) => {
      console.log(`New activity sent to ${BASE_URL}/createActivity`);
    })
    .catch((err) => {
      console.log(`Error: could not reach ${BASE_URL}/createActivity`);
    });
}

const Form = () => {

  // Theme & Context
  const navigation = useNavigation();
  const { assets, colors, sizes, gradients } = useTheme();
  const { user } = useData();
  const { t } = useTranslation();


  // Category Modal
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Title
  const [title, setTitle] = useState('')

  // Start Date and Time
  const startDateFocus = useRef();
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState('')
  const startTimeFocus = useRef();
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState('')
  const [startTimeDisable, setStartTimeDisable] = useState(true)
  const [startDateError, setStartDateError] = useState(false)
  const [startTimeError, setStartTimeError] = useState(false)

  // End Date and Time
  const endDateFocus = useRef();
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [endDate, setEndDate] = useState('')
  const endTimeFocus = useRef();
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [endTime, setEndTime] = useState('')
  const [endTimeDisable, setEndTimeDisable] = useState(true)
  const [endDateError, setEndDateError] = useState(false)
  const [endTimeError, setEndTimeError] = useState(false)

  // Recurrent
  const [recurrentSwitch, setRecurrentSwitch] = useState(false);

  // Location
  const [geolocationError, setGeolocationError] = useState(false);
  const [geolocation, setGeolocation] = useState(null);
  const [geolocationInput, setGeolocationInput] = useState('');

  // Description
  const [description, setDescription] = useState('');

  // Images
  const [imageButtonText1, setImageButtonText1] = useState(t('Post.AddImage'));
  const [imageButtonText2, setImageButtonText2] = useState(t('Post.AddImage'));
  const [imageButtonText3, setImageButtonText3] = useState(t('Post.AddImage'));
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);

  // Participants and Managers
  const [users, setUsers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showManagersModal, setShowManagersModal] = useState(false);
  const [participantsLimit, setParticipantsLimit] = useState(99999);

  // Fetch categories for Category Modal
  useEffect(() => {
    fetch(BASE_URL + 'allInterests')
      .then((result) => result.json())
      .then((json) => {
        setCategories(json);
      })
      .catch(() => setCategories([]));
    fetch(BASE_URL + 'allUsers')
      .then((result) => result.json())
      .then((json) => {
        for (const u of json) {
          u.title = u.title.slice(0, 40) + '...'
        }
        setUsers(json)
      })
      .catch(() => {
        console.error('Could not fetch users from DB.');
        setUsers([]);
      });
  }, []);

  // Creates Date object out of date and time strings (or null).
  const createDateObject = (date: string, time: string) => {
    try {
      let dateArray = date.split(', ')[1].split('.');
      let timeArray = time.split(':');
      let sY = Number(dateArray[2]);
      let sM = Number(dateArray[1]) - 1;
      let sD = Number(dateArray[0]);
      let sh = Number(timeArray[0]);
      let sm = Number(timeArray[1]);
      return new Date(sY, sM, sD, sh, sm);
    } catch (e) {
      return null;
    }
  }

  // Start Date Confirm
  const handleStartDateConfirm = (date: Date) => {
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

  // Start Time Confirm
  const handleStartTimeConfirm = (time: string) => {
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

  // End Date Confirm
  const handleEndDateConfirm = (date: Date) => {
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

  // End Time Confirm
  const handleEndTimeConfirm = (time: string) => {
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

  // Geocoding address to latitude and longitude
  async function geocode(address: string) {
    try {
      let res = await fetch(BASE_URL + `geocode?address=${address}`)
      let json = await res.json();
      setGeolocationError(false)
      setGeolocation({
        'address': address,
        'latitude': json.latitude,
        'longitude': json.longitude
      });
    } catch (error) {
      setGeolocation({
        'address': address,
        'latitude': 'unknown',
        'longitude': 'unknown'
      })
      setGeolocationError(true);
    }
  }

  // Image handler
  const chooseImage = (imageNumber: Number) => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    }).then((data) => {
      if (!data.cancelled) {
        if (imageNumber == 1) {
          setImage1(data);
          setImageButtonText1(t('Post.Change'))
        } else if (imageNumber == 2) {
          setImage2(data);
          setImageButtonText2(t('Post.Change'))
        } else if (imageNumber == 3) {
          setImage3(data);
          setImageButtonText3(t('Post.Change'))
        }
      }
    });
  }

  // Image remover
  const removeImage = (imageNumber: Number) => {
    if (imageNumber == 1) {
      setImage1(null);
      setImageButtonText1(t('Post.AddImage'))
    } else if (imageNumber == 2) {
      setImage2(null);
      setImageButtonText2(t('Post.AddImage'))
    } else if (imageNumber == 3) {
      setImage3(null);
      setImageButtonText3(t('Post.AddImage'))
    }
  }

  // Validate inputs
  const validateInputs = (params: object) => {
    let missing = []
    if (!params['category'] || params['category'] === '') {
      missing.push(t('Post.Category'));
    }
    if (!params['title'] || params['title'] === '') {
      missing.push(t('Post.ActivityTitle'));
    }
    if (!params['startDateTime']) {
      missing.push(t('Post.StartDate'));
      missing.push(t('Post.StartTime'));
    } else {
      if (!params['endDateTime'] || params['endDateTime'] < params['startDateTime']) {
        params['endDateTime'] = new Date(params['startDateTime'].getTime());
      }
    }
    // if (!params['geolocation'] || params['geolocation'] === '') {
    //   missing.push(t('Post.Location'));
    // }
    if (!params['description'] || params['description'] === '') {
      missing.push(t('Post.Description'));
    }
    // Insert here more tests...
    return missing
  }

  // Create a new activity instance in the DB
  const create = () => {
    let images = []
    if (image1) images.push(image1['base64'])
    if (image2) images.push(image2['base64'])
    if (image3) images.push(image3['base64'])
    let participants = [user._id.toString()]
    for (const p of selectedParticipants) {
      participants.push(p.id)
    }
    let managers = [user._id.toString()]
    for (const m of selectedManagers) {
      managers.push(m.id)
    }
    let params = {
      initiator: user._id.toString(),
      category: selectedCategory,
      title: title,
      startDateTime: createDateObject(startDate, startTime),
      endDateTime: createDateObject(endDate, endTime),
      recurrent: recurrentSwitch.toString(),
      geolocation: geolocation,
      description: description,
      imagesBase64: images,
      managers: managers,
      participants: participants,
      status: 'open'
    }
    let missing = validateInputs(params);
    if (missing.length == 0) {
      sendNewActivity(params);
      // navigation.navigate('PostSuccess');
      console.warn('Navigate to success.') // what about failure?
    } else {
      Toast.show({
        type: 'error',
        text1: t('Post.TryAgain'),
        text2: missing.join(', ')
      });
    }

  }

  // console.log(user)

  // Rendering
  return (

    <Block color={colors.card} paddingTop={sizes.m} paddingHorizontal={sizes.padding}>

      <Text p semibold marginBottom={sizes.sm}>{t('Post.PleaseFill')}</Text>

      <Block>

        <Block row marginBottom={sizes.sm}>
          <Image style={{ width: 60, height: 60 }} source={{ uri: user.profileImage }} marginRight={sizes.sm} />
          <Text p semibold marginTop={sizes.sm} align='center'>{user.username}</Text>
        </Block>

        <Block marginBottom={sizes.xs}>
          <Text p semibold>{t('Post.SelectCategory')}</Text>
        </Block>
        <AutocompleteDropdown closeOnBlur={true} closeOnSubmit={false} dataSet={categories} clearOnFocus={true}
          direction={'down'} onSelectItem={(category) => {
            if (category && category.title) {
              setSelectedCategory(category.title);
            }
          }} />

        <Block marginBottom={sizes.sm} marginTop={sizes.sm}>
          <TextInput label={t('Post.ActivityTitle')} mode='outlined' autoComplete={false}
            activeOutlineColor={colors.info} onChangeText={(newText) => { setTitle(newText) }} />
        </Block>

        <Block row marginBottom={sizes.sm}>

          <Block marginRight={sizes.sm / 2}>
            <TextInput label={t('Post.StartDate')} mode='outlined' value={startDate} error={startDateError}
              autoComplete={false} showSoftInputOnFocus={false} ref={startDateFocus} activeOutlineColor={colors.info}
              onFocus={() => { setStartDatePickerVisibility(true); startDateFocus.current.blur(); }}
            />
          </Block>

          <Block marginLeft={sizes.sm / 2}>
            <TextInput label={t('Post.StartTime')} mode='outlined' value={startTime} error={startTimeError}
              autoComplete={false} showSoftInputOnFocus={false} ref={startTimeFocus} activeOutlineColor={colors.info}
              disabled={startTimeDisable}
              onFocus={() => { setStartTimePickerVisibility(true); startTimeFocus.current.blur(); }} />
          </Block>

          <DateTimePickerModal isVisible={isStartDatePickerVisible} mode="date" onConfirm={handleStartDateConfirm}
            onCancel={() => setStartDatePickerVisibility(false)} />

          <DateTimePickerModal isVisible={isStartTimePickerVisible} mode="time" onConfirm={handleStartTimeConfirm}
            onCancel={() => setStartTimePickerVisibility(false)} />

        </Block>

        <Block row marginBottom={sizes.sm}>

          <Block marginRight={sizes.sm / 2}>
            <TextInput label={t('Post.EndDate')} mode='outlined' value={endDate} error={endDateError}
              autoComplete={false} showSoftInputOnFocus={false} ref={endDateFocus} activeOutlineColor={colors.info}
              onFocus={() => { setEndDatePickerVisibility(true); endDateFocus.current.blur(); }} />
          </Block>

          <Block marginLeft={sizes.sm / 2}>
            <TextInput label={t('Post.EndTime')} mode='outlined' value={endTime} error={endTimeError}
              autoComplete={false} showSoftInputOnFocus={false} ref={endTimeFocus} activeOutlineColor={colors.info}
              disabled={endTimeDisable}
              onFocus={() => { setEndTimePickerVisibility(true); endTimeFocus.current.blur(); }} />
          </Block>

          <DateTimePickerModal isVisible={isEndDatePickerVisible} mode="date" onConfirm={handleEndDateConfirm}
            onCancel={() => setEndDatePickerVisibility(false)} />

          <DateTimePickerModal isVisible={isEndTimePickerVisible} mode="time" onConfirm={handleEndTimeConfirm}
            onCancel={() => setEndTimePickerVisibility(false)} />

        </Block>

        <Block row flex={0} align="center" justify="space-between" marginBottom={sizes.s}>
          <Text>{t('Post.Recurrent')}</Text>
          <Block row flex={0}>
            <Text>{recurrentSwitch ? t('Post.RecurrentYes') : t('Post.RecurrentNo')}</Text>
            <Switch checked={recurrentSwitch} onPress={(checked) => setRecurrentSwitch(checked)} />
          </Block>

        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label={t('Post.Location')} mode='outlined' error={geolocationError} autoComplete={false}
            activeOutlineColor={colors.info} onEndEditing={() => geocode(geolocationInput)}
            onChangeText={(newText) => setGeolocationInput(newText)} />
        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label={t('Post.Description')} mode='outlined' autoComplete={false} multiline={true}
            numberOfLines={7} activeOutlineColor={colors.info}
            onChangeText={(newText) => { setDescription(newText) }} />
        </Block>

        <Block row marginBottom={sizes.s} align='center'>
          <Block>
            {image1 && (<Block align='flex-start' marginRight={sizes.xs}>
              <Image source={{ uri: image1.uri }}
                style={{ width: 100, height: 100, borderColor: 'black', borderWidth: 1 }} />
            </Block>)}
          </Block>

          <Block>
            {image2 && (<Block align='center' marginHorizontal={sizes.xs}>
              <Image source={{ uri: image2.uri }}
                style={{ width: 100, height: 100, borderColor: 'black', borderWidth: 1 }} />
            </Block>)}
          </Block>

          <Block>
            {image3 && (<Block align='flex-end' marginLeft={sizes.xs}>
              <Image source={{ uri: image3.uri }}
                style={{ width: 100, height: 100, borderColor: 'black', borderWidth: 1 }} />
            </Block>)}
          </Block>

        </Block>
        <Block row marginBottom={sizes.sm}>
          <Block marginRight={sizes.xs}>
            <Button flex={1} gradient={gradients.dark}
              onPress={() => chooseImage(1)} onLongPress={() => removeImage(1)}>
              <Text white bold>{imageButtonText1}</Text>
            </Button>
          </Block>
          <Block marginHorizontal={sizes.xs}>
            <Button flex={1} gradient={gradients.dark}
              onPress={() => chooseImage(2)} onLongPress={() => removeImage(2)}>
              <Text white bold>{imageButtonText2}</Text>
            </Button>
          </Block>
          <Block marginLeft={sizes.xs}>
            <Button flex={1} gradient={gradients.dark}
              onPress={() => chooseImage(3)} onLongPress={() => removeImage(3)}>
              <Text white bold>{imageButtonText3}</Text>
            </Button>
          </Block>
        </Block>

        <Block row justify='space-between' marginBottom={sizes.sm}>
          <Text p semibold marginTop={sizes.s}>{t('Post.NumberOfParticipants')}</Text>
          <Block marginLeft={sizes.m}>
            <Input keyboardType='numeric' onChangeText={(text) => {
              let n = parseInt(text)
              console.log(!isNaN(n))
              if (!isNaN(n) && n > 0) {
                setParticipantsLimit(n);
              }
            }} />
          </Block>
        </Block>

        <Block marginBottom={sizes.sm}>
          <Text p semibold>{t('Post.SelectParticipant')}</Text>
        </Block>
        <AutocompleteDropdown closeOnBlur={true} closeOnSubmit={false} dataSet={users} clearOnFocus={true}
          direction={'up'} onSelectItem={(user) => {
            if (user) {
              if (selectedParticipants.length < participantsLimit) {
                let array = selectedParticipants;
                if (!isIn(user, array)) {
                  array.push(user);
                  setSelectedParticipants(array);
                } else {
                  Toast.show({
                    type: 'error',
                    text1: t('Post.UserIncluded')
                  })
                }
              } else {
                Toast.show({
                  type: 'error',
                  text1: t('Post.LimitExceeded')
                })
              }

            }
          }} />
        <Block marginBottom={sizes.sm} marginTop={sizes.sm}>
          <Button row gradient={gradients.dark} onPress={() => setShowParticipantsModal(true)}>
            <Block align="center" paddingHorizontal={sizes.sm}>
              <Text white bold marginRight={sizes.sm}>Participants List</Text>
            </Block>
          </Button>
          <Modal visible={showParticipantsModal} onRequestClose={() => setShowParticipantsModal(false)}>
            <FlatList keyExtractor={(index) => `${index}`} data={selectedParticipants} renderItem={({ item }) => (
              <Button marginBottom={sizes.sm} onPress={() => {
                console.warn('DISPLAY USER PROFILE...')
                // navigation.navigate('')
              }}>
                <Text p white semibold transform="uppercase">{item.title}</Text>
              </Button>
            )}
            />
          </Modal>
        </Block>

        <Block marginBottom={sizes.sm}>
          <Text p semibold>{t('Post.SelectManagers')}</Text>
        </Block>
        <AutocompleteDropdown closeOnBlur={true} closeOnSubmit={false} dataSet={selectedParticipants}
          direction={'up'} onSelectItem={(user) => {
            if (user) {
              let array = selectedManagers;
              if (!isIn(user, array)) {
                array.push(user);
                setSelectedManagers(array);
              } else {
                Toast.show({
                  type: 'error',
                  text1: t('Post.ManagerIncluded')
                })
              }
            }
          }} />
        <Block marginBottom={sizes.sm} marginTop={sizes.sm}>
          <Button row gradient={gradients.dark} onPress={() => setShowManagersModal(true)}>
            <Block align="center" paddingHorizontal={sizes.sm}>
              <Text white bold marginRight={sizes.sm}>Managers List</Text>
            </Block>
          </Button>
          <Modal visible={showManagersModal} onRequestClose={() => setShowManagersModal(false)}>
            <FlatList keyExtractor={(index) => `${index}`} data={selectedManagers} renderItem={({ item }) => (
              <Button marginBottom={sizes.sm} onPress={() => {
                console.warn('DISPLAY MANAGER PROFILE...')
                // navigation.navigate('')
              }}>
                <Text p white semibold transform="uppercase">{item.title}</Text>
              </Button>
            )}
            />
          </Modal>
        </Block>


        <Block marginBottom={sizes.sm}></Block>

      </Block>

      <Block>
        <Button flex={1} gradient={gradients.primary} marginBottom={sizes.base} onPress={create}>
          <Text white bold transform="uppercase">{t('Post.Create')}</Text>
        </Button>
      </Block>

      <Toast position='bottom' bottomOffset={80} onPress={() => Toast.hide()} />

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
        <Image radius={0} resizeMode="cover" width={sizes.width} height={headerHeight} source={assets.background} />
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
