import { useEffect } from "react";
import socket from "../../services/socket";

const ChatSocketTest = () => {

    useEffect(() => {

        socket.on("message_sent", (data) => {
            console.log("MESSAGE SENT:", data);
        });

        socket.on("new_message", (data) => {
            console.log("NEW MESSAGE:", data);
        });

        socket.on("message_error", (data) => {
            console.log("MESSAGE ERROR:", data);
        });

        return () => {
            socket.off("message_sent");
            socket.off("new_message");
            socket.off("message_error");
        };

    }, []);


    const connectSocket = () => {
        socket.connect();
    };


    const sendTestMessage = () => {

        socket.emit("send_message", {
            conversationId: "6a79c39ab28ef3e5031c3048",
            content: "Hello from CampusConnect!",
            clientMessageId: crypto.randomUUID(),
        });

    };


    return (
        <div>
            <button onClick={connectSocket}>
                Connect Socket
            </button>
                 <br/>
            <button onClick={sendTestMessage}>
                Send Test Message
            </button>
        </div>
    );
};

export default ChatSocketTest;