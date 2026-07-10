import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Card, colors, typography, StatusPill } from "@trustbank/ui-kit";
import { apiClient } from "../utils/apiClient";

interface MsmeCockpitScreenProps {
  onBack: () => void;
}

export const MsmeCockpitScreen: React.FC<MsmeCockpitScreenProps> = ({
  onBack,
}) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchCashflow();
  }, []);

  const fetchCashflow = async () => {
    try {
      const response = await apiClient.request("/msme/cashflow", "GET");
      setData(response);
    } catch (e) {
      console.warn("Failed to fetch MSME data", e);
    }
  };

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={typography.body}>Loading MSME Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back to Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.title}>MSME Cash-Flow Cockpit</Text>

      {data.workingCapitalNudge && (
        <Card style={styles.nudgeCard}>
          <Text style={[typography.h2, { color: colors.surfaceWhite }]}>
            Working Capital Alert
          </Text>
          <Text
            style={[
              typography.body,
              { color: colors.surfaceWhite, marginTop: 4 },
            ]}
          >
            {data.workingCapitalNudge}
          </Text>
          <TouchableOpacity style={styles.nudgeButton}>
            <Text style={styles.nudgeButtonText}>Get Advance Now</Text>
          </TouchableOpacity>
        </Card>
      )}

      <View style={styles.row}>
        <Card style={[styles.statCard, { marginRight: 8 }]}>
          <Text style={typography.caption}>Cash In (This Month)</Text>
          <Text
            style={[
              typography.h2,
              { color: colors.statusSuccess, marginTop: 4 },
            ]}
          >
            +₹{(data.cashIn / 100000).toFixed(1)}L
          </Text>
        </Card>
        <Card style={[styles.statCard, { marginLeft: 8 }]}>
          <Text style={typography.caption}>Cash Out (This Month)</Text>
          <Text
            style={[typography.h2, { color: colors.statusDanger, marginTop: 4 }]}
          >
            -₹{(data.cashOut / 100000).toFixed(1)}L
          </Text>
        </Card>
      </View>

      <Card>
        <Text style={typography.h2}>Pending GST Invoices</Text>
        <View style={{ marginTop: 12 }}>
          <Text style={typography.h1}>{data.pendingInvoicesCount}</Text>
          <Text style={typography.body}>
            Totaling ₹{(data.pendingInvoicesAmount / 100000).toFixed(1)}L
          </Text>
        </View>
        <View style={{ marginTop: 16 }}>
          <StatusPill status="PENDING" label="Awaiting Payment" />
        </View>

        {data.invoices && data.invoices.length > 0 && (
          <View
            style={{
              marginTop: 24,
              borderTopWidth: 1,
              borderTopColor: colors.surfaceFog,
              paddingTop: 16,
            }}
          >
            <Text style={typography.bodyLarge}>Recent Invoices</Text>
            {data.invoices.map((inv: any, idx: number) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 12,
                }}
              >
                <View>
                  <Text style={typography.body}>{inv.invoiceNumber}</Text>
                  <Text style={typography.caption}>
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={typography.body}>
                    ₹{inv.amount.toLocaleString()}
                  </Text>
                  <Text
                    style={[
                      typography.caption,
                      {
                        color:
                          inv.status === "OVERDUE"
                            ? colors.statusDanger
                            : inv.status === "PAID"
                              ? colors.statusSuccess
                              : colors.statusWarn,
                      },
                    ]}
                  >
                    {inv.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    ...typography.body,
    color: colors.brandTeal600,
    fontWeight: "bold",
  },
  title: {
    ...typography.h1,
    color: colors.brandTeal900,
    marginBottom: 24,
  },
  nudgeCard: {
    backgroundColor: colors.brandOrange500,
    marginBottom: 16,
  },
  nudgeButton: {
    marginTop: 12,
    backgroundColor: colors.surfaceWhite,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  nudgeButtonText: {
    color: colors.brandOrange500,
    fontWeight: "bold",
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
  },
});
