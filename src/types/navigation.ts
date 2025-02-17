import { NavigatorScreenParams } from '@react-navigation/native';
import { TodoItem } from '../components/TodoList';

export type RootStackParamList = {
  '(tabs)': NavigatorScreenParams<TabStackParamList>;
  'modal': undefined;
  'not-found': undefined;
  'tododetail': {
    screen: 'tododetail',
    id: string;
    title: string;
    description: string;
    url?: string;
  };
};

export type TabStackParamList = {
  'index': undefined;
  'explore': undefined;
  'tododetail': {
    id: string;
    title: string;
    description: string;
    url?: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
