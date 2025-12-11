import { Anchor } from "@/components/common/anchor";
import { CodeBlock } from "@/components/common/code-block";

export function MessagesUsageExample() {
  return (
    <div className="space-y-2">
      <Anchor id="chat-messages">
        <h3 className="text-lg font-semibold">Chat Messages</h3>
      </Anchor>
      <CodeBlock language="jsx" code={codeString} showLineNumbers />
    </div>
  );
}

const codeString = `    <Chat>
      <ChatHeader>
        ...
      </ChatHeader>

      <ChatMessages>
        {MESSAGES.map((msg, i, msgs) => {
          // If date changed, show date item
          if (
            new Date(msg.timestamp).toDateString() !==
            new Date(msgs[i + 1]?.timestamp).toDateString()
          ) {
            return (
              <Fragment key={msg.id}>
                <PrimaryMessage
                  avatarSrc={msg.sender.avatarUrl}
                  avatarAlt={msg.sender.username}
                  avatarFallback={msg.sender.name.slice(0, 2)}
                  senderName={msg.sender.name}
                  content={msg.content}
                  timestamp={msg.timestamp}
                />
                <DateItem timestamp={msg.timestamp} className="my-4" />
              </Fragment>
            );
          }

          // If next item is same user, show additional
          if (msg.sender.id === msgs[i + 1]?.sender.id) {
            return (
              <AdditionalMessage
                key={msg.id}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            );
          }
          // Else, show primary
          else {
            return (
              <PrimaryMessage
                className="mt-4"
                key={msg.id}
                avatarSrc={msg.sender.avatarUrl}
                avatarAlt={msg.sender.username}
                avatarFallback={msg.sender.name.slice(0, 2)}
                senderName={msg.sender.name}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            );
          }
        })}
      </ChatMessages>

      <ChatToolbar>
        ...
      </ChatToolbar>
    </Chat>
    `;
