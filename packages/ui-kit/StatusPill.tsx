import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from './theme';

type Status = 'SUCCESS' | 'INFO' | 'WARN' | 'DANGER' | 'DEFAULT';

interface StatusPillProps {
  label: string;
  status: Status;
}

export const StatusPill: React.FC<StatusPillProps> = ({ label, status }) => {
  let backgroundColor = colors.surfaceFog;
  let textColor = colors.textInk;

  switch (status) {
    case 'SUCCESS':
      backgroundColor = colors.statusSuccess;
      textColor = colors.surfaceWhite;
      break;
    case 'INFO':
      backgroundColor = colors.statusInfo;
      textColor = colors.surfaceWhite;
      break;
    case 'WARN':
      backgroundColor = colors.statusWarn;
      textColor = colors.brandTeal900;
      break;
    case 'DANGER':
      backgroundColor = colors.statusDanger;
      textColor = colors.surfaceWhite;
      break;
  }

  return (
    <View style={[styles.pill, { backgroundColor }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.caption,
    fontWeight: 'bold',
  },
});
