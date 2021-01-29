import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import NewPointComponent from '../components/NewPointComponent';
import AddScreen from '../screens/AddScreen';

export const AddNavigator = createAppContainer(
  createStackNavigator({
    Agregar: {
      screen: AddScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    AddChallengePoint: {
      screen: NewPointComponent,
      navigationOptions: {
        title: 'Agregar punto',
      },
    },
  }),
);
