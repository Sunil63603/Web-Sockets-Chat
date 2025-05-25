import React from "react";
import CreateGroupChatForm from "./CreateGroupChatForm"; //MUI form to get group details from user.

const CreateGroupChat: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Group Chat</h2>
      <CreateGroupChatForm />
    </div>
  );
};

export default CreateGroupChat;
