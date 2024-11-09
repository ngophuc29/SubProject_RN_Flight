import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import Stepper from "./Stepper";

const TravellerInformationBagage = ({ navigation, route }) => {
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

  const [checkedBag, setCheckedBag] = useState("oneBag");  // Lưu trạng thái chọn bag
  const [personalItem, setPersonalItem] = useState(false);  // Lưu trạng thái của personal item
  const [travelProtection, setTravelProtection] = useState("noInsurance");

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
      <View>
        <View style={{ backgroundColor: "#fff" }}>
          <Stepper navigation={navigation} currentStep={2} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Cabin bags</Text>
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setPersonalItem(!personalItem)}  // Thay đổi trạng thái khi chọn Personal Item
      >
        <Icon name="briefcase" type="feather" color="#000" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Personal item only</Text>
          <Text style={styles.optionSubtitle}>Included per traveller</Text>
        </View>
        <Icon
          name={personalItem ? "dot-circle" : "circle"}
          type="font-awesome-5"
          color={personalItem ? "#007bff" : "#aaa"}
        />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Checked bags</Text>
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => {
          setCheckedBag("oneBag");
          setPersonalItem(false);  // Nếu chọn checked bag, bỏ chọn personal item
        }}
      >
        <Icon name="suitcase" type="font-awesome" color="#000" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>
            1 checked bag (Max weight 22.1 lbs)
          </Text>
          <Text style={styles.optionSubtitle}>from $19.99</Text>
        </View>
        <Icon
          name={checkedBag === "oneBag" ? "dot-circle" : "circle"}
          type="font-awesome-5"
          color={checkedBag === "oneBag" ? "#007bff" : "#aaa"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => {
          setCheckedBag("noBag");
          setPersonalItem(false);  // Nếu chọn no checked bag, bỏ chọn personal item
        }}
      >
        <Icon name="suitcase-rolling" type="font-awesome-5" color="#aaa" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>No checked bag</Text>
          <Text style={styles.optionSubtitle}>$0.00</Text>
        </View>
        <Icon
          name={checkedBag === "noBag" ? "dot-circle" : "circle"}
          type="font-awesome-5"
          color={checkedBag === "noBag" ? "#007bff" : "#aaa"}
        />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Travel protection</Text>
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setTravelProtection("insurance")}
      >
        <Icon name="shield" type="font-awesome" color="#000" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Travel protection plan</Text>
          <Text style={styles.optionSubtitle}>from $19.99</Text>
          <View style={styles.protectionDetails}>
            <Text style={styles.protectionItem}>
              ✓ Laboris exercitation Lorem anim pariatur
            </Text>
            <Text style={styles.protectionItem}>
              ✓ Duis aute irure dolor in reprehenderit
            </Text>
            <Text style={styles.protectionItem}>
              ✓ Incididunt amet cupidatat elit enim
            </Text>
            <Text style={styles.protectionItem}>
              ✓ Magna eu mollit veniam ipsum
            </Text>
          </View>
        </View>
        <Icon
          name={travelProtection === "insurance" ? "dot-circle" : "circle"}
          type="font-awesome-5"
          color={travelProtection === "insurance" ? "#007bff" : "#aaa"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setTravelProtection("noInsurance")}
      >
        <Icon name="times-circle" type="font-awesome" color="#aaa" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>No insurance</Text>
          <Text style={styles.optionSubtitle}>$0.00</Text>
        </View>
        <Icon
          name={travelProtection === "noInsurance" ? "dot-circle" : "circle"}
          type="font-awesome-5"
          color={travelProtection === "noInsurance" ? "#007bff" : "#aaa"}
        />
      </TouchableOpacity>

      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>${totalPrice}</Text>
          <Text style={styles.baggageSubText}>
            {adultCount + childrenCount + infantCount} traveller
          </Text>
        </View>
        <Button title="Next" buttonStyle={styles.nextButton}

          onPress={() => {
            navigation.navigate("TravellerInformationSeats", {
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
            )
          }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  baggageSubText: {
    color: "#666",
    marginVertical: 4,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 16,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  protectionDetails: {
    marginTop: 8,
  },
  protectionItem: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default TravellerInformationBagage;
