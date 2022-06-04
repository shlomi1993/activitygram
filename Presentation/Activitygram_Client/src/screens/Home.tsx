import React, {useLayoutEffect, useState, useCallback, useEffect } from 'react';
import {FlatList, TouchableOpacity, Platform} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme, useTranslation, useData} from '../hooks';
import {Block, Button, Input, Image, Switch, Modal, Text, Card} from '../components';
import 'react-native-gesture-handler';
import { DrawerContentScrollView } from '@react-navigation/drawer';

export const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';

const Home = () => {

  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const [all, setAll] = useState([]);
  const [nearMe, setNearMe] = useState([]);
  const {following, trending} = useData();
  const [products, setProducts] = useState(all);

  const {assets, sizes, colors, fonts, gradients } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? all : all);
    },
    [all, trending, setTab, setProducts],
  );

  useEffect(() => {
    fetch(baseUrl + 'getAllActivities', {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((responseJson) => {
      setAll(responseJson);
   })
   .catch((error) => {
      console.error(error + " detected");
   });
  })

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
        <Button onPress={() => handleProducts(0)}>
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
        <Button onPress={() => handleProducts(1)}>
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
              {t('home.nearme')}
            </Text>
          </Block>
        </Button>
      </Block>
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.l}}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {products?.map((product) => (
            // need to change title to id
            <Card {...product} key={`card-${product?.title}`} type="vertical" />
          ))}
        </Block>
      </Block>
    </Block>
  );
};

export default Home;
