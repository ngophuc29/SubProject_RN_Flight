import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button } from "react-native-elements";

const FlightDetail = ({ navigation, route }) => {
  const {
    fromLocation,
    toLocation,
    departureDate,
    returnDate,
    adultCount,
    childrenCount,
    infantCount,
    selectedClass,
    flightType,
    locations,
    airline,
    departureFlight,
    returnFlight,
    legs,
    price,
    flightType: tripType, username, avatar // Điều chỉnh để nhận kiểu chuyến bay (One-Way, Round Trip, Multi-City)
  } = route.params;

  const [openInfo, setOpenInfo] = useState([false, false]); // Mảng trạng thái cho từng chuyến bay

  const handleOpenInfo = (index) => {
    const newOpenInfo = [...openInfo];
    newOpenInfo[index] = !newOpenInfo[index];
    setOpenInfo(newOpenInfo);
  };

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => { navigation.goBack() }}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flight details</Text>
        <Icon name="favorite-border" size={24} color="#000" />
      </View>

      {/* Trip Summary */}
      <View style={styles.tripSummary}>
        <Text style={styles.tripTitle}>Your trip to {toLocation}</Text>
        <Text style={styles.tripSubtitle}>from {fromLocation}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {departureDate.toLocaleDateString()} - {returnDate.toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text>  {adultCount + childrenCount + infantCount} traveller</Text>
          <Text> • {selectedClass}</Text>
          <Text> • {tripType}</Text>
        </View>
      </View>

      {/* Flight Details */}

      {tripType == 'One-Way' || tripType == "Round-Trip" ?
      
        (<View>
          {/* Flight Details */}
          <View style={styles.flightCard}>
            <View style={styles.flightHeader}>
              <Text style={styles.flightRoute}>{fromLocation} - {toLocation}</Text>
              <Text style={styles.flightCarrier}>{airline}</Text>
            </View>
            <View style={styles.flightInfoRow}>
              <Text style={styles.flightTime}>{departureFlight.departureTime}</Text>
              <Text style={styles.flightDuration}>{departureFlight.stops} • {departureFlight.duration}</Text>
              <Text style={styles.flightTime}>{departureFlight.arrivalTime}</Text>
            </View>
            <Text style={styles.flightDate}>Tue, Jul 14</Text>

            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() => handleOpenInfo(0)} // Chuyển index của chuyến bay đầu tiên
            >
              <Text>{openInfo[0] ? "Less Info" : "More Info"}</Text>
            </TouchableOpacity>

            {openInfo[0] && (
              <View>
                <View style={styles.amenitiesRow}>
                  <View style={styles.amenitiesRowItem}>
                    <Icon name="event-seat" size={18} color="#666" />
                    <Text style={styles.amenityText}>28" seat pitch</Text>
                  </View>
                  <View style={styles.amenitiesRowItem}>
                    <Icon name="restaurant" size={18} color="#666" />
                    <Text style={styles.amenityText}>Light meal</Text>
                  </View>
                </View>
                <View style={styles.amenitiesRow}>
                  <View style={styles.amenitiesRowItem}>
                    <Icon name="wifi" size={18} color="#666" />
                    <Text style={styles.amenityText}>Chance of Wifi</Text>
                  </View>
                  <View style={styles.amenitiesRowItem}>
                    <Icon name="power" size={18} color="#666" />
                    <Text style={styles.amenityText}>No power outlet</Text>
                  </View>
                </View>
                <Text style={styles.noEntertainment}>No entertainment</Text>
              </View>
            )}
          </View>


          {returnFlight &&
            <View style={styles.flightCard}>
              <View style={styles.flightHeader}>
                <Text style={styles.flightRoute}>{toLocation} - {fromLocation}</Text>
                <Text style={styles.flightCarrier}>{airline}</Text>
              </View>
              <View style={styles.flightInfoRow}>
                <returnFlight style={styles.flightTime}>{returnFlight.departureTime}</returnFlight>
                <Text style={styles.flightDuration}>{returnFlight.stops} • {returnFlight.duration}</Text>
                <Text style={styles.flightTime}>{returnFlight.arrivalTime}</Text>
              </View>
              <Text style={styles.flightDate}>Fri, Jul 17</Text>

              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={() => handleOpenInfo(1)} // Chuyển index của chuyến bay thứ hai
              >
                <Text>{openInfo[1] ? "Less Info" : "More Info"}</Text>
              </TouchableOpacity>

              {openInfo[1] && (
                <View>
                  <View style={styles.amenitiesRow}>
                    <View style={styles.amenitiesRowItem}>
                      <Icon name="event-seat" size={18} color="#666" />
                      <Text style={styles.amenityText}>28" seat pitch</Text>
                    </View>
                    <View style={styles.amenitiesRowItem}>
                      <Icon name="restaurant" size={18} color="#666" />
                      <Text style={styles.amenityText}>Light meal</Text>
                    </View>
                  </View>
                  <View style={styles.amenitiesRow}>
                    <View style={styles.amenitiesRowItem}>
                      <Icon name="wifi" size={18} color="#666" />
                      <Text style={styles.amenityText}>Chance of Wifi</Text>
                    </View>
                    <View style={styles.amenitiesRowItem}>
                      <Icon name="power" size={18} color="#666" />
                      <Text style={styles.amenityText}>No power outlet</Text>
                    </View>
                  </View>
                  <Text style={styles.noEntertainment}>No entertainment</Text>
                </View>
              )}
            </View>
          }
        </View>):
        (
           
            legs.map((leg, index) => (
              <View key={index} style={styles.flightCard}>
                <View style={styles.flightHeader}>
                  <Text style={styles.flightRoute}>{leg.route}</Text>
                  <Text style={styles.flightCarrier}>{leg.airline}</Text>
                </View>
                <View style={styles.flightInfoRow}>
                  <Text style={styles.flightTime}>{leg.departureTime}</Text>
                  <Text style={styles.flightDuration}>{leg.stops} • {leg.duration}</Text>
                  <Text style={styles.flightTime}>{leg.arrivalTime}</Text>
                </View>
                <Text style={styles.flightDate}>Date: {departureDate.toLocaleDateString()}</Text>

                <TouchableOpacity
                  style={{ alignSelf: "center" }}
                  onPress={() => handleOpenInfo(index)}
                >
                  <Text>{openInfo[index] ? "Less Info" : "More Info"}</Text>
                </TouchableOpacity>

                {openInfo[index] && (
                  <View>
                    <View style={styles.amenitiesRow}>
                      <View style={styles.amenitiesRowItem}>
                        <Icon name="event-seat" size={18} color="#666" />
                        <Text style={styles.amenityText}>28" seat pitch</Text>
                      </View>
                      <View style={styles.amenitiesRowItem}>
                        <Icon name="restaurant" size={18} color="#666" />
                        <Text style={styles.amenityText}>Light meal</Text>
                      </View>
                    </View>
                    <View style={styles.amenitiesRow}>
                      <View style={styles.amenitiesRowItem}>
                        <Icon name="wifi" size={18} color="#666" />
                        <Text style={styles.amenityText}>Chance of Wifi</Text>
                      </View>
                      <View style={styles.amenitiesRowItem}>
                        <Icon name="power" size={18} color="#666" />
                        <Text style={styles.amenityText}>No power outlet</Text>
                      </View>
                    </View>
                    <Text style={styles.noEntertainment}>No entertainment</Text>
                  </View>
                )}
              </View>
            ))
           
      )
    }
     

      {/* Baggage Information */}
      <View style={styles.baggageInfo}>
        <Text style={styles.sectionTitle}>Included baggage</Text>
        <View style={styles.amenitiesRowItem}>
          <View style={{ marginHorizontal: 30 }}>
            <Icon name="backpack" size={24} color="#000" />
          </View>
          <View>
            <Text style={styles.baggageText}>1 personal item</Text>
            <Text style={styles.baggageSubText}>Must go under the seat in front of you</Text>
            <Text style={styles.baggageIncluded}>Included</Text>
          </View>
        </View>
      </View>

      <View style={styles.extraBaggage}>
        <Text style={styles.sectionTitle}>Extra baggage</Text>
        <View style={styles.amenitiesRowItem}>
          <View style={{ marginHorizontal: 30 }}>
            <Icon name="cases" size={24} color="#000" />
          </View>
          <View>
            <Text style={styles.baggageText}>Carry-on</Text>
            <Text style={styles.baggageText}>From $11.99</Text>
            <Text style={styles.baggageSubText}>Available in the next steps</Text>
          </View>
        </View>
        <View style={styles.amenitiesRowItem}>
          <View style={{ marginHorizontal: 30 }}>
            <Icon name="luggage" size={24} color="#000" />
          </View>
          <View>
            <Text style={styles.baggageText}>Checked bag</Text>
            <Text style={styles.baggageText}>From $19.99</Text>
            <Text style={styles.baggageSubText}>Available in the next steps</Text>
          </View>
        </View>
      </View>

      {/* Price and Select Button */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>${price}</Text>
          <Text style={styles.baggageSubText}>Total Price</Text>
        </View>
        <Button title="Select" buttonStyle={styles.selectButton} onPress={() => {
          navigation.navigate("TravellerInformationUser", {
            totalPrice: price,
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
            username, avatar
          });
        }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tripSummary: {
    padding: 16,
    alignItems: "center",
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tripSubtitle: {
    color: "#666",
    marginVertical: 4,
  },
  dateContainer: {
    backgroundColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginVertical: 8,
  },
  dateText: {
    color: "#fff",
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  flightCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  flightRoute: {
    fontSize: 14,
    fontWeight: "bold",
  },
  flightCarrier: {
    color: "#666",
  },
  flightInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  flightTime: {
    fontSize: 18,
    fontWeight: "bold",
  },
  flightDuration: {
    color: "#666",
  },
  flightDate: {
    color: "#666",
    marginVertical: 4,
  },
  amenitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  amenitiesRowItem: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  amenityText: {
    marginLeft: 4,
    color: "#666",
  },
  noEntertainment: {
    color: "#666",
    marginVertical: 4,
  },
  baggageInfo: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  baggageText: {
    marginTop: 4,
  },
  baggageSubText: {
    color: "#666",
    marginVertical: 4,
    fontSize: 12,
  },
  baggageIncluded: {
    color: "#007bff",
    marginTop: 4,
  },
  extraBaggage: {
    padding: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  selectButton: {
    backgroundColor: "#007bff",
  },
});

export default FlightDetail;
