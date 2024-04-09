import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { SERVER_URL } from "../../../api/src/constants";
import Profile from "../../components/Profile";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");
  const [profiles, setProfiles] = useState([]);

  // Get User Id
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);

  // Get User
  const fetchUserDescription = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/v1/user/${userId}/data`
      );
      //console.log("Reponse from Profile: ", response);
      const user = response.data;
      setUser(user?.user);
    } catch (error) {
      console.log("Error while fetching user data. ", error);
    }
  };
  //console.log("User Id from Profile :", userId);
  useEffect(() => {
    if (userId) {
      fetchUserDescription();
    }
  }, [userId]);
  //console.log("User from Profile: ", user);

  // Get Profiles
  const fetchProfiles = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/v1/user/profiles`, {
        params: {
          userId: userId,
          gender: user?.gender,
          turnOns: user?.turnOns,
          lookingFor: user?.lookingFor,
        },
      });
      setProfiles(response.data.profiles);
    } catch (error) {
      console.log("Error while fetching profiles. ", error);
    }
  };
  useEffect(() => {
    if (userId && user) {
      fetchProfiles();
    }
  }, [userId, user]);

  //console.log("Fetched Profiles: ", profiles);

  return (
    <View>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Profile
            key={index}
            item={item}
            userId={userId}
            setProfiles={setProfiles}
            isEven={index % 2 === 0}
          />
        )}
      />
    </View>
  );
};

export default index;
