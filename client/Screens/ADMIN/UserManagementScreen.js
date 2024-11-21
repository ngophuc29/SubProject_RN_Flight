import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
    Modal,
    Button,
    Alert,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Icon } from "react-native-elements";

const UserManagementScreen = () => {
    const navigation = useNavigation();

    const [users, setUsers] = useState([]);
    const [userDetails, setUserDetails] = useState(null); // Dữ liệu chi tiết người dùng
    const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);

    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false); // Modal xác nhận xóa
    const [userIdToDelete, setUserIdToDelete] = useState(null); // ID người dùng muốn xóa

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/users');
            setUsers(response.data.users);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:4000/api/admin/users/${userDetails._id}`, {
                username: userDetails.username,
                email: userDetails.email,
                avatar: userDetails.avatar,
                role: userDetails.role
            });
            alert('Cập nhật thành công');
            setUserDetailsModalVisible(false);
            fetchUsers();
        } catch (error) {
            console.log(error);
            alert('Cập nhật không thành công');
        }
    };

    const deleteUser = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/users/${userIdToDelete}`);
            alert('Xóa người dùng thành công');
            setConfirmDeleteModalVisible(false);
            fetchUsers();
        } catch (error) {
            console.log(error);
            alert('Xóa không thành công');
            setConfirmDeleteModalVisible(false);
        }
    };

    const openUserDetailsModal = (user) => {
        setUserDetails(user);
        setUserDetailsModalVisible(true);
    };

    const openConfirmDeleteModal = (userId) => {
        setUserIdToDelete(userId);
        setConfirmDeleteModalVisible(true);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <View style={styles.container}>

            {/* Nút Back */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()} // Quay lại màn hình trước
            >
                <Icon name="arrow-back" type="material" color="#333" style={{ alignSelf: 'flex-start' }} />
            </TouchableOpacity>
            <Text style={styles.title}>Quản lý Người dùng</Text>
            <FlatList
                data={users.filter(user => user.role !== 'ADMIN')}
                keyExtractor={(item) => item.user_id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <View style={styles.userInfo}>
                            <Text style={styles.username}>{item.username}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                            <Text style={styles.role}>Role: {item.role}</Text>
                            <Text style={styles.date}>
                                Tạo ngày: {new Date(item.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity onPress={() => openUserDetailsModal(item)}>
                                <Text style={styles.editButton}>Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openConfirmDeleteModal(item._id)}>
                                <Text style={styles.deleteButton}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Modal xác nhận xóa */}
            {/* Modal xác nhận xóa */}
            <Modal
                visible={confirmDeleteModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setConfirmDeleteModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Bạn có chắc muốn xóa người dùng này?</Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Xóa" onPress={deleteUser} color="red" style={styles.button} />
                            <Button title="Hủy" onPress={() => setConfirmDeleteModalVisible(false)} style={styles.button} />
                        </View>
                    </View>
                </View>
            </Modal>


            {/* Modal cập nhật thông tin người dùng */}
            {userDetails && (
                <Modal
                    visible={userDetailsModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setUserDetailsModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Cập nhật Người dùng</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Tên người dùng"
                                value={userDetails.username}
                                editable={false}
                                onChangeText={(text) =>
                                    setUserDetails((prev) => ({ ...prev, username: text }))
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={userDetails.email}
                                onChangeText={(text) =>
                                    setUserDetails((prev) => ({ ...prev, email: text }))
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Avatar URL"
                                value={userDetails.avatar}
                                onChangeText={(text) =>
                                    setUserDetails((prev) => ({ ...prev, avatar: text }))
                                }
                            />
                            <Image
                                source={{ uri: userDetails.avatar }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    alignSelf: 'center',
                                    marginVertical: 20,
                                }}
                            />
                            <View>
                                <Text>Vai trò</Text>
                                <Picker
                                    selectedValue={userDetails.role}
                                    style={styles.picker}
                                    onValueChange={(itemValue) =>
                                        setUserDetails((prev) => ({ ...prev, role: itemValue }))
                                    }>
                                    <Picker.Item label="USER" value="USER" />
                                    <Picker.Item label="ADMIN" value="ADMIN" />
                                </Picker>
                            </View>
                            <Button title="Lưu" onPress={handleUpdate} />
                            <Button
                                title="Hủy"
                                color="red"
                                onPress={() => setUserDetailsModalVisible(false)}
                            />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    item: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    userInfo: { flex: 1 },
    username: { fontSize: 16, fontWeight: 'bold' },
    email: { fontSize: 14, color: '#555' },
    role: { fontSize: 14, color: '#888' },
    date: { fontSize: 12, color: '#aaa' },
    actionButtons: { flexDirection: 'row' },
    editButton: { color: 'blue', marginRight: 10 },
    deleteButton: { color: 'red' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
    // Cập nhật lại phần style của modalContainer và modalContent
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Giãn cách các nút ra xa nhau
        marginTop: 20, // Khoảng cách giữa các nút và phần trên modal
    },
    button: {
        width: '45%', // Mỗi nút chiếm 45% chiều rộng modal
    },

    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    picker: { height: 50, width: '100%', borderWidth: 1, borderColor: '#ccc', marginBottom: 10 },

});

export default UserManagementScreen;
