/* This code provides a service worker for the code in 'caching.js' */
document.addEventListener("DOMContentLoaded", event => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("/js/caching.js")
      .then(registration => console.log("The service worker was registered correctly", registration))
      .catch(error => console.log("There was an error with the service worker registration", error));
  }
});