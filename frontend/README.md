# CakeDelight Frontend

Build a modern, elegant e-commerce frontend for a bakery application called "CakeDelight". Use React, Tailwind CSS, and shadcn/ui components. The design should be clean, using warm bakery colors (soft browns, creams, and warm accents).

Architecture & Setup:
Create a centralized api.js or standard fetch wrapper for data calls. For now, use hardcoded mock data that strictly matches the JSON structures provided below so I can easily swap in my local backend URL (http://localhost:8080) later.

Features & Views to Implement:

1. Main Navigation Bar:

A logo on the left ("CakeDelight").

A "Customer Dashboard" link.

A Shopping Cart icon on the right with a badge showing the number of items. Clicking it should open a shadcn slide-out Sheet (Drawer).

2. Product Catalog (Home View):

A responsive grid displaying cake products.

Each Cake Card should show: Image placeholder, Name, Category, Price (formatted as currency), and an "Add to Cart" button.

Mock Data Shape: [{ "id": 1, "name": "Belgian Chocolate Truffle", "category": "Chocolate", "price": 550.00, "available": true }]

3. Cake Details Modal (or Route):

When clicking a cake card, show a detailed view.

Include a section for Customer Reviews with a 5-star rating visual and review text.

Include a form to submit a new review (Rating 1-5 and a Textarea).

Mock Data Shape (Reviews): [{ "id": 1, "cakeId": 1, "customerEmail": "user@example.com", "rating": 5, "review": "Delicious!" }]

4. Shopping Cart Drawer (Sheet Component):

Displays added items with Name, Price, and Quantity.

Allow quantity adjustment (+/- buttons).

Show Total Price.

An input field for the user to enter their customerEmail.

A "Checkout" button that clears the cart and shows a success toast notification.

Mock Data Shape (Order Payload): { "customerEmail": "string", "items": [ { "cakeId": 1, "quantity": 2 } ] }

5. Customer Dashboard View:

A simple view where a user can enter their email to see past orders and notifications.

Orders List Mock: [{ "id": 1, "totalAmount": 550.00, "status": "COMPLETED", "createdAt": "2026-08-12T10:00:00" }]

Notifications List Mock: [{ "id": 1, "message": "Your order #1 has been completed successfully", "read": false }]

Focus on making the UI interactive (cart adds work locally in state, modals open/close) and ensure the code is modular so I can easily integrate it with my Spring Boot API Gateway later.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cakedelight-sweet-order.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b1b20f4d-ae3a-40dc-826e-30b4b554329b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
