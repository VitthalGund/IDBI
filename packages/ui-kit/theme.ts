export const colors = {
  brandTeal900: "#0F3D3E",
  brandTeal600: "#158158",
  brandOrange500: "#ED561B",
  surfaceWhite: "#FFFFFF",
  surfaceFog: "#F3F3F3",
  textInk: "rgba(0, 0, 0, 0.87)",
  textSecondary: "rgba(0, 0, 0, 0.6)",
  statusSuccess: "#50B432",
  statusInfo: "#058DC7",
  statusWarn: "#ED561B", // Was #EDEF00 (contrast fix)
  statusDanger: "#ED561B", // Using #ED561B as per ui-context
};

export const typography = {
  h1: { fontSize: 24, fontWeight: "bold" as const },
  h2: { fontSize: 20, fontWeight: "bold" as const },
  bodyLarge: { fontSize: 16, fontWeight: "400" as const },
  body: { fontSize: 14, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "400" as const },
  label: { fontWeight: "bold" as const },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
