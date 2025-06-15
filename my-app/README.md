# Student Progress Management System

This project is a Next.js application designed to track and manage the Codeforces activity of students. It allows for easy monitoring of student progress, sending automated email reminders, and configuring synchronization schedules.

## Video

[Project Video Link](https://drive.google.com/file/d/1r-MhTfCTnZgwmOMOVVu5OWcgm1nIOwC7/view?usp=sharing)

## Documentation

[Documentation Link](https://drive.google.com/file/d/10YrabQuhSTEd0OZWRGzsIYS45m9eU8nM/view?usp=sharing)

## Features

*   **Student Management:** Add, edit, and delete student profiles.
*   **Codeforces Integration:** Fetches and displays student's Codeforces rating and contest history.
*   **Automated Reminders:** Sends email reminders to students inactive on Codeforces for a specified period.
*   **Cron Job Scheduling:** Configurable cron job to automatically sync student data.
*   **Data Visualization:** Displays student progress using charts and heatmaps.
*   **Theme Support:** Supports both light and dark themes.
*   **Data Export:** Allows exporting student data in CSV and JSON formats.

## Technologies Used

*   [Next.js](https://nextjs.org/) - React framework for building performant web applications
*   [MUI (Material UI)](https://mui.com/) - React UI framework for building consistent and beautiful user interfaces
*   [axios](https://axios-http.com/docs/intro) - Promise based HTTP client for the browser and node.js
*   [mongoose](https://mongoosejs.com/) - elegant mongodb object modeling for node.js
*   [node-cron](https://www.npmjs.com/package/node-cron) - Cron scheduler for scheduling tasks
*   [nodemailer](https://nodemailer.com/about/) - Send emails from Node.js – easy as cake!
*   [react-chartjs-2](https://www.npmjs.com/package/react-chartjs-2) - React charting components for Chart.js
*   [react-calendar-heatmap](https://www.npmjs.com/package/react-calendar-heatmap) - A React component for creating calendar heatmaps

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/akshayyy22/student-progress-system.git
    cd akshayyy22-student-progress-system/my-app
    ```
2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```
3.  **Set up environment variables:**

    Create a `.env.local` file in the root directory and add the following:

    ```
    MONGODB_URI=<your_mongodb_connection_string>
    EMAIL=<your_email_address>
    EMAIL_PASS=<your_email_password>
    ```

    Replace `<your_mongodb_connection_string>`, `<your_email_address>`, and `<your_email_password>` with your actual MongoDB connection string and email credentials.
4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

## Code Structure

The project structure is organized as follows:

*   `app/`: Contains Next.js application routes and pages.
    *   `api/`: API routes for student data and settings.
    *   `student/[id]/`: Dynamic route for individual student profiles.
    *   `types/`: TypeScript interfaces for data structures.
*   `components/`: React components used throughout the application.
*   `contexts/`: React context for managing the theme.
*   `cron/`: Cron job for syncing Codeforces data.
*   `lib/`: Utility functions, including database connection.
*   `models/`: Mongoose schemas for data models.
*   `public/`: Static assets, such as images and fonts.
*   `utils/`: Includes utility functions for initializing the app and sending emails.

## Key Components and Functionalities

*   **Database Connection:**  The `lib/db.ts` file establishes the connection to the MongoDB database using Mongoose.
*   **Student Model:** The `models/Student.ts` file defines the schema for storing student information in the database.
*   **API Routes:**
    *   `app/api/students/route.ts`: Handles fetching and creating student records.
    *   `app/api/students/[id]/route.ts`: Handles fetching, updating, and deleting individual student records.
    *   `app/api/students/[id]/resync/route.ts`:  Resynchronizes student data with Codeforces.
    *   `app/api/students/[id]/toggle-email/route.ts`: Toggles email reminders for a student.
    *    `app/api/students/lastSynced/route.ts`: Retrieves the last synchronization time.
    *   `app/api/settings/cron-time/route.ts`: Manages the cron job schedule settings.
*   **Cron Job:** The `cron/syncCodeforces.ts` file defines the cron job that periodically synchronizes student data with Codeforces and sends email reminders.  It reads the cron schedule from `cron-config.json` and updates student information such as current rating, max rating, and last submission time.
*   **Email Reminders:** The `utils/sendMail.ts` file contains the logic for sending email reminders to students using Nodemailer.  It uses environment variables for email credentials.
*   **UI Components:** The `components/` directory includes React components for displaying student data, adding/editing students, and managing the theme.  The `StudentTable.tsx` component displays student data in a table format and allows editing, deleting, and viewing student profiles.
*   **Theme Context:** The `contexts/ThemeContext.tsx` file provides a React context for managing the application's theme.
*   **Configuration:** The `cron-config.json` file stores the cron schedule for the data synchronization job.

##  Conclusion

If you have any questions or feedback, feel free to reach out.

### Contact

- **Akshay Esackimuthu**
- **Email:** akshayesackimuthu@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/akshay-esackimuthu
- **GitHub:** https://github.com/akshayyy22

## Architecture

The application follows a serverless architecture with Next.js API routes handling backend logic and Mongoose interacting with MongoDB for data storage. The cron job is scheduled using `node-cron` and runs on the server to synchronize data and send email reminders.

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS Frontend
    participant NextJS Backend (API Routes)
    participant MongoDB
    participant Codeforces API
    participant Cron Job

    User->Browser: Accesses Student Management App
    Browser->NextJS Frontend: Requests student data
    NextJS Frontend->NextJS Backend (API Routes): Calls /api/students to fetch data
    NextJS Backend (API Routes)->MongoDB: Queries Student data
    MongoDB-->NextJS Backend (API Routes): Returns Student data
    NextJS Backend (API Routes)-->NextJS Frontend: Returns Student data
    NextJS Frontend-->Browser: Displays Student data

    User->Browser: Interacts with UI (add, edit, delete)
    Browser->NextJS Frontend: Sends request to update data
    NextJS Frontend->NextJS Backend (API Routes): Calls appropriate API route (/api/students/[id])
    NextJS Backend (API Routes)->MongoDB: Updates/Deletes Student data
    MongoDB-->NextJS Backend (API Routes): Acknowledges update
    NextJS Backend (API Routes)-->NextJS Frontend: Returns success status
    NextJS Frontend-->Browser: Updates UI

    Cron Job->NextJS Backend (API Routes): Scheduled call to sync Codeforces data
    NextJS Backend (API Routes)->Codeforces API: Requests User Info and Status
    Codeforces API-->NextJS Backend (API Routes): Returns User Data
    NextJS Backend (API Routes)->MongoDB: Updates Student data (rating, last submission)
    NextJS Backend (API Routes)->NextJS Backend (API Routes): Checks for inactive students & sends reminders (via Nodemailer)
    NextJS Backend (API Routes)-->Cron Job: Acknowledges completion





