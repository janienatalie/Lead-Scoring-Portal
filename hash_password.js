import bcrypt from "bcryptjs";

// GANTI password ini dengan password asli yang ingin kamu hash
const plainPassword = "janie123";

async function generateHash() {
  try {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(plainPassword, saltRounds);

    console.log("Password asli :", plainPassword);
    console.log("Password hash :", hashed);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

generateHash();
