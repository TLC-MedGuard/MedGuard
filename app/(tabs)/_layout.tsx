import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarActiveTintColor: COLORS.blue,
            tabBarStyle:{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                elevation: 0,
                backgroundColor: COLORS.white,
                borderTopWidth: 0,
                height: 60,
                paddingTop: 10,
                paddingBottom: 10,
            },
            tabBarItemStyle: {
                height: '100%', 
                justifyContent: "center", 
                alignItems: "center", 
              },
        }}
    >
        <Tabs.Screen 
            name="index" 
            options={{
                tabBarIcon: ({size, color }) => <MaterialCommunityIcons name="home-variant-outline" size={size} color={color} />, 
            }}
        />
        <Tabs.Screen 
            name="medications"  
            options={{
                tabBarIcon: ({size, color }) => <MaterialCommunityIcons name="pill" size={size} color={color} />, 
            }}
        />
        <Tabs.Screen 
            name="scan"  
            options={{
                tabBarIcon: ({size, color }) => <MaterialCommunityIcons name="scan-helper" size={size} color={COLORS.blue} />, 
            }}
        />
        <Tabs.Screen 
            name="reminders"  
            options={{
                tabBarIcon: ({ size, color }) => (
  <MaterialCommunityIcons name="heart-outline" size={size} color={color} />
)

            }}
        />
        <Tabs.Screen 
            name="profile" 
            options={{
                tabBarIcon: ({size, color }) => <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />, 
            }}
        />
    </Tabs>
  )
}