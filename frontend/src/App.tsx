import ChatList from "./components/ChatList";
import CreateGroupChat from "./components/CreateGroupChat";
import ActiveChat from "./components/ActiveChat";

function App() {
  return (
    <div className="flex h-screen">
      {/* Left Column */}
      <div className="w-1/3 border-r p-4 space-y-4">
        <ChatList></ChatList>
        <CreateGroupChat></CreateGroupChat>
      </div>

      {/* Right Column */}
      <div className="w-2/3 p-4">
        <ActiveChat></ActiveChat>
      </div>
    </div>
  );
}

export default App;
