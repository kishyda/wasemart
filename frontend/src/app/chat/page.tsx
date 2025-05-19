"use client";
import { useEffect, useRef, useState} from 'react'

interface Message {
    From: string,
    To: String,
    Message: string
}

export default function page() {

    const webSocketRef = useRef<WebSocket | null>(null);

    const [textContent, setTextContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [wsMessage, setwsMessage] = useState("");

    useEffect(() => {
        console.log("connecting to golang server")
        webSocketRef.current = new WebSocket("ws://localhost:8080/ws")

        webSocketRef.current.onopen = () => {
            console.log("Connected to server");
            webSocketRef.current?.send(JSON.stringify({From: "Me", To: "You", Message: "this is a message"}))
        };

        webSocketRef.current.onmessage = async (event) => {
            console.log("got a message", event.data);
            setwsMessage(wsMessage + await event.data);
        };

        return () => {
            webSocketRef.current?.close();
        };
    }, []);


    // Change sendMessage to send to the golang server
    const sendMessage = async () => {
        webSocketRef.current?.send(textContent)
    }
    return (
        <>
            <h1>Chat</h1>
            <button onClick={() => console.log(fetch('http://localhost:8080/getMessages'))}>Disconnect</button >
            <input className="" type="text" onChange={(e) => setTextContent(e.target.value)} value={textContent} />
            <button onClick={sendMessage}>SEND</button>
            <div>{errorMessage}</div>
            <div>{wsMessage}</div>
        </>
    )
}
