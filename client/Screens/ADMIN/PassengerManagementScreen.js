import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';
import { Button, Icon } from "react-native-elements";

const PassengerManagementScreen = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);

    // Hàm load chuyến bay và hành khách
    const loadFlights = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/api/flights');
            const flightsData = response.data.flights;

            // Lưu tất cả chuyến bay vào state
            setFlights(flightsData);
        } catch (error) {
            console.error(error);
            alert('Không thể tải chuyến bay');
        } finally {
            setLoading(false);
        }
    };

    // Gọi loadFlights khi màn hình được render
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
            <Text style={styles.title}>Quản lý Hành khách</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={flights}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.flightItem}>
                            <Text style={styles.flightTitle}>
                                {item.fromLocation} - {item.toLocation}
                            </Text>
                            <Text>Tên người đặt: {item.username}</Text>
                            <Text>Loại chuyến bay: {item.flightType}</Text>
                            <Text>Ngày khởi hành: {new Date(item.departureDate).toLocaleDateString()}</Text>
                            <Text>Ngày trở lại: {new Date(item.returnDate).toLocaleDateString()}</Text>

                            {/* Xử lý Multi-City */}
                            {item.flightType === "Multi-City" && item.legs.length > 0 ? (
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Thông tin chuyến bay:</Text>
                                    {item.legs.map((leg, legIndex) => (
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

                            {/* Hiển thị hành khách */}
                            <View style={styles.passengerSection}>
                                <Text  style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>Hành khách người lớn:</Text>
                                {renderPassenger('adults', item.travellers[0].adults)}

                                <Text  style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>Hành khách trẻ em:</Text>
                                {renderPassenger('children', item.travellers[0].children)}

                                <Text  style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>Hành khách em bé:</Text>
                                {renderPassenger('infants', item.travellers[0].infants)}
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    flightItem: {
        marginBottom: 20,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    flightTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    passengerSection: {
        marginTop: 10,
    },
    subTitle: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    passengerItem: {
        marginVertical: 5,
    },
});

export default PassengerManagementScreen;
