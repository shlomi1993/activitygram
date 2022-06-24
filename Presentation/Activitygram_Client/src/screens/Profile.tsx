import React, {useLayoutEffect, useState, useCallback, useEffect } from 'react';
import {Platform, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Image, Text, Card } from '../components';
import 'react-native-gesture-handler';
import { IActivity, IUser } from '../constants/types';

import { BASE_URL } from '../constants/appConstants';
import { AuthContext } from '../navigation/App';

const isAndroid = Platform.OS === 'android';

const Profile = () => {
  const {assets, sizes, colors } = useTheme();
  const { user, myActivities, allActivities } = useData();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [profile, setProfile] = useState<IUser>();
  const [createdByUser, setCreatedByUser] = useState<IActivity[]>();
  const {t} = useTranslation();
  const { signOut } = React.useContext(AuthContext);

 useEffect(() => {
  (fetch(BASE_URL + 'getCreatedByUserActivities?user_id=' + user._id.toString(), {
    method: 'GET'
 })
 .then((response) => response.json())
 .then((responseJson) => {
   setCreatedByUser(responseJson)
 })
 .catch((error) => {
    console.error(error + " detected");
 }))
 }, []);

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
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;

  const fullName = (user && (user.firstName + ' ' + user.lastName)) || '';
  const city = (user && user.city) || '';
  const bio = (user && user.bio) || '';
  const interests = (user && user.interests);

  return (
    <Block safe>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0} marginTop={sizes.xs}>
          <Button align='flex-end' onPress={() => {signOut()}} ><Text secondary bold>{t('profile.logout')}</Text></Button>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.cardRadius}
            source={assets.background}>
            <Block flex={0} align="center">
            {user.profileImage ? 
            (<Image
              width={128}
              height={128}
              marginBottom={sizes.sm}
              source={{uri: `data:image/png;base64,${user.profileImage['base64']}`}}
            />) :
            (<Image
              width={128}
              height={128}
              marginBottom={sizes.sm}
              source={assets.card1}
            />)}
              <Text h2 semibold center white>
                {fullName}
              </Text>
              <Text h5 center white marginBottom={sizes.md}>
                {city}
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
          {/* interests in */}
          <Block paddingHorizontal={sizes.sm} marginTop={sizes.sm}>
          {interests && (<Block row align="center" justify="space-between">
            <Text h4 semibold>
            {t('profile.InterestsIn')}
            </Text>
          </Block>)}
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
          {/* participated in */}
          {myActivities && (<Block row align="center" justify="space-between">
            <Text h4 semibold marginBottom={sizes.s}>
            {t('profile.ParticipatedIn')}
            </Text>
          </Block>)}
          <Block
          scroll
          horizontal
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: -sizes.padding, y: 0}}>
          {myActivities?.map((activity) => (
            // need to change title to id
            <Card {...activity} key={`card-${activity?._id}`} type="vertical" isProfile={true} />
          ))}
          </Block>
                    
          {/* Created by user */}
          {createdByUser && (<Block row align="center" justify="space-between">
            <Text h4 semibold marginBottom={sizes.s}>
            {t('profile.createdByUser')}
            </Text>
          </Block>)}
          <Block
          scroll
          horizontal
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: -sizes.padding, y: 0}}>
          {createdByUser?.map((activity) => (
            // need to change title to id
            <Card {...activity} key={`card-${activity?._id}`} type="vertical" isProfile={true} />
          ))}
          </Block>
        </Block>
      </Block>
    </Block>
  </Block>
  );
};

export default Profile;
