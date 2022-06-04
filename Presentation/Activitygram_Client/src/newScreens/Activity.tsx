import React, {useLayoutEffect, useState, useCallback } from 'react';
import {Platform, Linking} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Image, Text, Checkbox } from '../components';
import 'react-native-gesture-handler';

const isAndroid = Platform.OS === 'android';

const Activity = () => {
  const {assets, sizes, colors } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const {user} = useData();
  const {t} = useTranslation();
  const [isChecked, setIsChecked] = useState(false);

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
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0} paddingTop={sizes.l} paddingBottom={sizes.l}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.cardRadius}
            source={assets.background}>
            <Block flex={0} align="center">
              <Text h5 center white size={24} marginTop={sizes.sm}>
                Activity Name
              </Text>
              <Text p center white marginBottom={sizes.md}>
                Description
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
              row
              blur
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              tint={colors.blurTint}
              justify="space-evenly"
              paddingVertical={sizes.sm}
              renderToHardwareTextureAndroid>
              <Block align="center">
                <Text h5>0</Text>
                <Text>{t('activity.going')}</Text>
              </Block>
              <Block align="center">
                <Text h5>0</Text>
                <Text>{t('activity.left')}</Text>
              </Block>
              <Block align="center">
                <Text h5>0</Text>
                <Text>{t('activity.inTotal')}</Text>
              </Block>
            </Block>
          </Block>

          <Block paddingHorizontal={sizes.sm} marginTop={sizes.l}>
          <Block row align="center" justify="space-between" marginBottom={sizes.l}>
            <Text h5 semibold>
            {t('activity.time')}
            </Text>
            <Text p secondary semibold>
                placeholder
            </Text>
          </Block>
          <Block row align="center" justify="space-between" marginBottom={sizes.l}>
            <Text h5 semibold>
            {t('activity.createdBy')}
            </Text>
            <Text p secondary semibold>
                placeholder
            </Text>
          </Block>
          <Block row align="center" justify="space-between" marginBottom={sizes.l}>
            <Text h5 semibold>
            {t('activity.notes')}
            </Text>
            <Text p secondary semibold>
                placeholder
            </Text>
          </Block>
          <Block row marginBottom={sizes.l}>
              <Checkbox checked={isChecked} onPress={() => setIsChecked(!isChecked)}/>
              <Text p marginLeft={sizes.sm}>
                 I want to be a manager
            </Text>
          </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Activity;
