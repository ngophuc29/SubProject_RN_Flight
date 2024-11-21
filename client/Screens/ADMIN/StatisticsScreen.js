import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Icon } from "react-native-elements";

const StatisticsScreen = ({ navigation }) => {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        // Gọi API để lấy thống kê
        axios.get('http://localhost:4000/api/admin/statistics')
            .then(response => {
                setStatistics(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy thống kê:', error);
            });
    }, []);

    if (!statistics) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
            </View>
        );
    }

    return (
        <View style={{flex:1 ,padding:20}}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()} // Quay lại màn hình trước
                >
                    <Icon name="arrow-back" type="material" color="#333" style={{ alignSelf: 'flex-start',padding:20 }} />
                </TouchableOpacity>
                <Text style={styles.header}>Thống kê tổng quan</Text>
        <ScrollView style={styles.container}  >
             

           

            <View style={[styles.statItem, { backgroundColor: '#e1f5fe' }]}>
                <Text style={styles.statTitle}>Tổng số chuyến bay</Text>
                <Text style={styles.statValue}>{statistics.totalFlights}</Text>
            </View>

            <View style={[styles.statItem, { backgroundColor: '#ffecb3' }]}>
                <Text style={styles.statTitle}>Tổng số người dùng</Text>
                <Text style={styles.statValue}>{statistics.totalUsers}</Text>
            </View>

            <View style={[styles.statItem, { backgroundColor: '#c8e6c9' }]}>
                <Text style={styles.statTitle}>Tổng doanh thu</Text>
                <Text style={styles.statValue}>{statistics.totalRevenue} VNĐ</Text>
            </View>

            <View style={[styles.statItem, { backgroundColor: '#fff3e0' }]}>
                <Text style={styles.statTitle}>Số lượng người lớn</Text>
                <Text style={styles.statValue}>{statistics.totalAdults}</Text>
            </View>

            <View style={[styles.statItem, { backgroundColor: '#f8bbd0' }]}>
                <Text style={styles.statTitle}>Số lượng trẻ em</Text>
                <Text style={styles.statValue}>{statistics.totalChildren}</Text>
            </View>

            <View style={[styles.statItem, { backgroundColor: '#ffccbc' }]}>
                <Text style={styles.statTitle}>Số lượng trẻ sơ sinh</Text>
                <Text style={styles.statValue}>{statistics.totalInfants}</Text>
            </View>

            <View style={styles.statItem}>
                <Text style={styles.statTitle}>Thống kê chuyến bay theo loại</Text>
                <Text style={styles.statValue}>One-Way: {statistics.flightTypes["One-Way"]}</Text>
                <Text style={styles.statValue}>Round-Trip: {statistics.flightTypes["Round-Trip"]}</Text>
                <Text style={styles.statValue}>Multi-City: {statistics.flightTypes["Multi-City"]}</Text>
            </View>
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#888',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 5,
        left: 5,
        padding: 5,
        // backgroundColor: '#333',
        borderRadius: 50,
        zIndex: 10,
    },
    statItem: {
        padding: 16,
        marginBottom: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statValue: {
        fontSize: 16,
        color: '#555',
        marginTop: 8,
    },
});

export default StatisticsScreen;
