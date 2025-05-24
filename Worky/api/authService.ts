import AsyncStorage from '@react-native-async-storage/async-storage'; // For React Native

export async function loginWithOtp(
  otp_code: string
): Promise<{ id: string; secret: string }> {
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;
  if (!apiKey) throw new Error("API key is missing");

  const res = await fetch(
    "https://87e89eab-95e5-4c0f-8192-7ee0196e1581-dev.e1-us-east-azure.choreoapis.dev/employee-mgmt-system/student-mgmt-server/v1.0/validate-otp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({ otp_code }),
    }
  );

  if (!res.ok) throw new Error("Invalid OTP");

  const data = await res.json();

  // Extract student_id and store it permanently
  const { student_id } = data;
  if (student_id) {
    await AsyncStorage.setItem('student_id', student_id); // Store in AsyncStorage
  }

  return data;
}
