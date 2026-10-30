import { stdin, stdout } from "node:process";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

function prompt(label, { hidden = false } = {}) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    return Promise.reject(new Error("Run this command in an interactive terminal."));
  }

  return new Promise((resolve, reject) => {
    let answer = "";
    stdout.write(label);
    stdin.setRawMode(true);
    stdin.resume();

    const finish = (error) => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write("\n");
      if (error) reject(error);
      else resolve(answer);
    };

    const onData = (chunk) => {
      for (const character of chunk.toString("utf8")) {
        if (character === "\u0003" || character === "\u0004") {
          finish(new Error("Cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f" || character === "\b") {
          answer = Array.from(answer).slice(0, -1).join("");
          stdout.write("\b \b");
          continue;
        }
        if (character >= " " && character !== "\u007f") {
          answer += character;
          stdout.write(hidden ? "*" : character);
        }
      }
    };

    stdin.on("data", onData);
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured for this environment.");
  }

  const enteredUsername = (await prompt("Admin username (default AdminNempo): ")).trim();
  const username = enteredUsername || "AdminNempo";
  if (username.length > 80 || /[\r\n\0]/.test(username)) {
    throw new Error("Username must be 1–80 characters and cannot contain line breaks.");
  }

  const password = await prompt("New password (12–72 UTF-8 bytes): ", { hidden: true });
  if (Buffer.byteLength(password, "utf8") < 12 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error("Password must be between 12 and 72 UTF-8 bytes.");
  }

  const confirmation = await prompt("Re-enter password: ", { hidden: true });
  if (password !== confirmation) {
    throw new Error("Passwords do not match.");
  }

  const confirmAccount = await prompt(`Type SET to create/reset "${username}": `);
  if (confirmAccount !== "SET") {
    throw new Error("Cancelled. No account was changed.");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO admin_users (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username)
       DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING username`,
      [username, passwordHash],
    );
    console.log(`Admin password set for ${rows[0].username}. The password was not printed.`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
