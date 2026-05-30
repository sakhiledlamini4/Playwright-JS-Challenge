# 🧪 Test Automation Playwright JS Challenge Project Guide

This project contains automated tests for two different web applications using [Playwright](https://playwright.dev/) and [Monocart Reporter](https://www.npmjs.com/package/monocart-reporter):

- **Restful Booker** – API-level tests for booking scenarios  
- **Sauce Demo** – UI automation tests for an e-commerce demo app

---

## 🚀 Getting Started

### 1. **Clone the repository**
```sh
git clone https://github.com/sakhiledlamini4/Playwright-JS-Challenge.git
cd Playwright-JS-Challenge
```

2. **Install dependencies:**

Install dependencies in each project folder:
   ```sh
   cd Restful-Booker
   npm install

   cd ../Sauce-Demo
   npm install
   ```
   Note: Each project is isolated and has its own package.json and configuration.

3. **🧪 Running Tests**

✅ Restful Booker
   ```sh
   cd Restful-Booker
   npx playwright test
   ```
✅ Sauce Demo
   ```sh
   cd Sauce-Demo
   npx playwright test
   ```
✅ Restful Booker performance test with k6
   ```sh
   cd Restful-Booker
   k6 run ./k6/booker.js
   ```
4. **📊 Viewing the Monocart Test Report**
After tests run, Monocart generates an HTML report:
   ```sh
   npx monocart show-report monocart-report/index.html
   ```
Or simply open monocart-report/index.html in your browser.

## 📁 Project Structure
   ```sh
   repo-root/
├── Restful-Booker/
│   ├── tests/                # Playwright API tests
│   ├── test-data/            # JSON test payloads (e.g., booking.json)
│   ├── monocart-report/      # HTML test report (generated after tests run)
│   ├── playwright.config.js  # Playwright config with Monocart reporter
│   └── package.json
│
├── Sauce-Demo/
│   ├── tests/       # UI test scripts
         └── Authentication
         └── Checkout Process
         └── Inventory Management
         └── Shopping Cart         
│   ├── monocart-report/      # Test report for Sauce Demo
│   ├── playwright.config.js
│   └── package.json
│
└── .github/
    └── workflows/
        └── main.yml          # GitHub Actions CI/CD workflow
```

## Useful Commands
- `npx playwright install` - Install required Playwright browsers

## 🛠️ CI/CD Integration
GitHub Actions is set up to:

- Automatically install dependencies

- Run tests for either project (selectable via workflow dispatch)

- Upload HTML reports as artifacts

- You can trigger CI manually or via push/pull_request to main.

## 📚 Resources
For more information, see the 
- [Playwright Documentation](https://playwright.dev/docs/intro).
- [Monocart Reporter](https://www.npmjs.com/package/monocart-reporter).