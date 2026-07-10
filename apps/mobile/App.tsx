import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
} from "react-native";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { OtpScreen } from "./src/screens/OtpScreen";
import { MsmeCockpitScreen } from "./src/screens/MsmeCockpitScreen";
import { LiteModeScreen } from "./src/screens/LiteModeScreen";
import { MyDevicesScreen } from "./src/screens/MyDevicesScreen";
import { ModeToggle, colors, typography } from "@trustbank/ui-kit";
import {
  apiClient,
  isSimulatedOffline,
  setSimulatedOffline,
  setAuthToken,
} from "./src/utils/apiClient";
import { getOrCreateDeviceId } from "./src/utils/device";

type ScreenName = "LOGIN" | "OTP" | "HOME" | "MSME_COCKPIT" | "MY_DEVICES";

export default function App() {
  const [isProMode, setIsProMode] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [isOffline, setIsOffline] = useState(isSimulatedOffline);
  const [lastUpdated, setLastUpdated] = useState("never");

  // Auth state
  const [screen, setScreen] = useState<ScreenName>("LOGIN");
  const [deviceId, setDeviceId] = useState("");
  const [username, setUsername] = useState("");
  const [trustReason, setTrustReason] = useState("");
  const [sessionToken, setSessionToken] = useState("");

  const [lastPolled, setLastPolled] = useState(Date.now());
  const [nudge, setNudge] = useState<{ id: string; reason: string } | null>(
    null,
  );

  useEffect(() => {
    async function initDevice() {
      const id = await getOrCreateDeviceId();
      setDeviceId(id);
    }
    initDevice();
  }, []);

  // Polling loop for anomalies (every 10s)
  useEffect(() => {
    if (screen !== "HOME" || !sessionToken || isOffline) return;

    const interval = setInterval(async () => {
      try {
        const url = `/transactions/since?ts=${lastPolled}`;
        const newAnomalies = await apiClient.request(url, "GET");

        if (newAnomalies && newAnomalies.length > 0) {
          // Show the most recent one
          setNudge({
            id: newAnomalies[0].id,
            reason: newAnomalies[0].anomalyReason,
          });
          setLastPolled(Date.now());
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [screen, sessionToken, isOffline, lastPolled]);

  // Continuous Trust Signal (Phase C)
  useEffect(() => {
    if (screen !== 'HOME' || !sessionToken || isOffline || !deviceId) return;

    const trustInterval = setInterval(async () => {
      try {
        await apiClient.request('/auth/trust-event', 'POST', {
          deviceId,
          delta: 1, // small incremental trust
          reason: 'Continuous session trust signal'
        });
      } catch (e) {
        console.warn('Failed to emit continuous trust signal', e);
      }
    }, 60000); // every 1 minute

    return () => clearInterval(trustInterval);
  }, [screen, sessionToken, isOffline, deviceId]);

  const toggleOffline = async (value: boolean) => {
    setIsOffline(value);
    setSimulatedOffline(value);
    if (value) {
      const ts = await apiClient.getCacheTimestamp("/accounts/me");
      if (ts) {
        const diffMs = Date.now() - ts;
        const diffMins = Math.floor(diffMs / 60000);
        setLastUpdated(diffMins < 1 ? "just now" : `${diffMins}m ago`);
      } else {
        setLastUpdated("never");
      }
    }
  };

  const handleRequireOtp = (user: string, devId: string, reason: string) => {
    setUsername(user);
    setDeviceId(devId);
    setTrustReason(reason);
    setScreen("OTP");
  };

  const handleLoginSuccess = (data: { token: string; trustReason: string }) => {
    setSessionToken(data.token);
    setAuthToken(data.token);
    setTrustReason(data.trustReason);
    setScreen("HOME");
  };

  const resetTrustScore = async () => {
    try {
      await fetch("http://localhost:3000/auth/reset-trust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
      alert("Trust score reset. Next login will require OTP.");
      setScreen("LOGIN");
      setSessionToken("");
    } catch (e) {
      alert("Failed to reset trust score. Ensure NestJS backend is running.");
    }
  };

  const handleSignOut = () => {
    setScreen("LOGIN");
    setSessionToken("");
    setAuthToken(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceFog} />

      {/* Dev Toggle for Network */}
      {(process.env.EXPO_PUBLIC_DEV_MODE === "true" || __DEV__) && (
        <View style={styles.devBar}>
          <Text style={styles.devText}>Offline Mode:</Text>
          <Switch value={isOffline} onValueChange={toggleOffline} />

          {deviceId ? (
            <TouchableOpacity style={styles.devBtn} onPress={resetTrustScore}>
              <Text style={styles.devBtnText}>Reset Trust</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            Showing saved data — last updated {lastUpdated}
          </Text>
        </View>
      )}

      {screen === "LOGIN" && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onRequireOtp={handleRequireOtp}
        />
      )}

      {screen === "OTP" && (
        <OtpScreen
          username={username}
          deviceId={deviceId}
          trustReason={trustReason}
          onOtpSuccess={(token) =>
            handleLoginSuccess({
              token,
              trustReason: "MFA verified successfully",
            })
          }
          onCancel={() => setScreen("LOGIN")}
        />
      )}

      {screen === "HOME" && (
        <>
          <View style={styles.header}>
            {trustReason && (
              <View style={styles.securityIndicator}>
                <Text style={styles.securityText}>🛡️ {trustReason}</Text>
              </View>
            )}
            <View style={styles.headerActions}>
              <View style={styles.liteToggleWrapper}>
                <Text style={styles.liteToggleLabel}>LITE</Text>
                <Switch value={isLiteMode} onValueChange={setIsLiteMode} />
              </View>
              <ModeToggle isProMode={isProMode} onToggle={setIsProMode} />
              <TouchableOpacity
                style={styles.signOutBtn}
                onPress={handleSignOut}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          {isLiteMode ? (
            <LiteModeScreen deviceId={deviceId} />
          ) : (
            <HomeScreen
              isProMode={isProMode}
              deviceId={deviceId}
              onNavigateMsme={() => setScreen("MSME_COCKPIT")}
              onNavigateDevices={() => setScreen("MY_DEVICES")}
            />
          )}
        </>
      )}

      {screen === "MSME_COCKPIT" && (
        <>
          <View style={styles.header}>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.signOutBtn}
                onPress={handleSignOut}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          <MsmeCockpitScreen onBack={() => setScreen("HOME")} />
        </>
      )}

      {screen === "MY_DEVICES" && (
        <MyDevicesScreen onBack={() => setScreen("HOME")} />
      )}

      {nudge && (
        <View style={styles.nudgeToast}>
          <Text style={styles.nudgeTitle}>⚠️ Anomaly Detected</Text>
          <Text style={styles.nudgeReason}>{nudge.reason}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <TouchableOpacity
              style={[
                styles.nudgeDismissBtn,
                {
                  flex: 1,
                  marginRight: 8,
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              ]}
              onPress={async () => {
                try {
                  await apiClient.request("/auth/trust-event", "POST", {
                    deviceId,
                    delta: 1,
                    reason:
                      "User confirmed anomalous transaction was legitimate",
                  });
                } catch (e) {
                  // ignore
                }
                setNudge(null);
              }}
            >
              <Text style={styles.nudgeDismissText}>This was me</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.nudgeDismissBtn,
                {
                  flex: 1,
                  marginLeft: 8,
                  backgroundColor: colors.statusDanger,
                },
              ]}
              onPress={() => {
                alert(
                  "We will redirect this to the Grievance team and pause the transaction.",
                );
                setNudge(null);
              }}
            >
              <Text style={styles.nudgeDismissText}>This wasn't me</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceFog,
  },
  devBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 8,
    backgroundColor: "#ffeaa7",
  },
  devText: {
    ...typography.caption,
    marginRight: 8,
  },
  devBtn: {
    marginLeft: 12,
    backgroundColor: colors.brandOrange500,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  devBtnText: {
    color: colors.surfaceWhite,
    fontSize: 10,
    fontWeight: "bold",
  },
  offlineBanner: {
    backgroundColor: colors.statusWarn,
    padding: 8,
    alignItems: "center",
  },
  offlineText: {
    ...typography.body,
    fontWeight: "bold",
    color: colors.brandTeal900,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 48,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  securityIndicator: {
    backgroundColor: "rgba(21, 129, 88, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    maxWidth: "60%",
  },
  securityText: {
    fontSize: 11,
    color: colors.brandTeal600,
    fontWeight: "bold",
  },
  signOutBtn: {
    marginLeft: 12,
    backgroundColor: "transparent",
    borderColor: colors.brandTeal900,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  signOutText: {
    color: colors.brandTeal900,
    fontSize: 12,
    fontWeight: "bold",
  },
  liteToggleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.brandOrange500,
  },
  liteToggleLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.brandOrange500,
    marginRight: 4,
  },
  nudgeToast: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: colors.brandOrange500,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 100,
  },
  nudgeTitle: {
    color: colors.surfaceWhite,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  nudgeReason: {
    color: colors.surfaceWhite,
    fontSize: 14,
    marginBottom: 12,
  },
  nudgeDismissBtn: {
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  nudgeDismissText: {
    color: colors.surfaceWhite,
    fontWeight: "bold",
  },
});
