
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { callDeepseekChat } from '@/ai/flows/deepseek-chat-flow'; // Function name retained for compatibility
import type { AiAssistantMessage, AiAssistantChatFlowInput, AiAssistantChatFlowOutput } from '@/types';
import { Bot, User, Send, Loader2, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AiAssistantPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<AiAssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if(scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: AiAssistantMessage = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const flowInput: AiAssistantChatFlowInput = {
        userMessage: trimmedInput,
      };
      // The function 'callDeepseekChat' now internally uses Google AI via Genkit
      const result: AiAssistantChatFlowOutput = await callDeepseekChat(flowInput); 
      
      const assistantMessage: AiAssistantMessage = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: result.assistantResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Error calling AI assistant:", error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
       const errorMessage: AiAssistantMessage = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="w-full max-w-3xl mx-auto py-8">
        <Card className="shadow-xl flex flex-col h-[70vh] max-h-[700px] min-h-[400px]">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl text-primary">AI Assistant</CardTitle>
            </div>
            <CardDescription>Chat with our helpful AI assistant (powered by Google AI via Genkit).</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-4"> {/* MODIFIED: Added p-4 here */}
            <ScrollArea className="h-full" ref={scrollAreaRef}> {/* MODIFIED: Removed p-4 from here */}
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end space-x-2",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="p-2 bg-primary/10 rounded-full w-fit">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "p-3 rounded-lg max-w-[70%]",
                        msg.role === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="p-2 bg-accent/20 rounded-full w-fit">
                        <User className="h-6 w-6 text-accent" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 justify-start">
                    <div className="p-2 bg-primary/10 rounded-full w-fit">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="bg-accent hover:bg-accent/90">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
