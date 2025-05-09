import React from 'react';
import { Text, Image, View } from 'react-native';
import '../global.css';

export default function WelcomeScreen() {
  return (
    <View className="bg-white flex-1 justify-center items-center">
      <Image
        className="w-2 h-2 mb-5"
        source={require('../assets/images/WhatsApp_icon.png')}
      />
      <Text className="text-xl font-bold text-black">Welcome to ChatApp</Text>
    </View>
  );
}
