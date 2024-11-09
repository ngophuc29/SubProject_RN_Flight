import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Stepper = ({navigation, currentStep = 1 }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => { navigation.goBack() }}
      >
        <Icon
          name="arrow-left"
          size={20}
          color="#333"
          style={styles.backButton}
        />
      </TouchableOpacity>

      <View style={styles.stepsContainer}>
        <View
          style={[
            styles.step,
            currentStep >= 1 ? styles.activeStep : styles.inactiveStep,
          ]}
        >
          <Icon name="user" size={20} color="#fff" />
        </View>
        <View
          style={[
            styles.line,
            currentStep >= 2 ? styles.activeLine : styles.inactiveLine,
          ]}
        />

        <View
          style={[
            styles.step,
            currentStep >= 2 ? styles.activeStep : styles.inactiveStep,
          ]}
        >
          <Icon name="briefcase" size={20} color="#fff" />
        </View>
        <View
          style={[
            styles.line,
            currentStep >= 3 ? styles.activeLine : styles.inactiveLine,
          ]}
        />

        <View
          style={[
            styles.step,
            currentStep >= 3 ? styles.activeStep : styles.inactiveStep,
          ]}
        >
          <Icon name="chair" size={20} color="#fff" />
        </View>
        <View
          style={[
            styles.line,
            currentStep >= 4 ? styles.activeLine : styles.inactiveLine,
          ]}
        />

        <View
          style={[
            styles.step,
            currentStep >= 4 ? styles.activeStep : styles.inactiveStep,
          ]}
        >
          <Icon name="credit-card" size={20} color="#fff" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
     
  },
  backButton: {
    marginRight: 10,
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  activeStep: {
    backgroundColor: "#00A9E0", // Change this color to match the active step color
  },
  inactiveStep: {
    backgroundColor: "#ccc",
  },
  line: {
    width: 40,
    height: 2,
  },
  activeLine: {
    backgroundColor: "#00A9E0",
  },
  inactiveLine: {
    backgroundColor: "#ccc",
  },
});

export default Stepper;
