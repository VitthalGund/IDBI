import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { colors } from "@trustbank/ui-kit";
import { apiClient } from "../utils/apiClient";
import * as SecureStore from "expo-secure-store";
import CryptoJS from "crypto-js";

interface LiteModeScreenProps {
  deviceId: string;
}

export const LiteModeScreen: React.FC<LiteModeScreenProps> = ({ deviceId }) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferStatus, setTransferStatus] = useState("");

  const handleCheckBalance = async () => {
    setLoading(true);
    setTransferStatus("");
    try {
      const response = await apiClient.request("/accounts/me", "GET");
      setBalance(response.balance);
    } catch (e) {
      setTransferStatus("Failed to get balance.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount) return;
    setLoading(true);
    setTransferStatus("");
    try {
      const amount = parseFloat(transferAmount);
      const recipient = "Friend";
      const timestamp = Date.now().toString();

      const deviceSecret = await SecureStore.getItemAsync("deviceSecret");
      if (!deviceSecret) {
        setTransferStatus("Device not registered (missing secret)");
        setLoading(false);
        return;
      }

      const message = `${amount}:${recipient}:${timestamp}`;
      const hmacToken = CryptoJS.HmacSHA256(message, deviceSecret).toString(
        CryptoJS.enc.Hex,
      );

      await apiClient.request("/transactions/transfer", "POST", {
        amount,
        recipient,
        timestamp,
        hmacToken,
      });
      setTransferStatus(`Successfully transferred ₹${amount}`);
      setTransferAmount("");
      // Refresh balance if we have one
      if (balance !== null) {
        handleCheckBalance();
      }
    } catch (e) {
      setTransferStatus("Transfer failed (AFA check error?)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LITE MODE</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.label}>Your Balance</Text>
        {balance !== null ? (
          <Text style={styles.balanceValue}>
            ₹{balance.toLocaleString("en-IN")}
          </Text>
        ) : (
          <Text style={styles.balanceValue}>--</Text>
        )}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleCheckBalance}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Check Account Balance"
        >
          <Text style={styles.btnText}>CHECK BALANCE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transferContainer}>
        <Text style={styles.label}>Transfer Funds</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount (₹)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={transferAmount}
          onChangeText={setTransferAmount}
          accessibilityLabel="Amount to transfer"
        />
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleTransfer}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Send Money"
        >
          <Text style={styles.btnText}>SEND MONEY</Text>
        </TouchableOpacity>
        {transferStatus ? (
          <Text style={styles.statusText}>{transferStatus}</Text>
        ) : null}
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // High contrast white
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000000",
    marginBottom: 24,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  balanceContainer: {
    borderWidth: 4,
    borderColor: "#000000",
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  transferContainer: {
    borderWidth: 4,
    borderColor: "#000000",
    padding: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 12,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#000000",
    marginBottom: 20,
  },
  actionBtn: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 2,
    borderColor: "#000000",
    width: "100%",
    fontSize: 24,
    fontWeight: "bold",
    padding: 12,
    marginBottom: 16,
    color: "#000000",
    minHeight: 48,
  },
  statusText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  loader: {
    marginTop: 20,
  },
});
