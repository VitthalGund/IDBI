import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { colors, typography } from "./theme";

interface ModeToggleProps {
  isProMode: boolean;
  onToggle: (value: boolean) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  isProMode,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, !isProMode && styles.active]}>Simple</Text>
      <Switch
        value={isProMode}
        onValueChange={onToggle}
        trackColor={{ false: colors.surfaceFog, true: colors.brandTeal600 }}
        thumbColor={colors.surfaceWhite}
      />
      <Text style={[styles.label, isProMode && styles.active]}>Pro</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: colors.surfaceWhite,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.surfaceFog,
    alignSelf: "flex-start",
  },
  label: {
    ...typography.body,
    marginHorizontal: 8,
    color: colors.textSecondary,
  },
  active: {
    fontWeight: "bold",
    color: colors.brandTeal900,
  },
});
