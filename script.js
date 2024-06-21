class Bot {
    constructor(name, avatar) {
        this.name = name;
        this.avatar = avatar;
        this.commands = {
            "help": this.help,
            "time": this.sendTime,
            "date": this.sendDate,
            "chat": this.chatWithAllBots
        };
    }

    help() {
        return "Available commands: help, time, date, chat";
    }

    sendTime() {
        return `Current time is: ${new Date().toLocaleTimeString()}`;
    }

    sendDate() {
        return `Today's date is: ${new Date().toLocaleDateString()}`;
    }

    chatWithAllBots() {
        return "All bots are now chatting!";
    }

    respond(message) {
        const command = message.toLowerCase().trim();
        return this.commands[command] ? this.commands[command]() : 'Demande incomprise par le bot (chatgpt non connecter car api payante)';
    }
}

class Message {
    constructor(sender, content, timestamp, avatar) {
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
        this.avatar = avatar;
    }

    createMessageElement() {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${this.sender === 'You' ? 'sent' : 'received'}`;

        const avatarImg = document.createElement('img');
        avatarImg.src = this.avatar;
        avatarImg.className = 'avatar';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.textContent = `${this.timestamp} - ${this.sender}: ${this.content}`;

        messageDiv.appendChild(avatarImg);
        messageDiv.appendChild(contentDiv);

        return messageDiv;
    }
}

const bots = [
    new Bot("Bot1", "avatar1.png"),
    new Bot("Bot2", "avatar2.png"),
    new Bot("Bot3", "avatar3.png")
];

const sendMessage = (message, sender = 'You') => {
    const time = new Date().toLocaleTimeString();
    const messageObj = new Message(sender, message, time, sender === 'You' ? 'your-avatar.png' : 'bot-avatar.png');
    const messageElement = messageObj.createMessageElement();
    addMessageToHistory(messageElement);
    saveMessageToLocalStorage(messageObj);
};

const addMessageToHistory = (messageElement) => {
    const messageHistory = document.querySelector('.messageHistory');
    messageHistory.appendChild(messageElement);
    //messageHistory.scrollTop = messageHistory.scrollHeight;
};

const saveMessageToLocalStorage = (messageObj) => {
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(messageObj);
    localStorage.setItem('messages', JSON.stringify(messages));
};

const loadMessagesFromLocalStorage = () => {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(messageData => {
        const messageObj = new Message(
            messageData.sender,
            messageData.content,
            messageData.timestamp,
            messageData.avatar
        );
        const messageElement = messageObj.createMessageElement();
        addMessageToHistory(messageElement);
    });
};

const handleBotResponse = (message) => {
    bots.forEach(bot => {
        const response = bot.respond(message);
        if (response) {
            sendMessage(response, bot.name);
        }
    });
};

const main = () => {
    document.querySelector('.button').addEventListener('click', function (event) {
        event.preventDefault();
        const input = document.getElementById('inputMessage');
        const message = input.value.trim();
        if (message) {
            sendMessage(message);
            handleBotResponse(message);
            input.value = '';
        }
    });

    document.getElementById('inputMessage').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.querySelector('.button').click();
        }
    });

    loadMessagesFromLocalStorage();
};

main();
