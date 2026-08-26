import { execSync } from "child_process";

function run(cmd) {
  try {
    return execSync(cmd, { stdio: "inherit", encoding: "utf-8" });
  } catch (err) {
    return null;
  }
}

function runOutput(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8" }).trim();
  } catch (err) {
    return "";
  }
}

console.log("🔄 Fetching latest updates from GitHub...");
const branch = runOutput("git branch --show-current") || "main";

try {
  run(`git pull origin ${branch}`);
  console.log("✅ Successfully updated local files from GitHub!");
} catch (err) {
  console.error("❌ Failed to pull updates. Please check your network or resolve merge conflicts.");
}
