import React, { useEffect, useState, useContext } from 'react';
import { Platform } from 'react-native'
import { DataProvider, useData } from './src/hooks';
import AppNavigation from './src/navigation/App';

import img64 from './temp_img_var'

export const baseUri = Platform.OS === 'android' ? 'http://10.0.2.2:8080/' : 'http://127.0.0.1/8080/';

export const userContext = React.createContext({
  uid: 'TEMP_UID_1234',
  firebaseId: 'qazfzSLYfughUC3TyWeIqW8lNY12',
  username: 'TEST_USER_NAME',
  image: img64
});

export default function App() {

  // const [firebaseId, setFirebaseId] = useState('qazfzSLYfughUC3TyWeIqW8lNY12'); // TEMP
  // const [context, setContext] = useState({});
  // // useContext(userContext)

  // useEffect(() => {
  //   fetch(baseUri + `getUserContext?firebaseId=${firebaseId}`)
  //     .then((result) => result.json())
  //     .then((json) => {
  //       setContext(React.createContext(json));
  //     })
  //     .catch(() => console.error('Could not fetch user context.'));

  // });

  return (
    <DataProvider>
      <AppNavigation />
    </DataProvider>

  );
}
