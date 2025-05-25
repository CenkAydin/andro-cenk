import { extendTheme } from "@chakra-ui/react";

export const defaultTheme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "var(--background-color)",
        color: "var(--text-color)",
      },
    },
  },
}); 