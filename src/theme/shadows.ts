import { Platform } from "react-native";

export const shadows = Platform.select({
  ios: {
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.06,

    shadowRadius: 16,
  },

  android: {
    elevation: 6,
  },

  default: {},
});