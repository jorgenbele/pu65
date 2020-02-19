import React from "react";
import { StyleSheet, Text, View } from "react-native";

import PopupInfoBanner from "../components/PopupInfoBanner";

import { Avatar, List, FAB } from "react-native-paper";

import { makeListItem } from "../utils";
import ShoppingItem from "../components/ShoppingItem";
import { ScrollView } from "react-native-gesture-handler";

export default class ListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lists: this.props.lists };
  }

  render() {
    const styles = StyleSheet.create({
      fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0
      }
    });

    const isPersonalList = list => list.workspace === null;
    const personalLists = this.state.lists.filter(isPersonalList);
    const sharedLists = this.state.lists.filter(l => !isPersonalList(l));

    return (
      <>
        <ScrollView>
          {this.state.list.map((l, i) => {
            <ShoppingItem title={l.name} />;
          })}
        </ScrollView>

        <FAB
          style={styles.fab}
          medium
          icon="plus"
          onPress={() => {
            this.setState({
              lists: [
                {
                  name: "Kollektiv2",
                  workspace: "Kollektivet"
                },
                ...this.state.lists
              ],
              ...this.state
            });
            console.log("Pressed");
          }} // FIXME: Add authentication/creation of workspace
        />
      </>
    );
  }
}

ListsScreen.defaultProps = {
  listIcon: "folder"
};
