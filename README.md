   1. Title and Description

     DevTogether: A Real-Time Collaborative Code Editor
     A web application for collaborative coding in real time. It allows multiple users to join a single room, write code together, and run it directly in the browser, with support for multiple programming languages.

   Project: https://dev-together-azure.vercel.app/
2. Features

   Real-time synchronization: Instantly see code changes from all collaborators.

   Persistent rooms: Code is saved to a database, so rooms can be revisited later.

   Code execution: Run code for JavaScript, C++, and Java with real-time output.

   User management: Track which users are in a specific room.

   Responsive design: The application is usable on different screen sizes.

3. Technologies Used
 
   Frontend: HTML,CSS,React, Socket.io-client

   Backend: Node.js, Express.js, Socket.io

   Database: MongoDB

   External API: Judge0 API for code compilation and execution

4. How to Run It Locally

   * Prerequisites:

   Node.js (LTS version)

   npm

   MongoDB Atlas account or local installation

   A Judge0 API key from RapidAPI

   * Setup:

   Clone the repository:

   git clone https://github.com/knight-54/DevTogether.git

   cd DevTogether

   Install dependencies for both the client and server:

   Start the backend server (from the server directory): 
      node index.js

   Start the frontend client (from the client directory): 
      npm run dev

  5. Snapshots
     
      <img width="2539" height="1380" alt="image" src="https://github.com/user-attachments/assets/4c6aaa72-ad78-4417-9f1d-9d387baa44d3" />

      <img width="2354" height="1322" alt="image" src="https://github.com/user-attachments/assets/a6a39f31-66c6-4dbf-8003-4233d78bdcbf" />

      <img width="1885" height="1183" alt="image" src="https://github.com/user-attachments/assets/61bcbfa9-4afe-4da9-88d0-8ad8f781c1e0" />


