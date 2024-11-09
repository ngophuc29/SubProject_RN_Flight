// BookingTabs.js
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import RoundTrip from "./RoundTrip";
import MultiCity from "./MultiCity";
import OneWay from "./OneWay";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

const Tab = createMaterialTopTabNavigator();

export default function BookingTabs({ navigation, route }) {
  const { username, avatar } = route.params; // Lấy tên người dùng và avatar từ params

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ alignSelf: "flex-start", marginLeft: 20 }}
      >
        <Icon name="chevron-left" type="material" color="#333" size={40} />
      </TouchableOpacity>
      <Text style={styles.header}>Flight</Text>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14 },
          tabBarStyle: { backgroundColor: "#fff" },
          tabBarIndicatorStyle: { backgroundColor: "#00BCD4" },
        }}
      >
        <Tab.Screen
          name="Round-trip"
          component={RoundTrip}
          initialParams={{ username, avatar }}
        />
        <Tab.Screen
          name="One-way"
          component={OneWay}
          initialParams={{ username, avatar }}
        />
        <Tab.Screen
          name="Multi-city"
          component={MultiCity}
          initialParams={{ username, avatar }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
