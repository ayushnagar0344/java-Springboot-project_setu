import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { text: "NOTICE: I am an AI assistant. I provide informational guidance based on open legal data. For binding legal advice, please book a consultation with our verified lawyers below.", sender: 'bot', type: 'disclaimer' },
        { text: "JusticeBot active. How can I assist you with your legal needs today?", sender: 'bot' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!message.trim()) return;

        const userMsg = { text: message, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const currentMsg = message;
        setMessage('');
        setIsTyping(true);

        try {
            const res = await API.post('/api/chatbot/message', { message: currentMsg });
            // Extract bot response from API DTO
            const botText = res.data.message;
            setMessages(prev => [...prev, { text: botText, sender: 'bot' }]);
        } catch (err) {
            console.error("Chatbot error", err);
            setMessages(prev => [...prev, { text: "I'm having trouble connecting to the judiciary servers. Please try again later.", sender: 'bot' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickActions = [
        "How to book?",
        "Available lawyers?",
        "Payment Help"
    ];

    const handleQuickAction = (action) => {
        setMessage(action);
        // We'll trigger send indirectly or just set the message and let the user click
        // For better UX, let's auto-send
    };

    // Auto-send effect for quick actions or state-based messages
    useEffect(() => {
        if (quickActions.includes(message)) {
            handleSend();
        }
    }, [message]);

    return (
        <div className={`justice-bot-root ${isOpen ? 'open' : ''}`}>
            {/* Toggle Button */}
            <button className="bot-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '⚖️'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="bot-window card">
                    <div className="bot-header">
                        <div className="bot-avatar">⚖️</div>
                        <div className="bot-title">
                            <h3>JusticeBot</h3>
                            <span>Legal AI Assistant</span>
                        </div>
                    </div>

                    <div className="bot-messages" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message-bubble ${msg.sender} ${msg.type || ''}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && <div className="message-bubble bot typing">JusticeBot is thinking...</div>}
                    </div>

                    <div className="bot-quick-actions">
                        {quickActions.map(action => (
                            <button key={action} onClick={() => handleQuickAction(action)}>
                                {action}
                            </button>
                        ))}
                    </div>

                    <form className="bot-input-area" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder="Type your legal query..." 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" disabled={!message.trim()}>➤</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
