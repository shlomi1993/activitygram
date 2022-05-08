import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabsManager from './src/TabsManager/TabsManager';

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');
</style>

class App extends React.Component {

    render() {
    return (
      <NavigationContainer>
        <TabsManager />
      </NavigationContainer>
    );
  }

}


export default App;
