# webapp-estr2106

Webapp project for the ESTR2106 course: Building Web Applications.

## Organization

### Backend

Backend and API related code is in the `src/api` directory. [`index.ts`](src/api/index.ts) contains the entrypoint of the api. You may make a new script in the `src/api` directory and import it in [`index.ts`](src/api/index.ts) to add new routes. All API routes will by default be prefixed with `/api/` on the server. (See [`server.ts`](server.ts)).

### Frontend

Any paths not caught by the API will be served by the frontend. Frontend code is in `src/`. The entrypoint of the frontend is [`main.tsx`](src/main.tsx). You may add new pages by creating a new folder in `src` and adding a new route in [`main.tsx`](src/main.tsx). Components used in multiple pages can be placed in the `src/components` directory.

## Deployment

Start MongoDB server:

```bash
docker-compose up -d
```

Alternatively you can start the MongoDB using MongoDB Compass or the MongoDB shell as long as the connection url is `mongodb://127.0.0.1:27017/`.

Start development server:

```bash
npm run dev
```

## Roadmap

✨ = Extra features

### General

- [ ] ✨ Use TypeScript for basically everything, React TSX, Motion for animations
- [ ] free stockphotos from <https://picsum.photos/>

### Backend

API endpoint `/api/`

- [x] Parser for XML data from <https://data.gov.hk/en-data/dataset/hk-lcsd-event-event-cultural>
    - [x] Convert XML data to JSON
    - [x] Store JSON data in MongoDB
    - [x] Create relevant Schemas for MongoDB (see below)
    - [-] *"get the real time information from API to database only once when the user
logins and loads your page."* (*currently only on admin request*)
    - [-] *"Show the last updated time clearly"* (*Last update time API built*)
    - [x] Min 10 venues, each hosting at least 3 events. Handle: title, venue, date/time, description, presenter, location name, Latitude, Longitude. Only English required.

- [ ] User authentication
    - [-] User Schema - `username, password, role, Sessions[Session], Favourites[Location]` (*Favourites not implemented*)
    - [x] Session Schema - `User`
    - [x] User registration endpoint
    - [x] User login endpoint and cookie/session management
    - [x] User logout endpoint
    - [x] Use middleware to check if user is authenticated, if so, add user details to request object and pass to next middleware, else redirect to login page.
    - [x] Add initializer script to add sample users to the database
    - [x] ✨ use MongoDB for [session storage](https://medium.com/front-end-weekly/make-sessions-work-with-express-js-using-mongodb-62a8a3423ef5)
    - [x] ✨ Consider using [password hashing](https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1)

- [ ] CRUD endpoints for Locations, Events, Users, Comments
    - [-] Location Schema - `name, latitude, longitude, events[Event], Categories[Category]`
    - [x] Category Schema - `name, Locations[Location]`
    - [-] Event Schema - `title, Location/Venue, date/time, description, presenter, comments[Comment]` + ✨ `likes[User]`
    - [-] Comment Schema - `user, text, date, Event,` + ✨ `likes[User]`
    - [x] GET allowed for all users
    - [x] POST, PUT, DELETE allowed for Admins
    - [ ] Like/Unlike endpoints for Events and Comments
    - [ ] Favorite/Unfavorite endpoints for Users
    - [x] New Comment endpoint for Events
    - [x] ✨ serverside comments sanitization, allow for html input (`DOMPurify.sanitize` lol)
    - [x] ✨ GraphQL API for CRUD operations?

### Frontend

A lot of the below pages seem very repetitive, so we can probably create a generic page template and just pass in the data to display. Lets try out best to keep things functional and reusable.

- [ ] ✨ Animated transitions between pages, fluid animations of elements, use <https://motion.dev/>
- [ ] ✨ Dark/Light theme switch button
- [ ] ✨ Like button for Events
- [ ] ✨ Lazy loading of images, comments, events (basically everything) use react [Suspense](https://react.dev/reference/react/Suspense)
- [ ] ✨ Use TSX
- [ ] ✨ Use Bootstrap/SASS for styling
- [ ] Implement responsive design for different screen sizes.
- [ ] Login Page
    - [x] Form validation for username and password.
    - [x] Error handling for invalid credentials.
    - [x] Redirect on successful login.
    - [x] Logout functionality.
- [ ] Use [react-data-table-component](https://www.npmjs.com/package/react-data-table-component) for table
- [J] Location List Page
    - [ ] Dynamic table listing all locations.
    - [ ] Implement sorting (by event count) and filtering (categories, distance).
    - [ ] Add search bar to find locations by keyword.
    - [ ] Link each location to its details page.
- [J] Map View
    - [ ] Display all locations with pins on a map.
    - [ ] Enable hovering/clicking on pins to display location details.
    - [ ] Add zoom and pan functionalities for better navigation.
- [ ] Location Details Page
    - [ ] Display location details (name, description, events, etc.).
    - [ ] Show a map with the location pinned using Google Maps API.
    - [ ] List upcoming events hosted at the location.
    - [ ] Enable user comments with a form to add new comments.
    - [ ] Allow liking and favoriting the location.
    - [ ] Add breadcrumbs or navigation links for a better user flow.
- [ ] Events List Page
    - [ ] Dynamic table listing all Events.
    - [ ] Implement sorting (by event count, distance, name) and filtering (categories, distance).
    - [ ] Add search bar to find Events by keyword.
    - [ ] Link each Events to its details page?
- [ ] Event Details Page?
- [ ] User Profile Page?
    - [ ] Display user details (username, role, favorites, etc.).
    - [ ] Show user's favorite locations.
- [ ] Admin User Management Page
    - [ ] Table listing all users with options to edit/delete.
    - [ ] Enable searching users by name.
    - [ ] Add form for creating new users.
- [ ] Admin Location Management Page
    - [ ] Table listing all locations with edit/delete options.
    - [ ] Form for creating or editing location details.
- [ ] Admin Event Management Page
    - [ ] Table listing all events with edit/delete options.
    - [ ] Form for creating or editing events.
- [ ] Error pages?
