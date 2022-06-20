import React, { useLayoutEffect, useState, useEffect } from 'react';
import { FlatList, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';

import { useTheme, useData } from '../hooks';
import { IBigCard, ICategory } from '../constants/types';
import { Block, Image, Button, BigCard, Text } from '../components';
import { BASE_URL } from '../constants/appConstants';
// import 'react-native-gesture-handler';

const ForYou = () => {

  const navigation = useNavigation();
  const data = useData();
  const { assets, sizes, colors, gradients } = useTheme();
  const headerHeight = useHeaderHeight();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selected, setSelected] = useState<ICategory>();
  const [suggestions, setSuggestions] = useState<IBigCard[]>([]);

  useEffect(() => {
    fetch(BASE_URL + `getInterestPrediction?userId=${data.user.uid}&k=${10}&userbased=${1}`)
      .then((result) => result.json())
      .then((json) => {
        let adjucted = [];
        for (const cat of json) {
          adjucted.push({
            id: cat.interest_id,
            name: cat.interest_name
          });
        }
        setCategories(adjucted);
        let suggestionLists = {}
        for (const cat of adjucted) {
          fetch(BASE_URL + `getActivityPrediction?userId=${data.user.uid}&interest=${cat.name}`)
            .then((result) => result.json())
            .then((json) => { suggestionLists[cat.id] = json; })
            .catch(() => { console.error(`Could not fetch offers for ${cat.name} from DB.`); })
        }
      })
      .catch(() => {
        data.setCategories([]);
        console.error('Could not fetch interests from DB.');
      });
  }, []);

  useEffect(() => {
    setCategories(data?.categories);
    setSelected(data?.categories[0]);
    setSuggestions(data?.articles);
  }, [data.articles, data.categories]);

  useEffect(() => {
    const category = data?.categories?.find(
      (category) => category?.id === selected?.id,
    );
    const newArticles = data?.articles?.filter(
      (article) => article?.category?.id === category?.id,
    );
    setSuggestions(newArticles);
  }, [data, selected, setSuggestions]);


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
        data={suggestions}
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
