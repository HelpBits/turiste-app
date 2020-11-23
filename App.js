import 'react-native-gesture-handler';
import React, { Fragment, useState, useEffect } from 'react';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';
import TabNavigator from './src/navigation/TabNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import auth from '@react-native-firebase/auth';


const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(setUser);
    return subscriber;
  }, []);

  return (
    < Fragment >
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        {!user ? <AuthNavigator /> : <TabNavigator />}
      </ApplicationProvider>
    </Fragment >
  );
};

export default App;
