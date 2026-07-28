import { SupportTicketFeed } from "./SupportTicketFeed";

export function ChatRequests({ data, onRefresh }: { data?: any[]; onRefresh?: () => void }) {
  return <SupportTicketFeed data={data} onRefresh={onRefresh} />;
}
