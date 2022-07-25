import React, {useLayoutEffect, useState, useCallback, useEffect} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';
import {useTheme, useTranslation} from '../hooks';
import {Block, Image, Checkbox, Input, Text, Button, Card} from '../components';
import 'react-native-gesture-handler';
export const url =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/'
    : 'http://127.0.0.1/8080/';

const Gallery = () => {
  const {assets, sizes} = useTheme();
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  return (
    <Block paddingHorizontal={sizes.padding}>
      <Block>
        <Block row align="center" justify="space-between">
          <Text h5 semibold>
            Sport
          </Text>
          <Button>
            <Text p primary semibold>
              View all
            </Text>
          </Button>
        </Block>
        <Block row justify="space-between" wrap="wrap">
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
        </Block>
      </Block>

      <Block>
        <Block row align="center" justify="space-between">
          <Text h5 semibold>
            Celebrations
          </Text>
          <Button>
            <Text p primary semibold>
              View all
            </Text>
          </Button>
        </Block>
        <Block row justify="space-between" wrap="wrap">
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.background}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
        </Block>
      </Block>
    </Block>
  );
};

enum BoxData {
  Activities,
  Users,
}

const Search = () => {
  const [allActivities, setAllActivities] = useState([]);
  const [firstTime, setFirstTime] = useState(true);
  const [boxData, setBoxData] = useState<BoxData | undefined>();
  const [renderedAct, setRenderedAct] = useState(allActivities);

  const [allUsers, setallUsers] = useState([]);

  const {assets, sizes, gradients, colors} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const {t} = useTranslation();
  const [title, setTitle] = useState('');

  const sendNewSearch = () => {
    // console.log(`\nin sendNewSearch(params)`);
    // let formBodyArray = [];
    // for (var property in params) {
    //   var encodedKey = encodeURIComponent(property);
    //   var encodedValue = encodeURIComponent(params[property]);
    //   formBodyArray.push(encodedKey + '=' + encodedValue);
    // }
    // let formBody = formBodyArray.join('&');
    console.log(`firstTime = ${firstTime}`);
    let urn = '';
    switch (boxData) {
      case BoxData.Activities:
        urn = 'activities';
        break;
      case BoxData.Users:
        urn = 'users';
        break;
      default:
        // show error msg
        break;
    }
    const query = `?name=${title}`;
    fetch(url + urn + query, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson, boxData);

        switch (boxData) {
          case BoxData.Activities:
            setAllActivities(responseJson);
            break;
          case BoxData.Users:
            setallUsers(responseJson);
            break;
          default:
            // show error msg
            break;
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  useEffect(() => {
    setRenderedAct(allActivities);
    console.log('~~~~~~~~~~~~~~~~', allActivities);
  }, [allActivities]);
  useEffect(() => {
    console.log('~~~~~~~~~~~~~~~~', allUsers);
    setRenderedAct(
      allUsers.map(user => ({
        title: `${user.firstName} ${user.lastName}`,
        images: [user.profileImage],
        _id: user._id,
      })),
    );
  }, [allUsers]);
  useEffect(() => {
    console.log('~~~~~~~~~~~~~~~~', boxData);
  }, [boxData]);
  useEffect(() => {
    console.log('~~~~~~~~~~~~~~~~', title);
  }, [title]);
  const handlerenderedAct = useCallback(() => {
    // console.log(`\nin handlerenderedAct`);
    // console.log('~~~~~~~~~~~~~~~~', title);
    // let params = {
    //   title,
    //   searchUsers: boxData['Users'],
    //   searchActivities: boxData['Activities'],
    // };
    // console.log(`allActivities BEFORE sendNewSearch(params) ${allActivities}`);
    // console.log(`allActivities AFTER sendNewSearch(params) ${allActivities}`);
    if (boxData === undefined) {
      // show error msg
      return;
    }
    sendNewSearch();
  }, [allActivities, setRenderedAct, title]);

  const storeCheckData = (data: BoxData) => {
    setBoxData(data);
  };

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
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  return (
    <Block safe>
      {/* search input and button*/}
      <Block color={colors.card} flex={0}>
        <Block color={colors.card} flex={0} padding={sizes.padding}>
          <Input
            search
            placeholder={t('common.search')}
            onChangeText={newText => {
              setTitle(newText);
            }}
          />
        </Block>
        <Block
          row
          marginLeft={sizes.sm}
          color={colors.card}
          flex={0}
          marginBottom={sizes.sm}>
          <Block marginRight={sizes.s} row>
            <Checkbox
              checked={boxData === BoxData.Users}
              onPress={() => storeCheckData(BoxData.Users)}
            />
            <Text>Users</Text>
          </Block>
          <Block marginRight={sizes.s} row>
            <Checkbox
              checked={boxData === BoxData.Activities}
              onPress={() => storeCheckData(BoxData.Activities)}
            />
            <Text>Activities</Text>
          </Block>
        </Block>
        <Button
          gradient={gradients.info}
          onPress={() => {
            handlerenderedAct();
          }}
          margin={sizes.sm}>
          <Text white bold transform="uppercase">
            search
          </Text>
        </Button>
      </Block>
      {/* submit */}
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {renderedAct?.map(entity => (
            // need to change title to id
            <Card {...entity} key={`card-${entity?._id}`} type="vertical" />
          ))}
        </Block>
        <Block>
          <Gallery />
        </Block>
      </Block>
    </Block>
  );
};

export default Search;
