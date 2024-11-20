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

const OneWay = ({ navigation, route }) => {
  const { username, avatar } = route.params;
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateMode, setDateMode] = useState("departure");
  const [loading, setLoading] = useState(false);
  const [fromCities, setFromCities] = useState([]);
  const [toCities, setToCities] = useState([]);
  const [activeInput, setActiveInput] = useState("");

  // State cho modal
  const [modalVisible, setModalVisible] = useState(false);
  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [selectedClass, setSelectedClass] = useState("Economy");

  // Thêm state cho modal hiển thị thông tin
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const handleSearchFlights = () => {
    // Mở modal hiển thị thông tin
    if (fromLocation != "" && toLocation != "") setInfoModalVisible(true);
    else alert("Nhập thông tin điểm đến để tìm chuyển bay phù hợp nhé!");
  };

  const handleDateChange = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();

    if (selectedDate < today) {
      alert("Vui lòng chọn ngày hiện tại hoặc tương lai.");
      return;
    }

    if (dateMode === "departure") {
      setDepartureDate(selectedDate);
    } else {
      // Kiểm tra ngày trở về chỉ khi ngày khởi hành đã được chọn
      if (selectedDate < departureDate) {
        alert("Ngày trở về phải sau ngày khởi hành.");
        return;
      }
      setReturnDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleSwapLocations = () => {
    if (fromLocation && toLocation) {
      const temp = fromLocation;
      setFromLocation(toLocation);
      setToLocation(temp);
    } else {
      alert("Thông báo", "Vui lòng nhập cả hai địa điểm trước khi hoán đổi.");
    }
  };

  const fetchCities = async (query, inputType) => {
    if (!query) return;

    try {
      setLoading(true);
      const response = await axios.get("https://api.api-ninjas.com/v1/city", {
        params: { name: query },
        headers: { "X-Api-Key": "u2WlhmSyRt3fHxKFsRKgtw==DIy7QEne0kcVZ53o" },
      });

      if (inputType === "from") {
        setFromCities(response.data);
      } else if (inputType === "to") {
        setToCities(response.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      alert(
        "Lỗi",
        "Có lỗi xảy ra khi lấy dữ liệu thành phố. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (text, inputType) => {
    if (inputType === "from") {
      setFromLocation(text); // Cập nhật giá trị ô nhập
      setActiveInput("from");
      fetchCities(text, "from"); // Tìm kiếm thành phố mới
    } else if (inputType === "to") {
      setToLocation(text); // Cập nhật giá trị ô nhập
      setActiveInput("to");
      fetchCities(text, "to"); // Tìm kiếm thành phố mới
    }
  };

  const selectCity = (cityName) => {
    if (activeInput === "from") {
      setFromLocation(cityName);
      setFromCities([]); // Xóa danh sách thành phố sau khi chọn
    } else if (activeInput === "to") {
      setToLocation(cityName);
      setToCities([]); // Xóa danh sách thành phố sau khi chọn
    }
  };

  // Hàm tăng giảm số lượng hành khách
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

  return (
    <ScrollView style={styles.container}>
      {/* Location Inputs */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Icon name="flight-takeoff" type="material" color="#333" />
          <TextInput
            style={styles.input}
            value={fromLocation}
            onChangeText={(text) => handleSearchChange(text, "from")}
            placeholder="From"
          />
          <TouchableOpacity onPress={handleSwapLocations}>
            <Icon name="swap-horiz" type="material" color="#00A4FF" />
          </TouchableOpacity>
        </View>

        {/* City Selector for From */}
        {activeInput === "from" &&
          (loading ? (
            <ActivityIndicator size="large" color="#00A4FF" />
          ) : (
            <FlatList
              data={fromCities}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectCity(item.name)}>
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
            value={toLocation}
            onChangeText={(text) => handleSearchChange(text, "to")}
            placeholder="To"
          />
        </View>

        {/* City Selector for To */}
        {activeInput === "to" &&
          (loading ? (
            <ActivityIndicator size="large" color="#00A4FF" />
          ) : (
            <FlatList
              data={toCities}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectCity(item.name)}>
                  <Text style={styles.cityItem}>
                    {item.name}, {item.country}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.cityList}
            />
          ))}
      </View>

      {/* Date Selection */}
      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => {
            setDateMode("departure");
            setShowDatePicker(true);
          }}
        >
          <Icon name="calendar-today" type="material" color="#333" />

          <Text style={styles.dateText}>{departureDate.toDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => {
            setDateMode("return");
            setShowDatePicker(true);
          }}
        >
          <Icon name="calendar-today" type="material" color="#333" />

          <Text style={styles.dateText}>{returnDate.toDateString()}</Text>
        </TouchableOpacity>
      </View>

      {/* DatePicker */}
      {showDatePicker && (
        <DatePicker
          mode="calendar"
          selected={
            dateMode === "departure"
              ? departureDate.toISOString().split("T")[0]
              : returnDate.toISOString().split("T")[0]
          }
          onDateChange={handleDateChange}
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

      {/* Travelers and Class */}
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

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Passengers</Text>
            {/* Adult Count */}
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
            {/* Children Count */}
            <View style={styles.passengerRow}>
              <View>
                <Text>Children</Text>
                <Text style={{ fontSize: 10, color: "#ccc" }}>2-12 years </Text>
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
            {/* Infants Count */}
            <View style={styles.passengerRow}>
              <View>
                <Text>Infants </Text>
                <Text style={{ fontSize: 10, color: "#ccc" }}>
                  Under 2 years{" "}
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
            {/* Class Selection */}
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

      {/* Search Button */}
      <TouchableOpacity
        onPress={handleSearchFlights}
        style={styles.searchButton}
      >
        <Text style={styles.searchButtonText}>
          {loading ? "Đang tìm kiếm..." : "Search flights"}
        </Text>
      </TouchableOpacity>
      {/* Modal hiển thị thông tin đã nhập */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Flight Infomation</Text>
            <Text>From: {fromLocation}</Text>
            <Text>To đến: {toLocation}</Text>
            <Text>Ngày khởi hành: {departureDate.toDateString()}</Text>
            <Text>Ngày trở về: {returnDate.toDateString()}</Text>
            <Text>Số người lớn: {adultCount}</Text>
            <Text>Số trẻ em: {childrenCount}</Text>
            <Text>Số em bé: {infantCount}</Text>
            <Text>Hạng ghế: {selectedClass}</Text>

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
                  flightType: "One-Way",
                  username, avatar
                });
              }}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
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
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F5F9",
    padding: 10,
    borderRadius: 10,
    width: "48%",
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
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

export default OneWay;
