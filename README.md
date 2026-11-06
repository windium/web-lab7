# Assignment 7 - Mini Shop

CMP309 Web Programming, Fall 2026

A small online shop built with React and Vite. Products come from the
[DummyJSON](https://dummyjson.com) API. The app has client-side routing,
URL-based filters, a fake login with a protected cart page, a Zustand cart
that survives reloads, and a light/dark theme.

## Running the project

```bash
npm install
npm run dev
```

Demo account:

- Username: `230408041@st.biruni.edu.tr`
- Password: `demo123456`

## File organization

```
assignment7/
├─ src/
│  ├─ api/
│  │  ├─ productsApi.js     fetchProducts / fetchProduct, plain fetch + AbortSignal
│  │  └─ authApi.js         fake login(), resolves after ~500 ms
│  ├─ hooks/
│  │  ├─ useFetch.js        loading / error / data with useReducer, aborts old requests
│  │  └─ useLocalStorage.js useState-like hook that syncs with localStorage
│  ├─ context/
│  │  └─ AuthContext.jsx    AuthProvider + useAuth, reducer with LOGGED_IN / LOGGED_OUT
│  ├─ store/
│  │  └─ cartStore.js       Zustand cart store, selectors, localStorage subscription
│  ├─ components/
│  │  ├─ Layout.jsx         nav bar + <Outlet /> + footer, applies the theme class
│  │  ├─ NavBar.jsx         NavLinks, cart count, theme toggle, login/logout
│  │  ├─ ProductCard.jsx    one product in the grid
│  │  └─ ProtectedRoute.jsx redirects to /login when nobody is signed in
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ ProductList.jsx    /products, filters live in the query string
│  │  ├─ ProductDetail.jsx  /products/:id
│  │  ├─ Cart.jsx           /cart (protected)
│  │  ├─ Login.jsx          /login
│  │  └─ NotFound.jsx       any unknown path
│  ├─ App.jsx               route table
│  ├─ main.jsx              BrowserRouter + AuthProvider
│  └─ index.css             minimal styles and theme variables
├─ index.html
└─ package.json
```

### Routes

| Path            | Page          | Access          |
| --------------- | ------------- | --------------- |
| `/`             | Home          | Public          |
| `/products`     | ProductList   | Public          |
| `/products/:id` | ProductDetail | Public          |
| `/cart`         | Cart          | Signed-in users |
| `/login`        | Login         | Public          |
| `*`             | NotFound      | Public          |

All routes are children of one layout route, so they share the nav bar and
footer. `ProductList` and `ProductDetail` are nested under a `products` route.

## Reasoning questions

### 1. State choices

- **Signed-in user:** in `AuthContext` (Context + `useReducer`). Many parts of
  the app need to know who is logged in (nav bar, protected route, login page),
  and it changes very rarely, so Context is a good fit.
- **Cart:** in a Zustand store (`cartStore.js`). It changes often and is read
  from several places (nav bar count, cards, detail page, cart page). With
  selectors each component only re-renders for the part it uses.
- **Filter values:** in the URL query string (`?q=...&category=...`). This way
  the filtered view can be shared as a link, survives a refresh and works with
  the back button. Nothing is copied into state.
- **Product list:** local to the `ProductList` page through `useFetch`. It is
  server data that only this page needs, so it does not need to be global.
- **Theme:** in `Layout` with `useLocalStorage`. The layout wraps every page so
  it can put the theme class on the wrapper, and localStorage keeps the choice
  between visits.

### 2. Context versus store

The user changes only on login and logout, and almost every component that
reads it needs the whole value, so a Context re-render is cheap and rare. The
cart changes on every click. If the cart was in Context, every consumer would
re-render on each change because Context has no selectors, even the nav bar
when only a quantity changes and the count stays the same. Putting the user in
Zustand would work, but it adds an external store for something React already
handles well, and we would lose the clear provider boundary that `useAuth`
checks for.

### 3. Custom hooks

`useFetch` shares the **logic**: the reducer with loading / error / data, the
`AbortController`, ignoring `AbortError`, and the cleanup that aborts the old
request when the inputs change or the component unmounts. It does not share
**state**: every component that calls `useFetch` gets its own reducer, so
`ProductList` and `ProductDetail` have separate loading and data values and do
not see each other's results. There is also no caching between them.

### 4. Route parameters

`useParams()` always returns strings, so for `/products/3` the id is `"3"`,
not `3`. This mattered in `ProductDetail.jsx` for the previous / next product
links: `"3" + 1` would give `"31"`, so I convert it with `Number(id)` first and
only show the links when it is a positive integer. It also matters when
comparing with cart items, where the id is a number from the API.

### 5. Protected routes

`ProtectedRoute` only decides what to render in the browser. All of the code is
downloaded to the user anyway, the user can change state in DevTools, and the
"password" is visible in the JS bundle. It is a user-experience feature, not
security. To make it secure, the server must check identity: a real login
endpoint that checks the password on the server, returns a session cookie or
token, and every protected API request is checked on the server before it
returns any data.

### 6. Deep links

On a plain static file server, reloading `/products/3` makes the browser ask
the server for a file at `/products/3`. That file does not exist, so the server
returns a 404 and React never loads. The Vite dev server has an SPA fallback:
for unknown paths it returns `index.html`, the app starts, and React Router
reads the URL and shows the right page. In production the server must be
configured the same way (rewrite all unknown paths to `index.html`).

## Self-study notes

- **Updating one query parameter without losing the others.**
  `setSearchParams` from React Router accepts a function that gets the current
  params. In `ProductList.jsx` I copy them with `new URLSearchParams(prev)`,
  then `set` or `delete` only one key. So changing the category keeps the
  search text. I also pass `{ replace: true }` so typing in the search box does
  not add a history entry for every letter.
- **Initialising the store from localStorage safely.** `localStorage.getItem`
  returns `null` when the key is missing, `JSON.parse` throws on broken data,
  and the value could be valid JSON but in the wrong shape. `loadItems()` in
  `cartStore.js` handles all three: try/catch around the read and parse, check
  that it is an array, and filter out items without the right fields. Saving
  is done with `useCartStore.subscribe`, which is Zustand's way to listen to
  changes outside React, and it only writes when the `items` reference changes.
  I tested it by putting `{broken` into localStorage and reloading: the cart
  just starts empty.
- **Light/dark theme.** The colours are CSS custom properties defined on
  `.theme-light` and `.theme-dark`. `Layout` puts one of these classes on the
  wrapper `div`, and every other rule only uses `var(--bg)`, `var(--text)`
  etc. Switching the class switches all colours at once.

## Challenges

- **Aborted requests.** When moving quickly between products, or in
  StrictMode where effects run twice in development, the old request is
  aborted and rejects with an `AbortError`. If that were treated as a normal
  error the page would flash an error message, so `useFetch` ignores
  `AbortError`.
- **Not-found products.** `fetch` does not reject on a 404, so without a check
  an unknown id would try to render an error body as a product.
  `productsApi.js` checks `response.ok` and throws an error that keeps the
  status code, and the detail page shows "Product not found" for 404/400.
- **Login redirect and history.** The back button must not return to the
  login form after signing in. `<Navigate replace>` in `ProtectedRoute` and
  `navigate(..., { replace: true })` in `Login` handle that, and the original
  page is passed through `location.state.from`.
- **Nav bar re-renders.** Selecting the whole `items` array in the nav bar
  would re-render it on any cart change. Selecting the computed count (a
  number) means it only re-renders when the count is different.

