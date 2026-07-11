import { LaterProvider } from "./src/context/LaterContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <LaterProvider>
      <AppNavigator />
    </LaterProvider>
  );
}