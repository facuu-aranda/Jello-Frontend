import { JelliChat } from "@/components/jelli-chat"
import { AppLayout } from "@/components/layout/app-layout"

export default function AssistantPage() {
  return (
    <AppLayout>
      <div className="h-full p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Assistant</h1>
          <p className="text-muted-foreground">Chat with Jelli, your intelligent productivity partner</p>
        </div>

        <div className="h-[calc(100vh-200px)]">
          <JelliChat />
        </div>
      </div>
    </AppLayout>
  )
}
