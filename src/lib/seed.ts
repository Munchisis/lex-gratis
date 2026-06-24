/**
 * Seed script — creates the initial admin account.
 * Run once: npm run seed
 *
 * Usage:
 *   MONGODB_URI=<your-uri> npm run seed
 *
 * Or add to .env.local and run:
 *   npm run seed
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not set. Add it to .env.local");
  process.exit(1);
}

// Inline schema to avoid Next.js module issues in Node context
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true, unique: true, lowercase: true },
  password:         { type: String, required: true },
  role:             { type: String, enum: ["admin","lawyer"], required: true },
  specialisation:   { type: String, default: "" },
  isApproved:       { type: Boolean, default: true },
  barNumber:        { type: String, default: "" },
  state:            { type: String, default: "" },
  activeMatters:    { type: Number, default: 0 },
  completedMatters: { type: Number, default: 0 },
  proBonoHours:     { type: Number, default: 0 },
}, { timestamps: true });

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("✅  Connected to MongoDB");

  const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

  const existing = await User.findOne({ role: "admin" });
  if (existing) {
    console.log("ℹ️   Admin already exists:", existing.email);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@LexGratis1", 12);

  const admin = await User.create({
    name:       "HUMRI Admin",
    email:      "admin@lexgratis.ng",
    password:   hashedPassword,
    role:       "admin",
    isApproved: true,
  });

  console.log("✅  Admin account created:");
  console.log("    Email:   ", admin.email);
  console.log("    Password: Admin@LexGratis1");
  console.log("    ⚠️  Change this password immediately after first login!");

  await mongoose.disconnect();
  console.log("✅  Done.");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
