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

import UserManagementScreen from "./Screens/ADMIN/UserManagementScreen";
import FlightManagementScreen from "./Screens/ADMIN/FlightManagementScreen";
import PassengerManagementScreen from "./Screens/ADMIN/PassengerManagementScreen";
import StatisticsScreen from "./Screens/ADMIN/StatisticsScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Dùng null để đại diện cho trạng thái loading

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        console.log('User loaded from AsyncStorage:', user); // Debugging log

        // Kiểm tra nếu user có tồn tại và không phải là chuỗi rỗng
        if (user && user !== "null" && user !== "") {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log('Error checking login status:', error);
        setIsLoggedIn(false); // Xử lý khi có lỗi
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    // Trả về màn hình loading hoặc không làm gì khi đang kiểm tra login status
    return null; // Bạn có thể thay thế `null` bằng một loading indicator nếu muốn
  }

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

        <Stack.Screen name="UserManagementScreen" component={UserManagementScreen} />
        <Stack.Screen name="FlightManagementScreen" component={FlightManagementScreen} />
        <Stack.Screen name="PassengerManagementScreen" component={PassengerManagementScreen} />
        <Stack.Screen name="StatisticsScreen" component={StatisticsScreen} />



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
