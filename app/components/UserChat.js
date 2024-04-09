import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const UserChat = ({ item, userId }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/chat/chatroom",
          params: {
            image: item?.profileImages[0],
            name: item?.name,
            receiverId: item?._id,
            senderId: userId,
          },
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginVertical: 12,
      }}
    >
      <View>
        <Image
          style={{ width: 60, height: 60, borderRadius: 35 }}
          source={{ uri: item?.profileImages[0] }}
        />
      </View>
      <View>
        <Text
          style={{
            fontWeight: "500",
            color: "#DE3163",
            fontSize: 15,
          }}
        >
          {item?.name}
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            marginTop: 6,
          }}
        >
          Start Chat with {item?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserChat;
