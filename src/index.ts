import {
  Client,
  Collection,
  GatewayIntentBits,
  Events,
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
} from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

// ---- Type augmentation ----
declare module "discord.js" {
  interface Client {
    commands: Collection<string, SlashCommand>;
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

// Load commands (.ts)
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    console.log(`✔ Loaded /${command.data.name}`);
  } else {
    console.warn(`⚠ Command ${file} is missing data or execute.`);
  }
}

// Ready event
client.once(Events.ClientReady, ready => {
  console.log(`🚀 Logged in as ${ready.user.tag}`);
});

// Interaction event with logs
client.on(Events.InteractionCreate, async i => {
  console.log("🔵 Interaction received:", {
    type: i.type,
    command: i.isChatInputCommand() ? i.commandName : "not a command",
  });

  if (!i.isChatInputCommand()) return;

  const cmd = client.commands.get(i.commandName);

  if (!cmd) {
    console.log("❌ No command found for", i.commandName);
    return;
  }

  console.log("🟢 Executing command:", i.commandName);

  try {
    await cmd.execute(i);
  } catch (err) {
    console.error("❌ Error while executing command:", err);
    try {
      await i.reply({
        content: "❌ Internal error.",
        ephemeral: true,
      });
    } catch {}
  }
});

client.login(process.env.TOKEN);
