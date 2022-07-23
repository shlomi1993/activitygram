import React, {useLayoutEffect, useState, useEffect } from 'react';
import {FlatList} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme, useData, useTranslation } from '../hooks';
import {IBigCard, ICategory, IActivity} from '../constants/types';
import {Block, Image, Button, Text } from '../components';
import 'react-native-gesture-handler';
import { BASE_URL } from '../constants/appConstants';
import { identity, isEmpty } from 'lodash';

const ForYou = () => {
  const data = useData();
  const {t} = useTranslation();
  const { user, allActivities } = useData();
  // const [renderedActivity, setRenderedActivity] = useState<IActivity>();
  const [selected, setSelected] = useState<ICategory>();
  const [articles, setArticles] = useState<IBigCard[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const {assets, sizes, colors, gradients, icons } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [suggestions, setSuggestions] = useState([]);
  const [currentSuggestion, setCurrentSuggestion] = useState<IActivity>();
  const [counters, setCounters] = useState({});
  const [isInRange, setIsInRange] = useState(true);

  useEffect(() => {
    setArticles(data?.articles);
    setCategories(data?.categories);
    setSelected(data?.categories[0]);
  }, [categories]);

  // useEffect(() => {
  //   const uid = user._id.toString();
  //   const uri = BASE_URL + `getInterestPrediction?uid=${uid}&k=${10}&userbased=${1}`
    // fetch(uri)
    //   .then((result) => result.json())
    //   .then((json) => {
    //     let adjucted = [];
    //     let suggestionLists = {};
    //     for (const cat of json) {
    //       adjucted.push({
    //         id: cat.interest_id,
    //         name: cat.interest_name
    //       });
    //       fetch(BASE_URL + `getActivityPrediction?uid=${uid}&interest=${cat.interest_name}`)
    //         .then((result) => result.json())
    //         .then((activities) => {
    //           suggestionLists[cat.interest_id] = activities;
    //           // Activities recieved proparly, the question is how to store them in a hook and use them later...
    //           // Another question is how to show other random activities.
    //           // And another task to do is to define the operations beehind the "interest" and "not interest buttons"
    //         })
    //         .catch(() => { console.error(`Could not fetch offers for ${cat.interest_name} from DB.`); })
    //     }
    //     setCategories(adjucted);
    //   })
    //   .catch(() => {
    //     data.setCategories([]);
    //     console.error('Could not fetch interests from DB.');
    //   });
  // }, []);

  useEffect(() => {
    let counter;
    if (categories && isEmpty(counters)) {
      categories.map((category) => {
        const title = category?.title
        var pair = {[`${title}`] : 0};
        counter = {...counter, ...pair};
      })
      setCounters(counter)
    }
  })


  useEffect(() => {
    const category = data?.categories?.find(
      (category) => category?.id === selected?.id,
    );

    const newArticles = data?.articles?.filter(
      (article) => article?.category?.id === category?.id,
    );

    setArticles(newArticles);
  }, [data, selected, setArticles]);


  useEffect(() => {
    if(suggestions.length !== 0) {
      const counter = counters[`${selected?.title}`];
      setCurrentSuggestion(suggestions[counter])
    }
    
  });


  const handleSetSelected = (category) => {
    setSelected(category);
    setIsInRange(true);
    fetch(BASE_URL + 'getActivitiesByInterest?interest=' + category?.title, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((responseJson) => {
    //  console.log(responseJson)
    setSuggestions(responseJson);
    if(responseJson.length !== 0) {
      const counter = counters[`${selected?.title}`];
      setCurrentSuggestion(responseJson[counter])
    } else {
      setCurrentSuggestion(undefined);
    }
   })
   .catch((error) => {
      console.error(error + " detected");
   })

  }

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


  const raiseCounter = () => {
    const title = selected.title;
    if(counters[`${title}`] + 2 > suggestions.length) { 
      setIsInRange(false)
      return counters[`${title}`];
    } else {
      const counter = counters[`${title}`] + 1;
      var pair = {[`${title}`] : counter};
      setCounters({...counters, ...pair});
      return counter
    } 
  }

  const onPressInterested = () => {
    const counter = raiseCounter();
    setCurrentSuggestion(suggestions[counter]);
    // TODO: save that user interests on the activity log
    console.log('interested');
  }

  const onPressNotInterested = () => {
    const counter = raiseCounter();
    setCurrentSuggestion(suggestions[counter])
    // TODO: save that user interests on the activity log
    console.log('not interested');
  }

  const renderBigCard = () => {
    const title = currentSuggestion ? currentSuggestion.title : "title";
    const description = currentSuggestion ? currentSuggestion.description : "description";
    let image = currentSuggestion ? (currentSuggestion.images[0] ? currentSuggestion.images[0]['base64'] : undefined) : undefined;
    return (
      <Block card white padding={sizes.l} paddingHorizontal={sizes.padding}>
      <Image
        background
        resizeMode="cover"
        radius={sizes.cardRadius}
        height={460}
        source={assets.activityBackground}>
        
        <Block color={colors.overlay} padding={sizes.padding}>
          <Text h3 white bold center marginBottom={sizes.sm} marginTop={sizes.cardPadding}>
            {title}
          </Text>
          <Text h5 white center marginBottom={sizes.l}>
            {description}
          </Text>
          {image ? 
            (
            <Block center marginBottom={sizes.xl} marginHorizontal={sizes.m}>
              <Image height={150} width={265} source={{uri: `data:image/png;base64,${image}`}}/>
           </Block>) :
            (<Block center marginBottom={sizes.xl} marginHorizontal={sizes.m}>
              <Image height={150} width={265} source={assets.card1}/>
           </Block>)}
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
                onPress={() => handleSetSelected(category)}
                gradient={gradients?.[isSelected ? 'primary' : 'light']}>
                <Text
                  p
                  bold={isSelected}
                  white={isSelected}
                  black={!isSelected}
                  transform="capitalize"
                  marginHorizontal={sizes.m}>
                  {category?.title}
                </Text>
              </Button>
            );
          })}
        </Block>
      </Block>
      {(isInRange && suggestions.length !== 0) ? renderBigCard() : <Text h3 black bold center marginBottom={sizes.sm} marginTop={sizes.xxl}>{t('forYou.noMoreSug')}</Text>}
    </Block>
  );
};

export default ForYou;