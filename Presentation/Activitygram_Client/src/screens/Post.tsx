import React, { useEffect, useLayoutEffect, useState, useRef, useContext } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import _ from 'lodash';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Image, Text, Input, Button, Switch, Modal } from '../components';
import { BASE_URL } from '../constants/appConstants';
import { IActivity } from '../constants/types';

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

// Creates Date object out of date and time strings (or null).
function createDateObject(date: string, time: string) {
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

// Validate inputs
function validateInputs(a: IActivity, t: any) {
  let missing = []
  if (!a.category || a.category === '') {
    missing.push(t('Post.Category'));
  }
  if (!a.title || a.title === '') {
    missing.push(t('Post.ActivityTitle'));
  }
  if (!a.startDateTime) {
    missing.push(t('Post.StartDate'));
    missing.push(t('Post.StartTime'));
  } else {
    if (!a.endDateTime || a.endDateTime < a.startDateTime) {
      a.endDateTime = new Date(a.startDateTime.getTime());
    }
  }
  // if (!params['geolocation'] || params['geolocation'] === '') { // Disabled due to Geocoder provider issues.
  //   missing.push(t('Post.Location'));
  // }
  if (!a.description || a.description === '') {
    missing.push(t('Post.Description'));
  }
  // Insert here more tests...
  return missing
}

const Form = () => {

  // Theme & Context
  const navigation = useNavigation();
  const { colors, sizes, gradients } = useTheme();
  const { t } = useTranslation();
  const { user } = useData();

  // Build Activity object
  const [activity, setActivity] = useState<IActivity>({})

  // Category Modal
  const [categories, setCategories] = useState([]);

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

  // Location
  const [geolocationError, setGeolocationError] = useState(false);
  const [geolocationInput, setGeolocationInput] = useState('');

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

  // Result modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  // Fetch categories for Category AutocompleteDropdown
  useEffect(() => {
    fetch(BASE_URL + 'allInterests')
      .then((result) => result.json())
      .then((json) => {
        setCategories(json);
      })
      .catch(() => setCategories([]));
  }, []);

  // Fetch categories for Participants and Managers AutocompleteDropdowns
  useEffect(() => {
    fetch(BASE_URL + 'allUsers')
      .then((result) => result.json())
      .then((json) => {
        let array = []
        for (const u of json) {
          let myUid = user._id.toString();
          if (u.id !== myUid) {
            if (u.title.length > 40) {
              u.title = u.title.slice(0, 40) + '...'
            }
            array.push(u)
          }
        }
        setUsers(array);
      })
      .catch(() => {
        console.error('Could not fetch users from DB.');
        setUsers([]);
      });
  }, []);

  useEffect(() => {
    if (user && _.isEmpty(activity)) {
      initActivity();
    }
  })

  // Initialize Activity object
  const initActivity = () => {
    let uid = user._id.toString();
    let fullName = user.firstName + ' ' + user.lastName;
    setActivity({
      ...activity,
      initiator: [uid, fullName],
      participants: [uid],
      participantLimit: 1000,
      managers: [uid],
      images: [],
      status: 'open'
    });
    let userItem = {
      id: uid,
      title: user.firstName + ' ' + user.lastName + ' (' + t('Post.Yourself') + ')'
    }
    setSelectedParticipants([userItem])
    setSelectedManagers([userItem])
  }
  useEffect(() => {
    initActivity()
  }, []);

  // Clear form
  const clearForm = () => {
    setStartDatePickerVisibility(false);
    setStartDate('');
    setStartTimePickerVisibility(false);
    setStartTime('');
    setStartTimeDisable(true);
    setStartDateError(false);
    setStartTimeError(false);
    setEndDatePickerVisibility(false);
    setEndDate('');
    setEndTimePickerVisibility(false);
    setEndTime('');
    setEndTimeDisable(true);
    setEndDateError(false);
    setEndTimeError(false);
    setGeolocationError(false);
    setGeolocationInput('');
    setImageButtonText1(t('Post.AddImage'));
    setImageButtonText2(t('Post.AddImage'));
    setImageButtonText3(t('Post.AddImage'));
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setShowParticipantsModal(false);
    setShowManagersModal(false);
    setShowSuccessModal(false);
    setShowFailureModal(false);
    setActivity({})
    initActivity();
    navigation.goBack();
  }

  // Select Category
  const handleSelectCategory = (category: any) => {
    if (category && category.title) {
      setActivity({ ...activity, category: category.title })
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
    let sdt = createDateObject(startDate, newText);
    setActivity({ ...activity, startDateTime: sdt });
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
    let edt = createDateObject(endDate, newText);
    setActivity({ ...activity, endDateTime: edt });
  };

  // Geocoding address to latitude and longitude
  async function geocode(address: string) {
    let location = {}
    try {
      let res = await fetch(BASE_URL + `geocode?address=${address}`)
      let json = await res.json();
      location = {
        address: address,
        latitude: json.latitude,
        longitude: json.longitude
      };
      setGeolocationError(false)
    } catch (error) {
      location = {
        address: address,
        latitude: 'unknown',
        longitude: 'unknown'
      }
      setGeolocationError(true);
    }
    setActivity({ ...activity, geolocation: location });
  }

  // Image handler
  const chooseImage = (imageNumber: number) => {
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
  const removeImage = (imageNumber: number) => {
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

  // Handle set participant limit
  const handleSetLimit = (text) => {
    let n = parseInt(text)
    if (!isNaN(n) && n > 0) {
      setActivity({ ...activity, participantLimit: n });
    }
  }

  // Handle select participant
  const handleSelectParticipant = (user: any) => {
    if (user) {
      if (activity.participants.length < activity.participantLimit) {
        if (!isIn(user.id, activity.participants)) {
          setActivity({ ...activity, participants: [...activity.participants, user.id] })
          setSelectedParticipants([...selectedParticipants, user])
        } else {
          Toast.show({ type: 'error', text1: t('Post.UserIncluded') })
        }
      } else {
        Toast.show({ type: 'error', text1: t('Post.LimitExceeded') })
      }
    }
  }

  // Handle select manager
  const handleSelectManager = (user: any) => {
    if (user) {
      if (!isIn(user.id, activity.managers)) {
        setActivity({ ...activity, managers: [...activity.managers, user.id] })
        setSelectedManagers([...selectedManagers, user])
      } else {
        Toast.show({
          type: 'error',
          text1: t('Post.ManagerIncluded')
        })
      }
    }
  }

  // Create a new activity instance in the DB
  const create = () => {
    let missing = validateInputs(activity, t);
    let images = [];
    if (image1) images.push(image1);
    if (image2) images.push(image2);
    if (image3) images.push(image3);
    if (missing.length == 0) {
      fetch(BASE_URL + 'createActivity?activity=' + encodeURIComponent(JSON.stringify(activity)), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: `images=${encodeURIComponent(JSON.stringify(images))}`
      })
        .then((res) => {
          console.log(`New activity sent to ${BASE_URL}/createActivity`);
          setShowSuccessModal(true);
        })
        .catch((err) => {
          console.log(`Error: could not reach ${BASE_URL}/createActivity`);
          setShowSuccessModal(false);
        });
    } else {
      Toast.show({
        type: 'error',
        text1: t('Post.TryAgain'),
        text2: missing.join(', ')
      });
    }
  }

  // Rendering
  return (
    <Block color={colors.card} paddingTop={sizes.m} paddingHorizontal={sizes.padding}>
      <Block row marginBottom={sizes.sm}>
        <Image
          style={{ width: 60, height: 60 }}
          source={{ uri: 'data:image/png;base64,' + user.profileImage['base64'] }}
          marginRight={sizes.sm}
        />
        <Text p semibold marginTop={sizes.sm} align='center'>
          {user.firstName}
        </Text>
      </Block>
      <Block marginBottom={sizes.xs}>
        <Text p semibold>
          {t('Post.SelectCategory')}
        </Text>
      </Block>
      <AutocompleteDropdown
        closeOnBlur={true}
        closeOnSubmit={false}
        dataSet={categories}
        clearOnFocus={true}
        direction={'down'}
        onSelectItem={handleSelectCategory}
      />
      <Block marginBottom={sizes.sm} marginTop={sizes.sm}>
        <TextInput
          label={t('Post.ActivityTitle')}
          mode='outlined'
          autoComplete={false}
          activeOutlineColor={colors.info}
          onChangeText={(title) => setActivity({ ...activity, title: title })} />
      </Block>
      <Block row marginBottom={sizes.sm}>
        <Block marginRight={sizes.sm / 2}>
          <TextInput
            label={t('Post.StartDate')}
            mode='outlined'
            value={startDate}
            error={startDateError}
            autoComplete={false}
            showSoftInputOnFocus={false}
            ref={startDateFocus}
            activeOutlineColor={colors.info}
            onFocus={() => { setStartDatePickerVisibility(true); startDateFocus.current.blur(); }}
          />
        </Block>
        <Block marginLeft={sizes.sm / 2}>
          <TextInput
            label={t('Post.StartTime')}
            mode='outlined'
            value={startTime}
            error={startTimeError}
            autoComplete={false}
            showSoftInputOnFocus={false}
            ref={startTimeFocus}
            activeOutlineColor={colors.info}
            onFocus={() => { setStartTimePickerVisibility(true); startTimeFocus.current.blur(); }}
            disabled={startTimeDisable}
          />
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
          <TextInput
            label={t('Post.EndDate')}
            mode='outlined'
            value={endDate}
            error={endDateError}
            autoComplete={false}
            showSoftInputOnFocus={false}
            ref={endDateFocus}
            activeOutlineColor={colors.info}
            onFocus={() => { setEndDatePickerVisibility(true); endDateFocus.current.blur(); }}
          />
        </Block>
        <Block marginLeft={sizes.sm / 2}>
          <TextInput
            label={t('Post.EndTime')}
            mode='outlined'
            value={endTime}
            error={endTimeError}
            autoComplete={false}
            showSoftInputOnFocus={false}
            ref={endTimeFocus}
            activeOutlineColor={colors.info}
            onFocus={() => { setEndTimePickerVisibility(true); endTimeFocus.current.blur(); }}
            disabled={endTimeDisable}
          />
        </Block>
        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={handleEndDateConfirm}
          onCancel={() => setEndDatePickerVisibility(false)}
        />
        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time" onConfirm={handleEndTimeConfirm}
          onCancel={() => setEndTimePickerVisibility(false)}
        />
      </Block>
      <Block row flex={0} align="center" justify="space-between" marginBottom={sizes.s}>
        <Text>
          {t('Post.Recurrent')}
        </Text>
        <Block row flex={0}>
          <Text>
            {activity.recurrent ? t('Post.RecurrentYes') : t('Post.RecurrentNo')}
          </Text>
          <Switch
            checked={activity.recurrent}
            onPress={(checked) => setActivity({ ...activity, recurrent: checked })}
          />
        </Block>
      </Block>
      <Block marginBottom={sizes.sm}>
        <TextInput
          label={t('Post.Location')}
          mode='outlined'
          error={geolocationError}
          autoComplete={false}
          activeOutlineColor={colors.info}
          onEndEditing={() => geocode(geolocationInput)}
          onChangeText={(newText) => setGeolocationInput(newText)}
        />
      </Block>
      <Block marginBottom={sizes.sm}>
        <TextInput
          label={t('Post.Description')}
          mode='outlined'
          autoComplete={false}
          multiline={true}
          numberOfLines={7}
          activeOutlineColor={colors.info}
          onChangeText={(desc) => { setActivity({ ...activity, description: desc }) }}
        />
      </Block>
      <Block row marginBottom={sizes.s} align='center'>
        <Block>
          {image1 && (<Block align='flex-start' marginRight={sizes.xs}>
            <Image
              source={{ uri: image1.uri }}
              style={{ width: 100, height: 100, borderColor: 'black', borderWidth: 1 }}
            />
          </Block>)}
        </Block>
        <Block>
          {image2 && (<Block align='center' marginHorizontal={sizes.xs}>
            <Image
              source={{ uri: image2.uri }}
              style={{ width: 100, height: 100, borderColor: 'black', borderWidth: 1 }}
            />
          </Block>)}
        </Block>
        <Block>
          {image3 && (<Block align='flex-end' marginLeft={sizes.xs}>
            <Image
              source={{ uri: image3.uri }}
              style={{ width: 100, height: 100, borderColor: 'black', borderWidth: 1 }}
            />
          </Block>)}
        </Block>
      </Block>
      <Block row marginBottom={sizes.sm}>
        <Block marginRight={sizes.xs}>
          <Button flex={1} gradient={gradients.dark} onPress={() => chooseImage(1)} onLongPress={() => removeImage(1)}>
            <Text white bold>
              {imageButtonText1}
            </Text>
          </Button>
        </Block>
        <Block marginHorizontal={sizes.xs}>
          <Button flex={1} gradient={gradients.dark} onPress={() => chooseImage(2)} onLongPress={() => removeImage(2)}>
            <Text white bold>{imageButtonText2}</Text>
          </Button>
        </Block>
        <Block marginLeft={sizes.xs}>
          <Button flex={1} gradient={gradients.dark} onPress={() => chooseImage(3)} onLongPress={() => removeImage(3)}>
            <Text white bold>
              {imageButtonText3}
            </Text>
          </Button>
        </Block>
      </Block>
      <Block row justify='space-between' marginBottom={sizes.sm}>
        <Text p semibold marginTop={sizes.s}>
          {t('Post.NumberOfParticipants')}
        </Text>
        <Block marginLeft={sizes.m}>
          <Input keyboardType='numeric' onChangeText={handleSetLimit} />
        </Block>
      </Block>
      <Block marginBottom={sizes.sm}>
        <Text p semibold>
          {t('Post.SelectParticipant')}
        </Text>
      </Block>
      <AutocompleteDropdown
        closeOnBlur={true}
        closeOnSubmit={false}
        dataSet={users}
        clearOnFocus={true}
        direction={'up'}
        onSelectItem={handleSelectParticipant} />
      <Block marginBottom={sizes.sm} marginTop={sizes.sm}>
        <Button row gradient={gradients.dark} onPress={() => setShowParticipantsModal(true)}>
          <Block align="center" paddingHorizontal={sizes.sm}>
            <Text white bold marginRight={sizes.sm}>
              {t('Post.ParticipantsList')}
            </Text>
          </Block>
        </Button>
        <Modal visible={showParticipantsModal} onRequestClose={() => setShowParticipantsModal(false)}>
          <FlatList
            keyExtractor={(index) => `${index}`}
            data={selectedParticipants}
            renderItem={({ item }) => (
              <Button marginBottom={sizes.sm} onPress={() => { console.warn('DISPLAY USER PROFILE...') }}>
                <Text p white semibold>
                  {item.title}
                </Text>
              </Button>
            )}
          />
        </Modal>
      </Block>
      <Block marginBottom={sizes.sm}>
        <Text p semibold>
          {t('Post.SelectManagers')}
        </Text>
      </Block>
      <AutocompleteDropdown
        closeOnBlur={true}
        closeOnSubmit={false}
        dataSet={selectedParticipants}
        direction={'up'}
        onSelectItem={handleSelectManager}
      />
      <Block marginBottom={sizes.sm} marginTop={sizes.sm}>
        <Button row gradient={gradients.dark} onPress={() => setShowManagersModal(true)}>
          <Block align="center" paddingHorizontal={sizes.sm}>
            <Text white bold marginRight={sizes.sm}>
              {t('Post.ManagersList')}
            </Text>
          </Block>
        </Button>
        <Modal visible={showManagersModal} onRequestClose={() => setShowManagersModal(false)}>
          <FlatList
            keyExtractor={(index) => `${index}`}
            data={selectedManagers}
            renderItem={({ item }) => (
              <Button marginBottom={sizes.sm} onPress={() => { console.warn('DISPLAY MANAGER PROFILE...') }}>
                <Text p white semibold>
                  {item.title}
                </Text>
              </Button>
            )}
          />
        </Modal>
      </Block>
      <Block marginBottom={sizes.sm}></Block>
      <Block>
        <Button flex={1} gradient={gradients.primary} marginBottom={sizes.base} onPress={create}>
          <Text white bold transform="uppercase">{t('Post.Create')}</Text>
        </Button>
      </Block>
      <Modal visible={showSuccessModal} onRequestClose={() => { setShowSuccessModal(false); clearForm(); }}>
        <Text marginTop={sizes.sm} marginBottom={sizes.sm} bold white center size={sizes.m}>
          {t('Post.ActivityPosted')}
        </Text>
        <Button marginTop={sizes.s} marginBottom={sizes.sm} gradient={gradients.primary}
          onPress={() => { setShowSuccessModal(false); clearForm(); }}>
          <Text p white semibold>
            {t('Post.Okay')}
          </Text>
        </Button>
      </Modal>
      <Modal visible={showFailureModal} onRequestClose={() => { setShowFailureModal(false); clearForm(); }}>
        <Text marginTop={sizes.sm} marginBottom={sizes.sm} bold white center size={sizes.m}>
          {t('Post.Wrong')}
        </Text>
        <Button marginTop={sizes.s} marginBottom={sizes.sm} gradient={gradients.primary}
          onPress={() => { setShowSuccessModal(false); clearForm(); }}>
          <Text p white semibold>
            {t('Post.Dismiss')}
          </Text>
        </Button>
      </Modal>
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
