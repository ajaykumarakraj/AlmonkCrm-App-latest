import { Alert, InteractionManager } from 'react-native';

export const safeAlert = (title, message) => {
  InteractionManager.runAfterInteractions(() => {
    Alert.alert(title, message);
  });
};