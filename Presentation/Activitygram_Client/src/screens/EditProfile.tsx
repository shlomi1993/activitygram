import React, { useEffect, useLayoutEffect, useState, useRef, useContext, useCallback } from 'react';
import { Platform, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Assets, useHeaderHeight } from '@react-navigation/stack';
import Storage from '@react-native-async-storage/async-storage';
import { useTheme, useTranslation } from '../hooks';
import { Block, Image, Text, Input, Button, Switch, Modal } from '../components';
import MultiSelect from 'react-native-multiple-select';
import Moment from 'moment';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import Toast from 'react-native-toast-message'
import { BASE_URL } from '../constants/appConstants';
import { IUser } from '../constants/types';
import { AuthContext } from '../navigation/App';

const Form = () => {
  const { t } = useTranslation();
  // Theme & Context
  const navigation = useNavigation();
  const { completeSignUp } = React.useContext(AuthContext);
  const { assets, colors, sizes, gradients } = useTheme();
  const [profile, setProfile] = useState<IUser>({})
  const [isNewUser, setIsNewUser] = useState<boolean>(true);

  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedInterestsValues, setSelectedInterestsValues] = useState([]);

  const birthDateFocus = useRef();
  const [isbirthDatePickerVisible, setbirthDatePickerVisibility] = useState(false);
  const [birthDateError, setbirthDateError] = useState(false)

  const [image, setImage] = useState(null);

  const handleEmail = useCallback(
    async () => {
      const email = await Storage.getItem('userEmail')
      setProfile({...profile, email})
    },
    [profile, setProfile],
  );

  const handleSelectedInterests = () => {
    let result;
    const values = []
    selectedInterests.forEach((key) => {result = interests.find((i) => i.id === key ); values.push(result.title)})
    setProfile({...profile, interests: values});
  }

  // Fetch categories for Category Modal
  useEffect(() => {
    fetch(BASE_URL + 'allInterests')
      .then((result) => result.json())
      .then((json) => {
        setInterests(json);
      })
      .catch(() => setInterests([]));
  },[interests, setInterests]);

  useEffect(() => {
    setProfile({...profile, creationTime: Date(), activityLog: [] })
    handleEmail() 
    handleSelectedInterests()
  }, [selectedInterests, setSelectedInterests])


  const handlebirthDateConfirm = (date: Date) => {
    setProfile({...profile, birthDate: date})
    setbirthDatePickerVisibility(false);
  };

  // Image handler
  const chooseImage = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    }).then((data) => {
      if (!data.cancelled) {
        setImage(data);
      }
    });
  }

  // Image remover
  const removeImage = () => {
    setProfile({...profile, profileImage: null})
    setImage(null);
  }

  const onPressSave = () => {
    const imageArr = [];
    imageArr.push(image['base64'])
    fetch(BASE_URL + 'createUser?user=' + encodeURIComponent(JSON.stringify(profile)), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: encodeURIComponent(JSON.stringify(image))
    }).then(() => {
      isNewUser && completeSignUp(); 
      console.log('Success')
    })
  }

  return (

    <Block color={colors.card} paddingTop={sizes.m} paddingHorizontal={sizes.padding}>

      <Text p semibold marginBottom={sizes.sm}>{t('EditProfile.PleaseFill')}</Text>

      <Block>
        <Block align='center'>
            <Image style={{ width: 100, height: 100 }} source={image ? { uri: image.uri } : assets.profile} />
            <Button flex={1} 
              onPress={() => chooseImage()} onLongPress={() => removeImage()}>
              <Text secondary bold>{t('EditProfile.addImage')}</Text>
            </Button>
        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label={t('EditProfile.firstName')} mode='outlined' autoComplete={false} multiline={true}
            numberOfLines={1} activeOutlineColor={colors.info}
            onChangeText={(newText) => { setProfile({...profile, firstName: newText}) }} />
        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label={t('EditProfile.lastName')} mode='outlined' autoComplete={false} multiline={true}
            numberOfLines={1} activeOutlineColor={colors.info}
            onChangeText={(newText) => { setProfile({...profile, lastName: newText}) }} />
        </Block>

          <Block marginBottom={sizes.sm}>
            <TextInput label={t('EditProfile.birthDate')} mode='outlined' value={Moment(profile.birthDate).format('D.M.YYYY')} error={birthDateError}
              autoComplete={false} showSoftInputOnFocus={false} ref={birthDateFocus} activeOutlineColor={colors.info}
              onFocus={() => { setbirthDatePickerVisibility(true); birthDateFocus.current.blur(); }}
            />

          <DateTimePickerModal isVisible={isbirthDatePickerVisible} mode="date" onConfirm={handlebirthDateConfirm}
            onCancel={() => setbirthDatePickerVisibility(false)} />

        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label={t('EditProfile.city')} mode='outlined' autoComplete={false} multiline={true}
            numberOfLines={1} activeOutlineColor={colors.info}
            onChangeText={(newText) => { setProfile({...profile, city: newText}) }} />
        </Block>

        <Block marginBottom={sizes.sm}>
          <TextInput label={t('EditProfile.bio')} mode='outlined' autoComplete={false} multiline={true}
            numberOfLines={3} activeOutlineColor={colors.info}
            onChangeText={(newText) => { setProfile({...profile, bio: newText}) }} />
        </Block>

        <Block marginBottom={sizes.sm} safe>
          {/* <TextInput label={t('EditProfile.interests')} mode='outlined' autoComplete={false} multiline={true}
            numberOfLines={3} activeOutlineColor={colors.info}
            onChangeText={(newText) => {}} /> */}
          <Block>
          <MultiSelect
          hideTags
          items={interests}
          uniqueKey="id"
          onSelectedItemsChange={(selected) => {setSelectedInterests(selected)}}
          selectedItems={selectedInterests}
          onAddItem={() => handleSelectedInterests()}
          selectText="Choose Interests"
          onChangeInput={ (text)=> console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="title"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Choose"
        />
          </Block>
        </Block>
      </Block>

      <Block>
        <Button flex={1} gradient={gradients.primary} marginBottom={sizes.base} onPress={() => {onPressSave()}}>
          <Text white bold transform="uppercase">{t('EditProfile.save')}</Text>
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
