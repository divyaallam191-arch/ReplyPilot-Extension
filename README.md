# ReplyPilot Extension

ReplyPilot Extension brings AI-powered email reply generation into the email workflow. It adds an AI Reply button to the supported Gmail interface and connects to the ReplyPilot backend to generate replies using the selected tone.

## Features

- Generate email replies directly from Gmail.
- Choose a tone for the generated reply.
- Send email content to the ReplyPilot backend for processing.
- Display the generated reply in the email compose interface.
- Save the selected tone using browser storage.

## Technologies Used

- JavaScript
- HTML
- CSS
- Chrome Extension APIs
- Manifest V3
- Spring Boot REST API
- Google Gemini API

## Installation

1. Clone or download this repository.
2. Open `chrome://extensions/` in a Chromium-based browser.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the extension folder.
6. Open Gmail and test the ReplyPilot button.

## How It Works

1. Open Gmail and use the AI Reply button.
2. Select the preferred tone.
3. The extension sends the request to the ReplyPilot backend.
4. The generated reply is displayed in the email compose interface.

## Related Repositories

- [ReplyPilot Backend](https://github.com/divyaallam191-arch/ReplyPilot-Backend)
- [ReplyPilot Frontend](https://github.com/divyaallam191-arch/ReplyPilot-Frontend)
