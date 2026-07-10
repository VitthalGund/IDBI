import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Card, colors, typography } from '@trustbank/ui-kit';

interface SuccessOverlayProps {
  visible: boolean;
  title: string;
  message: string;
  onDismiss: () => void;
}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({ visible, title, message, onDismiss }) => {
  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Card style={styles.card}>
          <Text style={styles.icon}>✓</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>Got it</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    color: colors.statusSuccess,
    marginBottom: 16,
  },
  title: {
    ...typography.h1,
    color: colors.brandTeal900,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.brandTeal900,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: colors.surfaceWhite,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
