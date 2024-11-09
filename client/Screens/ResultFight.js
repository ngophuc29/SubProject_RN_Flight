import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  Button,
  TouchableOpacity,
  CheckBox,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import { color } from "react-native-elements/dist/helpers";

const ResultFlight = ({ navigation, route }) => {
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
    locations, airline, username, avatar
  } = route.params;

  const [flightsData, setFlightsData] = useState([
    // Round-Trip Flights
    {
      id: "1",
      type: "Round-Trip",
      departureFlight: {
        departureTime: "6:30 AM",
        arrivalTime: "2:00 PM",
        duration: "7h30m",
        stops: "1 stop",
        airline: "SkyHaven",
        route: "LCY - JFK",
      },
      returnFlight: {
        departureTime: "4:00 PM",
        arrivalTime: "10:30 PM",
        duration: "6h30m",
        stops: "Direct",
        airline: "SkyHaven",
        route: "JFK - LCY",
      },
      price: 1200,
      currency: "USD",
    },
    {
      id: "2",
      type: "Round-Trip",
      departureFlight: {
        departureTime: "9:00 AM",
        arrivalTime: "5:00 PM",
        duration: "8h",
        stops: "Direct",
        airline: "EcoWings",
        route: "LCY - JFK",
      },
      returnFlight: {
        departureTime: "11:00 AM",
        arrivalTime: "7:00 PM",
        duration: "8h",
        stops: "Direct",
        airline: "EcoWings",
        route: "JFK - LCY",
      },
      price: 1150,
      currency: "USD",
    },
    {
      id: "3",
      type: "Round-Trip",
      departureFlight: {
        departureTime: "8:15 AM",
        arrivalTime: "4:00 PM",
        duration: "7h45m",
        stops: "1 stop",
        airline: "AirVista",
        route: "LCY - JFK",
      },
      returnFlight: {
        departureTime: "3:30 PM",
        arrivalTime: "11:00 PM",
        duration: "7h30m",
        stops: "1 stop",
        airline: "AirVista",
        route: "JFK - LCY",
      },
      price: 1300,
      currency: "USD",
    },
    {
      id: "4",
      type: "Round-Trip",
      departureFlight: {
        departureTime: "6:45 AM",
        arrivalTime: "1:45 PM",
        duration: "7h",
        stops: "Direct",
        airline: "SkyHaven",
        route: "LCY - JFK",
      },
      returnFlight: {
        departureTime: "5:00 PM",
        arrivalTime: "12:00 AM",
        duration: "7h",
        stops: "Direct",
        airline: "SkyHaven",
        route: "JFK - LCY",
      },
      price: 1250,
      currency: "USD",
    },
    {
      id: "5",
      type: "Round-Trip",
      departureFlight: {
        departureTime: "2:00 PM",
        arrivalTime: "10:00 PM",
        duration: "8h",
        stops: "1 stop",
        airline: "SkyHaven",
        route: "LCY - JFK",
      },
      returnFlight: {
        departureTime: "10:00 AM",
        arrivalTime: "6:00 PM",
        duration: "8h",
        stops: "1 stop",
        airline: "SkyHaven",
        route: "JFK - LCY",
      },
      price: 1100,
      currency: "USD",
    },

    // One-Way Flights
    {
      id: "6",
      type: "One-Way",
      departureFlight: {
        departureTime: "10:30 AM",
        arrivalTime: "5:30 PM",
        duration: "7h",
        stops: "1 stop",
        airline: "AirVista",
        route: "LCY - JFK",
      },
      price: 600,
      currency: "USD",
    },
    {
      id: "7",
      type: "One-Way",
      departureFlight: {
        departureTime: "8:00 PM",
        arrivalTime: "4:00 AM",
        duration: "8h",
        stops: "Direct",
        airline: "EcoWings",
        route: "LCY - JFK",
      },
      price: 800,
      currency: "USD",
    },
    {
      id: "8",
      type: "One-Way",
      departureFlight: {
        departureTime: "7:15 AM",
        arrivalTime: "3:45 PM",
        duration: "8h30m",
        stops: "1 stop",
        airline: "SkyHaven",
        route: "LCY - JFK",
      },
      price: 550,
      currency: "USD",
    },
    {
      id: "9",
      type: "One-Way",
      departureFlight: {
        departureTime: "1:00 PM",
        arrivalTime: "9:30 PM",
        duration: "8h30m",
        stops: "Direct",
        airline: "EcoWings",
        route: "LCY - JFK",
      },
      price: 750,
      currency: "USD",
    },
    {
      id: "10",
      type: "One-Way",
      departureFlight: {
        departureTime: "4:30 PM",
        arrivalTime: "12:30 AM",
        duration: "8h",
        stops: "1 stop",
        airline: "AirVista",
        route: "LCY - JFK",
      },
      price: 690,
      currency: "USD",
    },

    // Multi-City Flights
    {
      id: "11",
      type: "Multi-City",
      legs: [
        {
          departureTime: "10:00 AM",
          arrivalTime: "12:00 PM",
          duration: "2h",
          stops: "Direct",
          airline: "SkyHaven",
          route: "LCY - CDG",
          price: 280,
        },
      ],
      currency: "USD",
      price: 280,
    },// 2 Chặng Bay (Two Legs)
    {
      id: "12",
      type: "Multi-City",
      legs: [
        {
          departureTime: "8:00 AM",
          arrivalTime: "10:00 AM",
          duration: "2h",
          stops: "Direct",
          airline: "SkyHaven",
          route: "LCY - CDG",
          price: 300,
        },
        {
          departureTime: "12:00 PM",
          arrivalTime: "2:30 PM",
          duration: "2h30m",
          stops: "Direct",
          airline: "EcoWings",
          route: "CDG - AMS",
          price: 250,
        },
      ],
      currency: "USD",
      price: 550,
    },

    // 3 Chặng Bay (Three Legs)
    {
      id: "13",
      type: "Multi-City",
      legs: [
        {
          departureTime: "7:00 AM",
          arrivalTime: "9:00 AM",
          duration: "2h",
          stops: "Direct",
          airline: "AirVista",
          route: "LCY - CDG",
          price: 320,
        },
        {
          departureTime: "10:00 AM",
          arrivalTime: "12:30 PM",
          duration: "2h30m",
          stops: "Direct",
          airline: "SkyHaven",
          route: "CDG - AMS",
          price: 280,
        },
        {
          departureTime: "3:00 PM",
          arrivalTime: "5:30 PM",
          duration: "2h30m",
          stops: "Direct",
          airline: "EcoWings",
          route: "AMS - MAD",
          price: 350,
        },
      ],
      currency: "USD",
      price: 950,
    },

    // 4 Chặng Bay (Four Legs)
    {
      id: "14",
      type: "Multi-City",
      legs: [
        {
          departureTime: "6:00 AM",
          arrivalTime: "8:00 AM",
          duration: "2h",
          stops: "Direct",
          airline: "AirVista",
          route: "LCY - CDG",
          price: 300,
        },
        {
          departureTime: "9:30 AM",
          arrivalTime: "11:30 AM",
          duration: "2h",
          stops: "Direct",
          airline: "SkyHaven",
          route: "CDG - AMS",
          price: 250,
        },
        {
          departureTime: "2:00 PM",
          arrivalTime: "5:00 PM",
          duration: "3h",
          stops: "1 stop",
          airline: "EcoWings",
          route: "AMS - MAD",
          price: 350,
        },
        {
          departureTime: "7:00 PM",
          arrivalTime: "9:30 PM",
          duration: "2h30m",
          stops: "Direct",
          airline: "AirVista",
          route: "MAD - BCN",
          price: 300,
        },
      ],
      currency: "USD",
      price: 1200,
    },

    // 5 Chặng Bay (Five Legs)
    {
      id: "15",
      type: "Multi-City",
      legs: [
        {
          departureTime: "5:00 AM",
          arrivalTime: "7:00 AM",
          duration: "2h",
          stops: "Direct",
          airline: "SkyHaven",
          route: "LCY - CDG",
          price: 320,
        },
        {
          departureTime: "8:00 AM",
          arrivalTime: "10:30 AM",
          duration: "2h30m",
          stops: "Direct",
          airline: "EcoWings",
          route: "CDG - AMS",
          price: 280,
        },
        {
          departureTime: "11:00 AM",
          arrivalTime: "1:00 PM",
          duration: "2h",
          stops: "Direct",
          airline: "AirVista",
          route: "AMS - MAD",
          price: 300,
        },
        {
          departureTime: "3:30 PM",
          arrivalTime: "6:00 PM",
          duration: "2h30m",
          stops: "Direct",
          airline: "EcoWings",
          route: "MAD - BCN",
          price: 270,
        },
        {
          departureTime: "7:00 PM",
          arrivalTime: "9:00 PM",
          duration: "2h",
          stops: "Direct",
          airline: "SkyHaven",
          route: "BCN - LCY",
          price: 310,
        },
      ],
      currency: "USD",
      price: 1480,
    },

    // 6 Chặng Bay (Six Legs)
    {
      id: "16",
      type: "Multi-City",
      legs: [
        {
          departureTime: "7:00 AM",
          arrivalTime: "9:00 AM",
          duration: "2h",
          stops: "Direct",
          airline: "SkyHaven",
          route: "LCY - CDG",
          price: 300,
        },
        {
          departureTime: "9:30 AM",
          arrivalTime: "12:00 PM",
          duration: "2h30m",
          stops: "Direct",
          airline: "EcoWings",
          route: "CDG - AMS",
          price: 250,
        },
        {
          departureTime: "12:30 PM",
          arrivalTime: "3:00 PM",
          duration: "2h30m",
          stops: "Direct",
          airline: "AirVista",
          route: "AMS - MAD",
          price: 320,
        },
        {
          departureTime: "3:30 PM",
          arrivalTime: "6:00 PM",
          duration: "2h30m",
          stops: "1 stop",
          airline: "SkyHaven",
          route: "MAD - BCN",
          price: 290,
        },
        {
          departureTime: "7:00 PM",
          arrivalTime: "9:30 PM",
          duration: "2h30m",
          stops: "Direct",
          airline: "EcoWings",
          route: "BCN - LCY",
          price: 280,
        },
        {
          departureTime: "9:30 PM",
          arrivalTime: "11:00 PM",
          duration: "1h30m",
          stops: "Direct",
          airline: "AirVista",
          route: "LCY - CDG",
          price: 330,
        },
      ],
      currency: "USD",
      price: 1830,
    }
  ]);
  const [filteredFlights, setFilteredFlights] = useState(flightsData);
  const applyFilters = () => {
    let filteredData = [...filteredFlights];

    // Lọc theo giá
    if (priceOrder.lowToHigh) {
      filteredData = filteredData.sort((a, b) => a.price - b.price);
    } else if (priceOrder.highToLow) {
      filteredData = filteredData.sort((a, b) => b.price - a.price);
    }

    // Lọc theo số điểm dừng
    if (stopsFilter.any) {
      // Không lọc
    } else if (stopsFilter.oneStop) {
      filteredData = filteredData.filter((item) => {
        if (item.type === "Round-Trip") {
          return (
            item.departureFlight.stops === "1 stop" ||
            item.returnFlight.stops === "1 stop"
          );
        }
        if (item.type === "One-Way") {
          return item.departureFlight.stops === "1 stop";
        }
        return false;
      });
    } else if (stopsFilter.nonStop) {
      filteredData = filteredData.filter((item) => {
        if (item.type === "Round-Trip") {
          return (
            item.departureFlight.stops === "Direct" &&
            item.returnFlight.stops === "Direct"
          );
        }
        if (item.type === "One-Way") {
          return item.departureFlight.stops === "Direct";
        }
        return false;
      });
    }

    // Lọc theo hãng hàng không
    if (airlinesFilter.SkyHaven || airlinesFilter.EcoWings) {
      filteredData = filteredData.filter((item) => {
        if (item.type === "Round-Trip") {
          return (
            (airlinesFilter.SkyHaven &&
              item.departureFlight.airline === "SkyHaven") ||
            (airlinesFilter.EcoWings &&
              item.departureFlight.airline === "EcoWings")
          );
        }
        if (item.type === "One-Way") {
          return (
            (airlinesFilter.SkyHaven &&
              item.departureFlight.airline === "SkyHaven") ||
            (airlinesFilter.EcoWings &&
              item.departureFlight.airline === "EcoWings")
          );
        }
        return false;
      });
    }

    setFilteredFlights(filteredData);
    setModalVisible(false);
  };

  useEffect(() => {
    console.log(
      fromLocation,
      toLocation,
      departureDate,
      returnDate,
      adultCount,
      childrenCount,
      infantCount,
      selectedClass,
      flightType
    );
    // Chỉ lấy các chuyến bay phù hợp với `flightType`
    const flights = flightsData.filter((flight) => flight.type === flightType);
    setFilteredFlights(flights);
  }, [flightType]);
  const renderFlightItem = ({ item }) => {
    const handlePress = () => {
      const flightInfo =
        item.type === "Round-Trip"
          ? `Round-Trip Flight:\nDeparture: ${item.departureFlight.departureTime} - Arrival: ${item.departureFlight.arrivalTime}\nPrice: $${item.price}`
          : item.type === "One-Way"
            ? `One-Way Flight:\nDeparture: ${item.departureFlight.departureTime} - Arrival: ${item.departureFlight.arrivalTime}\nPrice: $${item.price}`
            : `Multi-City Flight:\nTotal Price: $${item.totalPrice}`;

      console.log(flightInfo);

      // Passing detailed flight info in the params for navigation
      navigation.navigate("FlightDetail", {
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
        // Adding departure and return flight details
        departureFlight: item.departureFlight,
        returnFlight: item.returnFlight || null, // Only applicable for Round-Trip
        legs: item.legs || [], // For Multi-City
        price: item.price || item.totalPrice,
        price: item.price

        ,
        username, avatar
      });
    };
    if (item.type === "Round-Trip") {
      return (
        <TouchableOpacity style={styles.flightContainer} onPress={handlePress}>
          <View style={styles.flightDetailsContainer}>
            <Image
              source={{
                uri: "https://th.bing.com/th/id/OIF.9IIlarUPlTmbBmbTcgS0yA?w=227&h=180&c=7&r=0&o=5&pid=1.7",
              }}
              style={styles.airlineLogo}
            />

            <View style={styles.flightInfo}>
              {/* chuyen 1  */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  {/* giờ di */}
                  <Text
                    style={styles.timeText}
                  >{`${item.departureFlight.departureTime} - ${item.departureFlight.arrivalTime}`}</Text>
                  {/* chuyen di ,san bay */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.routeText}>
                      {item.departureFlight.route}
                    </Text>
                    <Text style={styles.airlineText}>
                      ,{item.departureFlight.airline}
                    </Text>
                  </View>
                </View>
                {/* thoi gian di va dung chan */}
                <View>
                  <Text style={styles.stopsText}>
                    {item.departureFlight.duration}
                  </Text>
                  <Text style={styles.stopsText}>
                    {item.departureFlight.stops}
                  </Text>
                </View>
              </View>

              {/* het chuyen 1 */}

              {/* chuyen 2 */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={styles.timeText}
                  >{`${item.returnFlight.departureTime} - ${item.returnFlight.arrivalTime}`}</Text>
                  {/* chuyen di ,san bay */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.routeText}>
                      {item.departureFlight.route}
                    </Text>
                    <Text style={styles.airlineText}>
                      ,{item.departureFlight.airline}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text style={styles.stopsText}>
                    {item.returnFlight.duration}
                  </Text>
                  <Text style={styles.stopsText}>
                    {item.returnFlight.stops}
                  </Text>
                </View>
              </View>
              {/* giờ về */}
            </View>
          </View>
          <View style={styles.price}>
            <Icon name="heart-outline" type="ionicon" color="#000" />
            <Text style={styles.priceText}>${item.price}</Text>
          </View>
        </TouchableOpacity>
      );
    } else if (item.type === "One-Way") {
      return (
        <TouchableOpacity style={styles.flightContainer} onPress={handlePress}>
          <View style={styles.flightDetailsContainer}>
            <Image
              source={{
                uri: "https://th.bing.com/th/id/OIF.9IIlarUPlTmbBmbTcgS0yA?w=227&h=180&c=7&r=0&o=5&pid=1.7",
              }}
              style={styles.airlineLogo}
            />
            <View style={styles.flightInfo}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={styles.timeText}>
                    {`${item.departureFlight.departureTime} - ${item.departureFlight.arrivalTime}`}
                  </Text>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.routeText}>
                      {item.departureFlight.route}
                    </Text>
                    <Text style={styles.airlineText}>
                      ,{item.departureFlight.airline}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text style={styles.stopsText}>
                    {item.departureFlight.duration}
                  </Text>

                  <Text style={styles.stopsText}>
                    {item.departureFlight.stops}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.price}>
            <Icon name="heart-outline" type="ionicon" color="#000" />
            <Text style={styles.priceText}>${item.price}</Text>
          </View>
        </TouchableOpacity>
      );
    } else if (item.type === "Multi-City") {
      return (
        <TouchableOpacity style={styles.flightContainer} onPress={handlePress}>
          {item.legs.map((leg, index) => (
            <View key={index} style={styles.flightDetailsContainer}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIF.9IIlarUPlTmbBmbTcgS0yA?w=227&h=180&c=7&r=0&o=5&pid=1.7",
                }}
                style={styles.airlineLogo}
              />
              <View style={styles.flightInfo}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={styles.timeText}
                    >{`${leg.departureTime} - ${leg.arrivalTime}`}</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.routeText}>{leg.route}</Text>
                      <Text style={styles.airlineText}>,{leg.airline}</Text>
                    </View>
                  </View>

                  <View>
                    <Text style={styles.stopsText}>{leg.duration}</Text>
                    <Text style={styles.stopsText}>{leg.stops}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
          <View style={styles.price}>
            <Icon name="heart-outline" type="ionicon" color="#000" />
            <Text style={styles.priceText}>${item.totalPrice}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [priceOrder, setPriceOrder] = useState("");
  const [stopsFilter, setStopsFilter] = useState("");
  const [airlinesFilter, setAirlinesFilter] = useState("");

  const clearFilters = () => {
    setPriceOrder({});
    setStopsFilter({});
    setAirlinesFilter({});
    const flights = flightsData.filter((flight) => flight.type === flightType);
    setFilteredFlights(flights);
  };

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[1]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#e4e8f1",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("BookingTabs")}>
            <Icon name="undo" type="material" color="#000" />
          </TouchableOpacity>
          <View style={{ marginLeft: 20 }}>
            {flightType != "Multi-City" && (
              <View>
                <Text style={{ fontSize: 17, color: "#000" }}>
                  {fromLocation} - {toLocation}
                </Text>
                <Text style={{ fontSize: 15, color: "#333" }}>
                  {departureDate.toLocaleDateString()} -{" "}
                  {returnDate.toLocaleDateString()},
                  {adultCount + childrenCount + infantCount} traveller
                </Text>
              </View>
            )}





            {/* Render locations */}
            {locations && locations.length > 0 ? (
              locations.map((location, index) => (
                <View key={index}>
                  <Text style={{ fontSize: 17, color: "#000" }}>
                    {location.from} ➜ {location.to}
                  </Text>
                  <Text style={{ fontSize: 15, color: "#333" }}>
                    {location.date.toLocaleDateString()}, {adultCount + childrenCount + infantCount} traveller
                  </Text>{" "}
                  
                </View>
              ))
            ) : (
              <></>
            )}
          </View>
        </View>
        <View style={{ marginRight: 20 }}>
          <Icon name="notifications" type="material" color="#000" />
        </View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingBottom: 10,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
      >
        <TouchableOpacity
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            alignSelf: "flex-start",
            marginTop: 10,
            marginLeft: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="sort" type="material" color="#000" />
          <Text>Sort & Filter Flights</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredFlights}
        renderItem={renderFlightItem}
        keyExtractor={(item) => item.id}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort & Filter Flights</Text>

            {/* Bộ lọc giá */}
            <Text style={styles.filterLabel}>Sort by Price</Text>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={priceOrder.lowToHigh}
                onValueChange={() =>
                  setPriceOrder({ lowToHigh: true, highToLow: false })
                }
              />
              <Text style={styles.checkboxLabel}>Low to High</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={priceOrder.highToLow}
                onValueChange={() =>
                  setPriceOrder({ lowToHigh: false, highToLow: true })
                }
              />
              <Text style={styles.checkboxLabel}>High to Low</Text>
            </View>

            {/* Bộ lọc điểm dừng */}
            <Text style={styles.filterLabel}>Stops</Text>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={stopsFilter.any}
                onValueChange={() =>
                  setStopsFilter({ any: true, oneStop: false, nonStop: false })
                }
              />
              <Text style={styles.checkboxLabel}>Any Stops</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={stopsFilter.oneStop}
                onValueChange={() =>
                  setStopsFilter({ any: false, oneStop: true, nonStop: false })
                }
              />
              <Text style={styles.checkboxLabel}>1 Stop</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={stopsFilter.nonStop}
                onValueChange={() =>
                  setStopsFilter({ any: false, oneStop: false, nonStop: true })
                }
              />
              <Text style={styles.checkboxLabel}>Non-stop</Text>
            </View>

            {/* Bộ lọc hãng hàng không */}
            <Text style={styles.filterLabel}>Airlines</Text>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={airlinesFilter.SkyHaven}
                onValueChange={() =>
                  setAirlinesFilter((prev) => ({
                    ...prev,
                    SkyHaven: !prev.SkyHaven,
                  }))
                }
              />
              <Text style={styles.checkboxLabel}>SkyHaven</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={airlinesFilter.EcoWings}
                onValueChange={() =>
                  setAirlinesFilter((prev) => ({
                    ...prev,
                    EcoWings: !prev.EcoWings,
                  }))
                }
              />
              <Text style={styles.checkboxLabel}>EcoWings</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={{ color: "#ccc", fontWeight: "bold" }}>
                  Clear Filters
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilters}
                style={{
                  paddingHorizontal: 40,
                  backgroundColor: "#00bdd5",
                  paddingVertical: 5,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#fff" }}> Apply Filters </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
  flightContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 22,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 10,
  },
  flightDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  airlineLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  flightInfo: {
    flex: 2,
    marginVertical: 10,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  routeText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 3,
    marginRight: 7,
  },
  airlineText: {
    fontSize: 12,
    color: "#888",
  },
  stopsText: {
    fontSize: 12,
    marginVertical: 3,
    color: "#888",
  },
  price: {
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    alignSelf: "flex-end",
    paddingTop: 5,
    width: "100%",
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  filterButton: {
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 15,
    padding: 10,
    marginLeft: 20,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  filterButtonText: {
    color: "#000",
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: 15,
    marginVertical: 5,
    fontWeight: "bold",
  },
});

export default ResultFlight;
