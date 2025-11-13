import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
// Firebase 제거됨 - 로컬 스토리지 사용
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import VoteScreen from './src/screens/VoteScreen';
import ResultScreen from './src/screens/ResultScreen';
import QuestionCreateScreen from './src/screens/QuestionCreateScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Firebase 초기화 불필요
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0ea5e9',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: '즉결심판' }}
          />
          <Stack.Screen 
            name="Vote" 
            component={VoteScreen}
            options={{ title: '투표하기' }}
          />
          <Stack.Screen 
            name="Result" 
            component={ResultScreen}
            options={{ title: '투표 결과' }}
          />
          <Stack.Screen 
            name="QuestionCreate" 
            component={QuestionCreateScreen}
            options={{ title: '고민 작성하기' }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ title: '마이페이지' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

