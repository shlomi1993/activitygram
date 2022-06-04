import React from 'react';
import {TouchableOpacity} from 'react-native';

import Block from './Block';
import Image from './Image';
import Text from './Text';
import {ICard} from '../constants/types';
import {useTheme, useTranslation} from '../hooks';

const Card = ({image, title, type, linkLabel, imageInRow}: ICard) => {
  const {t} = useTranslation();
  const {assets, colors, sizes} = useTheme();

  const isHorizontal = type !== 'vertical';
  const num = imageInRow ? imageInRow : 2
  const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / num;

  return (
    <Block
      card
      flex={0}
      row={false}
      marginBottom={sizes.sm}
      width={CARD_WIDTH }>
      <Image
        resizeMode="cover"
        source={assets.background}
        style={{
          height: isHorizontal ? 114 : 110,
          width: !isHorizontal ? '100%' : sizes.width / 2.435,
        }}
      />
      <Block
        paddingTop={sizes.s}
        justify="space-between"
        paddingLeft={isHorizontal ? sizes.sm : 0}
        paddingBottom={isHorizontal ? sizes.s : 0}>
        <Text p marginBottom={sizes.s}>
          {title}
        </Text>
        <TouchableOpacity>
          <Block row flex={0} align="center">
            <Text
              p
              color={colors.link}
              semibold
              size={sizes.linkSize}
              marginRight={sizes.s}>
              {t('common.register')}
            </Text>
            <Image source={assets.arrow} color={colors.link} />
          </Block>
        </TouchableOpacity>
      </Block>
    </Block>
  );
};

export default Card;
