import React, { useState } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const DangNhap = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handelLogin = async () => {
        if (username !== '' && password !== '') {
            try {
                const response = await fetch('http://localhost:4000/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Tạo object chứa thông tin người dùng
                    const user = {
                        user_id: data.id.toString(),
                        username: username,
                        avatar: data.avatar,
                        email: data.email,
                        created_at: data.created_at,
                        role:data.role
                    };

                    // Lưu object vào AsyncStorage dưới dạng chuỗi JSON
                    await AsyncStorage.setItem('user', JSON.stringify(user));

                    // Điều hướng tới màn hình Home và truyền thông tin
                    navigation.navigate("Home", {
                        user_id: data.id.toString(),
                        username: username,
                        avatar: data.avatar,
                        email: data.email,
                        created_at: data.created_at,
                        role: data.role
} );

                     
                    // navigation.navigate("Home" );


                    Alert.alert("Đăng nhập thành công");

                    // Xóa các giá trị trong input
                    setUsername('');
                    setPassword('');
                } else {
                    Alert.alert(data.message || "Lỗi đăng nhập");
                }
            } catch (err) {
                console.log(err);
                Alert.alert("Có lỗi xảy ra. Vui lòng thử lại");
            }
        } else {
            Alert.alert("Vui lòng điền đầy đủ thông tin trước khi đăng nhập");
        }
    };


    return (
        <View>
            <View style={{ marginBottom: 20 }}>
                <Image
                    source={{ uri: "https://beyondtype1.org/wp-content/uploads/2016/05/BT1-TAKE-TO-THE-SKIES-HEADER-2021-1200x429.jpg" }}
                    style={{ height: 200, width: '100%' }} />
            </View>

            <View style={{ padding: 20 }}>
                <View style={{ marginBottom: 40 }}>
                    <Text style={{ fontSize: 30, fontWeight: '600', marginVertical: 10 }}>
                        Welcome
                    </Text>
                </View>

                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderRadius: 20, padding: 10 }}>
                        <Icon name="user" size={20} color="gray" style={{ marginRight: 10 }} />
                        <TextInput
                            placeholder="Enter your username"
                            style={{ flex: 1, outlineStyle: 'none' }}
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderRadius: 20, padding: 10 }}>
                        <Icon name="lock" size={20} color="gray" style={{ marginRight: 10 }} />
                        <TextInput
                            placeholder="Enter your password"
                            secureTextEntry
                            style={{ flex: 1, outlineStyle: 'none' }}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={{ width: '94%', marginLeft: 16, marginTop: 11, backgroundColor: 'rgb(34, 200, 247)', paddingVertical: 11, borderRadius: 20 }}
                    onPress={handelLogin}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                        Login
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ width: '94%', marginLeft: 16, marginTop: 11, backgroundColor: 'rgb(34, 200, 247)', paddingVertical: 11, borderRadius: 20 }}
                    onPress={() => {
                        navigation.navigate("DangKy");
                    }}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                        You don't have an account? Sign Up Here
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DangNhap;
