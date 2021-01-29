import Toast from 'react-native-toast-message';
import { MessageTypeEnum } from '../constants/MessageTypeEnum';

export function showMessage(message, type) {
  let toastConfiguration = {
    type: type,
    text1: '',
    text2: message,
    position: 'top',
    visibilityTime: 2000,
    topOffset: 50,
  };

  switch (type) {
    case MessageTypeEnum.Success:
      toastConfiguration.text1 = 'Exito';
      break;
    case MessageTypeEnum.Info:
      toastConfiguration.text1 = 'Información';
      break;
    case MessageTypeEnum.Error:
      toastConfiguration.text1 = 'Error';
  }

  Toast.show(toastConfiguration);
}
