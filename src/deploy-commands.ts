import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

// Charger les commandes .ts
const commands: any[] = [];
const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`⚠️ Command '${file}' is missing "data" or "execute".`);
  }
}

// REST instance
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

async function deploy() {
  try {
    console.log("🚀 Deploying **GUILD** slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID!
      ),
      { body: commands }
    );

    console.log("✔ Guild commands deployed successfully.");
  } catch (err) {
    console.error("❌ Deployment error:", err);
  }
}

deploy();
