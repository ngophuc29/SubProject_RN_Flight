import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Stepper from "./Stepper";

const TravellerInformationSeats = ({ navigation, route }) => {
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

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedSeatPrice, setSelectedSeatPrice] = useState(null);
  const [seats, setSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentTraveller, setCurrentTraveller] = useState(0); // Default to the first traveller

  const rows = 8;
  const columns = ["A", "B", "C", "D", "E", "F"];
  const totalTravellers = adultCount + childrenCount + infantCount;

  useEffect(() => {
    initializeSeats();
  }, []);

  const initializeSeats = () => {
    const newSeats = {};
    for (let row = 1; row <= rows; row++) {
      for (let col of columns) {
        const seatKey = `${row}${col}`;
        newSeats[seatKey] = Math.random() > 0.7 ? "unavailable" : "available";
      }
    }
    setSeats(newSeats);
  };

  const handleSeatPress = (seatKey) => {
    if (seats[seatKey] === "available") {
      setSelectedSeat(seatKey);
      const price = 5 + Math.random() * 5; // You can replace this with a fixed price calculation if needed
      setSelectedSeatPrice(price);
    }
  };

  const confirmSeatSelection = () => {
    if (selectedSeat && selectedSeatPrice !== null) {
      const updatedSeats = [...selectedSeats];
      updatedSeats[currentTraveller] = { seat: selectedSeat, price: selectedSeatPrice };
      setSelectedSeats(updatedSeats);

      if (currentTraveller < totalTravellers - 1) {
        setCurrentTraveller(currentTraveller + 1); // Move to next traveller
      } else {
        alert("All seats selected!");
        navigation.navigate("NextScreen"); // Navigate after the last traveller
      }

      setSelectedSeat(null);
      setSelectedSeatPrice(null);
    }
  };

  const renderSeatGrid = () => (
    <View style={styles.seatGrid}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.seatRow}>
          {columns.map((col) => {
            const seatKey = `${rowIndex + 1}${col}`;
            const seatStatus = seats[seatKey];
            const isSeatSelected = selectedSeats.some(seat => seat.seat === seatKey);

            return (
              <TouchableOpacity
                key={col}
                style={[
                  styles.seatBox,
                  seatStatus === "available"
                    ? isSeatSelected
                      ? styles.confirmedSeat
                      : selectedSeat === seatKey
                        ? styles.selectedSeat
                        : styles.availableSeat
                    : styles.unavailableSeat
                ]}
                onPress={() => seatStatus === "available" && handleSeatPress(seatKey)}
                disabled={seatStatus !== "available"}
              >
                <Text style={seatStatus === "available" && !isSeatSelected ? styles.seatText : styles.unavailableText}>
                  {seatStatus === "available" && !isSeatSelected ? `${col}${rowIndex + 1}` : "X"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Stepper navigation={navigation} currentStep={3} />
      </View>
      <Text style={styles.header}>Seat Selection</Text>
      {renderSeatGrid()}

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalPrice}>${totalPrice}</Text>
          <Text style={styles.baggageSubText}>{totalTravellers} travellers</Text>
          <Text style={styles.baggageSubText}>
            Traveller {currentTraveller + 1} of {totalTravellers}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            if (currentTraveller === totalTravellers - 1 && selectedSeat === null) {
              navigation.navigate("TravellerInformationPayment",
                {
                  totalPrice: `${price * (adultCount + childrenCount + infantCount)}`,

                  adultCount,
                  childrenCount,
                  infantCount,
                  fromLocation,
                  toLocation,
                  departureDate,
                  returnDate,

                  selectedClass,
                  flightType,
                  locations, airline, departureFlight, returnFlight, legs, price, travellers,
                  username, avatar

                }
              ) // Hiển thị alert chỉ khi văn bản là "Next" và không có ghế đã chọn
            } else {
              confirmSeatSelection(); // Tiến hành xác nhận ghế khi đã chọn ghế
            }
          }}
        >
          <Text style={styles.nextButtonText}>
            {selectedSeat ? "Confirm" : currentTraveller === totalTravellers - 1 ? "Next" : "Select a seat"}
          </Text>
        </TouchableOpacity>

      </View>

      {/* <View style={styles.modalFooter}>
        <Text style={styles.selectionText}>
          {selectedSeat
            ? `Selected seat: ${selectedSeat} - $${selectedSeatPrice.toFixed(2)}`
            : "Select a seat"}
        </Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  baggageSubText: {
    color: "#666",
    marginVertical: 4,
    fontSize: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  seatGrid: {
    alignItems: "center",
  },
  seatRow: {
    flexDirection: "row",
  },
  seatBox: {
    width: 30,
    height: 30,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  availableSeat: {
    backgroundColor: "#e0e0e0",
  },
  unavailableSeat: {
    backgroundColor: "#ccc",
  },
  selectedSeat: {
    backgroundColor: "#00CFFF",
  },
  confirmedSeat: {
    backgroundColor: "#00FF00", // Confirmed seats will have a green color
  },
  seatText: {
    fontSize: 10,
  },
  unavailableText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#00CFFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectionText: {
    fontSize: 16,
  },
  headerContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default TravellerInformationSeats;
