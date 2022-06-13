import 'react-native-gesture-handler';
import React from 'react';

import { DataProvider } from './src/hooks';
import AppNavigation from './src/navigation/App';

import img64 from './temp_img_var'

export const userContext = React.createContext({
    uid: 'TEMP_UID_1234',
    username: 'TEST_USER_NAME',
    image: img64
});

export default function App() {
  return (
    <DataProvider>
      <AppNavigation />
    </DataProvider>

  );
}
