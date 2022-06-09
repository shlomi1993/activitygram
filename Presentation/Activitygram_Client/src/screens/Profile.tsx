import React, {useLayoutEffect, useState, useCallback, useEffect } from 'react';
import {Platform, Linking} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Image, Text } from '../components';
import 'react-native-gesture-handler';
import { IUser } from '../constants/types';

import { BASE_URL } from '../constants/appConstants';

const isAndroid = Platform.OS === 'android';

const ImageSeries = () => {
  const {assets, sizes, colors } = useTheme();

  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  return(
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
    </Block>
  )
}
const Profile = () => {
  const {assets, sizes, colors } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [profile, setProfile] = useState<IUser>();
  const {t} = useTranslation();

  useEffect(() => {
    const userId = '627659c91fbdd7e2c67d5e11';
    fetch(BASE_URL + 'getUser?user_id=' + userId, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setProfile(responseJson);
      })
      .catch((error) => {
        console.error(error + " detected");
      });

  }, [profile, setProfile])

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

  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 4;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  

  const fullName = profile ? profile.fullName : '';
  const username = profile ? profile.username : '';
  const bio = profile ? profile.bio : '';
  const interests = profile ? profile.interests : [];

  return (
    <Block safe>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0} marginTop={sizes.sm}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.cardRadius}
            source={assets.background}>
            <Block flex={0} align="center">
              <Image
                width={128}
                height={128}
                marginBottom={sizes.sm}
                source={assets.card1}
              />
              <Text h2 semibold center white>
                {fullName}
              </Text>
              <Text h5 center white marginBottom={sizes.md}>
                {username}
              </Text>
            </Block>
          </Image>

          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={-sizes.l}
            marginHorizontal="8%"
            color="rgba(255,255,255,0.2)">
            <Block
              blur
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              tint={colors.blurTint}
              justify="space-evenly"
              paddingHorizontal={sizes.l}
              renderToHardwareTextureAndroid>
                <Text h5 center marginTop={sizes.sm}>{t('profile.bio')}</Text>
                <Text center marginBottom={sizes.sm}>{bio}</Text>
            </Block>
          </Block>

          <Block paddingHorizontal={sizes.sm} marginTop={sizes.sm}>
          <Block row align="center" justify="space-between">
            <Text h4 semibold>
            {t('profile.InterestsIn')}
            </Text>
            <Button>
            </Button>
          </Block>
          <Block row justify="space-between" wrap="wrap">
          {interests?.map((interest) => (
            <Block key={`block-${interest}`}>
              <Text key={`text-${interest}`} color={colors.secondary}>{interest}</Text>
            <Image
            key={`image-${interest}`}
            resizeMode="cover"
            source={assets?.[interest]}
            marginBottom={IMAGE_MARGIN}
            color={colors.secondary}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
              borderColor: 'black'
            }}
            />
            </Block>
          ))}

          </Block>
          
          <Block row align="center" justify="space-between">
            <Text h4 semibold>
            {t('profile.ParticipatedIn')}
            </Text>
            <Button onPress={() => {console.log('Pressed')}}>
              <Text p primary semibold>
                View all
              </Text>
            </Button>
          </Block>
          <ImageSeries/>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Profile;
