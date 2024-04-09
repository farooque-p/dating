import { Tabs } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profiles",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Feather name="eye" size={24} color="black" />
            ) : (
              <Feather name="eye" size={24} color="gray" />
            ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color="black"
              />
            ) : (
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color="gray"
              />
            ),
        }}
      />
      <Tabs.Screen
        name="bio"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="guy-fawkes-mask"
                size={24}
                color="black"
              />
            ) : (
              <MaterialCommunityIcons
                name="guy-fawkes-mask"
                size={24}
                color="gray"
              />
            ),
        }}
      />
    </Tabs>
  );
}
