import "dotenv/config";
import bcrypt from "bcrypt";
import { query } from "./db.js";

// One-time script: run manually with `node src/seedAdmin.js`, never imported elsewhere.
const email = "sherylochiengtech@gmail.com"; // ← change to YOUR real email
const plainPassword = "jwt254@254"; // ← change to a real password you'll remember

async function seed() {
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await query(
    `INSERT INTO admin_users (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING`,
    [email, passwordHash]
  );

  console.log(`Admin account ready for ${email}`);
  process.exit(0);
}

seed();