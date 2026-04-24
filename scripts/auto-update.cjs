// scripts/auto-update.cjs
const { execSync } = require("child_process");

const INTERVAL = 30000;

async function run() {
  const time = new Date().toLocaleTimeString();
  console.log(`\n[${time}] Checking for new picks...`);

  try {
    // fetch-picks.cjs exits with code 1 if no new picks
    const result = execSync("node scripts/fetch-picks.cjs", {
      encoding: "utf8",
      stdio: "pipe",
    });

    console.log(result);

    // Only apply and push if new picks were found
    if (result.includes("Added") && !result.includes("Added 0")) {
      execSync("node scripts/apply-picks.cjs", { stdio: "inherit" });
      const status = execSync("git status --porcelain data/").toString().trim();
      if (status) {
        execSync("git add data/", { stdio: "inherit" });
        execSync(`git commit -m "Live pick update ${time}"`, {
          stdio: "inherit",
        });
        execSync("git push", { stdio: "inherit" });
        console.log("✅ Pushed new picks to site");
      }
    } else {
      console.log("⏳ No new picks yet");
    }
  } catch (err) {
    console.log("⚠️  Error:", err.message);
  }
}

console.log("🏈 Draft auto-updater running — checking every 30 seconds");
console.log("Press Ctrl+C to stop\n");

run();
setInterval(run, INTERVAL);
