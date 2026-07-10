import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, colors, typography } from "@trustbank/ui-kit";

export const ConsentPanel = () => {
  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Data & Privacy Transparency</Text>
      </View>
      <Text style={styles.body}>
        To minimize OTP checks and provide a seamless login experience, we
        securely monitor your device pattern as a continuous trust signal.
      </Text>
      <View style={styles.bulletList}>
        <Text style={styles.bulletItem}>
          • Device ID & OS are recorded securely.
        </Text>
        <Text style={styles.bulletItem}>
          • Session behavior helps generate an adaptive trust score.
        </Text>
        <Text style={styles.bulletItem}>
          • We never sell your data to third parties.
        </Text>
      </View>
      <Text style={styles.footer}>
        You can revoke trust for any device at any time, which will prompt an
        OTP on the next login attempt.
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E8F5E9",
    borderColor: "#A5D6A7",
    borderWidth: 1,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    ...typography.h2,
    color: "#2E7D32",
  },
  body: {
    ...typography.body,
    color: "#1B5E20",
    marginBottom: 12,
  },
  bulletList: {
    marginBottom: 12,
  },
  bulletItem: {
    ...typography.caption,
    color: "#1B5E20",
    marginBottom: 4,
  },
  footer: {
    ...typography.caption,
    color: "#388E3C",
    fontStyle: "italic",
  },
});
