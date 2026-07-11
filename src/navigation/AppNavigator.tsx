import { Ionicons } from "@expo/vector-icons";
import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
} from "@react-navigation/native";

import AddItemScreen from "../screens/AddItemScreen";
import CollectionScreen from "../screens/CollectionScreen";
import DoneScreen from "../screens/DoneScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

export type RootTabParamList = {
  Home: undefined;
  Collection: undefined;
  Add: undefined;
  Done: undefined;
  Profile: undefined;
};

const Tab =
  createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor:
            colors.textLight,

          tabBarStyle: {
            height: 68,
            paddingTop: 7,
            paddingBottom: 8,
            backgroundColor: colors.surface,
            borderTopWidth: 0,
            elevation: 8,
          },

          tabBarLabelStyle: {
            fontFamily: fontFamily.semibold,
            fontSize: 11,
          },

          tabBarIcon: ({
            focused,
            color,
            size,
          }) => {
            let iconName:
              keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case "Home":
                iconName = focused
                  ? "home"
                  : "home-outline";
                break;

              case "Collection":
                iconName = focused
                  ? "albums"
                  : "albums-outline";
                break;

              case "Add":
                iconName = focused
                  ? "add-circle"
                  : "add-circle-outline";
                break;

              case "Done":
                iconName = focused
                  ? "checkmark-circle"
                  : "checkmark-circle-outline";
                break;

              case "Profile":
                iconName = focused
                  ? "person"
                  : "person-outline";
                break;

              default:
                iconName = "ellipse-outline";
            }

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />

        <Tab.Screen
          name="Collection"
          component={CollectionScreen}
        />

        <Tab.Screen
          name="Add"
          component={AddItemScreen}
        />

        <Tab.Screen
          name="Done"
          component={DoneScreen}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}