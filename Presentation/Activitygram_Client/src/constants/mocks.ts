import dayjs from 'dayjs';
import {
  IBigCard,
  IArticleOptions,
  ICategory,
  ILocation,
  ICard,
  IUser,
} from './types';

// users
export const USERS: IUser[] = [
  {
    id: 1,
    name: 'Devin Coldewey',
    department: 'Marketing Manager',
    stats: { posts: 323, followers: 53200, following: 749000 },
    social: { twitter: 'CreativeTim', dribbble: 'creativetim' },
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?fit=crop&w=80&q=80',
  },
  {
    id: 2,
    name: 'Bella Audrey',
    department: 'Marketing Manager',
    stats: { posts: 323, followers: 53200, following: 749000 },
    social: { twitter: 'CreativeTim', dribbble: 'creativetim' },
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=80&q=80',
  },
  {
    id: 3,
    name: 'Miriam Lendra',
    department: 'Desktop Publisher',
    stats: { posts: 323, followers: 53200, following: 749000 },
    social: { twitter: 'CreativeTim', dribbble: 'creativetim' },
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=80&q=80',
  },
  {
    id: 4,
    name: 'David Bishop',
    department: 'Marketing Manager',
    stats: { posts: 323, followers: 53200, following: 749000 },
    social: { twitter: 'CreativeTim', dribbble: 'creativetim' },
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?fit=crop&w=80&q=80',
  },
  {
    id: 5,
    name: 'Mathew Glock',
    department: 'HR Manager',
    stats: { posts: 323, followers: 53200, following: 749000 },
    social: { twitter: 'CreativeTim', dribbble: 'creativetim' },
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?fit=crop&w=80&q=80',
  },
  {
    id: 6,
    name: 'Emma Roberts',
    department: 'HR Manager',
    stats: { posts: 323, followers: 53200, following: 749000 },
    social: { twitter: 'CreativeTim', dribbble: 'creativetim' },
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?fit=crop&w=80&q=80',
  },
];

// following cards
export const FOLLOWING: ICard[] = [
  {
    id: 1,
    type: 'vertical',
    title: 'Unique activities with local experts.',
    image:
      'https://images.unsplash.com/photo-1604998103924-89e012e5265a?fit=crop&w=450&q=80',
  },
  {
    id: 2,
    type: 'vertical',
    title: 'The highest status people.',
    image:
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?fit=crop&w=450&q=80',
  },
  {
    id: 3,
    type: 'horizontal',
    title: 'Experiences and things to do wherever you are.',
    image:
      'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?fit=crop&w=450&q=80',
  },
  {
    id: 4,
    type: 'vertical',
    title: 'Get more followers and grow.',
    image:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?fit=crop&w=450&q=80',
  },
  {
    id: 5,
    type: 'vertical',
    title: 'New ways to meet your business goals.',
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fit=crop&w=450&q=80',
  },
  {
    id: 6,
    type: 'horizontal',
    title: 'Adventures - Multi day trips with meals and stays.',
    image:
      'https://images.unsplash.com/photo-1468078809804-4c7b3e60a478?fit=crop&w=450&q=80',
  },
];

// trending cards
export const TRENDING: ICard[] = [
  {
    id: 1,
    type: 'horizontal',
    title: 'Experiences and things to do wherever you are.',
    image:
      'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?fit=crop&w=450&q=80',
  },
  {
    id: 2,
    type: 'vertical',
    title: 'The highest status people.',
    image:
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?fit=crop&w=450&q=80',
  },
  {
    id: 3,
    type: 'vertical',
    title: 'Unique activities with local experts.',
    image:
      'https://images.unsplash.com/photo-1604998103924-89e012e5265a?fit=crop&w=450&q=80',
  },
  {
    id: 4,
    type: 'vertical',
    title: 'Adventures - Multi day trips with meals and stays.',
    image:
      'https://images.unsplash.com/photo-1468078809804-4c7b3e60a478?fit=crop&w=450&q=80',
  },
  {
    id: 5,
    type: 'vertical',
    title: 'New ways to meet your business goals.',
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fit=crop&w=450&q=80',
  },
];

// categories
export const CATEGORIES: ICategory[] = [
  { id: 1, name: 'InterestTop1' },
  { id: 2, name: 'InterestTop2' },
  { id: 3, name: 'InterestTop3' },
  { id: 4, name: 'InterestTop4' },
];

// article options
export const ARTICLE_OPTIONS: IArticleOptions[] = [
  {
    id: 1,
    title: 'Best party in town',
    description:
      '18+ only',
    type: 'celebrations',
    guests: 1,
    sleeping: { total: 1, type: 'adults' },
    price: 89,
    user: USERS[0],
    image:
      'https://images.unsplash.com/photo-1543489822-c49534f3271f?fit=crop&w=450&q=80',
  },
];

// articles
export const ARTICLES: IBigCard[] = [
  {
    id: 1,
    title: 'Flexible office space means growth.',
    description:
      'Rather than worrying about switching offices every couple years, you can instead stay in the same location.',
    category: CATEGORIES[0],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1604998103924-89e012e5265a?fit=crop&w=450&q=80',
    user: USERS[0],
    timestamp: dayjs().unix(),
  },
  {
    id: 2,
    title: 'Global payments in a single integration.',
    description:
      'Rather than worrying about switching offices every couple years, you can instead stay.',
    category: CATEGORIES[0],
    options: ARTICLE_OPTIONS,
    image:
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?fit=crop&w=450&q=80',
    user: USERS[1],
    timestamp: dayjs().unix(),
  },
];

// chat messages
export const MESSSAGES = [
  {
    _id: 1,
    text: 'Bye, bye 👋🏻',
    createdAt: dayjs().subtract(1, 'm').toDate(),
    user: {
      _id: USERS[0].id,
      name: USERS[0].name,
      avatar: USERS[0].avatar,
    },
  },
  {
    _id: 2,
    text: 'Ok. Cool! See you 😁',
    createdAt: dayjs().subtract(2, 'm').toDate(),
    user: {
      _id: USERS[1].id,
      name: USERS[1].name,
      avatar: USERS[1].avatar,
    },
  },
  {
    _id: 3,
    text: 'Sure, just let me finish somerhing and I’ll call you.',
    createdAt: dayjs().subtract(3, 'm').toDate(),
    user: {
      _id: USERS[0].id,
      name: USERS[0].name,
      avatar: USERS[0].avatar,
    },
  },
  {
    _id: 4,
    text: 'Hey there! How are you today? Can we meet and talk about location? Thanks!',
    createdAt: dayjs().subtract(4, 'm').toDate(),
    user: {
      _id: USERS[1].id,
      name: USERS[1].name,
      avatar: USERS[1].avatar,
    },
  },
];

export default {
  USERS,
  FOLLOWING,
  TRENDING,
  CATEGORIES,
  ARTICLES,
  MESSSAGES,
};
