import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from "./Screens/Home";
import BookingTabs from "./Screens/BookingTabs";
import FlightDetail from "./Screens/FlightDetails";
import ResultFight from "./Screens/ResultFight";
import TravellerInformationUser from "./Screens/TravellerInformationUser";
import TravellerInformationBagage from "./Screens/TravellerInformationBagage";
import TravellerInformationSeats from "./Screens/TravellerInformationSeats";
import TravellerInformationPayment from "./Screens/TravellerInformationPayment";
import BookingSuccess from "./Screens/BookingSuccess";
import DangKy from './Screens/DangKy';
import DangNhap from './Screens/DangNhap';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user'); // Kiểm tra xem có user không
        if (user) {
          setIsLoggedIn(true); // Nếu có, người dùng đã đăng nhập
        } else {
          setIsLoggedIn(false); // Nếu không có, người dùng chưa đăng nhập
        }
      } catch (error) {
        console.log(error);
        setIsLoggedIn(false); // Xử lý khi có lỗi
      }
    };

    checkLoginStatus();
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "Home" : "DangNhap"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BookingTabs" component={BookingTabs} />
        <Stack.Screen name="FlightDetail" component={FlightDetail} />
        <Stack.Screen name="ResultFight" component={ResultFight} />
        <Stack.Screen
          name="TravellerInformationUser"
          component={TravellerInformationUser}
        />
        <Stack.Screen
          name="TravellerInformationBagage"
          component={TravellerInformationBagage}
        />
        <Stack.Screen
          name="TravellerInformationSeats"
          component={TravellerInformationSeats}
        />
        <Stack.Screen
          name="TravellerInformationPayment"
          component={TravellerInformationPayment}
        />
        <Stack.Screen name="BookingSuccess" component={BookingSuccess} />
        <Stack.Screen name="DangKy" component={DangKy} />
        <Stack.Screen name="DangNhap" component={DangNhap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
