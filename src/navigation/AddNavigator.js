import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AddScreen from '../screens/AddScreen';
import NewPointComponent from '../components/NewPointComponent';

export const AddNavigator = createAppContainer(
  createStackNavigator({
    Agregar: {
      screen: AddScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    AgregarPunto: {
      screen: NewPointComponent,
      navigationOptions: {
        title: 'Agregar punto',
      },
    },
  }),
);
