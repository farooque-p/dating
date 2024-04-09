import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { SERVER_URL } from "../../../api/src/constants";
import UserChat from "../../components/UserChat";

const index = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);

  // Fetch Logged In user
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);

  // Fetch Received Likes Detail
  const fetchReceivedLikesDetails = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/v1/user/received-likes/${userId}/details`
      );
      //console.log("Received Likes Details: ", response);
      const receivedLikesDetails = response.data.receivedLikesDetails;

      setProfiles(receivedLikesDetails);
    } catch (error) {
      console.log("Error while fetching Received Likes Details. ", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchReceivedLikesDetails();
    }
  }, [userId]);

  // Get User Matches
  const fetchUserMatches = async () => {
    const response = await axios.get(
      `${SERVER_URL}/api/v1/user/${userId}/matches`
    );

    const userMatches = response.data.matches;
    setMatches(userMatches);
  };

  useEffect(() => {
    if (userId) {
      fetchUserMatches();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchUserMatches();
      }
    }, [])
  );

  //console.log("Matches: ", matches);

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "500" }}>CHATS</Text>
        <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
      </View>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/chat/select",
            params: {
              profiles: JSON.stringify(profiles),
              userId: userId,
            },
          })
        }
        style={{
          marginVertical: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor: "#E0E0E0",
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="heart" size={24} color="black" />
        </View>
        <Text style={{ fontSize: 17, marginLeft: 10, flex: 1 }}>
          You have received {profiles?.length} likes!
        </Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </TouchableOpacity>
      <View>
        {matches.map((item, index) => (
          <UserChat key={index} userId={userId} item={item} />
        ))}
      </View>
    </View>
  );
};

export default index;
