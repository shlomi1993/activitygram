import React, { useLayoutEffect, useState, useEffect } from 'react';
import { FlatList, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';

import { useTheme, useData } from '../hooks';
import { IBigCard, ICategory } from '../constants/types';
import { Block, Image, Button, BigCard, Text } from '../components';
import 'react-native-gesture-handler';

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
    fetch(baseUri + `getInterestPrediction?userId=${data.user.uid}&k=${10}&userbased=${1}`)
      .then((result) => result.json())
      .then((json) => {
        let adjucted = [];
        for (const cat of json) {
          adjucted.push({
            id: cat.interest_id,
            name: cat.interest_name
          });
        }
        data.setCategories(adjucted);
        let offers = {}
        for (const cat of adjucted) {
          fetch(baseUri + `getActivityPrediction?userId=${data.user.uid}&interest=${cat.name}`)
            .then((result) => result.json()).then((json) => {
              offers[cat.id] = json;
            })
            .catch(() => {
              console.error(`Could not fetch offers for ${cat.name} from DB.`);
            })
        }
      })
      .catch(() => {
        data.setCategories([]);
        console.error('Could not fetch interests from DB.');
      });
  }, []);

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
