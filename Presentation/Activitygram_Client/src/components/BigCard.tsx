import React from 'react';
import dayjs from 'dayjs';
import {TouchableWithoutFeedback} from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import Button from './Button';
import {useTheme, useTranslation} from '../hooks/';
import {IBigCard} from '../constants/types';
import { size } from 'lodash';

const BigCard = ({
  image,
  onPress,
}: IBigCard) => {
  const {t} = useTranslation();
  const {colors, gradients, icons, sizes, assets} = useTheme();

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Block card white padding={0} marginTop={sizes.xl}>
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
              <Button success paddingHorizontal={sizes.sm} marginRight={sizes.sm}><Text white p bold>{t('forYou.interested')}</Text></Button>
              <Button danger paddingHorizontal={sizes.sm}><Text white p bold>{t('forYou.notInterested')}</Text></Button>
            </Block>
          </Block>
        </Image>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default BigCard;
