import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import AuthScreen from "./components/AuthScreen";
import ChatDashboard from "./components/ChatDashboard";
import LatticeLoader from "./components/LatticeLoader";
import { authStore } from "./stores";

const App = observer(() => {
  useEffect(() => {
    authStore.initSession();
  }, []);

  if (!authStore.isInitialized || authStore.isLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 select-none">
        <LatticeLoader
          status="working"
          label="Thinking"
          doneLabel="Done in"
          errorLabel="Failed after"
          pattern="orbit"
          grid={3}
          shape="round"
          doneColor="#22c55e"
          errorColor="#ef4444"
          cellSize={6}
          gap={2}
          fontSize={14}
          step={90}
          idleOpacity={0.15}
          glow={false}
          glowColor=""
          showTimer
          color="#f5f5f5"
        />
      </div>
    );
  }

  if (!authStore.isAuthenticated) {
    return (
      <AuthScreen
        onAuthSuccess={() => {
          authStore.refreshSession();
        }}
      />
    );
  }

  return <ChatDashboard />;
});

export default App;

