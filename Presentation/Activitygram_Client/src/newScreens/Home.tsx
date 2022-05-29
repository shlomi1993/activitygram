import React, {useLayoutEffect, useState, useCallback } from 'react';
import {FlatList, TouchableOpacity} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme, useTranslation, useData} from '../hooks';
import {Block, Button, Input, Image, Switch, Modal, Text, Product} from '../components';
import 'react-native-gesture-handler';

const Home = () => {
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);

  const {assets, sizes, colors, fonts, gradients } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );

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
      {/* search input */}
      {/* <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={t('common.search')} />
      </Block> */}
      
      {/* toggle products list */}
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
              {t('home.nearme')}
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
                source={assets.documentation}
              />
            </Block>
            <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
              {t('home.recommended')}
            </Text>
          </Block>
        </Button>
      </Block>

      
      {/* products list */}
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.l}}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {products?.map((product) => (
            <Product {...product} key={`card-${product?.id}`} />
          ))}
        </Block>
      </Block>
    </Block>
  );
};

export default Home;
