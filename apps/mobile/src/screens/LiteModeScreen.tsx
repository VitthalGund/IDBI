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
import * as Speech from "expo-speech";
import { SuccessOverlay } from "../components/SuccessOverlay";

interface LiteModeScreenProps {
  deviceId: string;
}

export const LiteModeScreen: React.FC<LiteModeScreenProps> = ({ deviceId }) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferStatus, setTransferStatus] = useState("");
  const [isHindi, setIsHindi] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const getText = (en: string, hi: string) => (isHindi ? hi : en);

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: isHindi ? "hi-IN" : "en-IN" });
  };

  const handleCheckBalance = async () => {
    setLoading(true);
    setTransferStatus("");
    try {
      const response = await apiClient.request("/accounts/me", "GET");
      setBalance(response.balance);
      speak(
        getText(
          `Your balance is ${response.balance} rupees.`,
          `आपका बैलेंस ${response.balance} रुपये है।`,
        ),
      );
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
      setSuccessMessage(
        getText(
          `Successfully transferred ₹${amount}`,
          `₹${amount} सफलतापूर्वक भेजे गए`,
        ),
      );
      setShowSuccess(true);
      setTransferAmount("");
      speak(
        getText(
          `Successfully transferred ${amount} rupees.`,
          `${amount} रुपये सफलतापूर्वक भेजे गए।`,
        ),
      );
      // Refresh balance if we have one
      if (balance !== null) {
        handleCheckBalance();
      }
    } catch (e) {
      setTransferStatus(getText("Transfer failed", "पैसे भेजने में विफलता"));
      speak(getText("Transfer failed", "पैसे भेजने में विफलता"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.header}>{getText("LITE MODE", "सरल मोड")}</Text>
        <TouchableOpacity
          style={styles.langToggle}
          onPress={() => setIsHindi(!isHindi)}
          accessibilityRole="button"
          accessibilityLabel="Toggle Language"
        >
          <Text style={styles.langToggleText}>{isHindi ? "A/अ" : "अ/A"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.label}>
          {getText("Your Balance", "आपका बैलेंस")}
        </Text>
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
          <Text style={styles.btnText}>
            {getText("CHECK BALANCE", "बैलेंस देखें")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transferContainer}>
        <Text style={styles.label}>
          {getText("Transfer Funds", "पैसे भेजें")}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={getText("Amount (₹)", "राशि (₹)")}
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
          <Text style={styles.btnText}>
            {getText("SEND MONEY", "पैसे भेजें")}
          </Text>
        </TouchableOpacity>
        {transferStatus ? (
          <Text style={styles.statusText}>{transferStatus}</Text>
        ) : null}
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      )}

      <SuccessOverlay
        visible={showSuccess}
        title={getText("Success", "सफलता")}
        message={successMessage}
        onDismiss={() => setShowSuccess(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // High contrast white
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000000",
    textDecorationLine: "underline",
  },
  langToggle: {
    borderWidth: 2,
    borderColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  langToggleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
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
