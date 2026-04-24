// scripts/auto-update.cjs
// Run: node scripts/auto-update.cjs
// Updates every 30 seconds during the draft

const { execSync } = require("child_process");

const INTERVAL = 30000; // 30 seconds

async function run() {
  const time = new Date().toLocaleTimeString();
  console.log(`\n[${time}] Checking for new picks...`);

  try {
    execSync("node scripts/fetch-picks.cjs", { stdio: "inherit" });
    execSync("node scripts/apply-picks.cjs", { stdio: "inherit" });

    // Only commit and push if data changed
    const status = execSync("git status --porcelain data/").toString().trim();
    if (status) {
      execSync("git add data/", { stdio: "inherit" });
      execSync(`git commit -m "Live pick update ${time}"`, {
        stdio: "inherit",
      });
      execSync("git push", { stdio: "inherit" });
      console.log("✅ Pushed new picks to site");
    } else {
      console.log("⏳ No new picks yet");
    }
  } catch (err) {
    console.log("⚠️  Error:", err.message);
  }
}

console.log("🏈 Auto-updater started — checking every 30 seconds");
console.log("Press Ctrl+C to stop\n");

run();
setInterval(run, INTERVAL);
