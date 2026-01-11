Fin-Track: Personal Finance Management Application
This project is a comprehensive React-based financial management dashboard where users can track incomes and expenses, monitor real-time currency exchange rates, and manage spending limits.

 Features
Secure Authentication: Login screen with username and password verification.

Password Recovery: Reset mechanism based on username and phone number matching.

Dashboard Overview: Visual analysis of total balance, currency assets, and spending trends.

Transaction Tracking: Categorized income and expense logs displayed in separate, organized columns.

Real-time Data Ticker: An animated ticker at the top showing simulated live exchange rates for USD, EUR, and GOLD.

Limit Management: Set budget limits for different categories with visual over-spending alerts.

Personalization: Dark/Light mode toggle and Multi-language (Turkish/English) support.

Data Persistence: Full localStorage integration to ensure data remains safe even after page refreshes.

🛠 Tech Stack
React.js: Component-based UI management.

JavaScript (ES6+): Logical operations and data handling.

CSS-in-JS: Dynamic theme and style management.

LocalStorage API: Browser-based data storage.

🏗 Project Architecture
🧠 Challenges and Solutions
During the development of this project, I encountered several technical challenges and implemented the following solutions:

1. State Management and Synchronization

Challenge: Managing multiple dynamic data points like language settings, theme toggles, and balance updates across different components (Dashboard, Profile, Transactions) was complex. Solution: I utilized React's useState and useEffect hooks effectively to create a centralized data flow. I developed custom functions to automatically recalculate the total balance whenever a transaction is added or deleted.

2. Data Persistence

Challenge: Ensuring that user data (transactions, profile info) stayed intact after a browser refresh was crucial for user experience. Solution: I implemented localStorage logic to write data to the browser's memory on every state change and fetch it back during the initial application load.

3. Responsive Layout and Full-Screen Experience

Challenge: To make the application feel like a professional software tool rather than a simple web page, I needed to eliminate default browser margins and ensure a "full-bleed" layout. Solution: I applied global CSS styles to the root containers (body, html, #root) and used 100vh/100vw units to achieve a seamless full-screen interface.

4. Authentication Logic and Initial State

Challenge: A bug occurred where the app wouldn't allow login if the localStorage was empty during the first run. Solution: I implemented a "Default User" object structure. This ensures that even on the first launch, the system has a pre-defined credential set to validate against.