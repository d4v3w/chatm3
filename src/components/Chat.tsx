import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";

export const ChatArgs = z.object({
  online: z.boolean(),
  message: z.string().nullish(),
  name: z.string().nullish(),
});
export type ZChat = z.infer<typeof ChatArgs>;

export const ChatApp = ({ online, name, message }: ZChat) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: chatMessages } = api.post.getChatMessages.useQuery(undefined, {
    enabled: online,
  });

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  const addMessage = () => {
    const val = inputRef.current?.value;
    console.log("Message", val);
  };

  return (
    <div className="chat">
      {!online && (
        <div>
          <h2>chatm3 is offline!</h2>
          <p>Please login to use chatm3</p>
        </div>
      )}
      {online && (
        <div className="min-h-1 min-w-1 bg-red-500">
          <p>{name} has entered the chat...</p>
          <p>{message}</p>
        </div>
      )}

      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={addMessage}>
        <input
          type="text"
          placeholder="Enter message..."
          ref={inputRef}
          title="Enter your chat message here"
        />
        <button type="submit" title="Submit your message">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
