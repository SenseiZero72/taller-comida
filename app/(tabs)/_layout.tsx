import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.navBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeTabContainer : styles.inactiveTabContainer}>
              <View style={focused ? styles.activeIconCircle : null}>
                <Ionicons name={focused ? "home" : "home-outline"} size={22} color={focused ? '#FFFFFF' : color} />
              </View>
              
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'SEARCH',
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeTabContainer : styles.inactiveTabContainer}>
              <View style={focused ? styles.activeIconCircle : null}>
                <Ionicons name={focused ? "search" : "search-outline"} size={22} color={focused ? '#FFFFFF' : color} />
              </View>
              
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'FAVORITES',
          tabBarIcon: ({ focused, color }) => (
            <View style={focused ? styles.activeTabContainer : styles.inactiveTabContainer}>
              <View style={focused ? styles.activeIconCircle : null}>
                <Ionicons name={focused ? "heart" : "heart-outline"} size={22} color={focused ? '#FFFFFF' : color} />
              </View>
              
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navBar: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute',
    paddingTop: 4,
    bottom: 0,
  },
  activeTabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  inactiveTabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  activeIconCircle: {
    backgroundColor: '#0F7A3E',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});