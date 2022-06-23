import i18n from 'i18n-js';
import {ImageSourcePropType} from 'react-native';
import {ITheme} from './theme';

export * from './components';
export * from './theme';

export interface ICategory {
  id?: number;
  name?: string;
}
export interface IArticleOptions {
  id?: number;
  title?: string;
  description?: string;
  type?: 'celebrations' | 'sport' | 'other';
  sleeping?: {total?: number; type?: 'adults' | 'kids'};
  guests?: number;
  price?: number;
  user?: IUser;
  image?: string;
}
export interface IBigCard {
  id?: number;
  title?: string;
  description?: string;
  category?: ICategory;
  image?: string;
  location?: ILocation;
  rating?: number;
  user?: IUser;
  offers?: ICard[];
  options?: IArticleOptions[];
  timestamp?: number;
  onPress?: (event?: any) => void;
}

export interface ICard {
  id?: number;
  title?: string;
  description?: string;
  image?: string;
  timestamp?: number;
  linkLabel?: string;
  type: 'vertical' | 'horizontal';
  imageInRow?: number;
  _id?: string;
  marginLeft?: string;
  isProfile?: boolean;
}
export interface ILocation {
  id?: number;
  city?: string;
  country?: string;
}
export interface IUseData {
  isDark: boolean;
  handleIsDark: (isDark?: boolean) => void;
  theme: ITheme;
  setTheme: (theme?: ITheme) => void;
  user: IUser;
  handleUser: (data?: IUser) => void;
  categories: ICategory[];
  setCategories: (data?: ICategory[]) => void;
  articles: IBigCard[];
  setArticles: (data?: IBigCard[]) => void;
  allActivities: IActivity[];
  setAllActivities: (data?: IActivity[]) => void;
  myActivities: IActivity[];
  setMyActivities: (data?: IActivity[]) => void;
  userEmail: string;
  setUserEmail: (data?: string) => void;
  getUserEmail: () => string;
}

export interface ITranslate {
  locale: string;
  setLocale: (locale?: string) => void;
  t: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
  translate: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
}

export interface IActivityComp {
  activityId: string;
}

export interface IUser {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  birthDate: Date,
  city: string,
  country: string;
  bio: string,
  interests?: string[],
  profileImage?: any[],
  activityLog?: any[],
  creationTime: string,
}

export interface IActivity {
  _id: string;
  title: string;
  initiator: string[];
  category: string;
  startDateTime: Date;
  endDateTime: Date;
  recurrent: boolean;
  geolocation: object;
  description: string;
  images: any[];
  managers: any[];
  participants: any[];
  participantLimit: number;
  status: string;
}
