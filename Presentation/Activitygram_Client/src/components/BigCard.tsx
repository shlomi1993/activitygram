import React from 'react';
import dayjs from 'dayjs';
import {TouchableWithoutFeedback} from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import {useTheme, useTranslation} from '../hooks/';
import {IBigCard} from '../constants/types';

const BigCard = ({
  image,
  onPress,
}: IBigCard) => {
  const {t} = useTranslation();
  const {colors, gradients, icons, sizes} = useTheme();

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Block card white padding={0} marginTop={sizes.xl}>
        <Image
          background
          resizeMode="cover"
          radius={sizes.cardRadius}
          source={{uri: image}}>
          <Block color={colors.overlay} padding={sizes.padding}>
            <Text h4 white marginBottom={sizes.sm} marginTop={sizes.cardPadding}>
              Activity title
            </Text>
            <Text p white marginBottom={sizes.sm}>
              Activity Description
            </Text>
            <Block row align="center" marginBottom={sizes.sm}>
              <Image source={icons.location} marginRight={sizes.s} />
              <Text p size={12} semibold white>
                Activity Location
              </Text>
            </Block>
            {/* Need to change icons */}
            <Block row align="center" marginBottom={sizes.cardPadding}>
              <Image source={icons.location} marginRight={sizes.s} />
              <Text p size={18} semibold white>
                Show Activity
              </Text>
              <Text p bold marginHorizontal={sizes.s} white>
                •
              </Text>
              <Image source={icons.location} marginRight={sizes.s} />
              <Text p size={18} semibold white>
                Skip to others
              </Text>
            </Block>
          </Block>
        </Image>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default BigCard;
