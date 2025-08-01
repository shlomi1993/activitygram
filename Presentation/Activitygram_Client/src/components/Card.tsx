import React from 'react';
import { TouchableOpacity } from 'react-native';

import Block from './Block';
import Image from './Image';
import Text from './Text';
import { ICard } from '../constants/types';
import { useTheme, useTranslation } from '../hooks';
import {useNavigation} from '@react-navigation/native';


const Card = ({ images, _id, title, type, linkLabel, imageInRow, marginLeft, isProfile }: ICard) => {
  const { t } = useTranslation();
  const { assets, colors, sizes } = useTheme();
  const navigation = useNavigation();
  const styles = isProfile ? {marginRight: sizes.s} : {};
  const isHorizontal = type !== 'vertical';
  const num = imageInRow ? imageInRow : 2;
  const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / num;
  let image = images ? (images[0] ? images[0]['base64'] : undefined) : undefined;
  
  return (
    <Block
      card
      flex={0}
      row={false}
      marginBottom={sizes.sm}
      style={styles}
      width={CARD_WIDTH}>
      {image ? <Image
        resizeMode="cover"
        source={{uri: `data:image/png;base64,${image}`}}
        style={{
          height: isHorizontal ? 114 : 110,
          width: !isHorizontal ? '100%' : sizes.width / 2.435,
        }}
      /> : 
      <Image
        resizeMode="cover"
        source={assets.background}
        style={{
          height: isHorizontal ? 114 : 110,
          width: !isHorizontal ? '100%' : sizes.width / 2.435,
        }}
      />}
      <Block
        paddingTop={sizes.s}
        justify="space-between"
        paddingLeft={isHorizontal ? sizes.sm : 0}
        paddingBottom={isHorizontal ? sizes.s : 0}>
        <Text p marginBottom={sizes.s}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => {navigation.navigate('Activity', {activityId: _id})}}>
          <Block row flex={0} align="center">
            <Text
              p
              color={colors.link}
              semibold
              size={sizes.linkSize}
              marginRight={sizes.s}>
              {t('common.more')}
            </Text>
            <Image source={assets.arrow} color={colors.link} />
          </Block>
        </TouchableOpacity>
      </Block>
    </Block>
  );
};

export default Card;
