import React, {useLayoutEffect, useState, useEffect } from 'react';
import {FlatList} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme, useData, useTranslation } from '../hooks';
import {IBigCard, ICategory} from '../constants/types';
import {Block, Image, Button, Text } from '../components';
import 'react-native-gesture-handler';

const ForYou = () => {
  const data = useData();
  const {t} = useTranslation();
  // const [renderedActivity, setRenderedActivity] = useState<IActivity>();
  const [selected, setSelected] = useState<ICategory>();
  const [articles, setArticles] = useState<IBigCard[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const {assets, sizes, colors, gradients, icons } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    setArticles(data?.articles);
    setCategories(data?.categories);
    setSelected(data?.categories[0]);
  }, [data.articles, data.categories]);

  useEffect(() => {
    const category = data?.categories?.find(
      (category) => category?.id === selected?.id,
    );

    const newArticles = data?.articles?.filter(
      (article) => article?.category?.id === category?.id,
    );

    setArticles(newArticles);
  }, [data, selected, setArticles]);


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

  const onPressInterested = () => {
    // save that user interests
    // setRenderedActivity(activity[i+1])
    console.log('interested');
  }

  const onPressNotInterested = () => {
    // save that user not interests
    // setRenderedActivity(activity[i+1])
    console.log('not interested');
  }

  const renderBigCard = () => {
    return (
      <Block card white padding={0} marginTop={sizes.xl} paddingHorizontal={sizes.padding}>
      <Image
        background
        resizeMode="cover"
        radius={sizes.cardRadius}
        height={460}
        source={assets.activityBackground}>
        
        <Block color={colors.overlay} padding={sizes.padding}>
          <Text h2 white bold center marginBottom={sizes.sm} marginTop={sizes.cardPadding}>
            Activity title
          </Text>
          <Text h5 white center marginBottom={sizes.sm}>
            Activity Description
          </Text>
          <Block row center marginBottom={sizes.sm}>
            <Image source={icons.location} marginRight={sizes.s} />
            <Text p semibold white>
              Activity Location
            </Text>
          </Block>
          <Block center marginBottom={sizes.xl} marginHorizontal={sizes.m}>
             <Image height={150} width={265} source={assets.background}/>
          </Block>
          {/* Need to change icons */}
          <Block row align="center" marginBottom={sizes.cardPadding}>
            <Button success paddingHorizontal={sizes.sm} marginRight={sizes.sm} onPress={() => {onPressInterested()}}><Text white p bold>{t('forYou.interested')}</Text></Button>
            <Button danger paddingHorizontal={sizes.sm} onPress={() => {onPressNotInterested()}}><Text white p bold>{t('forYou.notInterested')}</Text></Button>
          </Block>
        </Block>
      </Image>
    </Block>
    )
  }

  return (
    <Block safe>
            {/* categories list */}
            <Block color={colors.card} row flex={0} paddingVertical={sizes.padding}>
        <Block
          scroll
          horizontal
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: -sizes.padding, y: 0}}>
          {categories?.map((category) => {
            const isSelected = category?.id === selected?.id;
            return (
              <Button
                radius={sizes.m}
                marginHorizontal={sizes.s}
                key={`category-${category?.id}}`}
                onPress={() => setSelected(category)}
                gradient={gradients?.[isSelected ? 'primary' : 'light']}>
                <Text
                  p
                  bold={isSelected}
                  white={isSelected}
                  black={!isSelected}
                  transform="capitalize"
                  marginHorizontal={sizes.m}>
                  {category?.name}
                </Text>
              </Button>
            );
          })}
        </Block>
      </Block>
      {renderBigCard()}
    </Block>
  );
};

export default ForYou;