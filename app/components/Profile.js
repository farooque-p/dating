import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Entypo, FontAwesome, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import * as Animatable from "react-native-animatable";
import { SERVER_URL } from "../../api/src/constants.js";

const Profile = ({ item, isEven, userId, setProfiles }) => {
  const colors = ["#F0F8FF", "#FFFFFF"];
  const [liked, setLiked] = useState(false);
  const [selected, setSelected] = useState(false);

  // Handle Like
  const handleLike = async (selectedUserId) => {
    try {
      setLiked(true);
      await axios.post(`${SERVER_URL}/api/v1/user/send-like`, {
        currentUserId: userId,
        selectedUserId: selectedUserId,
      });
      setTimeout(() => {
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile._id !== selectedUserId)
        );
        setLiked(false);
      }, 200);
    } catch (error) {
      console.log("Error liking user profile. ", error);
    }
  };

  // Handle Like - Other
  const handleLikeOther = async (selectedUserId) => {
    try {
      setSelected(true);
      await axios.post(`${SERVER_URL}/api/v1/user/send-like`, {
        currentUserId: userId,
        selectedUserId: selectedUserId,
      });

      setTimeout(() => {
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile._id !== selectedUserId)
        );
        setSelected(false);
      }, 200);

      // Handle success: Perform any UI updates or navigate to another screen
    } catch (error) {
      console.error("Error liking user:", error);
      // Handle error scenarios
    }
  };

  if (isEven) {
    return (
      <View style={{ padding: 12, backgroundColor: "#F0F8FF" }}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 50 }}>
            <View>
              <Text style={{ fontSize: 17, fontWeight: "600" }}>
                {item?.name}
              </Text>
              <Text
                style={{
                  width: 200,
                  marginTop: 15,
                  fontSize: 18,
                  lineHeight: 24,
                  marginBottom: 8,
                }}
              >
                {item?.description?.length < 160
                  ? item?.description
                  : item?.description.substr(0, 160)}
              </Text>
            </View>
            {item?.profileImages?.slice(0, 1).map((item, index) => (
              <Image
                style={{
                  width: 280,
                  height: 280,
                  resizeMode: "cover",
                  borderRadius: 5,
                }}
                source={{ uri: item }}
              />
            ))}
          </View>
        </ScrollView>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Entypo name="dots-three-vertical" size={26} color="black" />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "#E0E0E0",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome name="diamond" size={27} color="#DE3163" />
              </TouchableOpacity>
              {liked ? (
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#E0E0E0",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Animatable.View
                    animation="swing"
                    easing={"ease-in-out-circ"}
                    iterationCount={1}
                  >
                    <AntDesign name="heart" size={27} color="red" />
                  </Animatable.View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleLike(item?._id)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#E0E0E0",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={27} color="#FF033E" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ padding: 12, backgroundColor: "#FFFFFF" }}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 50 }}>
            {item?.profileImages?.slice(0, 1).map((item, index) => (
              <Image
                style={{
                  width: 280,
                  height: 280,
                  resizeMode: "cover",
                  borderRadius: 5,
                }}
                source={{ uri: item }}
              />
            ))}
            <View>
              <Text style={{ fontSize: 17, fontWeight: "600" }}>
                {item?.name}
              </Text>
              <Text
                style={{
                  width: 200,
                  marginTop: 15,
                  fontSize: 18,
                  lineHeight: 24,
                  marginBottom: 8,
                }}
              >
                {item?.description?.length < 160
                  ? item?.description
                  : item?.description.substr(0, 160)}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Entypo name="dots-three-vertical" size={26} color="black" />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "#E0E0E0",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome name="diamond" size={27} color="#0066b2" />
              </TouchableOpacity>
              {selected ? (
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#6699CC",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Animatable.View
                    animation="swing"
                    easing={"ease-in-out-circ"}
                    iterationCount={1}
                  >
                    <AntDesign name="heart" size={27} color="white" />
                  </Animatable.View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleLikeOther(item._id)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#6699CC",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={27} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
};

export default Profile;
