import React, {useLayoutEffect, useState, useCallback } from 'react';
import {Platform, Linking} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Image, Text, Checkbox } from '../components';
import 'react-native-gesture-handler';

const isAndroid = Platform.OS === 'android';

const ActivityCreatedSuccessfully = () => {
  const {assets, sizes, colors } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const {user} = useData();
  const {t} = useTranslation();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Block safe>
        <Image source={assets.success} width={280} height={280} marginLeft={sizes.xxl} marginTop={sizes.m}></Image>
        <Text h2 center marginTop={sizes.xl} >
            Activity Created Successfully!
        </Text>
        <Button>
        <Block row marginTop={sizes.sm}>
        <Image
            radius={0}
            width={10}
            height={15}
            color={colors.black}
            source={assets.arrow}
            transform={[{rotate: '180deg'}]}
            marginTop={sizes.xs}
        />
        <Text h5 semibold marginLeft={sizes.s}>Show Activity </Text>
        </Block>
        </Button>
    </Block>
  );
};

export default ActivityCreatedSuccessfully;
