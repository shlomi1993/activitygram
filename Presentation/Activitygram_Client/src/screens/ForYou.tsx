import React, { useLayoutEffect, useState, useEffect } from 'react';
import { FlatList, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';

import { useTheme, useData } from '../hooks';
import { IBigCard, ICategory } from '../constants/types';
import { Block, Image, Button, BigCard, Text } from '../components';
import 'react-native-gesture-handler';

const userContext = { uid: '6283c59f09c1aba370980c09' } // Need to be replaced!
export const baseUri = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';

const ForYou = () => {
  const data = useData();
  const [selected, setSelected] = useState<ICategory>();
  const [articles, setArticles] = useState<IBigCard[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { assets, sizes, colors, gradients } = useTheme();
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

  useEffect(() => {
    let uid = userContext.uid;
    fetch(baseUri + `getInterestPrediction?userId=${uid}k=${100}userbased=${1}`)
      .then((result) => result.json())
      .then((json) => {
        setCategories(json);
        console.log(json);
      })
      .catch(() => {
        setCategories([]);
        console.error('Could not fetch interests from DB.');
      });
  }, []);

  return (
    <Block safe>
      {/* categories list */}
      <Block color={colors.card} row flex={0} paddingVertical={sizes.padding}>
        <Block scroll horizontal renderToHardwareTextureAndroid showsHorizontalScrollIndicator={false}
          contentOffset={{ x: -sizes.padding, y: 0 }}>
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

      {/* our data will be top 2 recommendations */}
      <FlatList
        data={articles}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item?.id}`}
        style={{ paddingHorizontal: sizes.padding }}
        contentContainerStyle={{ paddingBottom: sizes.l }}
        renderItem={({ item }) => <BigCard {...item} />}
      />
    </Block>
  );
};

export default ForYou;
