import React, { useState } from 'react';
import { TouchableOpacity, Modal, View, Text, TextInput, Image, ScrollView, StyleSheet } from 'react-native';
import { Avatar, Icon, Card } from 'react-native-elements';
import axios from 'axios';

const Home = ({ navigation, route }) => {
    const { id, username, avatar, email, created_at } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
    const [userDetails, setUserDetails] = useState({
        id, username, email, avatar, created_at, password: '***'
    });
    const [originalDetails, setOriginalDetails] = useState({ username, email, avatar });

    const openUserDetails = () => {
        setModalVisible(false);
        setUserDetailsModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:4000/api/users/${id}`, {
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

    const resetDetails = () => {
        setUserDetails({ ...userDetails, ...originalDetails });
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
                            <Avatar rounded title="A" source={{ uri: avatar }} containerStyle={styles.avatar} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("BookingTabs", { username, avatar })}>
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
                <TouchableOpacity onPress={() => navigation.navigate("BookingTabs", { username, avatar })}>
                    <Icon name="explore" type="material" color="gray" />
                    <Text>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Avatar rounded title="A" source={{ uri: avatar }} containerStyle={styles.avatarfooter} />
                    <Text>{username}</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for Menu Options */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={openUserDetails}>
                            <Text style={styles.modalOption}>Xem thông tin</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalOption}>Chỉnh sửa</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => {
                            setModalVisible(false);
                            navigation.navigate("DangNhap");
                            alert("Đăng xuất thành công");
                        }}>
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

                        <TouchableOpacity onPress={resetDetails} style={styles.resetButton}>
                            <Text style={styles.resetButtonText}>Đặt lại</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setUserDetailsModalVisible(false)} style={styles.closeButton}>
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
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
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
