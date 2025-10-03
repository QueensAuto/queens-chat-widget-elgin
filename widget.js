class ChatWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                /* All CSS is now safely inside the Shadow DOM */
                :host {
                    font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
                }
                #chat-widget-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 350px;
                    height: 550px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                    z-index: 99999;
                    overflow: hidden;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    visibility: hidden;
                }
                #chat-widget-container.visible {
                    opacity: 1;
                    transform: translateY(0);
                    visibility: visible;
                }
                #chat-widget-header {
                    background: #0a79c8;
                    color: white;
                    padding: 12px 20px;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .header-content { display: flex; align-items: center; gap: 12px; }
                .header-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
                .header-text { display: flex; flex-direction: column; line-height: 1.2; }
                .header-title { font-size: 16px; font-weight: bold; }
                .header-subtitle { font-size: 13px; font-weight: normal; opacity: 0.9; }
                #chat-widget-header button { background: none; border: none; color: white; font-size: 24px; cursor: pointer; line-height: 1; }
                #chat-widget-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; }
                .message-group { display: flex; flex-direction: column; max-width: 85%; margin-bottom: 15px; }
                .bot-group { align-self: flex-start; }
                .user-group { align-self: flex-end; }
                .message-eyebrow { font-size: 12px; color: #555; margin-bottom: 4px; padding-left: 12px; }
                .message { padding: 12px; border-radius: 18px; font-size: 14px; word-wrap: break-word; }
                .message::-moz-selection { color: white; background: #0095eb; }
                .message::selection { color: white; background: #0095eb; }
                .user-message { background: #f1f1f1; color: #333; border-bottom-right-radius: 4px; }
                .bot-message { background: #0a79c8; color: #fff; border-bottom-left-radius: 4px; }
                .bot-message a { color: #fff; font-weight: bold; text-decoration: underline; }
                .bot-message strong { font-weight: bold; }
                .welcome-message { background: #f1f1f1; color: #333; border-bottom-left-radius: 4px; }
                .typing-indicator { color: #aaa; font-style: italic; padding: 12px; }
                #chat-widget-footer { padding: 12px; border-top: 1px solid #ddd; display: flex; gap: 10px; }
                #chat-widget-input { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 8px; outline: none; color: #333; }
                #chat-widget-send { background: #0a79c8; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
                #chat-bubble-wrapper { position: fixed; bottom: 20px; right: 20px; z-index: 99998; display: flex; align-items: center; gap: 12px; transition: opacity 0.3s ease, transform 0.3s ease; }
                .chat-bubble-text { background: #ffffff; color: #333; padding: 8px 14px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.15); font-size: 14px; font-weight: 500; white-space: nowrap; }
                #chat-widget-button { background: #0a79c8; color: white; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); flex-shrink: 0; }
                #chat-bubble-wrapper.hidden { opacity: 0; transform: scale(0.5); visibility: hidden; }
                .quick-replies { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; align-items: flex-start; }
                .quick-reply { background: #e7f2fa; color: #0a79c8; border-radius: 16px; padding: 8px 14px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid #cce5ff; transition: background-color 0.2s ease; }
                .quick-reply:hover { background: #d4e9f7; }
            </style>
            
            <div id="chat-bubble-wrapper">
                <div class="chat-bubble-text">Chat with us</div>
                <button id="chat-widget-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>
            <div id="chat-widget-container">
                <div id="chat-widget-header">
                    <div class="header-content">
                        <img src="https://queensautoserviceselgin.com/wp-content/uploads/2025/10/New-Project.png" alt="AI Agent" class="header-avatar">
                        <div class="header-text">
                            <span class="header-title">Jessica – Queens Auto</span>
                            <span class="header-subtitle">Your Auto Repair Assistant</span>
                        </div>
                    </div>
                    <button id="close-widget-btn">−</button>
                </div>
                <div id="chat-widget-body">
                    <!-- Initial content will be loaded by JS -->
                </div>
                <div id="chat-widget-footer">
                    <input type="text" id="chat-widget-input" placeholder="Type your message here...">
                    <button id="chat-widget-send">Send</button>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.chatContainer = this.shadowRoot.getElementById("chat-widget-container");
        this.chatBubbleWrapper = this.shadowRoot.getElementById("chat-bubble-wrapper");
        this.chatButton = this.shadowRoot.getElementById("chat-widget-button");
        this.chatBody = this.shadowRoot.getElementById("chat-widget-body");
        this.sendButton = this.shadowRoot.getElementById("chat-widget-send");
        this.inputField = this.shadowRoot.getElementById("chat-widget-input");
        this.closeButton = this.shadowRoot.getElementById("close-widget-btn");
        
        this.chatHistory = [];

        this.chatButton.addEventListener("click", () => this.toggleChatWidget());
        this.closeButton.addEventListener("click", () => this.toggleChatWidget());
        this.sendButton.addEventListener("click", () => this.sendMessage());
        this.inputField.addEventListener("keypress", event => {
            if (event.key === "Enter") this.sendMessage();
        });

        this.initializeChat();
    }
    
    getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : '';
    }

    getGAClientId() {
        const gaCookie = this.getCookie('_ga');
        if (gaCookie) {
            const parts = gaCookie.split('.');
            if (parts.length > 2) return parts[2] + '.' + parts[3];
        }
        return '';
    }
    
    getAttributionData() {
        const params = new URLSearchParams(window.location.search);
        const attribution = {
            ga_client_id: this.getGAClientId(),
            gclid: params.get('gclid') || this.getCookie('_gcl_au'),
            fbc: this.getCookie('_fbc'),
            utm_source: params.get('utm_source'),
            utm_medium: params.get('utm_medium'),
            utm_campaign: params.get('utm_campaign'),
            utm_term: params.get('utm_term'),
            utm_content: params.get('utm_content'),
            page_url: window.location.href,
        };
        return Object.fromEntries(Object.entries(attribution).filter(([_, v]) => v != null && v !== ''));
    }

    getChatId() {
        let chatId = sessionStorage.getItem("chatId");
        if (!chatId) {
            chatId = "chat_" + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem("chatId", chatId);
        }
        return chatId;
    }

    toggleChatWidget() {
        this.chatContainer.classList.toggle("visible");
        this.chatBubbleWrapper.classList.toggle("hidden");
    }

    scrollToBottom() {
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }
    
    prefillMessage(msg) {
        this.inputField.value = msg;
        const quickReplies = this.chatBody.querySelector('.quick-replies');
        if (quickReplies) quickReplies.remove();
        if (this.chatHistory.length > 0 && this.chatHistory[0].showQuickReplies) {
            this.chatHistory[0].showQuickReplies = false;
            sessionStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        }
        this.sendMessage();
    }

    linkify(inputText) {
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return inputText.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
    }
    
    markdownToHtml(text) {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    sendMessage() {
        const message = this.inputField.value.trim();
        if (message === "") return;

        this.chatHistory.push({ type: 'user', content: message });
        sessionStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));

        const userGroup = document.createElement("div");
        userGroup.className = "message-group user-group";
        userGroup.innerHTML = `<p class="message user-message">${message}</p>`;
        this.chatBody.appendChild(userGroup);
        this.inputField.value = "";
        this.scrollToBottom();

        const typingIndicatorGroup = document.createElement("div");
        typingIndicatorGroup.className = "message-group bot-group";
        typingIndicatorGroup.innerHTML = `<p class="message typing-indicator">Jessica is typing...</p>`;
        this.chatBody.appendChild(typingIndicatorGroup);
        this.scrollToBottom();

        setTimeout(() => {
            fetch('https://n8n.queensautoservices.com/webhook/a4303953-30c4-4951-b63f-4b1261053985/chat', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatId: this.getChatId(),
                    message: message,
                    route: 'general',
                    attribution: this.getAttributionData()
                })
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                typingIndicatorGroup.remove();
                if (data.tool === 'navigateTo' && data.url) {
                    window.location.href = data.url;
                } else {
                    const botResponseContent = data.output || "Sorry, I couldn't understand that.";
                    this.chatHistory.push({ type: 'bot', eyebrow: 'Jessica', content: botResponseContent });
                    sessionStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));

                    const botGroup = document.createElement("div");
                    botGroup.className = "message-group bot-group";
                    botGroup.innerHTML = `<div class="message-eyebrow">Jessica</div><p class="message bot-message">${this.linkify(this.markdownToHtml(botResponseContent))}</p>`;
                    this.chatBody.appendChild(botGroup);
                }
            })
            .catch(error => {
                typingIndicatorGroup.remove();
                console.error("Error:", error);
                const errorContent = "Sorry, I couldn't get a response. Please try again.";
                this.chatHistory.push({ type: 'bot', eyebrow: 'Jessica', content: errorContent });
                sessionStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
                const errorGroup = document.createElement("div");
                errorGroup.className = "message-group bot-group";
                errorGroup.innerHTML = `<div class="message-eyebrow">Jessica</div><p class="message bot-message">${errorContent}</p>`;
                this.chatBody.appendChild(errorGroup);
            })
            .finally(() => this.scrollToBottom());
        }, 1500);
    }
    
    initializeChat() {
        const storedHistory = sessionStorage.getItem('chatHistory');
        if (storedHistory) {
            this.chatHistory = JSON.parse(storedHistory);
            this.chatBody.innerHTML = '';
            this.chatHistory.forEach(msg => {
                if (msg.type === 'user') {
                    const userGroup = document.createElement("div");
                    userGroup.className = "message-group user-group";
                    userGroup.innerHTML = `<p class="message user-message">${msg.content}</p>`;
                    this.chatBody.appendChild(userGroup);
                } else if (msg.type === 'bot') {
                    const botGroup = document.createElement("div");
                    botGroup.className = "message-group bot-group";
                    const messageClass = msg.showQuickReplies ? "message welcome-message" : "message bot-message";
                    botGroup.innerHTML = `<div class="message-eyebrow">${msg.eyebrow}</div><p class="${messageClass}">${this.linkify(this.markdownToHtml(msg.content))}</p>`;
                    if (msg.showQuickReplies) {
                        const quickRepliesContainer = document.createElement("div");
                        quickRepliesContainer.className = "quick-replies";
                        quickRepliesContainer.innerHTML = `
                            <div class="quick-reply">📅 Book an appointment</div>
                            <div class="quick-reply">🕑 Hours & Directions</div>
                            <div class="quick-reply">💲 Coupon Details</div>
                            <div class="quick-reply">🇲🇽 Continua en Español</div>
                        `;
                         quickRepliesContainer.querySelectorAll('.quick-reply').forEach(qr => {
                            qr.addEventListener('click', () => this.prefillMessage(qr.textContent.substring(2).trim()));
                        });
                        botGroup.appendChild(quickRepliesContainer);
                    }
                    this.chatBody.appendChild(botGroup);
                }
            });
        } else {
            const botGroup = document.createElement("div");
            botGroup.className = "message-group bot-group";
            const welcomeMessageHTML = `Hi there 👋<br><br>Welcome to Queens Auto Services! Thanks for stopping by. My name is Jessica, and I'm here to help. What can I do for you today?`;
            botGroup.innerHTML = `<div class="message-eyebrow">Jessica</div><p class="message welcome-message">${welcomeMessageHTML}</p>`;
            
            const quickRepliesContainer = document.createElement("div");
            quickRepliesContainer.className = "quick-replies";
            quickRepliesContainer.innerHTML = `
                <div class="quick-reply">📅 Book an appointment</div>
                <div class="quick-reply">🕑 Hours & Directions</div>
                <div class="quick-reply">💲 Coupon Details</div>
                <div class="quick-reply">🇲🇽 Continua en Español</div>
            `;
            quickRepliesContainer.querySelectorAll('.quick-reply').forEach(qr => {
                qr.addEventListener('click', () => this.prefillMessage(qr.textContent.substring(2).trim()));
            });
            botGroup.appendChild(quickRepliesContainer);
            this.chatBody.appendChild(botGroup);

            this.chatHistory.push({ type: 'bot', eyebrow: 'Jessica', content: welcomeMessageHTML, showQuickReplies: true });
            sessionStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        }
        this.scrollToBottom();
    }
}
customElements.define('chat-widget', ChatWidget);

// This line automatically adds the chat widget to the page
document.body.appendChild(document.createElement('chat-widget'));