import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Stepper from "./Stepper";
import Axios from 'axios';
export default function TravellerInformationPayment({ navigation, route }) {
  const { totalPrice, adultCount, childrenCount, infantCount, fromLocation, toLocation, departureDate, returnDate, selectedClass, flightType, locations, airline, departureFlight, returnFlight, legs, price, travellers, username, avatar } = route.params;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [currentCard, setCurrentCard] = useState({ number: "**** 9876", expiryDate: "MM/YY", cvv: "***" });

  const openModal = (edit = false) => {
    if (edit) {
      setCardNumber(currentCard.number);
      setExpiryDate(currentCard.expiryDate);
      setCvv(currentCard.cvv);
    } else {
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
  };

  const saveCard = () => {
    if (cardNumber && expiryDate && cvv) {
      setCurrentCard({ number: cardNumber, expiryDate: expiryDate, cvv: cvv });
      closeModal();
    } else {
      alert("Please fill all fields.");
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await Axios.post('http://localhost:4000/api/flights', {
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
        departureFlight: JSON.stringify(departureFlight),
        returnFlight: JSON.stringify(returnFlight),
        legs,
        price,
        travellers,
        username,
        avatar,
      });
      console.log(response.data);
      navigation.navigate("BookingSuccess", { totalPrice: `${price * (adultCount + childrenCount + infantCount)}`, adultCount, childrenCount, infantCount, fromLocation, toLocation, departureDate, returnDate, selectedClass, flightType, locations, airline, departureFlight, returnFlight, legs, price, travellers, username, avatar });
    } catch (error) {
      console.error('Error uploading flight data:', error);
      alert('Failed to upload flight data');
    }
  };

  return (
    <View>
      <View style={{ backgroundColor: "#fff", alignItems: "center", paddingVertical: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, marginBottom: 10 }}>
        <Stepper navigation={navigation} currentStep={4} />
      </View>
      <View style={styles.container}>
        <Text style={styles.header}>Payment</Text>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment method</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentDetails}>
              <FontAwesome name="cc-mastercard" size={24} color="#f24e1e" />
              <Text style={styles.cardType}>MasterCard {currentCard.number}</Text>
              <TouchableOpacity onPress={() => openModal(true)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addCardButton} onPress={() => openModal(false)}>
              <Text style={styles.addCardText}>+ New card</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Traveller Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Traveller details</Text>
          <View style={styles.travellerRow}>
            <Icon name="person" size={24} color="#333" />
            <Text style={styles.travellerInfo}>{travellers.adults[0].firstName} {travellers.adults[0].lastName}</Text>
            <Text style={styles.travellerDetails}>Adult • {travellers.adults[0].gender}</Text>
          </View>
        </View>

        {/* Contact Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact details</Text>
          <View style={styles.contactRow}>
            <Icon name="email" size={24} color="#333" style={styles.iconSpacing} />
            <Text style={styles.contactInfo}>{travellers.adults[0].email}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="phone" size={24} color="#333" style={styles.iconSpacing} />
            <Text style={styles.contactInfo}>{travellers.adults[0].phone}</Text>
          </View>
        </View>

        {/* Price and Checkout */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>${totalPrice}</Text>
            <Text style={styles.priceDescription}>{adultCount + childrenCount + infantCount} traveller</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for New Card */}
        <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Card</Text>
              <TextInput style={styles.input} placeholder="Card Number" keyboardType="numeric" value={cardNumber} onChangeText={setCardNumber} />
              <TextInput style={styles.input} placeholder="Expiry Date (MM/YY)" value={expiryDate} onChangeText={setExpiryDate} />
              <TextInput style={styles.input} placeholder="CVV" keyboardType="numeric" secureTextEntry={true} value={cvv} onChangeText={setCvv} />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={saveCard}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
    paddingTop: 0,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 8,
    fontWeight: "500",
  },
  paymentCard: {
    padding: 15,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    flexDirection: "column",
  },
  paymentDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  cardType: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    flex: 1,
    marginLeft: 10,
  },
  editText: {
    fontSize: 14,
    color: "#1e90ff",
  },
  addCardButton: {
    marginTop: 5,
  },
  addCardText: {
    color: "#1e90ff",
    fontSize: 14,
  },
  travellerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  travellerInfo: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginLeft: 10,
  },
  travellerDetails: {
    fontSize: 14,
    color: "#888",
    marginLeft: "auto",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  iconSpacing: {
    marginRight: 10,
  },
  contactInfo: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  priceDescription: {
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: "#04c4d1",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "50%",
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#1e90ff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#888",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
