import i18n from 'i18n-js';
import { ImageSourcePropType } from 'react-native';
import { ITheme } from './theme';

export * from './components';
export * from './theme';

export interface IUser {
  id: number | string;
  name?: string;
  department?: string;
  avatar?: string;
  stats?: { posts?: number; followers?: number; following?: number };
  social?: { twitter?: string; dribbble?: string };
  about?: string;
}

export interface ICategory {
  id?: number;
  name?: string;
}
export interface IArticleOptions {
  id?: number;
  title?: string;
  description?: string;
  type?: 'celebrations' | 'sport' | 'other';
  sleeping?: { total?: number; type?: 'adults' | 'kids' };
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
  users: IUser[];
  handleUser: (data?: IUser) => void;
  handleUsers: (data?: IUser[]) => void;
  following: ICard[];
  setFollowing: (data?: ICard[]) => void;
  trending: ICard[];
  setTrending: (data?: ICard[]) => void;
  categories: ICategory[];
  setCategories: (data?: ICategory[]) => void;
  recommendations: IBigCard[];
  setRecommendations: (data?: IBigCard[]) => void;
  articles: IBigCard[];
  setArticles: (data?: IBigCard[]) => void;
  article: IBigCard;
  handleArticle: (data?: IBigCard) => void;
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

export interface IActivity {
  _id: string;
  common_interest: string;
  date: string;
  description: string;
  group_managers: any[];
  is_done: boolean;
  paticipants: any[];
  title: string;

}
