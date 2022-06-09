import React, {useLayoutEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { useTheme, useTranslation } from '../hooks';
import { Block, Image, Checkbox, Input, Text, Button } from '../components';
import { IEventForm } from '../constants/types/forms';
import 'react-native-gesture-handler';
export const url = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';

var boxData = { "Users": false,
                "Activities": false,
                "Groups": false}

var searchUsers = {"Users": false}
var searchActivities = {"Activities": false}
var searchGroups = {"Groups": false}


async function onPressSearch(params) {
  console.log(`\nin onPressSearch(params)`)
	var formBody = [];
  // let formBody: any;
	for (var property in params) {
		var encodedKey = encodeURIComponent(property);
		var encodedValue = encodeURIComponent(params[property]);
		formBody.push(encodedKey + '=' + encodedValue);
	}
	formBody = formBody.join('&');
  console.log(`form: ${formBody}`)

	await fetch(url + 'search', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: formBody
	})
		.then((res) => {
			console.log('sent request');
			// console.log(`res ${JSON.stringify(res)}`)
		})
		.catch((err) => {
			console.log('error');
		});
}

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

const Search = () => {
  const {assets, sizes,gradients, colors } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const {t} = useTranslation();
  const [form, setForm] = useState<IEventForm>();
  const [isChecked, setIsChecked] = useState(false);

  async function storeCheckData(boxName, state) {
    console.log(`\nin storeCheckData(boxName, state)`)
    boxData[boxName] = state
    if (boxName == "Users"){
      searchUsers[boxName] = state
      setForm(prevState => ({...prevState, Users : state}));
    }
    else if(boxName == "Activities"){
      searchActivities[boxName] = state
      setForm(prevState => ({...prevState, Activities : state}));
    }
    else{
      searchGroups[boxName] = state
      setForm(prevState => ({...prevState, Groups : state}));
    }
    console.log(`form: ${JSON.stringify(form)}`)
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
          onChangeText={(newText) => {
            setForm(prevState => ({...prevState, keyword: newText}));
        }}/>

        <Checkbox checked={isChecked} onPress={() => {setIsChecked(!isChecked), storeCheckData('Users', !isChecked)}}/>
        <Text>Users</Text>
        <Checkbox checked={isChecked} onPress={() => {setIsChecked(!isChecked), storeCheckData('Activities', !isChecked)}}/>
        <Text>Activities</Text>
        <Checkbox checked={isChecked} onPress={() => {setIsChecked(!isChecked), storeCheckData('Groups', !isChecked)}}/>
        <Text>Groups</Text>

        <Button flex={1} gradient={gradients.info} marginBottom={sizes.base} onPress={() => {
					console.log('\nsearch clicked!');
          console.log(`form = ${JSON.stringify(form)}`);
					onPressSearch(form);
				}}>
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
        <Block>
          <Gallery/>
        </Block>
      </Block>
    </Block>
  );
};

export default Search;
