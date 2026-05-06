"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaTimes, FaPaperPlane, FaWhatsapp, FaBuilding, FaBed, FaBoxOpen, FaGift, FaUsers, FaPhone, FaCalendarCheck, FaChevronRight } from 'react-icons/fa';
import { FaLocationDot, FaInfo } from 'react-icons/fa6';
import styles from './ChatbotWidget.module.css';

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
    hasLinks?: boolean;
}

// Enhanced quick replies categories
const quickReplyCategories = {
    initial: [
        { icon: FaBuilding, text: "View our Halls", query: "What halls do you have?" },
        { icon: FaBed, text: "Lodge options", query: "Tell me about lodges" },
        { icon: FaBoxOpen, text: "Event Packages", query: "What event packages do you offer?" },
        { icon: FaGift, text: "Special Packages", query: "Tell me about special packages" },
        { icon: FaUsers, text: "Group Retreats", query: "What group retreat packages do you have?" },
    ],
    followUp: [
        { icon: FaCalendarCheck, text: "How to Book", query: "How do I book?" },
        { icon: FaPhone, text: "Contact Info", query: "How can I contact you?" },
        { icon: FaLocationDot, text: "Location", query: "Where is Camp Elim?" },
        { icon: FaInfo, text: "About Camp Elim", query: "Tell me about Camp Elim Africa" },
    ]
};

const EMILY_WELCOME_MESSAGE = `Hello! 👋 I'm Emily, your personal Camp Elim Africa assistant.

I can help you with:
• 🏛️ **Event Halls** - Conference rooms & auditoriums
• 🏨 **Lodges** - Comfortable accommodation
• 📦 **Event Packages** - Complete event solutions
• 🎁 **Special Packages** - Discounts & offers
• 👥 **Group Retreats** - Team & church retreats

What would you like to explore today?`;

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showInitialQuickReplies, setShowInitialQuickReplies] = useState(true);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize welcome message on client only to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
        setMessages([{
            id: 0,
            text: EMILY_WELCOME_MESSAGE,
            isUser: false,
            timestamp: new Date()
        }]);
    }, []);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
            setHasNewMessage(false);
        }
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            text: text.trim(),
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setShowInitialQuickReplies(false);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text.trim() })
            });

            const data = await response.json();

            const botMessage: Message = {
                id: Date.now() + 1,
                text: data.response || "I'm sorry, I couldn't process that request. Please try again or contact us at +233 27 993 1941.",
                isUser: false,
                timestamp: new Date(),
                hasLinks: data.response?.includes('/services') || data.response?.includes('/hall-booking')
            };

            setMessages(prev => [...prev, botMessage]);

            // Show notification if chat is closed
            if (!isOpen) {
                setHasNewMessage(true);
            }
        } catch (error) {
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: "I'm having trouble connecting right now. Please try again in a moment, or reach us directly at +233 27 993 1941.",
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const handleQuickReply = (query: string) => {
        sendMessage(query);
    };

    // Format message text with bold and links
    const formatMessageText = (text: string) => {
        // Convert **text** to bold
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className={styles.chatbotContainer}>
            {/* Chat Window */}
            <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
                {/* Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.headerInfo}>
                        <div className={styles.emilyAvatar}>
                            <Image
                                src="/emily_1.jpg"
                                alt="Emily - Camp Elim Assistant"
                                width={42}
                                height={42}
                                className={styles.emilyImage}
                            />
                        </div>
                        <div className={styles.headerText}>
                            <span className={styles.botName}>Emily</span>
                            <span className={styles.botStatus}>
                                <span className={styles.statusDot}></span>
                                Camp Elim Assistant • Online
                            </span>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={toggleChat} aria-label="Close chat">
                        <FaTimes />
                    </button>
                </div>

                {/* Messages */}
                <div className={styles.messagesContainer}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.message} ${message.isUser ? styles.userMessage : styles.botMessage}`}
                        >
                            {!message.isUser && (
                                <div className={styles.emilyMessageAvatar}>
                                    <Image
                                        src="/emily_1.jpg"
                                        alt="Emily"
                                        width={28}
                                        height={28}
                                        className={styles.emilySmallImage}
                                    />
                                </div>
                            )}
                            <div className={styles.messageBubble}>
                                <p>{formatMessageText(message.text)}</p>
                                <span className={styles.messageTime}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className={`${styles.message} ${styles.botMessage}`}>
                            <div className={styles.emilyMessageAvatar}>
                                <Image
                                    src="/emily_1.jpg"
                                    alt="Emily"
                                    width={28}
                                    height={28}
                                    className={styles.emilySmallImage}
                                />
                            </div>
                            <div className={styles.typingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies - Show initial categories or follow-up */}
                {messages.length <= 3 && (
                    <div className={styles.quickRepliesSection}>
                        <div className={styles.quickRepliesHeader}>
                            <FaChevronRight size={12} />
                            <span>{showInitialQuickReplies ? 'Explore Our Services' : 'More Options'}</span>
                        </div>
                        <div className={styles.quickReplies}>
                            {(showInitialQuickReplies ? quickReplyCategories.initial : quickReplyCategories.followUp).map((reply, index) => {
                                const IconComponent = reply.icon;
                                return (
                                    <button
                                        key={index}
                                        className={styles.quickReplyBtn}
                                        onClick={() => handleQuickReply(reply.query)}
                                    >
                                        <IconComponent size={14} />
                                        <span>{reply.text}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {showInitialQuickReplies && (
                            <div className={styles.quickReplies}>
                                {quickReplyCategories.followUp.slice(0, 2).map((reply, index) => {
                                    const IconComponent = reply.icon;
                                    return (
                                        <button
                                            key={`followup-${index}`}
                                            className={`${styles.quickReplyBtn} ${styles.secondaryQuickReply}`}
                                            onClick={() => handleQuickReply(reply.query)}
                                        >
                                            <IconComponent size={12} />
                                            <span>{reply.text}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Input */}
                <form className={styles.inputContainer} onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask Emily anything..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className={styles.messageInput}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={styles.sendBtn}
                        disabled={!inputValue.trim() || isLoading}
                        aria-label="Send message"
                    >
                        <FaPaperPlane />
                    </button>
                </form>

                {/* Powered by Footer */}
                <div className={styles.poweredBy}>
                    Powered by Camp Elim Africa AI
                </div>
            </div>

            {/* Floating Buttons */}
            <div className={styles.widgetContainer}>
                {/* Emily Chat Button */}
                <div className={styles.widget} onClick={toggleChat}>
                    <div className={styles.emilyTooltip}>
                        Chat with Emily
                    </div>
                    <div className={styles.emilyButton}>
                        <Image
                            src="/emily_1.jpg"
                            alt="Emily - Chat Assistant"
                            width={60}
                            height={60}
                            className={styles.emilyButtonImage}
                        />
                        {hasNewMessage && <span className={styles.notificationBadge}></span>}
                    </div>
                </div>

                {/* WhatsApp Button */}
                <a
                    href="https://wa.me/233279931941"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappButton}
                    aria-label="Contact us on WhatsApp"
                >
                    <FaWhatsapp />
                </a>
            </div>
        </div>
    );
}
