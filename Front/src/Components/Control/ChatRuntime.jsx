import { Api_manager } from "@/Service/Api_manager.jsx";
import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";

export function ChatRuntime({ children }) {
    const { chat } = Api_manager()

    const runtime = useLocalRuntime({
        async *run({ messages, abortSignal }) {
            const ultimo = messages[messages.length - 1]
            let text = ""

            const chunks = chat.stream(
                ultimo.content[0].text,
                messages.slice(0, -1).map((m) => ({
                    role: m.role,
                    content: m.content[0].text,
                })),
                abortSignal
            )

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