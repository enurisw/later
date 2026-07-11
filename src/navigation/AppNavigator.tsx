import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import CustomTabBar from "./components/CustomTabBar";
import AddItemScreen from "../screens/AddItemScreen";
import CollectionScreen from "../screens/CollectionScreen";
import DoneScreen from "../screens/DoneScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type RootTabParamList = {
  Home: undefined;
  Collection: undefined;
  Add: undefined;
  Done: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
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