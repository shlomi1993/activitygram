import React, {useCallback, useContext, useEffect, useState} from 'react';
import Storage from '@react-native-async-storage/async-storage';

import {
  IBigCard,
  ICategory,
  ICard,
  IUser,
  IUseData,
  ITheme,
  IActivity,
} from '../constants/types';

import {
  USERS,
  FOLLOWING,
  TRENDING,
  CATEGORIES,
  ARTICLES,
} from '../constants/mocks';
import {light} from '../constants';
import { BASE_URL } from '../constants/appConstants';

export const DataContext = React.createContext({});

export const DataProvider = ({children}: {children: React.ReactNode}) => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<ITheme>(light);
  const [user, setUser] = useState<IUser>();
  const [categories, setCategories] = useState<ICategory[]>(CATEGORIES);
  const [articles, setArticles] = useState<IBigCard[]>(ARTICLES);
  const [article, setArticle] = useState<IBigCard>({});
  const [userEmail, setUserEmail] = useState<string>();
  const [allActivities, setAllActivities] = useState<IActivity[]>();

  // get isDark mode from storage
  const getIsDark = useCallback(async () => {
    // get preferance gtom storage
    const isDarkJSON = await Storage.getItem('isDark');

    if (isDarkJSON !== null) {
      // set isDark / compare if has updated
      setIsDark(JSON.parse(isDarkJSON));
    }
  }, [setIsDark]);

  const getUserEmail = useCallback(async () => {
    const userEmail = await Storage.getItem('userEmail');
    if (userEmail !== null) {
      setUserEmail(userEmail);
      fetch(BASE_URL + 'getUserByEmail?user_email=' + userEmail.toString(), {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setUser(responseJson);
        })
        .catch((error) => {
          console.error(error + " detected");
        });
  
    }
  }, [user, setUser, setUserEmail]);

  // handle isDark mode
  const handleIsDark = useCallback(
    (payload: boolean) => {
      // set isDark / compare if has updated
      setIsDark(payload);
      // save preferance to storage
      Storage.setItem('isDark', JSON.stringify(payload));
    },
    [setIsDark],
  );
  // handle user
  const handleUser = useCallback(
    (payload: IUser) => {
      // set user / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(user)) {
        setUser(payload);
      }
    },
    [user, setUser],
  );

  // handle Article
  const handleArticle = useCallback(
    (payload: IBigCard) => {
      // set article / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(article)) {
        setArticle(payload);
      }
    },
    [article, setArticle],
  );

  // get initial data for: isDark & language
  useEffect(() => {
    getIsDark();
  }, [getIsDark]);

  // change theme based on isDark updates
  useEffect(() => {
    setTheme(isDark ? light : light);
  }, [isDark]);

  useEffect(() => {
  }, [isDark]);

  useEffect(() => {
    getUserEmail();
  }, []);

  const contextValue = {
    isDark,
    handleIsDark,
    theme,
    setTheme,
    user,
    handleUser,
    categories,
    setCategories,
    articles,
    setArticles,
    article,
    handleArticle,
    userEmail,
    setUserEmail,
    getUserEmail
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext) as IUseData;