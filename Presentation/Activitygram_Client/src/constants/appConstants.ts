import { Platform} from 'react-native';

export const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';


export const INTERESTS = ['Swimming', 'Basketball'];