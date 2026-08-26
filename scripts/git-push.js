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

// 1. Check if git repo exists
const isGit = runOutput("git rev-parse --is-inside-work-tree");
if (!isGit) {
  console.log("📦 Initializing git repository...");
  run("git init");
  run("git branch -M main");
}

// 2. Add all changes
console.log("📝 Staging changes (git add .)...");
run("git add .");

// 3. Check status
const status = runOutput("git status --porcelain");
if (!status) {
  console.log("✨ No changes to commit. Working tree is clean.");
} else {
  // Custom message or timestamp
  const customMsg = process.argv.slice(2).join(" ");
  const timestamp = new Date().toLocaleString();
  const commitMsg = customMsg || `Auto-update: ${timestamp}`;

  console.log(`💾 Committing changes: "${commitMsg}"...`);
  run(`git commit -m "${commitMsg}"`);
}

// 4. Check remote
const remotes = runOutput("git remote");
if (!remotes) {
  console.log("\n⚠️  No GitHub remote configured yet!");
  console.log("👉 To connect your GitHub repo, run:");
  console.log("   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git");
  console.log("   git push -u origin main\n");
} else {
  const branch = runOutput("git branch --show-current") || "main";
  console.log(`🚀 Pushing to origin/${branch}...`);
  run(`git push -u origin ${branch}`);
  console.log("✅ Successfully pushed all changes to GitHub!");
}
