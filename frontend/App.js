import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
  ColorPropType
} from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import store from "./src/redux/store";

import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createAppContainer } from "react-navigation";

import ListsScreen from "./src/screens/ListsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import WorkspacesScreen from "./src/screens/WorkspacesScreen";

import { makeIcon } from "./src/utils";

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        {
          // FIXME: Not currently working on my phone correctly without hidden=true
        }
        <StatusBar hidden={true} />
        <BottomTabContainer />
      </PaperProvider>
    </StoreProvider>
  );
}

const makeNavigationOptions = (label, iconName, color) => {
  return {
    navigationOptions: {
      tabBarLabel: label,
      tabBarColor: color,
      tabBarIcon: ({ focused }) => makeIcon(iconName, focused)
    }
  };
};

const BottomTabNavigator = createMaterialBottomTabNavigator(
  {
    Lists: {
      screen: ListsScreen,
      ...makeNavigationOptions("Lists", "list", "#00796b")
    },
    Workspaces: {
      screen: WorkspacesScreen,
      ...makeNavigationOptions("Workspaces", "apps", "#6200ee")
    },
    Settings: {
      screen: SettingsScreen,
      ...makeNavigationOptions("Settings", "settings", "#FFFFFF")
    }
  },
  {
    initialRouteName: "Lists",
    shifting: true
    //activeColor: "#F44336"
  }
);

const BottomTabContainer = createAppContainer(BottomTabNavigator);
