import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, typography, Card } from '@trustbank/ui-kit';
import { getOrCreateDeviceId } from '../utils/device';
import { apiClient } from '../utils/apiClient';

interface LoginScreenProps {
  onLoginSuccess: (sessionData: { token: string; trustReason: string }) => void;
  onRequireOtp: (username: string, deviceId: string, trustReason: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onRequireOtp }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceTrust, setDeviceTrust] = useState<{ score: number; trusted: boolean; reason: string } | null>({
    score: 0,
    trusted: false,
    reason: 'New device detected. OTP required to establish device trust.'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    async function initDevice() {
      const id = await getOrCreateDeviceId();
      console.log(`[CLIENT] DEVICE ID RESOLVED: "${id}"`);
      setDeviceId(id);
      
      // Fetch initial trust score preview
      try {
        const response = await fetch(`http://127.0.0.1:3000/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'admin', deviceId: id })
        });
        const data = await response.json();
        console.log(`[CLIENT] TRUST RESPONSE FOR "${id}":`, JSON.stringify(data));
        if (data.success) {
          setDeviceTrust({
            score: 0, 
            trusted: !data.requireOtp,
            reason: data.trustReason
          });
        }
      } catch (err) {
        console.log("[CLIENT] TRUST FETCH ERROR:", err);
      }
    }
    initDevice();
  }, []);

  const handleLogin = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Direct call or via apiClient (apiClient queues if offline, but auth needs online)
      const response = await fetch('http://127.0.0.1:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, deviceId })
      });
      
      const data = await response.json();
      setLoading(false);

      if (data.success) {
        if (data.requireOtp) {
          onRequireOtp(username, deviceId, data.trustReason);
        } else {
          onLoginSuccess({ token: 'mock-session', trustReason: data.trustReason });
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setLoading(false);
      setError('Connection to backend failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.logo}>IDBI TrustBank+</Text>
        <Text style={styles.subtitle}>Reliability-First Mobile Banking</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.surfaceWhite} />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {deviceTrust && (
          <View style={styles.trustBanner}>
            <Text style={styles.trustTitle}>
              Adaptive Security Profile: {deviceTrust.trusted ? '🛡️ Trusted' : '⚠️ OTP Required'}
            </Text>
            <Text style={styles.trustText}>{deviceTrust.reason}</Text>
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.surfaceFog,
  },
  card: {
    padding: 24,
    borderRadius: 12,
  },
  logo: {
    ...typography.h1,
    color: colors.brandTeal900,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    color: colors.brandOrange500,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.statusDanger,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    ...typography.caption,
    fontWeight: 'bold',
    color: colors.textInk,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: colors.textInk,
    backgroundColor: colors.surfaceWhite,
  },
  button: {
    backgroundColor: colors.brandTeal900,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.surfaceWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  trustBanner: {
    marginTop: 20,
    padding: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(21, 129, 88, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(21, 129, 88, 0.2)',
  },
  trustTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.brandTeal600,
    marginBottom: 4,
  },
  trustText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 14,
  },
});
