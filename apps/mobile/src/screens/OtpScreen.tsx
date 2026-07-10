import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, typography, Card } from '@trustbank/ui-kit';

interface OtpScreenProps {
  username: string;
  deviceId: string;
  trustReason: string;
  onOtpSuccess: (token: string) => void;
  onCancel: () => void;
}

export const OtpScreen: React.FC<OtpScreenProps> = ({ 
  username, 
  deviceId, 
  trustReason, 
  onOtpSuccess, 
  onCancel 
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [tempToken, setTempToken] = useState('');

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, otp, deviceId })
      });
      
      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setTempToken(data.token);
        setIsVerified(true);
      } else {
        setError(data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error. Check your server connection.');
    }
  };

  const handleConsent = async (register: boolean) => {
    if (!register) {
      // If they refuse registration, we clear the trust event we just recorded in the backend
      try {
        await fetch('http://localhost:3000/auth/reset-trust', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId })
        });
      } catch (e) {
        // Ignore error on reset, we just proceed
      }
    }
    onOtpSuccess(tempToken);
  };

  if (isVerified) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Device Registration</Text>
          <Text style={styles.subtitle}>You successfully verified this device. Would you like to register it as a trusted device to skip OTP in the future?</Text>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleConsent(true)}
          >
            <Text style={styles.buttonText}>Yes, Register Device</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => handleConsent(false)}>
            <Text style={styles.cancelText}>No, Skip for Now</Text>
          </TouchableOpacity>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Step-up verification</Text>
        <Text style={styles.subtitle}>Enter the 6-digit security code sent to your registered device.</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.reasonBox}>
          <Text style={styles.reasonTitle}>Why is this needed?</Text>
          <Text style={styles.reasonText}>{trustReason}</Text>
        </View>

        <TextInput
          style={styles.otpInput}
          value={otp}
          onChangeText={(val) => setOtp(val.replace(/[^0-9]/g, '').substring(0, 6))}
          placeholder="000000"
          keyboardType="numeric"
          textAlign="center"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.hintText}>Demo code: 123456</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.surfaceWhite} />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel & Go Back</Text>
        </TouchableOpacity>
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
  title: {
    ...typography.h2,
    color: colors.brandTeal900,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  reasonBox: {
    backgroundColor: '#fffbeb',
    borderColor: '#fef3c7',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  reasonTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b45309',
    marginBottom: 2,
  },
  reasonText: {
    fontSize: 11,
    color: '#78350f',
  },
  errorText: {
    color: colors.statusDanger,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 14,
    fontSize: 28,
    letterSpacing: 8,
    fontWeight: 'bold',
    color: colors.brandTeal900,
    backgroundColor: colors.surfaceWhite,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: colors.brandTeal900,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.surfaceWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 14,
    padding: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
