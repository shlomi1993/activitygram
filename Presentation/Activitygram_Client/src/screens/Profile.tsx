import React, {useLayoutEffect, useState, useCallback } from 'react';
import {Platform, Linking} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Image, Text } from '../components';
import 'react-native-gesture-handler';

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
  const {user} = useData();
  const {t} = useTranslation();

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
              <Text h5 center white>
                Name
              </Text>
              <Text p center white marginBottom={sizes.md}>
                Nickname
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
                <Text center marginBottom={sizes.sm}>bio</Text>
            </Block>
          </Block>

          <Block paddingHorizontal={sizes.sm} marginTop={sizes.sm}>
          <Block row align="center" justify="space-between">
            <Text h5 semibold>
            {t('profile.ParticipatedIn')}
            </Text>
            <Button>
              <Text p primary semibold>
                View all
              </Text>
            </Button>
          </Block>
          <ImageSeries/>
          <Block row align="center" justify="space-between">
            <Text h5 semibold>
            {t('profile.InterestedIn')}
            </Text>
            <Button>
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
