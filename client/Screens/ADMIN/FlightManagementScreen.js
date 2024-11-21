import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
    Modal,
} from 'react-native';
import axios from 'axios';
import { Button, Icon } from "react-native-elements";
import { useNavigation } from '@react-navigation/native';

const FlightManagementScreen = ({ userDetails }) => {
    const navigation = useNavigation();

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingFlight, setEditingFlight] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [flightToDelete, setFlightToDelete] = useState(null);
    const generateFlightCode = () => {
        return `FL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    };

    const loadFlights = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/api/flights`);
            setFlights(response.data.flights);
        } catch (error) {
            console.error(error);
            alert('Không thể tải chuyến bay');
        } finally {
            setLoading(false);
        }
    };

    const updateFlight = async () => {
        if (!editingFlight.departureDate || !editingFlight.totalPrice) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }
        try {
            const response = await axios.put(
                `http://localhost:4000/api/flights/${editingFlight._id}`,
                editingFlight
            );
            setFlights(flights.map((flight) => (flight.id === editingFlight.id ? response.data.flight : flight)));
            setEditingFlight(null);
            alert('Cập nhật chuyến bay thành công');
            loadFlights();
        } catch (error) {
            console.error(error);
            alert('Không thể cập nhật chuyến bay');
        }
    };

    // Hiển thị modal
    const showModal = (flightId) => {
        setFlightToDelete(flightId);
        setIsModalVisible(true);
    };

    // Đóng modal
    const hideModal = () => {
        setIsModalVisible(false);
        setFlightToDelete(null);
    };

    const deleteFlight = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/flights/${flightToDelete}`);
            setFlights(flights.filter((flight) => flight.id !== flightToDelete));
            alert('Xóa chuyến bay thành công');
            loadFlights();

        } catch (error) {
            console.error(error);
            alert('Không thể xóa chuyến bay');
        } finally {
            hideModal(); // Ẩn modal sau khi xóa
        }
    };


    useEffect(() => {
        loadFlights();
    }, []);


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
            

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()} // Quay lại màn hình trước
            >
                <Icon name="arrow-back" type="material" color="#333" style={{ alignSelf: 'flex-start' }} />
            </TouchableOpacity>
             
            <Text style={styles.title}>Quản lý chuyến bay</Text>
            

            {/* Form chỉnh sửa chuyến bay */}
            {editingFlight && (
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ngày đi (YYYY-MM-DD)"
                        value={editingFlight.departureDate}
                        onChangeText={(text) =>
                            setEditingFlight({ ...editingFlight, departureDate: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Giá vé"
                        value={editingFlight.totalPrice}
                        onChangeText={(text) =>
                            setEditingFlight({ ...editingFlight, totalPrice: text })
                        }
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={updateFlight}
                    >
                        <Text style={styles.addButtonText}>Cập nhật chuyến bay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setEditingFlight(null)}
                    >
                        <Text style={styles.cancelButtonText}>Hủy chỉnh sửa</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Danh sách chuyến bay */}
            <ScrollView style={{ padding: 10 }}>
                {loading ? (
                    <Text style={{ textAlign: 'center', fontSize: 16, color: 'gray' }}>Đang tải dữ liệu...</Text>
                ) : Array.isArray(flights) && flights.length > 0 ? (
                    flights
                        .sort((a, b) => new Date(b.departureDate) - new Date(a.departureDate))
                        .map((flight, index) => (
                            <View key={flight.id} style={styles.flightItem}>
                                <Text style={styles.flightHeader}>Chuyến bay của {flight.username}</Text>
                                <Text style={styles.flightHeader}>
                                    Chuyến bay {index + 1} - {flight.fromLocation} → {flight.toLocation}
                                </Text>
                                <Text style={styles.flightCode}>
                                    Mã chuyến bay: {generateFlightCode()}
                                </Text>
                                <Text>
                                    {new Date(flight.departureDate).toLocaleDateString()} -{' '}
                                    {flight.flightType === 'Round-Trip'
                                        ? new Date(flight.returnDate).toLocaleDateString()
                                        : 'Không có chuyến về'}
                                </Text>
                                <Text>Loại vé: {flight.selectedClass}</Text>
                                <Text>Giá tổng: ${flight.totalPrice}</Text>

                                {/* Multi-City Info */}
                                {flight.flightType === 'Multi-City' && flight.legs.length > 0 && (
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={styles.legHeader}>Thông tin chuyến bay:</Text>
                                        {flight.legs.map((leg, legIndex) => (
                                            <View key={legIndex} style={styles.legItem}>
                                                <Text>
                                                    Chặng {legIndex + 1}: {leg.route} ({leg.stops}) - {leg.duration}
                                                </Text>
                                                <Text style={styles.legDetail}>
                                                    Khởi hành: {leg.departureTime} - Đến: {leg.arrivalTime} (Hãng: {leg.airline})
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {/* Departure Flight */}
                                {flight.departureFlight ? (
                                    <Text style={styles.flightDetail}>
                                        Đi: {JSON.parse(flight.departureFlight).departureTime} -{' '}
                                        {JSON.parse(flight.departureFlight).arrivalTime} (Hãng: {JSON.parse(flight.departureFlight).airline})
                                    </Text>
                                ) : (
                                    <Text style={styles.flightDetail}>Thông tin chuyến bay đi không có</Text>
                                )}

                                {/* Return Flight */}
                                {flight.flightType === 'Round-Trip' && flight.returnFlight !== 'null' ? (
                                    <Text style={styles.flightDetail}>
                                        Về: {JSON.parse(flight.returnFlight).departureTime} -{' '}
                                        {JSON.parse(flight.returnFlight).arrivalTime} (Hãng: {JSON.parse(flight.returnFlight).airline})
                                    </Text>
                                ) : flight.flightType === 'One-Way' ? (
                                    <Text style={styles.flightDetail}>Không có chuyến bay về</Text>
                                ) : null}

                                

                                {/* Hiển thị hành khách */}
                                <View style={styles.passengerSection}>

                                    <Text style={styles.flightHeader}>Thông tin Hành Khách</Text>

                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>Hành khách người lớn:</Text>
                                    {renderPassenger('adults', flight.travellers[0].adults)}

                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>Hành khách trẻ em:</Text>
                                    {renderPassenger('children', flight.travellers[0].children)}

                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>Hành khách em bé:</Text>
                                    {renderPassenger('infants', flight.travellers[0].infants)}
                                </View>
                                {/* Passenger Count */}
                                            
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }} >Tổng số hành khách</Text>

                                <Text>
                                    {flight.adultCount} người lớn, {flight.childrenCount} trẻ em, {flight.infantCount} em bé
                                </Text>
                                {/* Action Buttons: Edit and Delete */}
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => setEditingFlight(flight)} // Chỉnh sửa chuyến bay
                                    >
                                        <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                                    </TouchableOpacity>
                                    <View>
                                         
                                        <Button title="Xóa" onPress={() => showModal(flight._id)} />
                                    </View>
                                </View>
                            </View>
                        ))
                ) : (
                    <Text style={{ textAlign: 'center', fontSize: 16, color: 'gray' }}>Bạn chưa có chuyến bay nào.</Text>
                )}
            </ScrollView>
            {/* Modal xác nhận xóa */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={hideModal}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                        <Text style={{ marginBottom: 20 }}>Bạn có chắc chắn muốn xóa chuyến bay này?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={hideModal} style={{ padding: 10 }}>
                                <Text style={{ color: 'red' }}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={deleteFlight} style={{ padding: 10 }}>
                                <Text style={{ color: 'green' }}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
       
        marginVertical: 10,
    },
    form: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    flightItem: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    flightHeader: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    flightCode: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 5,
    },
    flightDetail: {
        marginTop: 10,
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 15,
    },
    editButton: {
        backgroundColor: '#FFD700',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    legHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    legItem: {
        marginVertical: 5,
    },
    legDetail: {
        fontSize: 12,
        color: 'gray',
    },
});

export default FlightManagementScreen;
