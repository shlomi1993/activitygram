import React, {useLayoutEffect } from 'react';

import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme, useTranslation } from '../hooks';
import {Block,  Image, Input, Text, Button } from '../components';
import 'react-native-gesture-handler';

const Gallery = () => {
    const {assets, sizes} = useTheme();
    const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
    const IMAGE_VERTICAL_SIZE =
      (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
    const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
    const IMAGE_VERTICAL_MARGIN =
      (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;
  
    return (
      <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
        <Block>
          <Block row align="center" justify="space-between">
            <Text h5 semibold>
              Sport
            </Text>
            <Button>
              <Text p primary semibold>
                View all
              </Text>
            </Button>
          </Block>
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
        </Block>

        <Block>
          <Block row align="center" justify="space-between">
            <Text h5 semibold>
              Celebrations
            </Text>
            <Button>
              <Text p primary semibold>
                View all
              </Text>
            </Button>
          </Block>
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
        </Block>
      </Block>
    );
  };

const Search = () => {
  const {assets, sizes, colors } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
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
    {/* search input */}
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={t('common.search')} />
    </Block>
    <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <Block>
          <Gallery />
        </Block>
      </Block>
    </Block>
  );
};

export default Search;
