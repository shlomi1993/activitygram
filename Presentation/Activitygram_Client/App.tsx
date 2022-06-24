import React, { useEffect, useState, useContext } from 'react';
import { Platform } from 'react-native'
import { DataProvider, useData } from './src/hooks';
import AppNavigation from './src/navigation/App';

import img64 from './temp_img_var'

export const baseUri = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';

export default function App() {
  return (
    <DataProvider>
      <AppNavigation />
    </DataProvider>

  );
}
