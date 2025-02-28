export const theme = {
  colors: {
    background: "#121212",
    card: "#1e1e1e",
    text: "#fff",
    textSecondary: "#999",
    primary: "#0084ff",
    danger: "#f44336",
    success: "#4caf50",
    border: "#333",
    inputBackground: "#333",
  },
  spacing: {
    xs: 5,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },
};

export type Theme = typeof theme;
