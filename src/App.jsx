import { useState, useRef, useEffect, useContext } from 'react';
import './App.css';
import { 
  PanelLeft, 
  PanelLeftClose,
  Plus, 
  MoreHorizontal, 
  Settings, 
  LogOut, 
  Image as ImageIcon, 
  PenTool, 
  Globe, 
  Mic, 
  ArrowUp,
  MessageSquare,
  Sparkles,
  Trash2,
  Moon
} from 'lucide-react';

import { context } from './context/context';

const INITIAL_RECENTS = [];
 
const INITIAL_HISTORIES = {};

function App() {
  const {
    prevPrompts,
    setPrevPrompts,
    recentPrompt,
    setRecentPrompt,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    onSent,
    input,
    setInput
  } = useContext(context);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [resultData, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleNewChat = () => {
    setShowResult(false);
    setInput('');
    setProfileMenuOpen(false);
  };

  const handleSendMessage = (textToSend = null) => {
    const text = (textToSend !== null ? textToSend : input).trim();
    if (!text) return;
    onSent(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  // Quick Action Pill Handler
  const handleQuickAction = (actionType) => {
    if (actionType === 'image') {
      setInput("Create an image of a cat wearing a crown sitting on a futuristic command center throne");
    } else if (actionType === 'write') {
      setInput("Write a Python script to scan my home network and detect the automatic treat dispenser IP address");
    } else if (actionType === 'lookup') {
      setInput("Look up the biological reasoning behind why cats are afraid of cucumbers");
    }
    textareaRef.current?.focus();
  };

  return (
    <div id="app-container" onClick={() => {
      setProfileMenuOpen(false);
    }}>
      
      {/* Sidebar Component */}
      <div className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo-group">
            <img src="/whiteLogo.png" alt="Logo" />
            <span>CatGPT</span>
          </div>
          <button 
            className="btn-sidebar-toggle" 
            title="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Sidebar Scrollable Nav */}
        <div className="sidebar-nav">
          <button className="btn-new-chat btn-new-chat-highlighted" onClick={handleNewChat}>
            <MessageSquare size={16} />
            <span>New chat</span>
          </button>

          {/* Recents list */}
          <div className="sidebar-recents-section">
            <span className="recents-title">Recents</span>
            <div className="recents-list">
              {prevPrompts.map((item, index) => (
                <div 
                  key={index} 
                  className={`recent-item ${recentPrompt === item ? 'active' : ''}`}
                  onClick={() => {
                    setRecentPrompt(item);
                    onSent(item);
                  }}
                >
                  <span className="recent-item-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="sidebar-footer">
          <button 
            className="profile-button" 
            onClick={(e) => {
              e.stopPropagation();
              setProfileMenuOpen(!profileMenuOpen);
            }}
          >
            <div className="profile-avatar">SH</div>
            <div className="profile-info">
              <span className="profile-name">Simple Human</span>
              <span className="profile-sub">CatGPT Free User</span>
            </div>
            <MoreHorizontal size={16} className="profile-more-icon" />
          </button>

          {profileMenuOpen && (
            <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="profile-dropdown-item">
                <Settings size={16} />
                <span>Settings</span>
              </div>
              <div className="profile-dropdown-item">
                <Moon size={16} />
                <span>Dark Theme</span>
              </div>
              <div className="profile-dropdown-divider"></div>
              <div className="profile-dropdown-item" onClick={() => {
                setPrevPrompts([]);
                setShowResult(false);
                setProfileMenuOpen(false);
              }}>
                <Trash2 size={16} />
                <span>Clear Conversations</span>
              </div>
              <div className="profile-dropdown-item">
                <LogOut size={16} />
                <span>Log out</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="main-content">
        
        {/* Header Bar */}
        <header className="main-header">
          <div className="header-left">
            {!sidebarOpen && (
              <button 
                className="btn-menu-floating" 
                title="Open sidebar"
                onClick={() => setSidebarOpen(true)}
              >
                <PanelLeft size={18} />
              </button>
            )}
            
            <div className="model-selector" style={{ cursor: 'default' }}>
              <span>CatGPT 3.14</span>
            </div>
          </div>

          <div className="header-right">
            <button className="btn-header-action" title="New Chat" onClick={handleNewChat}>
              <Plus size={18} />
            </button>
          </div>
        </header>

        {/* Content Display (Landing or Chat screen) */}
        {!showResult ? (
          /* Empty landing state screen */
          <div className="landing-screen">
            <h1 className="landing-title">Good to see you, User.</h1>
            
            {/* Input area inside landing */}
            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                <button className="btn-attach" title="Attach file">
                  <Plus size={20} />
                </button>
                <textarea 
                  ref={textareaRef}
                  className="chat-textarea" 
                  placeholder="Ask anything" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                />
                <div className="input-actions-right">
                  <button
                    className="btn-voice btn-voice-disabled"
                    title="practice 10000 hours of classical singing before talking to me"
                    disabled
                  >
                    <Mic size={18} />
                  </button>
                  {input.trim() ? (
                    <button className="btn-send" title="Send message" onClick={() => handleSendMessage()}>
                      <ArrowUp size={16} />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Action Cards under prompt */}
              <div className="quick-actions">
                <button className="btn-quick" onClick={() => handleQuickAction('image')}>
                  <ImageIcon size={14} className="quick-action-icon" />
                  <span>Create an image</span>
                </button>
                <button className="btn-quick" onClick={() => handleQuickAction('write')}>
                  <PenTool size={14} className="quick-action-icon" />
                  <span>Write or edit</span>
                </button>
                <button className="btn-quick" onClick={() => handleQuickAction('lookup')}>
                  <Globe size={14} className="quick-action-icon" />
                  <span>Look something up</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Active chat stream screen */
          <div className="chat-messages-container">
            <div className="chat-messages-wrapper">
              
              {/* User Message */}
              <div className="message-item user">
                <div className="message-avatar user">AT</div>
                <div className="message-content-wrapper">
                  <span className="message-sender">You</span>
                  <div className="message-bubble">
                    <p>{recentPrompt}</p>
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="message-item ai">
                <div className="message-avatar ai">CG</div>
                <div className="message-content-wrapper">
                  <span className="message-sender">CatGPT</span>
                  
                  {loading ? (
                    <div className="typing-loader">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <div 
                      className="message-bubble"
                      dangerouslySetInnerHTML={{ __html: resultData }}
                    />
                  )}
                </div>
              </div>

              <div ref={messagesEndRef} />
            </div>

            {/* Chat bottom input area */}
            <div className="chat-input-container" style={{ marginTop: 'auto' }}>
              <div className="chat-input-wrapper">
                <button className="btn-attach" title="Attach file">
                  <Plus size={20} />
                </button>
                <textarea 
                  ref={textareaRef}
                  className="chat-textarea" 
                  placeholder="Ask anything" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                />
                <div className="input-actions-right">
                  <button className="btn-voice" title="Voice input">
                    <Mic size={18} />
                  </button>
                  {input.trim() ? (
                    <button className="btn-send" title="Send message" onClick={() => handleSendMessage()}>
                      <ArrowUp size={16} />
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="chat-footer-disclaimer">
                CatGPT can make mistakes. Consider checking important information.
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
