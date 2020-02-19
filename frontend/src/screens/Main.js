import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";

import store from "../redux/store";

import ShoppingList from "../components/ShoppingList";
import Navbar from "../components/Navbar";

export default function Main() {

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <ShoppingList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});