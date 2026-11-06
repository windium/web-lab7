// Fake login: there is no backend, so the credentials are checked here.
// This is only for the demo, real authentication comes later in the course.
const DEMO_USERNAME = "230408041@st.biruni.edu.tr";
const DEMO_PASSWORD = "demo123456";

export function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username.trim() === DEMO_USERNAME && password === DEMO_PASSWORD) {
        resolve({ username: DEMO_USERNAME });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 500);
  });
}
