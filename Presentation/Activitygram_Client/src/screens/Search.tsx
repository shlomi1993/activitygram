import React, {useLayoutEffect, useState, useCallback} from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { useTheme, useTranslation } from '../hooks';
import { Block, Image, Checkbox, Input, Text, Button, Card} from '../components';
import 'react-native-gesture-handler';
export const url = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';



const Gallery = () => {
    const {assets, sizes} = useTheme();
    const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
    const IMAGE_VERTICAL_SIZE =
      (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
    const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
    const IMAGE_VERTICAL_MARGIN =
      (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;
  
    return (
      <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
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

var boxData = { "Users": false,
                "Activities": false,
                "Groups": false}

const Search = () => {
  const [allActivities, setAllActivities] = useState([]);
  const [firstTime, setFirstTime] = useState(true);
  const [renderedAct, setRenderedAct] = useState(allActivities);

  const {assets, sizes, gradients, colors} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const {t} = useTranslation();
  const [isCheckedUsers, setIsCheckedUsers] = useState(false);
  const [isCheckedActivities, setIsCheckedActivities] = useState(false);
  const [isCheckedGroups, setIsCheckedGroups] = useState(false);
  const [title, setTitle] = useState('')

  const sendNewSearch = (params: object) => {
    console.log(`\nin sendNewSearch(params)`)
    let formBodyArray = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBodyArray.push(encodedKey + '=' + encodedValue);
    }
    let formBody = formBodyArray.join('&');
    console.log(`firstTime = ${firstTime}`)
    fetch(url + 'search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: formBody
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(`allActivities BEFORE setAllActivities ${allActivities}`)
        setAllActivities(responseJson[1])
        console.log(`allActivities AFTER setAllActivities ${allActivities}`)
        setFirstTime(false)
        console.log(`responseJson[1] = ${JSON.stringify(responseJson[1])}`)
      })
      .catch((err) => {
        console.log('error');
      })
  }

  const handlerenderedAct = useCallback(() => {
    console.log(`\nin handlerenderedAct`)
    let params = {
      title: title,
      searchUsers : boxData["Users"],
      searchActivities : boxData["Activities"],
      searchGroups : boxData["Groups"]
    }
    console.log(`allActivities BEFORE sendNewSearch(params) ${allActivities}`)
    sendNewSearch(params)
    console.log(`allActivities AFTER sendNewSearch(params) ${allActivities}`)
    setRenderedAct(allActivities);
    console.log(`allActivities AFTER setRenderedAct(params) ${allActivities}`)
  },
  [allActivities, setRenderedAct],
);

  const storeCheckData = (boxName, state) => {
    boxData[boxName] = state
  }


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
    <Block justify="space-between" marginBottom={sizes.xxl} color={colors.card} flex={0.8} padding={sizes.base}>

        <Input search placeholder={t('common.search')} marginBottom={sizes.sm} 				
          onChangeText={(newText) => { setTitle(newText) }}/>
          
        <Checkbox checked={isCheckedUsers} onPress={() => {setIsCheckedUsers(!isCheckedUsers), storeCheckData('Users', !isCheckedUsers)}}/>
        <Text>Users</Text>
        <Checkbox checked={isCheckedActivities} onPress={() => {setIsCheckedActivities(!isCheckedActivities), storeCheckData('Activities', !isCheckedActivities)}}/>
        <Text>Activities</Text>
        <Checkbox checked={isCheckedGroups} onPress={() => {setIsCheckedGroups(!isCheckedGroups), storeCheckData('Groups', !isCheckedGroups)}}/>
        <Text>Groups</Text>

        <Button flex={1} gradient={gradients.info} marginBottom={sizes.base} onPress={() => {handlerenderedAct()}}>
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
          {renderedAct?.map((activity) => (
            // need to change title to id
            <Card {...activity} key={`card-${activity?._id}`} type="vertical" />
          ))}
        </Block>
        <Block>
          <Gallery/>
        </Block>
    </Block>
    </Block>
  );
};

export default Search;
