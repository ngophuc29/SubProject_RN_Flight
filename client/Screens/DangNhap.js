import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const DangNhap = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

   const handelLogin = async () => {
        

        if (username !=null && password !=null) { 
            try {
            
            const response = await fetch(`http://localhost:4000/api/users`, {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username  ,password})

            })

            const data = await response.json()
            
            if (response.ok) {
                console.log(data)
                navigation.navigate("Home", {
                     id:data.id,
                    username: username,
                    avatar: data.avatar,                  
                    email: data.email,
                    created_at: data.created_at
                })
                alert("Dang nhap thanh cong")
                setPassword("")
                setUsername("")
            }
            else {
                alert(data.message)
            }

        } catch(err) {
            
            console.log(err)
            alert("Dang ky khong thanh cong")
        }
        } else {
            alert("Dien day du thong tin truoc khi dang ky")
        }
        
    }

    

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
}

export default DangNhap;
