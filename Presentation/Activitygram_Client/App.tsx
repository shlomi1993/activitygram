import 'react-native-gesture-handler';
import React from 'react';

import { DataProvider } from './src/hooks';
import AppNavigation from './src/navigation/App';

export const userContext = React.createContext({ uid: 'TEMP_UID_1234', image: 'some_base64_string'});

export default function App() {
  return (
    <DataProvider>
      <AppNavigation />
    </DataProvider>

  );
}
