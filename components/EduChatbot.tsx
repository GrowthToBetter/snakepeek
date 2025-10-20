"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/lib/types";
import { extractLocation } from "@/lib/utils";

interface EduChatbotProps {
  onLocationDetected?: (location: string, lat: number, lng: number) => void;
}

export default function EduChatbot({ onLocationDetected }: EduChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message:
        "Halo! Saya asisten virtual untuk edukasi kedaruratan. Anda dapat bertanya tentang mitigasi darurat, prosedur evakuasi, atau persiapan menghadapi keadaan darurat.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: input.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (!process.env.NEXT_PUBLIC_NGROK_URL) {
        throw new Error("NGROK_URL not set in environment variables");
      }

      // Check if streaming endpoint is available, fallback to regular JSON endpoint
      const useStreaming = true; // You can make this configurable

      if (useStreaming) {
        await handleStreamingResponse(userMessage.message);
      } else {
        await handleRegularResponse(userMessage.message);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleStreamingResponse = async (messageText: string) => {
    setIsStreaming(true);
    
    // Create initial bot message for streaming
    const botMessageId = (Date.now() + 1).toString();
    let streamedContent = "";
    
    const initialBotMessage: ChatMessage = {
      id: botMessageId,
      message: "",
      isBot: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, initialBotMessage]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NGROK_URL}/webhook/whatsapp/stream`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "text/plain",
          },
          body: JSON.stringify({
            MessageSid: `SM${Date.now()}`,
            From: "whatsapp:+6281235667629",
            Body: messageText,
            MediaUrl0: "",
            MediaContentType0: "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body reader available");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'status') {
                // Show status updates as temporary messages
                setMessages((prev) => 
                  prev.map((msg) => 
                    msg.id === botMessageId 
                      ? { ...msg, message: `⏳ ${data.message}` }
                      : msg
                  )
                );
              } else if (data.type === 'token') {
                // Append streaming tokens
                streamedContent += data.content;
                setMessages((prev) => 
                  prev.map((msg) => 
                    msg.id === botMessageId 
                      ? { ...msg, message: streamedContent }
                      : msg
                  )
                );
              } else if (data.type === 'report_id') {
                console.log("Report ID:", data.report_id);
              } else if (data.type === 'complete') {
                // Final completion data
                console.log("Emergency Info:", data.emergency_info);
                console.log("Final Report ID:", data.report_id);
              } else if (data.type === 'error') {
                streamedContent = data.message;
                setMessages((prev) => 
                  prev.map((msg) => 
                    msg.id === botMessageId 
                      ? { ...msg, message: streamedContent }
                      : msg
                  )
                );
              }
            } catch (parseError) {
              console.error("Error parsing stream data:", parseError);
            }
          }
        }
      }

      // Ensure final message is properly set
      if (!streamedContent) {
        streamedContent = "Laporan Anda telah diproses.";
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMessageId 
              ? { ...msg, message: streamedContent }
              : msg
          )
        );
      }

    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId 
            ? { ...msg, message: "Maaf, terjadi kesalahan dalam streaming. Silakan coba lagi." }
            : msg
        )
      );
    }
  };

  const handleRegularResponse = async (messageText: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NGROK_URL}/webhook/whatsapp/json`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          MessageSid: `SM${Date.now()}`,
          From: "whatsapp:+6281235667629",
          Body: messageText,
          MediaUrl0: "",
          MediaContentType0: "",
        }),
      }
    );

    const jsonResponse = await response.json();

    let botReply = "Terima kasih. Laporan Anda sedang diproses.";

    if (jsonResponse.status === "success") {
      botReply = jsonResponse.message || "Laporan berhasil diproses.";

      if (jsonResponse.emergency_info) {
        console.log("Emergency Info:", jsonResponse.emergency_info);
      }
      if (jsonResponse.report_id) {
        console.log("Report ID:", jsonResponse.report_id);
      }
    } else if (jsonResponse.status === "error") {
      botReply = jsonResponse.message || "Terjadi kesalahan dalam memproses laporan.";
      console.error("Error:", jsonResponse.error);
    }

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      message: botReply,
      isBot: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="disaster-card h-96 flex flex-col">
      <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-200">
        <div className="p-2 bg-secondary rounded-full">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-dark">
            Asisten Edukasi kedaruratan
          </h3>
          <p className="text-xs text-gray-600">Selalu siap membantu 24/7</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isBot ? "justify-start" : "justify-end"
            }`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isBot
                  ? "bg-gray-100 text-dark"
                  : "bg-secondary text-white"
              }`}>
              <div className="flex items-start space-x-2">
                {message.isBot ? (
                  <Bot className="h-4 w-4 mt-0.5 text-secondary" />
                ) : (
                  <User className="h-4 w-4 mt-0.5" />
                )}
                <div className="flex-grow">
                  <p className="text-sm">{message.message}</p>
                  {message.detectedLocation && (
                    <div className="mt-2 p-2 bg-success/10 rounded border border-success/20">
                      <p className="text-xs text-success font-medium">
                        📍 Lokasi terdeteksi: {message.detectedLocation}
                      </p>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {(isLoading || isStreaming) && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-secondary" />
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-600">
                  {isStreaming ? "Memproses..." : "Sedang mengetik..."}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tanyakan tentang mitigasi kedaruratan..."
          disabled={isLoading || isStreaming}
          className="flex-grow"
          aria-label="Ketik pertanyaan tentang kedaruratann"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading || isStreaming}
          size="sm"
          className="disaster-button-primary px-3"
          aria-label="Kirim pesan">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}