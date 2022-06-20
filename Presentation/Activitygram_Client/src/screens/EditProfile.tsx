import React, { useEffect, useLayoutEffect, useState, useRef, useContext } from 'react';
import { Platform, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Assets, useHeaderHeight } from '@react-navigation/stack';

import { useTheme, useTranslation } from '../hooks';
import { Block, Image, Text, Input, Button, Switch, Modal } from '../components';

import Moment from 'moment';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import Toast from 'react-native-toast-message'
import { BASE_URL } from '../constants/appConstants';



const Form = () => {
  const { t } = useTranslation();
  // Theme & Context
  const navigation = useNavigation();
  const { assets, colors, sizes, gradients } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  // Category Modal
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(t('Post.SelectCategory'));

  // Start Date and Time
  const birthDateFocus = useRef();
  const [isbirthDatePickerVisible, setbirthDatePickerVisibility] = useState(false);
  const [birthDate, setbirthDate] = useState('')
  const [birthDateError, setbirthDateError] = useState(false)

  // Location
  const [geolocationError, setGeolocationError] = useState(false);
  const [geolocation, setGeolocation] = useState(null);
  

  // Images
  const [imageButtonText1, setImageButtonText1] = useState(t('Post.AddImage'));
  const [image1, setImage1] = useState(null);

  // Fetch categories for Category Modal
  useEffect(() => {
    fetch(BASE_URL + 'allInterests')
      .then((result) => result.json())
      .then((json) => {
        setCategories(json);
      })
      .catch(() => setCategories([]));
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
  const handlebirthDateConfirm = (date: Date) => {
    Moment.locale('en');
    let newText = Moment(date).format('ddd, D.M.YYYY');
    setbirthDate(newText);
    setbirthDatePickerVisibility(false);
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
      setGeolocation('unknown')
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
        }
      }
    });
  }

  // Image remover
  const removeImage = (imageNumber: Number) => {
    if (imageNumber == 1) {
      setImage1(null);
      setImageButtonText1(t('Post.AddImage'))
    }
  }

  return (

    <Block color={colors.card} paddingTop={sizes.m} paddingHorizontal={sizes.padding}>

      <Text p semibold marginBottom={sizes.sm}>{t('EditProfile.PleaseFill')}</Text>

      <Block>
        <Block align='center'>
        <Image style={{ width: 60, height: 60 }} source={assets.profile} />
        </Block>
        

        {/* <Block marginBottom={sizes.xs}>
          <Text p semibold>{t('Post.SelectCategory')}</Text>
        </Block> */}
        {/* <AutocompleteDropdown closeOnBlur={true} closeOnSubmit={false} dataSet={categories} clearOnFocus={true}
          direction={'down'} onSelectItem={(category) => {
            if (category && category.title) {
              setSelectedCategory(category.title);
            }
          }} /> */}

        <Block marginBottom={sizes.sm}>
          <TextInput label={t('EditProfile.firstName')} mode='outlined' autoComplete={false} multiline={true}
            numberOfLines={1} activeOutlineColor={colors.info}
            onChangeText={(newText) => { setFirstName(newText) }} />
        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label={t('EditProfile.lastName')} mode='outlined' autoComplete={false} multiline={true}
            numberOfLines={1} activeOutlineColor={colors.info}
            onChangeText={(newText) => { setLastName(newText) }} />
        </Block>

          <Block marginBottom={sizes.sm}>
            <TextInput label={t('EditProfile.birthDate')} mode='outlined' value={birthDate} error={birthDateError}
              autoComplete={false} showSoftInputOnFocus={false} ref={birthDateFocus} activeOutlineColor={colors.info}
              onFocus={() => { setbirthDatePickerVisibility(true); birthDateFocus.current.blur(); }}
            />

          <DateTimePickerModal isVisible={isbirthDatePickerVisible} mode="date" onConfirm={handlebirthDateConfirm}
            onCancel={() => setbirthDatePickerVisibility(false)} />

        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label={t('EditProfile.address')} mode='outlined' error={geolocationError} autoComplete={false}
            activeOutlineColor={colors.info} onChangeText={(newText) => { geocode(newText) }} />
        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label={t('EditProfile.bio')} mode='outlined' autoComplete={false} multiline={true}
            numberOfLines={3} activeOutlineColor={colors.info}
            onChangeText={(newText) => { setBio(newText) }} />
        </Block>

        <Block row marginBottom={sizes.s} align='center'>
          <Block>
            {image1 && (<Block align='flex-start' marginRight={sizes.xs}>
              <Image source={{ uri: image1.uri }}
                style={{ width: 100, height: 100, borderColor: 'black', borderWidth: 1 }} />
            </Block>)}
          </Block>

        </Block>

      </Block>

      <Block>
        <Button flex={1} gradient={gradients.primary} marginBottom={sizes.base} onPress={() => {console.log('create placeholder')}}>
          <Text white bold transform="uppercase">{t('Post.Create')}</Text>
        </Button>
      </Block>

      <Toast position='bottom' bottomOffset={80} onPress={() => Toast.hide()} />

    </Block >
  );
};

const EditProfile = () => {
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

export default EditProfile;
