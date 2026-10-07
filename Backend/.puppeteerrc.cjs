const { join } = require("path");

/**
 * On Render, keep Puppeteer's downloaded Chrome inside the project folder.
 * The default cache (~/.cache/puppeteer) is filled during the build but isn't
 * available at runtime there, so puppeteer.launch() can't find Chrome.
 * Render sets RENDER=true for both the build and the running service.
 * Locally the default cache is used.
 * @type {import("puppeteer").Configuration}
 */
module.exports = process.env.RENDER
  ? { cacheDirectory: join(__dirname, ".cache", "puppeteer") }
  : {};
