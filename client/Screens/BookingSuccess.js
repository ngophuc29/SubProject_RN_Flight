  import React from "react";
  import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
  } from "react-native";
  import Icon from "react-native-vector-icons/MaterialIcons";

  export default function BookingSuccess({ navigation,route }) {
    const { totalPrice,

      adultCount,
      childrenCount,
      infantCount,
      fromLocation,
      toLocation,
      departureDate,
      returnDate,

      selectedClass,
      flightType,
      locations, airline, departureFlight, returnFlight, legs, price, travellers, username, avatar } = route.params;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: "https://beyondtype1.org/wp-content/uploads/2016/05/BT1-TAKE-TO-THE-SKIES-HEADER-2021-1200x429.jpg" }}
          style={styles.backgroundImage}
        >
          <View style={styles.card}>
            {/* Success Icon and Message */}
            <Icon
              name="check-circle"
              size={30}
              color="#f68a20"
              style={styles.successIcon}
            />
            <Text style={styles.successText}>Booking successful</Text>

            {/* Booking Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.locationCode}>LCY</Text>
                  <Text style={styles.dateText}>Tue, Jul 14</Text>
                </View>
                <Icon name="swap-horiz" size={24} color="#333" />
                <View style={styles.column}>
                  <Text style={styles.locationCode}>JFK</Text>
                  <Text style={styles.dateText}>Fri, Jul 17</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Traveller</Text>
                  <Text style={styles.infoText}>{travellers.adults[0].firstName} {travellers.adults[0].lastName}</Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Class</Text>
                  <Text style={styles.infoText}>{ selectedClass}</Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Flight</Text>
                  <Text style={styles.infoText}>{flightType}</Text>
                </View>
              </View>

              <Text style={styles.priceText}> ${totalPrice}</Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Booking detail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate("Home", { username, avatar })}
            >
              <Text style={styles.homeButtonText}>Home</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f7f7f7",
    },
    backgroundImage: {
      width: "100%",
      height: "300px", // chỉ chiếm 50% chiều cao màn hình
      resizeMode: "cover",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      width: "85%",
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
      marginTop:  '100%', // di chuyển thẻ card lên trên để lấn vào phần dưới của hình nền
    },  
    successIcon: {
      marginBottom: 10,
    },
    successText: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 20,
      color: "#333",
    },
    detailsContainer: {
      width: "100%",
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    column: {
      alignItems: "center",
    },
    locationCode: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
    },
    dateText: {
      fontSize: 14,
      color: "#888",
    },
    infoColumn: {
      alignItems: "center",
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: "#888",
      marginBottom: 2,
    },
    infoText: {
      fontSize: 14,
      color: "#333",
      fontWeight: "500",
    },
    priceText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 20,
    },
    detailButton: {
      backgroundColor: "#04c4d1",
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 40,
      marginBottom: 10,
    },
    detailButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    homeButton: {
      backgroundColor: "#ddd",
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 40,
    },
    homeButtonText: {
      color: "#333",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
