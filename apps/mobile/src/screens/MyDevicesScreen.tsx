import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Card, colors, typography } from "@trustbank/ui-kit";
import { apiClient } from "../utils/apiClient";
import { ConsentPanel } from "../components/ConsentPanel";
import { SuccessOverlay } from "../components/SuccessOverlay";
import * as SecureStore from "expo-secure-store";

interface MyDevicesScreenProps {
  onBack: () => void;
}

export const MyDevicesScreen: React.FC<MyDevicesScreenProps> = ({ onBack }) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const data = await apiClient.request("/accounts/devices", "GET");
      setDevices(data);
    } catch (e) {
      setError("Failed to fetch registered devices");
    } finally {
      setLoading(false);
    }
  };

  const removeDevice = async (deviceId: string) => {
    try {
      setLoading(true);
      await apiClient.request(`/accounts/devices/${deviceId}`, "DELETE");
      setSuccessMessage("Device revoked successfully");
      setShowSuccess(true);
      fetchDevices();
    } catch (e) {
      Alert.alert("Error", "Failed to revoke device");
      setLoading(false);
    }
  };

  const rotateDevice = async (deviceId: string) => {
    try {
      setLoading(true);
      const res = await apiClient.request(`/accounts/devices/rotate`, "POST", {
        deviceId,
      });
      // In a real app we'd check if this is the CURRENT device before overwriting SecureStore.
      // For this demo, we'll store it if we rotate.
      await SecureStore.setItemAsync("deviceSecret", res.newSecret);
      setSuccessMessage("Device secret rotated securely.");
      setShowSuccess(true);
      fetchDevices();
    } catch (e) {
      Alert.alert("Error", "Failed to rotate device secret");
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>My Trusted Devices</Text>

      <ConsentPanel />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color={colors.brandTeal900} />
      ) : devices.length === 0 ? (
        <Text style={styles.emptyText}>No trusted devices found.</Text>
      ) : (
        devices.map((device, idx) => (
          <Card key={idx} style={styles.deviceCard}>
            <View>
              <Text style={styles.deviceLabel}>{device.deviceLabel}</Text>
              <Text style={styles.deviceDate}>
                Added: {new Date(device.registeredAt).toLocaleDateString()}
              </Text>
              <Text style={styles.deviceInfo}>ID: {device.deviceId}</Text>
            </View>
            <View style={{ flexDirection: "column", gap: 8 }}>
              <TouchableOpacity
                style={styles.rotateBtn}
                onPress={() => rotateDevice(device.deviceId)}
              >
                <Text style={styles.rotateBtnText}>Rotate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeDevice(device.deviceId)}
              >
                <Text style={styles.removeBtnText}>Revoke</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))
      )}

      <SuccessOverlay
        visible={showSuccess}
        title="Success"
        message={successMessage}
        onDismiss={() => setShowSuccess(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 48,
    flexGrow: 1,
  },
  header: {
    ...typography.h1,
    color: colors.brandTeal900,
    marginBottom: 24,
  },
  backBtn: {
    marginBottom: 16,
  },
  backBtnText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: colors.statusDanger,
    marginBottom: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  deviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  deviceLabel: {
    ...typography.h2,
    fontSize: 16,
    marginBottom: 4,
  },
  deviceDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  deviceInfo: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  removeBtn: {
    backgroundColor: colors.statusDanger,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  removeBtnText: {
    color: colors.surfaceWhite,
    fontWeight: "bold",
    fontSize: 12,
  },
  rotateBtn: {
    backgroundColor: colors.surfaceFog,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  rotateBtnText: {
    color: colors.textInk,
    fontWeight: "bold",
    fontSize: 12,
  },
});
