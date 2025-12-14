const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API_URL = isLocal
    ? "http://localhost:5000/api"
    : "https://sweet-shop-cvab.onrender.com/api";
// const API_URL = "http://localhost:5000/api";

export default API_URL;