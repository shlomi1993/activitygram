import React, { useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';

import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Image, Text, Checkbox, Modal } from '../components';
import 'react-native-gesture-handler';
import { IActivity, IUser } from '../constants/types';
import { BASE_URL } from '../constants/appConstants';
const isAndroid = Platform.OS === 'android';

const Activity = ({ route }) => {
  const { assets, sizes, colors, gradients } = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  // const { user } = useData();
  const { t } = useTranslation();
  const [activity, setActivity] = useState<IActivity>();
  const [user, setUser] = useState<IUser>();
  // const [participants, setParticipants] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setModal] = useState(false);
  const { activityId } = route.params;

  useEffect(() => {
    fetch(BASE_URL + 'getActivityById?activity_id=' + activityId, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setActivity(responseJson)
      })
      .catch((error) => {
        console.error(error + " detected");
      });
  }, [activity])

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

  const title = activity ? activity.title : '';
  const description = activity ? activity.description : '';
  // const time = activity ? activity.date : '';

  const going = (activity && activity.participants.length) || 0;
  const left = (activity && (activity.participantLimit - activity.participants.length)) || 0;
  const inTotal = (activity && activity.participantLimit) || 0;

  const onPressJoin = () => {
    const userId = '627659c91fbdd7e2c67d5e11';
    fetch(BASE_URL + 'getUserById?user_id=' + userId, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setUser(responseJson);
      })
      .then(() => {
        let updatedParticipants: string[] = activity.participants ? activity.participants : [];
        updatedParticipants.push(userId);
        fetch(BASE_URL + 'updateActivityParticipants?activity_id=' + activity._id + '&participants=' + encodeURIComponent(JSON.stringify(updatedParticipants)), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
        })
      })
      .then(() => {
        setModal(true);
      })
      .catch((error) => {
        console.error(error + " detected");
      });
  }
  return (
    <Block safe>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.padding }}>
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
                {title}
              </Text>
              <Text p center white marginBottom={sizes.md}>
              {description}
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
                <Text h5>{going}</Text>
                <Text>{t('activity.going')}</Text>
              </Block>
              <Block align="center">
                <Text h5>{left}</Text>
                <Text>{t('activity.left')}</Text>
              </Block>
              <Block align="center">
                <Text h5>{inTotal}</Text>
                <Text>{t('activity.inTotal')}</Text>
              </Block>
            </Block>
          </Block>
          <Block align="center">
            <Button light marginBottom={sizes.xs} marginTop={sizes.s} radius={15} paddingRight={sizes.l} paddingLeft={sizes.l} onPress={() => {onPressJoin()}}>
              <Text bold transform="uppercase">
                {t('activity.join')}
              </Text>
            </Button>
          </Block>
          

          <Block paddingHorizontal={sizes.sm} marginTop={sizes.sm}>
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
              <Checkbox checked={isChecked} onPress={() => setIsChecked(!isChecked)} />
              <Text p marginLeft={sizes.sm}>
                I want to be a manager
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
      <Modal visible={showModal} onRequestClose={() => setModal(false)} >
            <Text h3 white marginBottom={sizes.xl} center>{t('activity.joined')}</Text>
          </Modal>
    </Block>
  );
};

export default Activity;
