# Zealthy Helpdesk

[Zealthy Helpdesk](zealthy-helpdesk.vercel.app) is a simple ticket management system designed to streamline the process of handling support requests. It allows end users to submit support tickets and support staff to manage these tickets effectively to showcase my technical skills. Given the time limit, some corners were cut to balance out some of the depth I wanted to have. Things likes types weren't entirely fleshed out, and some components, `TicketTable` in particular, could have been further component-ized to make the codebase more readable and easier to maintain.

## Routes

- **/**: Ticket submission with basic error handling and comprehensive input validation.
- **/admin**: Admin page where you can view a list of all tickets, update their status, and respond to them. Ticket statuses include "New", "In Progress", and "Resolved".

## Tech Stack

- **Frontend**: React/Typescript with Mantine as the UI framework.
- **Backend**: [Node.js/ExpressJS/MongoDB. Quick and simple.](https://github.com/MuhammedEl-Sayed/zealthy-helpdesk-api)

## Getting Started

Start with creating a .env file and add a VITE_API_URL that points to your local API.

```bash
git clone https://github.com/MuhammedEl-Sayed/zealthy-helpdesk.git
cd zealthy-helpdesk
```

Then, install the dependencies:

```bash
npm install
```

To start the development server:

```bash
npm run dev
```
