# CRYPT://CHAT - Conventional Encryption Chat Program

A web-based chat simulation that demonstrates various conventional cryptographic algorithms. Built for CSIT385, this project provides a sleek, cyberpunk-themed interface to encode, decode, send, and receive messages using classic encryption techniques.

## 🚀 Features

- **Live Encryption/Decryption**: Encrypt your messages before sending or send decrypted messages directly.
- **Multiple Ciphers Supported**:
  - **Caesar Cipher**: A simple substitution cipher that shifts characters by a fixed number.
  - **Vigenère Cipher**: A method of encrypting alphabetic text by using a series of interwoven Caesar ciphers based on the letters of a keyword.
  - **Rail Fence Cipher**: A transposition cipher that writes text downwards and diagonally on successive "rails" of an imaginary fence.
  - **Playfair Cipher**: A manual symmetric encryption technique that encrypts pairs of letters (digraphs) using a 5x5 matrix.
- **Simulate Received Messages**: Receive random encrypted messages and decrypt them on the fly.
- **Toggle Decryption**: Hide or reveal decrypted ciphertext within the chat bubble dynamically.
- **Dynamic Configuration**: Change ciphers and keys on the fly, with visually updating badges and UI elements.

## 🛠️ Technologies Used

- **HTML5:** Semantic structure.
- **CSS3:** Custom cyberpunk/terminal aesthetic (custom properties, flexbox, CSS animations).
- **Vanilla JavaScript:** Core encryption algorithms and DOM manipulation. No external dependencies.

## 📖 How to Run

Since this is a client-side only web application, no server or installation is required:

1. Clone or download this repository.
2. Navigate to the project folder.
3. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, etc.).

## 🎮 Usage Guide

1. **Configure your Cipher**: 
   - Use the dropdown menu in the top bar to select the desired encryption algorithm (Caesar, Vigenère, Rail Fence, Playfair).
   - Enter your desired `Key` in the input field. (e.g., a number `3` for Caesar/Rail Fence, or a word `KEY` for Vigenère/Playfair).
2. **Send Encrypted Messages**:
   - Type your plaintext message in the input box at the bottom.
   - Click **ENCRYPT + SEND ▶**. The chat will display your original message and the resulting encrypted ciphertext.
3. **Send Decrypted Messages**:
   - Type ciphertext into the input box.
   - Click **DECRYPT + SEND ▶**. The chat will decrypt using the current cipher/key settings and display the original ciphertext and the decoded plaintext.
4. **Simulate Incoming Messages**:
   - Click **↙ SIM RECV** to simulate receiving an encrypted message from a remote party.
   - Click the **▶ DECRYPT** button on the newly received message to decode it based on your current config.
   - Click **▼ HIDE DECRYPTED** to hide the plaintext again.
5. **Copy Ciphertext**:
   - You can click on any ciphertext block in the chat UI to instantly copy it to your clipboard.

## 📂 Project Structure

```text
├── index.html   # Main HTML structure and chat layout
├── style.css    # Styling, themes, and animations
├── script.js    # Logic for encryption algorithms and chat interactivity
└── README.md    # Project documentation
```

## 🎓 Academic Context

Developed as a demonstration of conventional encryption methods for the **CSIT385** course.
