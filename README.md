# handleliste
This project is a web application designed to provide an easily accessible way to store products that need to be purchased. It also allows users to easily check the prices of items. Additionally, the project includes authentication and authorization features.

# Project Setup Instructions

To set up the project on your own, you can either follow the README.md file located in the repository on GitHub or follow the instructions below.

## Required Setup

This project requires a working Firebase Firestore Database with two collections named `products` and `validUsers`. In the `validUsers` collection, you should add the approved email addresses that will have access to the application, using the field `email`.

## Steps to Set Up the Project

1. Clone the repository from GitHub to your code editor. The repository can be found at: [https://github.com/Korni26/handleliste](https://github.com/Korni26/handleliste).

2. Open your terminal at the location where the repository was cloned and run the command: `npm install`

3. Create a `.env.local` file in the same directory.

4. In the `.env.local` file, add the necessary environment variables for the project. You can find all the required values in your project settings in Firebase. The setup should look like this:

`NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key`

`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain` 

`NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id` 

`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket` 

`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id` 

`NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id`

5. In the same file, you can also add an additional variable for the API key that you need to create in one of Kassalap's pages. This should be added with the following variable name:
 `NEXT_PUBLIC_API_TOKEN=your_kassalap_api_key`

6. Run the application locally by executing the command: `npm run dev`

This will start the application on one of the available ports.

7. Finally, open your browser and navigate to: `http://localhost:{port_number}`

Replace `{port_number}` with the port number on which the application is running.

## Result
Your project should now be running locally.

