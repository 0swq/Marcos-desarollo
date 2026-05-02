import { ChatRuntime } from "../../Components/Control/ChatRuntime.jsx";
import { Thread } from "../../Components/Control/Thread.jsx";

export default function Chatbot() {
  return (
    <div className="h-screen w-full">
      <ChatRuntime>
        <Thread/>
      </ChatRuntime>
    </div>
  );
}