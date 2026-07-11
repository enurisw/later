import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CustomTabBar from "./components/CustomTabBar";
import AddItemScreen from "../screens/AddItemScreen";
import CollectionScreen from "../screens/CollectionScreen";
import DoneScreen from "../screens/DoneScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SuggestionScreen from "../screens/SuggestionScreen";
import { Category } from "../types/LaterItem";

export type RootTabParamList = {
  Home: undefined;
  Collection: undefined;
  Add: undefined;
  Done: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Suggestion:
    | {
        category?: Category;
      }
    | undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack =
  createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
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
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
        />

        <Stack.Screen
          name="Suggestion"
          component={SuggestionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}