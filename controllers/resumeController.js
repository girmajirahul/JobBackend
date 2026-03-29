const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const User = require("../models/User");
const generateHTML = require("../utils/resumeTemplate");

exports.generateResume = async (req, res) => {
  let browser;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const html = generateHTML(user);

    // 🔥 Detect environment
    const isLocal = process.env.NODE_ENV !== "production";

    browser = await puppeteer.launch(
      isLocal
        ? {
            // 👉 LOCAL (Windows)
            executablePath:
              "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            headless: true,
          }
        : {
            // 👉 VERCEL (Linux)
            args: [...chromium.args, "--no-sandbox"],
            executablePath: await chromium.executablePath(),
            headless: true,
          }
    );

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error("PDF Error:", error);

    res.status(500).json({
      message: error.message,
    });

  } finally {
    if (browser) await browser.close();
  }
};