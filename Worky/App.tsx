import React, { useEffect, useState, useRef } from "react";
// import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, StyleSheet } from "react-native";
import OTP from "./pages/OTP";
import MainApp from "./pages/MainApp";

// Make sure OTP and MainApp do NOT contain their own NavigationContainer
const Stack = createStackNavigator();

const App: React.FC = () => {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    const checkStudentId = async () => {
      const storedId = await AsyncStorage.getItem("student_id");
      setStudentId(storedId);
      setLoading(false);
    };
    checkStudentId();
  }, []);

  const handleOtpSuccess = async (id: string) => {
    await AsyncStorage.setItem("student_id", id);
    setStudentId(id);
    navigationRef.current?.reset({
      index: 0,
      routes: [{ name: "MainApp" }],
    });
  };

  if (loading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        initialRouteName={studentId ? "MainApp" : "OTP"}
        // @ts-ignore
        ref={navigationRef}
      >
        <Stack.Screen
          name="OTP"
          options={{ headerShown: false }}
        >
          {(props) => <OTP {...props} onOtpSuccess={handleOtpSuccess} />}
        </Stack.Screen>
        <Stack.Screen
          name="MainApp"
          component={MainApp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;