import React, { useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { FlatList, TouchableOpacity, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';

import { useTheme, useTranslation, useData } from '../hooks';
import { Block, Button, Input, Image, Switch, Modal, Text, Card } from '../components';
import 'react-native-gesture-handler';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { BASE_URL } from '../constants/appConstants';


const Home = () => {
  const { user, allActivities, setMyActivities, getUserEmail } = useData()
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const [myAllActivities, setMyAllActivities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [firstTime, setFirstTime] = useState(true);
  const [renderedAct, setRenderedAct] = useState(allActivities);
  const { assets, sizes, colors, fonts, gradients } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  const handleMyActivities = () => {
    if(user) {
      return !firstTime ? myAllActivities : 
      (fetch(BASE_URL + 'getMyActivities?user_id=' + (user._id).toString(), {
        method: 'GET'
     })
     .then((response) => response.json())
     .then((responseJson) => {
      setMyAllActivities(responseJson);
      setMyActivities(responseJson);
        setFirstTime(false)
     })
     .catch((error) => {
        console.error(error + " detected");
     }))
    }
  }

  const handlerenderedAct = useCallback(
    (tab: number) => {
      handleMyActivities();
      setRenderedAct(tab === 0 ? allActivities : myAllActivities);
      setTab(tab);
    },
    [allActivities, myAllActivities, setTab, setRenderedAct],
  );

  useEffect(() => {
    handlerenderedAct(tab);
  });

  useEffect(() => {
    getUserEmail();
  });

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

  return (
    <Block safe>
      <Block
        row
        flex={0}
        align="center"
        justify="center"
        color={colors.card}
        paddingBottom={sizes.sm}>
        <Button onPress={() => handlerenderedAct(0)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 0 ? 'primary' : 'secondary']}>
              <Image source={assets.search} color={colors.white} radius={0} />
            </Block>
            <Text p font={fonts?.[tab === 0 ? 'medium' : 'normal']}>
              {t('home.all')}
            </Text>
          </Block>
        </Button>
        <Block
          gray
          flex={0}
          width={1}
          marginHorizontal={sizes.sm}
          height={sizes.socialIconSize}
        />
        <Button onPress={() => handlerenderedAct(1)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
              <Image
                radius={0}
                color={colors.white}
                source={assets.location}
              />
            </Block>
            <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
              {t('home.myActivities')}
            </Text>
          </Block>
        </Button>
      </Block>
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.l }}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {renderedAct?.map((activity) => (
            <Card {...activity} key={`card-${activity?._id}`} type="vertical" />
          ))}
        </Block>
      </Block>
    </Block>
  );
};

export default React.memo(Home);
