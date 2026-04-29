// necesitas acceder al hook, así que ChatRuntime debe estar dentro del contexto de Clerk
import {useApi} from "@/Service/Api_model.jsx";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
} from "@assistant-ui/react";
export function ChatRuntime({ children }) {
  const api = useApi()

  const runtime = useLocalRuntime({
    async *run({ messages, abortSignal }) {
      const ultimo = messages[messages.length - 1]
      let text = ""

      const chunks = api.stream("/chat/stream", {
        prompt: ultimo.content[0].text,
        historial: messages.slice(0, -1).map((m) => ({
          role: m.role,
          content: m.content[0].text,
        })),
      }, abortSignal)

      for await (const chunk of chunks) {
        text += chunk
        yield { content: [{ type: "text", text }] }
      }
    },
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  )
}