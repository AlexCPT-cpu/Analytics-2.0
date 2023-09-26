// lib/moralis.js
import { moralisKey } from 'src/config/index';
import Moralis from 'moralis';

let isMoralisStarted = false; // Flag to track module start

const initMoralis = async () => {
  if (!isMoralisStarted) {
    await Moralis.start({
      apiKey: moralisKey,
    });
    isMoralisStarted = true; // Set the flag to true once started
  }
};

export default initMoralis;
