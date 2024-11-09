// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

import Home from "./Screens/Home";
import BookingTabs from "./Screens/BookingTabs"; // Import BookingTabs
import FlightDetail from "./Screens/FlightDetails";
import ResultFight from "./Screens/ResultFight";
import TravellerInformationUser from "./Screens/TravellerInformationUser";
import TravellerInformationBagage from "./Screens/TravellerInformationBagage";
import TravellerInformationSeats from "./Screens/TravellerInformationSeats";
import TravellerInformationPayment from "./Screens/TravellerInformationPayment";

import BookingSuccess from "./Screens/BookingSuccess";
import DangKy from './Screens/DangKy'
import DangNhap from './Screens/DangNhap'
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DangNhap"
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
