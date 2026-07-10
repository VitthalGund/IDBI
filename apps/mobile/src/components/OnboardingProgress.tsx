import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors, spacing } from "@trustbank/ui-kit";

interface OnboardingProgressProps {
  currentStep: 1 | 2 | 3;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.dotContainer}>
          <View
            style={[
              styles.dot,
              currentStep >= step ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  dotContainer: {
    paddingHorizontal: spacing.xs,
  },
  dot: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: colors.brandTeal900,
  },
  inactiveDot: {
    backgroundColor: colors.surfaceFog,
  },
});
