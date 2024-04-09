import {
  View,
  Text,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { SERVER_URL } from "../../api/src/constants";

const register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };
    axios
      .post(`${SERVER_URL}/api/v1/user/register`, user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registeration Success",
          "You have been registered successfully."
        );
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.log("Registeration failed.");
        Alert.alert(
          "Registration Fail",
          "An error occured while registering user."
        );
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ height: 200, backgroundColor: "pink", width: "100%" }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Image
            style={{ width: 150, height: 80, resizeMode: "contain" }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/6655/6655045.png",
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Match Mate
        </Text>
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 25,
              color: "#F9629F",
            }}
          >
            Create Your Account
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Image
            style={{ width: 100, height: 80, resizeMode: "cover" }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/2509/2509078.png",
            }}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#FFC0CB",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <Ionicons
              style={{ marginLeft: 8 }}
              name="person-sharp"
              size={24}
              color="white"
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Enter your name"
              placeholderTextColor={"white"}
              style={{
                color: "white",
                marginVertical: 10,
                width: 300,
                fontSize: name ? 17 : 17,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#FFC0CB",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="white"
            />

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your email"
              placeholderTextColor={"white"}
              style={{
                color: "white",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 17 : 17,
              }}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#FFC0CB",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock1"
                size={24}
                color="white"
              />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Enter your password"
                placeholderTextColor={"white"}
                style={{
                  color: "white",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 17 : 17,
                }}
              />
            </View>
          </View>

          <View style={{ marginTop: 50 }} />
          <TouchableOpacity
            onPress={handleRegister}
            style={{
              width: 200,
              backgroundColor: "#FFC0CB",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 12,
              gap: 12,
            }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;
