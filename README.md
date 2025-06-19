# Eletrocurte-se

An online electronics store

## Members
- Davi Gabriel Domingues (15447497)
- Giovanna Nascimento Noventa (15637210)
- Pedro Martins Oliveira (13696213)

---

## Table of Contents

- [Navigation Map](#navigation-map)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contribution](#contribution)
- [License](#license)
- [Issues](#issues)
- [Comments](#comments)

---

## Navigation Map

![navigation map](UX-eletrocurtese.png "Map")

For a better view, access the [project on Milanote](https://app.milanote.com/1TWIzG1gYJgXeW?p=rvOTCrnhBY9).

## Project Structure

```text
Trabalho-web/
├── backend/                # Node.js/Express backend (API, models, routes)
│   ├── models/             # Mongoose models (User, Product, Order, Admin)
│   ├── routes/             # Express route handlers (users, products, orders, auth)
│   ├── middleware/         # Authentication and utility middleware
│   ├── server.js           # Main backend entry point
│   ├── backendManipulationRules.txt # API usage and backend rules (ENGLISH)
│   └── insomnia_examples.http       # HTTP request examples for API (ENGLISH)
├── eletrocurte-se/         # React frontend app
│   ├── public/             # Static files, images, and product data (JSON)
│   ├── src/                # React source code
│   │   ├── components/     # Reusable React components (Cart, Product, Profile, etc.)
│   │   ├── pages/          # Main page components (Home, Product, Checkout, etc.)
│   │   ├── styles/         # CSS files for each component/page
│   │   ├── routes.js       # Route definitions for React Router
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies and scripts
├── Old-Version/            # Legacy HTML/CSS/JS version (for reference)
└── README.md               # Main documentation (this file)
```

## Requirements

## Program Functionality
Dividing the program into the client and store administrator parts, each must have the following functionalities:

### Client Side

The [home page](eletrocurte-se/src/pages/PaginaInicial.jsx), where the user sees some products and the electronic e-commerce layout, requiring login with password, username, and email to access their account or register.

After registration, the user can access their profile page, where they can change information, access recent purchases, see recent products, among other functions (e.g., add balance to the wallet for each associated card), access the product modal with descriptions, buy products, add to the shopping cart, and make purchases.

Additionally, the user can search for a product to buy, with options to search by name or by specific associated sector, as a form of dynamic search.

By choosing a product, the user can access the [specific product page](eletrocurte-se/src/pages/PaginaSetor.jsx) and proceed to purchase on the [purchase page](eletrocurte-se/src/pages/PaginaProduto.jsx).

### Administrator Side
If the user logs in as an administrator, they are taken to the [admin home page](eletrocurte-se/src/pages/Desempenho.jsx), where they have access to general sales information.

On the home page, the administrator can also access products, where they can add, remove, and edit listed products.

Finally, the administrator can access [pending issues](eletrocurte-se/src/pages/Pendencias.jsx), where they can see questions, complaints, pending shipments, and other activities that need to be addressed.

## HTML, CSS, and JS (React embedded) Structure
The pages were structured with HTML5 for the basic elements. With the structure done, the mockups were used as a basis to add CSS rules to the elements. Then, the [first version of the project](Old-Version) was adapted to compose the general componentized structure in React, using .jsx files, and adding associated properties (such as React libraries and props) to give the site responsiveness, as well as to support future robustness in data handling via NoSQL database (MongoDB), for Milestone 3.

# Project Description
The project consists of a website for selling electronic products from a fictitious store called **Eletrocurte-se**.

There are three general parts ([legacy from Milestone 1](Old-Version)): general access, profile, and admin-only access.

The general access page is where users search for products to buy.

The profile page is where users can check their interaction history with site products (views and purchases), personal data, system and/or admin messages, and several other available options.

The admin page is where store owners can not only control the products available for sale (add, remove, or edit) but also view sales statistics, answer questions and complaints from users, check which products are waiting to be shipped, among other features.

Even if the basic structure is not necessarily the same anymore, the logic of division used for development, as well as for the division of work and general parts, is similar. However, from Milestone 2 onwards, it was necessary to enrich the application with framework components and libraries to adapt the pages to the development criteria of the Web Development course.

# Code Comments

The web app used the React environment to develop the files and functionalities. Code comments are found within the files themselves, in the [project folder](eletrocurte-se), which contains the [public data used](eletrocurte-se/public), the [developed components](eletrocurte-se/src/components), the [layout pages](eletrocurte-se/src/styles), and the [pages themselves].

There, each page will have its explanation of associated functionalities, usage, structure, and operation appropriate for the site.

# Test Results

The tests were run individually, based on the components used in the application and developed in the project. Checks were performed using the React jest extension to assess the consistency of expected functionalities as a response to the user while using the site in real time. No errors were reported during their execution, given the functions and manipulations each part performs in the overall project structure. The responses were consistent with what was developed and implemented so far.

If you want to check the unit tests, you can run, considering the project is a React App, the following commands in the terminal:

### `npm test`

Runs the default jest library test, via the project's package.json script

### `npx jest --verbose`

Runs the file tests, but uses broader and more flexible flags than those in package.json (guaranteeing broader test coverage).

The "--verbose" flag is used to detail the test results, making them even more transparent to the user.

**Note**: tests must be run in the eletrocurte-se folder.

# Using React

This project was initialized with [Create React App](https://github.com/facebook/create-react-app).

## Quick Start

### Clone the repository

To use its dependencies, you need to clone it from GitHub:
```bash
git clone https://github.com/Pedropudin/Trabalho-web.git
cd eletrocurte-se
```

### Install dependencies

```bash
npm install
```

### Start the frontend

```bash
npm start
```

### Start the backend

```bash
cd ../backend
npm install
npm run dev
```

## Backend Setup

The project has a Node.js/Express backend server to manage authentication, users, products, and MongoDB database integration.

### Server installation and execution

In the project's root directory, go to the `backend` folder:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

For development, it is recommended to use [nodemon](https://www.npmjs.com/package/nodemon) to automatically restart the server on every change:

```bash
npm run dev
```

Or, to run normally:

```bash
npm start
```

Or, in a normal aproach:

```bash
node server.js
```

Or, evenly:

```bash
nodemon server.js
```

The server will start normally at [http://localhost:5000](http://localhost:5000) (or the port defined in `.env`).

### Environment configuration

Create a `.env` file in the `backend` folder with the necessary variables, for example:

```
MONGO_URI=mongodb://localhost:27017/eletrocurte-se
PORT=5000
JWT_SECRET=your_secret_key
API_URL=http://localhost:5000/api/products/import
ADMIN_TOKEN=YOUR_ADMIN_JWT_TOKEN
```

- `API_URL` and `ADMIN_TOKEN` are used to import products via script (see below).

### Main endpoints

- `/api/auth/login` — User login
- `/api/auth/register` — User registration
- `/api/products` — Product listing and management
- `/api/users` — User management

Check the files in the `backend/routes` folder for details of each route.

### Backend scripts and utilities (extra)

#### Batch product import

To import products from the JSON file into the MongoDB database, use the script:

```bash
node importProducts.js
```

- The script reads the `public/data/products.json` file and makes an authenticated request to the backend import endpoint.
- You must correctly set the `API_URL` and `ADMIN_TOKEN` variables in the backend `.env`.
- The admin token (`ADMIN_TOKEN`) can be obtained by logging in as admin and copying the returned JWT.

#### Admin creation

To create a new admin via terminal, use:

```bash
node createAdmin.js
```

- The script will prompt for name, email, password, and numeric token for the new admin.
- The data is saved directly to the MongoDB database.

## Frontend Setup

The frontend is a React application that consumes the backend API.

### Available commands

First, in the terminal, run "cd eletrocurte-se". Then, in the project directory, you can run: 

```bash
npm install
```

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view it after the App compiles in the terminal.

## API Documentation

- [Backend API Rules](backend/backendManipulationRules.txt)
- [HTTP Request Examples](backend/insomnia_examples.http)

---

## Additional Documentation

- **API Usage and Rules:**  
  See [`backend/backendManipulationRules.txt`](backend/backendManipulationRules.txt) for a complete guide to backend endpoints, authentication, JWT usage, and CRUD operations.  
  All backend documentation is in English for consistency.

- **HTTP Request Examples:**  
  See [`backend/insomnia_examples.http`](backend/insomnia_examples.http) for ready-to-use API request examples (login, CRUD, etc.) compatible with Insomnia, Postman, or cURL.

- **Frontend Componentization:**  
  All React components are documented with comments at the top of each file, describing their purpose, props, and usage.  
  The folder structure is organized by feature (e.g., `ProfileEdition`, `Card`, `Address`).

- **Data Models:**  
  The backend uses Mongoose models for `User`, `Product`, `Order`, and `Admin`.  
  Each model is documented with field descriptions in the schema files.

- **Product Data:**  
  The initial product catalog is stored in [`eletrocurte-se/public/data/products.json`](eletrocurte-se/public/data/products.json) and can be imported into the database using the provided scripts.

- **Testing:**  
  Unit and integration tests are located alongside components and can be run with `npm test` (see above).

- **Environment Variables:**  
  Both frontend and backend use `.env` files for configuration.  
  See the "Environment configuration" section above for required variables.

## Testing

The tests were run individually, based on the components used in the application and developed in the project. Checks were performed using the React jest extension to assess the consistency of expected functionalities as a response to the user while using the site in real time. No errors were reported during their execution, given the functions and manipulations each part performs in the overall project structure. The responses were consistent with what was developed and implemented so far.

If you want to check the unit tests, you can run, considering the project is a React App, the following commands in the terminal:

### `npm test`

Runs the default jest library test, via the project's package.json script

### `npx jest --verbose`

Runs the file tests, but uses broader and more flexible flags than those in package.json (guaranteeing broader test coverage).

The "--verbose" flag is used to detail the test results, making them even more transparent to the user.

**Note**: tests must be run in the eletrocurte-se folder.

---

## Contribution

If you wish to contribute or review the code, please follow these guidelines:

- Use English for all code comments, commit messages, and documentation.
- Keep the folder structure and naming conventions consistent.
- Document any new components, endpoints, or scripts you add.
- Run all tests before submitting changes.

---

## License

This project is for educational purposes only and is not intended for production use.

```
MIT License
```

---

## Issues (almost as the same as Milestone 2)

Although we maintained the policy of developing many files and prioritizing componentization as much as possible, as can be seen in the [project components folder](eletrocurte-se/src/components/), we ended up facing some difficulty migrating many of the original ideas present in the Figma Mockup, as well as maintaining, to some extent, the original site layout, considering the adaptations for the React model. In addition, we found it somewhat difficult to fully modularize the CSS styles used in [Milestone 1](Old-Version/) and [Milestone 2](eletrocurte-se/). Thus, the development time for the project was much higher than expected, as there was a large dependency tree between files to be developed in a shorter period compared to the first Milestone.

# Comments
Milestone 3 served to conclude the project for the introductory web development course, requiring extensive knowledge of NoSQL databases, in addition to a solid front-end foundation built during Milestones 1 and 2. It also served as a parameter for putting into practice teamwork skills, code versioning dynamics and, most importantly, how to build a functional website from scratch. This way, we were able to get our hands dirty and practice all the principles taught in class, in addition to having a different programming experience, as it was our first in-depth contact with web development itself.

<!--

### `npm test`

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

-->