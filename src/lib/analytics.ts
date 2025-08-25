import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-KQ7PCDRFQG"; // Replace with your actual ID

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logPageView = () => {
  ReactGA.send("pageview");
};
