import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Modal, View, Text, TextInput, Image, ScrollView, StyleSheet } from 'react-native';
import { Avatar, Icon, Card } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
const Home = ({ navigation, route }) => {
    // const { user_id, username, avatar, email, created_at,role } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
    const [flightListModalVisible, setFlightListModalVisible] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [flights, setFlights] = useState([]); // State to store flights

    // useEffect(() => {
    //     const fetchLoginState = async () => {
    //         try {
    //             const user = await AsyncStorage.getItem('user');
    //             if (user) {
    //                 setUserDetails(JSON.parse(user)); // Set user data from AsyncStorage
    //             }
    //         } catch (error) {
    //             console.log("Failed to load user data", error);
    //         }
    //     };
    //     fetchLoginState();
    // }, []);
    useEffect(() => {
        const fetchLoginState = async () => {
            try {
                const userFromStorage = await AsyncStorage.getItem('user');
                const userFromParams = route.params;

                // Prioritize params over AsyncStorage data
                if (userFromParams) {
                    setUserDetails(userFromParams); // Use user data from params if available
                } else if (userFromStorage) {
                    setUserDetails(JSON.parse(userFromStorage)); // Otherwise, use AsyncStorage
                }
            } catch (error) {
                console.log("Failed to load user data", error);
            }
        };

        fetchLoginState();
    }, [route.params]);



    const openUserDetails = () => {
        setModalVisible(false);
        setUserDetailsModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:4000/api/users/${userDetails.user_id}`, {
                username: userDetails.username,
                email: userDetails.email,
                avatar: userDetails.avatar,
            });
            alert("Cập nhật thành công");
            setUserDetailsModalVisible(false);
        } catch (error) {
            console.log(error);
            alert("Cập nhật không thành công");
        }
    };

    const loadFlights = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/flights/${userDetails.username}`);
            setFlights(response.data.flights); // Assume the API returns a list of flights
        } catch (error) {
            console.log(error);
            alert("Không thể tải chuyến bay");
        }
    };

    const openFlightList = () => {
        loadFlights(); // Load flights when opening the modal
        setModalVisible(false);
        setFlightListModalVisible(true);
    };
    const generateFlightCode = () => {
        return `FL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    };
    const handleLogout = async () => {
        try {
            // await AsyncStorage.removeItem('user'); // Remove user data on logout
            // const user = await AsyncStorage.getItem('user'); // Check if user is removed
            // console.log('User after logout:', user); // Should return null if removed
            // Xóa toàn bộ dữ liệu trong AsyncStorage

            // Clear AsyncStorage data
            await AsyncStorage.clear();
            // Reset state and navigate to the login screen
            setUserDetails({}); // Reset user details

            setModalVisible(false)
            alert("Đăng xuất thành công");
            navigation.navigate("DangNhap"); // Redirect to login screen
        } catch (error) {
            alert("Đã có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.");
        }
    };


    const openAdminManagement = (type) => {
        setModalVisible(false);
        switch (type) {
            case "user":
                navigation.navigate("UserManagementScreen"); // Màn hình quản lý người dùng
                break;
            case "passenger":
                navigation.navigate("PassengerManagementScreen"); // Màn hình quản lý hành khách
                break;
            case "flight":
                navigation.navigate("FlightManagementScreen"); // Màn hình quản lý chuyến bay
                break;
            case "statistics":
                navigation.navigate("StatisticsScreen"); // Màn hình thống kê
                break;
            default:
                break;
        }
    };

    // Hàm render thông tin hành khách
    const renderPassenger = (passengerType, passengers) => {
        return passengers.map((passenger, index) => (
            <View key={index} style={styles.passengerItem}>
                <Text>{`${passenger.firstName} ${passenger.lastName} (${passenger.gender})`}</Text>
                {passenger.email && <Text>Email: {passenger.email}</Text>}
                {passenger.phone && <Text>Phone: {passenger.phone}</Text>}
            </View>
        ));
    };
    return (
        <View style={styles.container}>
            <ScrollView stickyHeaderIndices={[0]} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <View style={styles.header}>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="flight" type="material" color="#00A4FF" size={30} />
                                <Text style={styles.headerTitle}>Explore flight</Text>
                            </View>
                            <Text style={styles.headerSubtitle}>Welcome to flight booking</Text>
                        </View>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Avatar rounded title="A" source={{ uri: userDetails.avatar }} containerStyle={styles.avatar} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("BookingTabs", { username: userDetails.username, avatar: userDetails.avatar })}>
                        <TextInput placeholder="Find a flight" style={styles.searchInput} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>The best cities for you</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScroll}>
                    <Card containerStyle={styles.card}>
                        <Image source={{ uri: 'https://www.costacruises.com/content/dam/costa/inventory-assets/ports/HKG/hkg-hong%20kong-port-1.jpg' }} style={styles.exploreImage} />
                        <Text style={styles.cardTitle}>HongKong</Text>
                        <Text style={styles.cardSubtitle}>from $33.00 to $38.00</Text>
                    </Card>
                    <Card containerStyle={styles.card}>
                        <Image source={{ uri: 'https://cdn.aarp.net/content/dam/aarp/travel/destinations/2022/06/1140-san-antonio-skyline.jpg' }} style={styles.exploreImage} />
                        <Text style={styles.cardTitle}>San Antonio</Text>
                        <Text style={styles.cardSubtitle}>from $48.00 to $53.00</Text>
                    </Card>
                </ScrollView>

                <Text style={styles.sectionTitle}>Explore Destinations</Text>
                <Card containerStyle={styles.exploreCard}>
                    <Image source={{ uri: 'https://th.bing.com/th/id/R.43f1e0fb3969e802e0f369e74722872f?rik=WHk7ftG2Aeb20Q&pid=ImgRaw&r=0' }} style={styles.exploreImage} />
                </Card>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity>
                    <Icon name="home" type="material" color="#00A4FF" />
                    <Text>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("BookingTabs", { username: userDetails.username, avatar: userDetails.avatar })}>
                    <Icon name="explore" type="material" color="gray" />
                    <Text>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Avatar rounded title="A" source={{ uri: userDetails.avatar }} containerStyle={styles.avatarfooter} />
                    <Text>{userDetails.username}</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for Menu Options */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={openUserDetails}>
                            <Text style={styles.modalOption}>Xem thông tin</Text>
                        </TouchableOpacity>
                        {userDetails.role !== "ADMIN" && (

                            <TouchableOpacity onPress={openFlightList}>
                                <Text style={styles.modalOption}>Xem chuyến bay của bạn</Text>
                            </TouchableOpacity>
                        )}

                        {/* Hiển thị các mục quản lý nếu role là ADMIN */}
                        {userDetails.role === "ADMIN" && (
                            <>
                                <TouchableOpacity onPress={() => openAdminManagement("user")}>
                                    <Text style={styles.modalOption}>Quản lý người dùng</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => openAdminManagement("passenger")}>
                                    <Text style={styles.modalOption}>Quản lý hành khách</Text>
                                </TouchableOpacity> */}
                                <TouchableOpacity onPress={() => openAdminManagement("flight")}>
                                    <Text style={styles.modalOption}>Quản lý chuyến bay</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => openAdminManagement("statistics")}>
                                    <Text style={styles.modalOption}>Thống kê</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <TouchableOpacity onPress={handleLogout}>
                            <Text style={styles.modalOption}>Đăng xuất</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* User Details Modal */}
            <Modal animationType="fade" transparent={true} visible={userDetailsModalVisible} onRequestClose={() => setUserDetailsModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainerINFO}>
                        <Text style={styles.modalLabel}>Username:</Text>
                        <TextInput
                            style={styles.inputField}
                            value={userDetails.username}
                            onChangeText={(text) => setUserDetails({ ...userDetails, username: text })}
                            editable={false}
                        />

                        <Text style={styles.modalLabel}>Email:</Text>
                        <TextInput
                            style={styles.inputField}
                            value={userDetails.email}
                            onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
                        />

                        <Text style={styles.modalLabel}>Avatar URL:</Text>
                        <TextInput
                            style={styles.inputField}
                            value={userDetails.avatar}
                            onChangeText={(text) => setUserDetails({ ...userDetails, avatar: text })}
                        />
                        <Image source={{ uri: userDetails.avatar }} style={styles.avatarImage} />

                        <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                            <Text style={styles.updateButtonText}>Cập nhật</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setUserDetails({ ...userDetails, ...JSON.parse(localStorage.getItem('user')) })} style={styles.resetButton}>
                            <Text style={styles.resetButtonText}>Đặt lại</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setUserDetailsModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Flight List Modal */}
            {/* Flights List Modal */}
            <Modal animationType="slide" transparent={true} visible={flightListModalVisible} onRequestClose={() => setFlightListModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginBottom: 10, alignSelf: 'center'
                        }}>Chuyến bay của bạn</Text>

                        <ScrollView style={{ padding: 10 }}>
                            {Array.isArray(flights) && flights.length > 0 ? (
                                flights
                                    .sort((a, b) => new Date(b.departureDate) - new Date(a.departureDate)) // Sắp xếp theo departureDate giảm dần
                                    .map((flight, index) => (
                                        <View key={index} style={{ marginBottom: 15, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
                                                Chuyến bay {index + 1} - {flight.fromLocation} → {flight.toLocation}
                                            </Text>
                                            {/* Mã chuyến bay ngẫu nhiên */}
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
                                                Mã chuyến bay: {generateFlightCode()}
                                            </Text>
                                            <Text>{new Date(flight.departureDate).toLocaleDateString()} - {flight.flightType === "Round-Trip" ? new Date(flight.returnDate).toLocaleDateString() : 'Không có chuyến về'}</Text>
                                            <Text>Loại vé: {flight.selectedClass}</Text>
                                            <Text>Giá tổng: ${flight.totalPrice}</Text>

                                            {/* Xử lý Multi-City */}
                                            {flight.flightType === "Multi-City" && flight.legs.length > 0 ? (
                                                <View style={{ marginTop: 10 }}>
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Thông tin chuyến bay:</Text>
                                                    {flight.legs.map((leg, legIndex) => (
                                                        <View key={legIndex} style={{ marginTop: 5 }}>
                                                            <Text style={{ fontSize: 14 }}>
                                                                Chặng {legIndex + 1}: {leg.route} ({leg.stops}) - {leg.duration}
                                                            </Text>
                                                            <Text style={{ fontSize: 14, color: 'gray' }}>
                                                                Khởi hành: {leg.departureTime} - Đến: {leg.arrivalTime} (Hãng: {leg.airline})
                                                            </Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            ) : null}

                                            {/* Thông tin chuyến bay đi */}
                                            {flight.departureFlight ? (
                                                <Text style={{ fontSize: 14, color: 'gray', marginTop: 5 }}>
                                                    Đi: {JSON.parse(flight.departureFlight).departureTime} - {JSON.parse(flight.departureFlight).arrivalTime}
                                                    (Hãng: {JSON.parse(flight.departureFlight).airline})
                                                </Text>
                                            ) : (
                                                <Text style={{ fontSize: 14, color: 'gray', marginTop: 5 }}>Thông tin chuyến bay đi không có</Text>
                                            )}

                                            {/* Thông tin chuyến bay về (chỉ hiển thị nếu là Round-Trip và có thông tin về chuyến bay về) */}
                                            {flight.flightType === "Round-Trip" && flight.returnFlight !== "null" ? (
                                                <Text style={{ fontSize: 14, color: 'gray', marginTop: 5 }}>
                                                    Về: {JSON.parse(flight.returnFlight).departureTime} - {JSON.parse(flight.returnFlight).arrivalTime}
                                                    (Hãng: {JSON.parse(flight.returnFlight).airline})
                                                </Text>
                                            ) : flight.flightType === "One-Way" ? (
                                                <Text style={{ fontSize: 14, color: 'gray', marginTop: 5 }}>Không có chuyến bay về</Text>
                                            ) : null}

                                            {/* Hiển thị hành khách */}
                                            <View style={styles.passengerSection}>

                                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }} >Thông tin Hành Khách</Text>

                                                <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>Hành khách người lớn:</Text>
                                                {renderPassenger('adults', flight.travellers[0].adults)}

                                                <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>Hành khách trẻ em:</Text>
                                                {renderPassenger('children', flight.travellers[0].children)}

                                                <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>Hành khách em bé:</Text>
                                                {renderPassenger('infants', flight.travellers[0].infants)}
                                            </View>
                                            {/* Số lượng hành khách */}
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }} >Tổng số hành khách</Text>

                                            <Text>{flight.adultCount} người lớn, {flight.childrenCount} trẻ em, {flight.infantCount} em bé</Text>

                                        </View>
                                    ))
                            ) : (
                                <Text style={{ textAlign: 'center', fontSize: 16, color: 'gray' }}>Bạn chưa có chuyến bay nào.</Text>
                            )}
                        </ScrollView>




                        <TouchableOpacity onPress={() => setFlightListModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F5F9',
        paddingTop: 20,
    },
    scrollContainer: {
        paddingBottom: 80,
    },
    headerContainer: {
        backgroundColor: '#F4F5F9',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EDEFF1',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    avatar: {
        marginLeft: 'auto',
        width: 40, height: 40, borderRadius: 20
    },
    avatarfooter: {
        marginLeft: 'auto',
        width: 30, height: 30, borderRadius: 20
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#999',
        paddingHorizontal: 20,
        marginTop: 5,
    },
    searchContainer: {
        backgroundColor: '#EDEFF1',
        borderRadius: 10,
        marginHorizontal: 20,
        padding: 10,
        marginBottom: 20,
    },
    searchInput: {
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 10,
        marginTop: 10
    },
    horizontalScroll: {
        marginLeft: 10
    },
    card: {
        padding: 0,
        marginRight: 10,
        width: 200,
        borderRadius: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 10,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#999',
        marginHorizontal: 10,
        marginBottom: 10,
    },
    exploreImage: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    exploreCard: {
        padding: 0,
        marginBottom: 20,
        width: '90%',
        alignSelf: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EDEFF1',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        maxHeight: '80%', // Giới hạn chiều cao tối đa của modal
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalOption: {
        fontSize: 18,
        paddingVertical: 10,
        width: '100%',
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
        paddingVertical: 10,
    },
    closeButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
    },
    modalContainerINFO: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#EDEFF1',
        borderRadius: 5,
        padding: 8,
        fontSize: 16,
        marginTop: 5,
        marginBottom: 15,
    },
    updateButton: {
        backgroundColor: '#00A4FF',
        borderRadius: 5,
        paddingVertical: 10,
        marginTop: 20,
    },
    updateButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#FFF',
    },
    resetButton: {
        backgroundColor: '#FF5E5E',
        borderRadius: 5,
        paddingVertical: 10,
        marginTop: 10,
    },
    resetButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#FFF',
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 20,
        alignSelf: 'center',
    },
});

export default Home;
