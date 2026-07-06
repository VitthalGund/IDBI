import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Card, StatusPill, colors, typography } from '@trustbank/ui-kit';
import { apiClient } from '../utils/apiClient';

interface HomeScreenProps {
  isProMode: boolean;
  deviceId?: string;
  onNavigateMsme?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ isProMode, deviceId, onNavigateMsme }) => {
  const [grievanceText, setGrievanceText] = useState('');
  const [nudges, setNudges] = useState<any[]>([]);

  useEffect(() => {
    if (isProMode && deviceId) {
      fetchNudges();
    }
  }, [isProMode, deviceId]);

  const fetchNudges = async () => {
    try {
      const response = await apiClient.request(`/transactions/nudges?deviceId=${deviceId}`, 'GET');
      if (Array.isArray(response)) {
        setNudges(response);
      }
    } catch (e) {
      console.warn('Failed to fetch nudges', e);
    }
  };

  const submitGrievance = async () => {
    if (!grievanceText) return;
    try {
      const response = await apiClient.request('/grievance/analyze', 'POST', { text: grievanceText });
      if (response.id) {
        Alert.alert('Offline', 'Saved offline. Will sync later.');
      } else {
        Alert.alert('Success', JSON.stringify(response.data));
      }
      setGrievanceText('');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const renderGrievanceForm = () => (
    <Card style={{ marginTop: 24 }}>
      <Text style={typography.h2}>Submit Grievance</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your issue..."
        value={grievanceText}
        onChangeText={setGrievanceText}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={submitGrievance}>
        <Text style={styles.buttonText}>Submit via AI</Text>
      </TouchableOpacity>
    </Card>
  );

  if (!isProMode) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Good Morning!</Text>
        
        <Card style={styles.largeTile}>
          <Text style={styles.tileTitle}>Your Balance</Text>
          <Text style={styles.tileValue}>₹15,000.50</Text>
        </Card>

        <View style={styles.row}>
          <Card style={[styles.largeTile, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.tileTitle}>Send Money</Text>
          </Card>
          
          <Card style={[styles.largeTile, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.tileTitle}>Get Help</Text>
          </Card>
        </View>

        {renderGrievanceForm()}
      </ScrollView>
    );
  }

  // Pro Mode
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Dashboard Overview</Text>

      {nudges.length > 0 && (
        <Card style={{ borderColor: colors.statusWarn, borderWidth: 1, marginBottom: 16 }}>
          <Text style={[typography.h2, { color: colors.statusWarn }]}>Security Nudges</Text>
          {nudges.map((nudge, index) => (
            <View key={index} style={styles.nudgeItem}>
              <Text style={typography.body}>⚠️ {nudge.anomalyReason}</Text>
            </View>
          ))}
        </Card>
      )}

      {onNavigateMsme && (
        <TouchableOpacity onPress={onNavigateMsme} style={{ marginBottom: 16 }}>
          <Card style={{ backgroundColor: colors.brandOrange500 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={[typography.h2, { color: colors.surfaceWhite }]}>MSME Cash-Flow</Text>
                <Text style={[typography.caption, { color: colors.surfaceWhite, marginTop: 4 }]}>View working capital & invoices</Text>
              </View>
              <Text style={{ fontSize: 24, color: colors.surfaceWhite }}>→</Text>
            </View>
          </Card>
        </TouchableOpacity>
      )}
      
      <Card>
        <Text style={typography.bodyLarge}>Total Balance</Text>
        <Text style={typography.h1}>₹2,65,000.50</Text>
        <View style={{ marginTop: 8 }}>
          <StatusPill status="SUCCESS" label="+ 5% vs last month" />
        </View>
      </Card>

      <Card>
        <Text style={typography.h2}>Recent Transactions</Text>
        <View style={styles.transaction}>
          <View>
            <Text style={typography.body}>Client Payment A</Text>
            <Text style={typography.caption}>1 day ago</Text>
          </View>
          <Text style={[typography.body, { color: colors.statusSuccess }]}>+₹50,000</Text>
        </View>
        <View style={styles.transaction}>
          <View>
            <Text style={typography.body}>Vendor Payment X</Text>
            <Text style={typography.caption}>2 days ago</Text>
          </View>
          <Text style={typography.body}>-₹15,000</Text>
        </View>
      </Card>

      {renderGrievanceForm()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 48,
  },
  greeting: {
    ...typography.h1,
    color: colors.brandTeal900,
    marginBottom: 24,
  },
  largeTile: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  tileValue: {
    ...typography.h1,
    color: colors.brandTeal900,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceFog,
  },
  nudgeItem: {
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceFog,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.surfaceFog,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.brandTeal900,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.body,
    color: colors.surfaceWhite,
    fontWeight: 'bold',
  },
});
