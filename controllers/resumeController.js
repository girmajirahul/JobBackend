const puppeteer = require("puppeteer");
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

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "domcontentloaded"
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf"
    });

    res.send(pdfBuffer);

  } catch (error) {

    console.error("PDF Error:", error);

    res.status(500).json({
      message: "Failed to generate resume"
    });

  } finally {

    if (browser) {
      await browser.close(); // ✅ ALWAYS CLOSE
    }

  }

};