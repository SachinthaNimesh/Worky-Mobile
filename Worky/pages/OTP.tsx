import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OTP = ({ navigation }: any) => {
  const [otp, setOtp] = useState<string>("");

  const handleOtpSubmit = async () => {
    try {
      if (!otp) {
        throw new Error("Invalid OTP. Please enter a valid OTP.");
      }

      const response = await fetch(
        "https://87e89eab-95e5-4c0f-8192-7ee0196e1581-dev.e1-us-east-azure.choreoapis.dev/employee-mgmt-system/student-mgmt-server/v1.0/validate-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.EXPO_PUBLIC_API_KEY,
            "otp-code": otp, // Pass OTP in the header
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (__DEV__) {
          console.error("API Error:", {
            status: response.status,
            statusText: response.statusText,
            responseBody: errorText,
          });
        } else {
          console.error("An error occurred while validating OTP.");
        }
        throw new Error("Failed to validate OTP");
      }

      const data = await response.json();

      const { success, student_id, message } = data; // Adjusted to match backend response

      if (!success) {
        throw new Error(message || "Invalid response from server");
      }

      console.log("Student ID:", student_id); // Log student_id for debugging or further use

      // Store student_id in AsyncStorage
      await AsyncStorage.setItem("student_id", String(student_id));

      // Navigate to MainApp
      navigation.navigate("MainApp");
    } catch (error) {
      if (__DEV__) {
        console.error("Error during OTP validation:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : null,
          otpValue: otp,
        });
      } else {
        console.error("An error occurred during OTP validation.");
      }
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp} // Get otp as a string
          keyboardType="numeric"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={handleOtpSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default OTP;
