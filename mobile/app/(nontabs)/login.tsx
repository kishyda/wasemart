import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from 'expo-linking'; // Used to handle deep links for callback

// Ensure that the authentication session is properly completed, especially on web platforms.
WebBrowser.maybeCompleteAuthSession();

// IMPORTANT: Replace with your actual backend URL where handleGoogleLoginInitiate is exposed.
const BACKEND_URL = 'YOUR_BACKEND_SERVER_URL'; // e.g., 'http://localhost:8080' or 'https://yourbackend.com'

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | string[] | null>(null); // To store session token from backend

  // This useEffect handles the deep linking callback from the browser
  // after your backend redirects to the mobile app's custom scheme.
  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  // Function to handle the deep link URL received from the browser
  const handleDeepLink = ({ url }: any) => {
    WebBrowser.dismissBrowser(); // Close the external browser opened by the app

    // Parse the URL to extract tokens or session ID
    const parsedUrl = Linking.parse(url);
    const accessToken = parsedUrl.queryParams?.accessToken;
    const refreshToken = parsedUrl.queryParams?.refreshToken;
    const backendSessionToken = parsedUrl.queryParams?.sessionToken; // If your backend sends a session token

    if (accessToken && refreshToken) {
      console.log("Tokens received from backend via deep link:");
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);
      // TODO: Securely store these tokens (e.g., using Expo SecureStore)
      // and update your app's authentication state.
      setSessionToken(accessToken); // For demonstration, just storing access token as session
    } else if (backendSessionToken) {
        console.log("Session token received from backend via deep link:", backendSessionToken);
        setSessionToken(backendSessionToken);
        // TODO: Use this session token to authenticate with your backend.
    } else {
      console.warn("Deep link received, but no tokens or session token found:", url);
      Alert.alert("Login Failed", "Could not retrieve session information.");
    }
    setLoading(false);
  };

  // Function to initiate the Google login flow by calling your backend.
  const startGoogleLogin = async () => {
      setLoading(true);
      try {
          // Call your backend endpoint to get the Google authorization URL
          const response = await fetch(`http://192.168.0.20:8080/auth/login?platform=mobile`); // <-- New endpoint
          const data = await response.json();

          if (response.ok && data.Url) {
              // Open the received authUrl in the device's web browser
              let result = await WebBrowser.openBrowserAsync(data.Url);

              // WebBrowser.openBrowserAsync will block until the browser is closed or redirected.
              // For actual mobile deep linking, the `handleDeepLink` listener will capture the redirect.
              // On some platforms (e.g., iOS), result.type might be 'dismiss' if the user closes the browser.
              if (result.type === 'cancel' || result.type === 'dismiss') {
                  console.log("Web browser was closed or cancelled.");
                  setLoading(false);
              }
          } else {
              console.error("Failed to get auth URL from backend:", data);
              Alert.alert("Login Error", data.error || "Failed to initiate Google login.");
              setLoading(false);
          }
      } catch (error) {
          console.error("Error starting Google login:", error);
          Alert.alert("Network Error", "Could not connect to backend to start login.");
          setLoading(false);
      }
  };

  if (sessionToken) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Welcome!</Text>
        <Text style={styles.loggedInText}>Logged in with session: {sessionToken}...</Text>
        <Button title="Logout" onPress={() => setSessionToken(null)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login with Google</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Sign in with Google"
          onPress={startGoogleLogin}
          testID="googleLoginButton"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Center content horizontally
    padding: 24,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  loggedInText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  }
});
