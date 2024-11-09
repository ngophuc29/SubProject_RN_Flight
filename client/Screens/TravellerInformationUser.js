import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-elements";
import Stepper from "./Stepper";

const TravellerInformationUser = ({ navigation, route }) => {
  const {
    totalPrice,
    adultCount,
    childrenCount,
    infantCount,
    fromLocation,
    toLocation,
    departureDate,
    returnDate,
    selectedClass,
    flightType,
    locations,
    airline,
    departureFlight,
    returnFlight,
    legs,
    price, username, avatar
  } = route.params;

  const [genderOptions] = useState(["Male", "Female", "Other"]);
  const [adults, setAdults] = useState(adultCount);
  const [children, setChildren] = useState(childrenCount);
  const [infants, setInfants] = useState(infantCount);

  const [travellers, setTravellers] = useState({
    adults: Array(adults).fill({}),
    children: Array(children).fill({}),
    infants: Array(infants).fill({}),
  });

  const updateTravellerForms = (type, count) => {
    setTravellers((prevTravellers) => ({
      ...prevTravellers,
      [type]: Array(count).fill({}),
    }));
  };

  const handleInputChange = (type, index, field, value) => {
    const updatedTravellers = { ...travellers };
    updatedTravellers[type][index] = {
      ...updatedTravellers[type][index],
      [field]: value,
    };
    setTravellers(updatedTravellers);
  };

  const validateTravellerInfo = () => {
    for (let type in travellers) {
      for (let i = 0; i < travellers[type].length; i++) {
        const traveller = travellers[type][i];
        if (!traveller?.firstName || !traveller?.lastName || !traveller?.gender || (type === "adults" && (!traveller?.email || !traveller?.phone))) {
          return false;
        }
      }
    }
    return true;
  };

  const handleNextPress = () => {
    if (!validateTravellerInfo()) {
      alert("Please fill in all required fields for each traveler.");
      return;
    }
    navigation.navigate("TravellerInformationBagage", {
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
      locations,
      airline,
      departureFlight,
      returnFlight,
      legs,
      price,
      travellers, username, avatar
    });
  };

  const renderTravellerForms = (count, type) => {
    return Array.from({ length: count }).map((_, index) => (
      <View key={`${type}-${index}`} style={styles.travellerForm}>
        <Text style={styles.travellerTitle}>
          {type.charAt(0).toUpperCase() + type.slice(1)} {index + 1}
        </Text>
        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          placeholder="First name"
          placeholderTextColor="#aaa"
          value={travellers[type][index]?.firstName || ""}
          onChangeText={(value) => handleInputChange(type, index, "firstName", value)}
        />
        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          placeholder="Last name"
          placeholderTextColor="#aaa"
          value={travellers[type][index]?.lastName || ""}
          onChangeText={(value) => handleInputChange(type, index, "lastName", value)}
        />
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={travellers[type][index]?.gender || ""}
            onValueChange={(value) => handleInputChange(type, index, "gender", value)}
          >
            <Picker.Item label="Select option" value="" />
            {genderOptions.map((gender) => (
              <Picker.Item label={gender} value={gender.toLowerCase()} key={gender} />
            ))}
          </Picker>
        </View>

        {type === "adults" && (
          <>
            <Text style={styles.label}>Contact email</Text>
            <TextInput
              style={styles.input}
              placeholder="Your email"
              placeholderTextColor="#aaa"
              value={travellers[type][index]?.email || ""}
              onChangeText={(value) => handleInputChange(type, index, "email", value)}
            />
            <Text style={styles.label}>Contact phone</Text>
            <View style={styles.phoneContainer}>
              <TextInput
                style={styles.phonePrefix}
                placeholder="+07"
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={[styles.input, styles.phoneNumber]}
                placeholder="Contact phone"
                placeholderTextColor="#aaa"
                value={travellers[type][index]?.phone || ""}
                onChangeText={(value) => handleInputChange(type, index, "phone", value)}
              />
            </View>
          </>
        )}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
      <View style={{ backgroundColor: "#fff" }}>
        <Stepper navigation={navigation} currentStep={1} />
      </View>
      <Text style={styles.headerTitle}>Traveller Information</Text>

      <Text style={styles.sectionTitle}>Adults</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={adults}
          onValueChange={(value) => {
            setAdults(value);
            updateTravellerForms("adults", value);
          }}
          style={styles.picker}
        >
          {[...Array(10).keys()].map((i) => (
            <Picker.Item label={`${i + 1}`} value={i + 1} key={i} />
          ))}
        </Picker>
      </View>

      <Text style={styles.sectionTitle}>Children</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={children}
          onValueChange={(value) => {
            setChildren(value);
            updateTravellerForms("children", value);
          }}
          style={styles.picker}
        >
          {[...Array(10).keys()].map((i) => (
            <Picker.Item label={`${i}`} value={i} key={i} />
          ))}
        </Picker>
      </View>

      <Text style={styles.sectionTitle}>Infants</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={infants}
          onValueChange={(value) => {
            setInfants(value);
            updateTravellerForms("infants", value);
          }}
          style={styles.picker}
        >
          {[...Array(10).keys()].map((i) => (
            <Picker.Item label={`${i}`} value={i} key={i} />
          ))}
        </Picker>
      </View>

      <Text style={styles.sectionTitle}>Traveller Details</Text>
      {renderTravellerForms(adults, "adults")}
      {renderTravellerForms(children, "children")}
      {renderTravellerForms(infants, "infants")}

      <View style={styles.footer}>
        <Text style={styles.price}>${totalPrice}</Text>
        <Button title="Next" buttonStyle={styles.nextButton} onPress={handleNextPress} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 16,
  },
  label: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },
  input: {
    height: 48,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 4,
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginTop: 4,
    overflow: "hidden",
  },
  picker: {
    height: 48,
    color: "#666",
  },
  travellerForm: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    backgroundColor: "#f9f9f9",
  },
  travellerTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: "row",
  },
  phonePrefix: {
    width: 60,
    height: 48,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: "#f9f9f9",
  },
  phoneNumber: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
  },
});

export default TravellerInformationUser;
