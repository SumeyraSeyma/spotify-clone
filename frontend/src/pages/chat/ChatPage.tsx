import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";

const ChatPage = () => {
  const { user } = useUser();
  const { selectedUser, fetchUsers, fetchMessages } = useChatStore();

  // Fetch users when the user is logged in
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [fetchUsers, user]);

  // Fetch messages when the selected user changes
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.clerkId);
    }
  }, [fetchMessages, selectedUser]);

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Topbar />

      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <UsersList />
      </div>
    </main>
  );
};

export default ChatPage;
