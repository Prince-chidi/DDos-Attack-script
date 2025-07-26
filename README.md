
---

## README.md

### Web Form Load Testing Tool (Educational Use Only)

> **Disclaimer:** This tool is intended for **authorized performance testing only**. You must have explicit permission to test any website or server using this script. Unauthorized use against third-party services is illegal and unethical.

---

### 📌 Features

* Simulate multiple concurrent browser instances (bots).
* Automate form input and submission using [Puppeteer](https://pptr.dev/).
* Rotate proxies for distributed testing.
* Adjustable attack rate:

  * Configure **number of bots**.
  * Set **iterations per bot**.
* Designed to measure how well a form submission endpoint handles load.

---

### ⚠️ Legal Notice

* Only use this tool on **websites you own or have permission to test**.
* Do **NOT** use this for DDoS or spamming. This is strictly for **educational and security testing purposes**.

---

### 🚀 Installation

```bash
git clone <your-repo-url>
cd your-repo
npm install
```

---

### 🛠️ Usage

1. **Configure Target**

   * Open `server.js`
   * Set your target URL:

     ```js
     const targetURL = "https://your-website.com/form";
     ```
   * Update input and button selectors for the form:

     ```js
     const attackAction = {
       input: 'textarea[name="message"]',
       button: 'button[name="submit"]',
     };
     ```

2. **Run the Test**

   ```bash
   node server.js
   ```

   * Default launches **10 bots**, each performing **10 iterations**.

3. **Adjust Parameters**

   * Change number of bots:

     ```js
     startAttackProcesses(20); // 20 concurrent bots
     ```
   * Change iterations per bot inside `attack()`:

     ```js
     attack(targetURL, attackAction, 50); // 50 iterations per bot
     ```

---

### 🔧 Configuration

* **Proxies:** Update the proxy list inside `server.js`.
* **User-Agent:** Modify the UA string for more realistic simulations.

---

### 📊 Use Cases

* Load testing form endpoints.
* Stress-testing server capacity under simulated user traffic.
* Educational purposes for understanding concurrency and rate-limiting.

---
