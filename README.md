# webapp-estr2106

Webapp project for the ESTR2106 course: Building Web Applications.

## Deployment

<!-- TODO: Add deployment instructions -->
*cricket noises*

## Roadmap

✨ = Extra features

### General

- [ ] ✨ Use TypeScript for basically everything, React TSX, Motion for animations
- [ ] free stockphotos from <https://picsum.photos/>

### Backend

API endpoint `/api/`

- [ ] Parser for XML data from <https://data.gov.hk/en-data/dataset/hk-lcsd-event-event-cultural>
    - [ ] Convert XML data to JSON
    - [ ] Store JSON data in MongoDB
    - [ ] Create relevant Schemas for MongoDB (see below)
    - [ ] *"get the real time information from API to database only once when the user
logins and loads your page."*
    - [ ] *"Show the last updated time clearly"*
    - [ ] Min 10 venues, each hosting at least 3 events. Handle: title, venue, date/time, description, presenter, location name, Latitude, Longitude. Only English required.

- [ ] User authentication
    - [ ] User Schema - `username, password, role, Sessions[Session], Favourites[Location]`
    - [ ] Session Schema - `User`
    - [ ] User registration endpoint
    - [ ] User login endpoint and cookie/session management
    - [ ] User logout endpoint
    - [ ] Use middleware to check if user is authenticated, if so, add user details to request object and pass to next middleware, else redirect to login page.
    - [ ] Add initializer script to add sample users to the database
    - [ ] ✨ use MongoDB for [session storage](https://medium.com/front-end-weekly/make-sessions-work-with-express-js-using-mongodb-62a8a3423ef5)
    - [ ] ✨ Consider using [password hashing](https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1)

- [ ] CRUD endpoints for Locations, Events, Users, Comments
    - [ ] Location Schema - `name, latitude, longitude, events[Event], Categories[Category]`
    - [ ] Category Schema - `name, Locations[Location]`
    - [ ] Event Schema - `title, Location/Venue, date/time, description, presenter, comments[Comment]` + ✨ `likes[User]`
    - [ ] Comment Schema - `user, text, date, Event,` + ✨ `likes[User]`
    - [ ] GET allowed for all users
    - [ ] POST, PUT, DELETE allowed for Admins
    - [ ] Like/Unlike endpoints for Events and Comments
    - [ ] Favorite/Unfavorite endpoints for Users
    - [ ] New Comment endpoint for Events
    - [ ] ✨ serverside comments sanitization, allow for html input
    - [ ] ✨ GraphQL API for CRUD operations?

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
    - [ ] Form validation for username and password.
    - [ ] Error handling for invalid credentials.
    - [ ] Redirect on successful login.
    - [ ] Logout functionality.
- [ ] Use [react-data-table-component](https://www.npmjs.com/package/react-data-table-component) for table
- [ ] Location List Page
    - [ ] Dynamic table listing all locations.
    - [ ] Implement sorting (by event count) and filtering (categories, distance).
    - [ ] Add search bar to find locations by keyword.
    - [ ] Link each location to its details page.
- [ ] Map View
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
