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
  basket: IBasket;
  handleBasket: (data?: IBasket) => void;
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
  notifications: INotification[];
  handleNotifications: (data?: INotification[]) => void;
}

export interface ITranslate {
  locale: string;
  setLocale: (locale?: string) => void;
  t: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
  translate: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
}
export interface IExtra {
  id?: number;
  name?: string;
  time?: string;
  image: ImageSourcePropType;
  saved?: boolean;
  booked?: boolean;
  available?: boolean;
  onBook?: () => void;
  onSave?: () => void;
  onTimeSelect?: (id?: number) => void;
}

export interface IBasketItem {
  id?: number;
  image?: string;
  title?: string;
  description?: string;
  stock?: boolean;
  price?: number;
  qty?: number;
  qtys?: number[];
  size?: number | string;
  sizes?: number[] | string[];
}

export interface IBasket {
  subtotal?: number;
  items?: IBasketItem[];
  recommendations?: IBasketItem[];
}

export interface INotification {
  id?: number;
  subject?: string;
  message?: string;
  read?: boolean;
  business?: boolean;
  createdAt?: number | Date;
  type:
  | 'document'
  | 'documentation'
  | 'payment'
  | 'notification'
  | 'profile'
  | 'extras'
  | 'office';
}
