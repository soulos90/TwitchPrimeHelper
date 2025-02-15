import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  '(tabs)': NavigatorScreenParams<TabStackParamList>;
  'modal': undefined;
  'not-found': undefined;
};

export type TabStackParamList = {
  'index': undefined;
  'explore': undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
