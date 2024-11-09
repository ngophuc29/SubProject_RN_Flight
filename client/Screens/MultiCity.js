import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import DatePicker from "react-native-modern-datepicker";
import axios from "axios";

const MultiCity = ({ navigation, route }) => {
  const { username, avatar } = route.params;
  const [locations, setLocations] = useState([
    { from: "", to: "", date: new Date() },
  ]);

    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateMode, setDateMode] = useState("departure");
  
    const [fromCities, setFromCities] = useState([]);
    const [toCities, setToCities] = useState([]);
 
  

  const [showDatePickerIndex, setShowDatePickerIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [selectedClass, setSelectedClass] = useState("Economy");

  const handleDateChange = (date, index) => {
    const selectedDate = new Date(date);
    const today = new Date();

    if (selectedDate < today) {
      alert("Vui lòng chọn ngày hiện tại hoặc tương lai.");
      return;
    }

    const updatedLocations = [...locations];
    updatedLocations[index].date = selectedDate;
    setLocations(updatedLocations);
    setShowDatePickerIndex(-1);
  };

  const handleSwapLocations = (index) => {
    const updatedLocations = [...locations];
    if (updatedLocations[index].from && updatedLocations[index].to) {
      const temp = updatedLocations[index].from;
      updatedLocations[index].from = updatedLocations[index].to;
      updatedLocations[index].to = temp;
      setLocations(updatedLocations);
    } else {
      alert("Vui lòng nhập cả hai địa điểm trước khi hoán đổi.");
    }
  };

  const addLocation = () => {
    setLocations([...locations, { from: "", to: "", date: new Date() }]);
  };

  const fetchCities = async (query, inputType, index) => {
    if (!query) return;

    try {
      setLoading(true);
      const response = await axios.get("https://api.api-ninjas.com/v1/city", {
        params: { name: query },
        headers: { "X-Api-Key": "AHv0lH1DInE1twTDfSR4Fw==awuwVVV45UwKoO6A" },
      });

      const updatedLocations = [...locations];
      if (inputType === "from") {
        updatedLocations[index].fromCities = response.data;
      } else if (inputType === "to") {
        updatedLocations[index].toCities = response.data;
      }
      setLocations(updatedLocations);
    } catch (error) {
      console.error("Error fetching cities:", error);
      alert("Có lỗi xảy ra khi lấy dữ liệu thành phố. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (text, inputType, index) => {
    const updatedLocations = [...locations];
    if (inputType === "from") {
      updatedLocations[index].from = text;
      setActiveInput({ type: "from", index });
      updatedLocations[index].fromCities = []; // Clear previous cities
      fetchCities(text, "from", index);
    } else if (inputType === "to") {
      updatedLocations[index].to = text;
      setActiveInput({ type: "to", index });
      updatedLocations[index].toCities = []; // Clear previous cities
      fetchCities(text, "to", index);
    }
    setLocations(updatedLocations);
  };

  const selectCity = (cityName, inputType, index) => {
    const updatedLocations = [...locations];
    if (inputType === "from") {
      updatedLocations[index].from = cityName;
      updatedLocations[index].fromCities = []; // Clear city list
    } else if (inputType === "to") {
      updatedLocations[index].to = cityName;
      updatedLocations[index].toCities = []; // Clear city list
    }
    setLocations(updatedLocations);
  };

  const adjustCount = (type, action) => {
    if (type === "adult") {
      setAdultCount(
        action === "increase" ? adultCount + 1 : Math.max(1, adultCount - 1)
      );
    } else if (type === "children") {
      setChildrenCount(
        action === "increase"
          ? childrenCount + 1
          : Math.max(0, childrenCount - 1)
      );
    } else if (type === "infant") {
      setInfantCount(
        action === "increase" ? infantCount + 1 : Math.max(0, infantCount - 1)
      );
    }
  };

  // const handleSearchFlights = () => {
  //  if (fromLocation != "" && toLocation != "") setInfoModalVisible(true);
  //  else alert("Nhập thông tin điểm đến để tìm chuyển bay phù hợp nhé!");
  // };
  const handleSearchFlights = () => {
    // Kiểm tra xem tất cả các điểm đến (locations) có từ và đến hợp lệ hay không
    const allLocationsValid = locations.every(
      (location) => location.from !== "" && location.to !== ""
    );

    if (allLocationsValid) {
      setInfoModalVisible(true); // Hiển thị modal thông tin
    } else {
      alert("Nhập thông tin điểm đến để tìm chuyến bay phù hợp nhé!");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {locations.map((location, index) => (
        <View key={index} style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Icon name="flight-takeoff" type="material" color="#333" />
            <TextInput
              style={styles.input}
              value={location.from}
              onChangeText={(text) => handleSearchChange(text, "from", index)}
              placeholder="From"
            />
            <TouchableOpacity onPress={() => handleSwapLocations(index)}>
              <Icon name="swap-horiz" type="material" color="#00A4FF" />
            </TouchableOpacity>
          </View>
          {activeInput.type === "from" &&
            activeInput.index === index &&
            (loading ? (
              <ActivityIndicator size="large" color="#00A4FF" />
            ) : (
              <FlatList
                data={location.fromCities}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => selectCity(item.name, "from", index)}
                  >
                    <Text style={styles.cityItem}>
                      {item.name}, {item.country}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.cityList}
              />
            ))}

          <View style={styles.inputRow}>
            <Icon name="flight-land" type="material" color="#333" />
            <TextInput
              style={styles.input}
              value={location.to}
              onChangeText={(text) => handleSearchChange(text, "to", index)}
              placeholder="To"
            />
          </View>
          {activeInput.type === "to" &&
            activeInput.index === index &&
            (loading ? (
              <ActivityIndicator size="large" color="#00A4FF" />
            ) : (
              <FlatList
                data={location.toCities}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => selectCity(item.name, "to", index)}
                  >
                    <Text style={styles.cityItem}>
                      {item.name}, {item.country}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.cityList}
              />
            ))}

          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              setShowDatePickerIndex(index);
            }}
          >
            <Icon name="calendar-today" type="material" color="#333" />
            <Text style={styles.dateText}>{location.date.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePickerIndex === index && (
            <DatePicker
              mode="calendar"
              selected={location.date.toISOString().split("T")[0]}
              onDateChange={(date) => handleDateChange(date, index)}
              options={{
                backgroundColor: "#FFF",
                textHeaderColor: "#000",
                textDefaultColor: "#000",
                selectedTextColor: "#FFF",
                mainColor: "#00A4FF",
                textSecondaryColor: "#8e8e8e",
                borderColor: "rgba(122, 146, 165, 0.1)",
              }}
            />
          )}
        </View>
      ))}

      <TouchableOpacity onPress={addLocation} style={styles.addLocationButton}>
        <Text style={styles.addLocationText}>Add another destination</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.optionsRow}
      >
        <Icon name="people" type="material" color="#333" />

        <Text style={styles.optionText}>
          {adultCount + childrenCount + infantCount} Travelers
        </Text>
        <Text>•</Text>
        <Icon
          style={styles.optionText1}
          name="chair"
          type="material"
          color="#333"
        />

        <Text> {selectedClass}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Passenger Details</Text>
            <View style={styles.passengerRow}>
              <View>
                <Text>Adults</Text>
                <Text style={{ fontSize: 10, color: "#ccc" }}>12+ years</Text>
              </View>
              <View style={styles.countControl}>
                <TouchableOpacity
                  onPress={() => adjustCount("adult", "decrease")}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text>{adultCount}</Text>
                <TouchableOpacity
                  onPress={() => adjustCount("adult", "increase")}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.passengerRow}>
              <View>
                <Text>Children</Text>
                <Text style={{ fontSize: 10, color: "#ccc" }}>2-12 years</Text>
              </View>
              <View style={styles.countControl}>
                <TouchableOpacity
                  onPress={() => adjustCount("children", "decrease")}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text>{childrenCount}</Text>
                <TouchableOpacity
                  onPress={() => adjustCount("children", "increase")}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.passengerRow}>
              <View>
                <Text>Infants</Text>
                <Text style={{ fontSize: 10, color: "#ccc" }}>
                  Under 2 years
                </Text>
              </View>
              <View style={styles.countControl}>
                <TouchableOpacity
                  onPress={() => adjustCount("infant", "decrease")}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text>{infantCount}</Text>
                <TouchableOpacity
                  onPress={() => adjustCount("infant", "increase")}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.classSelection}>
              <Text>Class:</Text>
              <TouchableOpacity
                onPress={() => setSelectedClass("Economy")}
                style={[
                  styles.classButton,
                  selectedClass === "Economy" && styles.selectedClass,
                ]}
              >
                <Text>Economy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedClass("Business")}
                style={[
                  styles.classButton,
                  selectedClass === "Business" && styles.selectedClass,
                ]}
              >
                <Text>Business</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedClass("First")}
                style={[
                  styles.classButton,
                  selectedClass === "First" && styles.selectedClass,
                ]}
              >
                <Text>First</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={handleSearchFlights}
        style={styles.searchButton}
      >
        <Text style={styles.searchButtonText}>
          {loading ? "Đang tìm kiếm..." : "Search flights"}
        </Text>
      </TouchableOpacity>

      {/* Info Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Flight Information</Text>
            {locations.map((location, index) => (
              <View key={index}>
                <Text>
                  {location.from} ➜ {location.to}
                </Text>
                <Text>{location.date.toDateString()}</Text>
              </View>
            ))}
            <Text style={{ marginTop: 20 }}>
              Passengers: {adultCount} adult{adultCount !== 1 ? "s" : ""},{" "}
              {childrenCount} child{childrenCount !== 1 ? "ren" : ""},{" "}
              {infantCount} infant{infantCount !== 1 ? "s" : ""}
            </Text>
            <Text>Class: {selectedClass}</Text>
            <TouchableOpacity
              onPress={() => {
                setInfoModalVisible(false);

                navigation.navigate("ResultFight", {
                  fromLocation,
                  toLocation,
                  departureDate,
                  returnDate,
                  adultCount,
                  childrenCount,
                  infantCount,
                  selectedClass,
                  locations: locations,

                  flightType: "Multi-City",
                  username, avatar
                });
              }}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  inputContainer: {
    backgroundColor: "#F4F5F9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    outlineStyle: "none",
    color: "#333",
  },
  cityList: {
    maxHeight: 150,
    marginBottom: 10,
  },
  cityItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F5F9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  addLocationButton: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addLocationText: {
    color: "#333",
    fontWeight: "bold",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#00A4FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  passengerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  countControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  classSelection: {
    marginVertical: 20,
  },
  classButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  selectedClass: {
    backgroundColor: "#00A4FF",
    borderColor: "#00A4FF",
  },
  modalCloseButton: {
    backgroundColor: "#00A4FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default MultiCity;
