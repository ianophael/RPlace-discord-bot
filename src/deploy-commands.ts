// src/deploy-commands.ts
// Registers slash commands globally or in a specific guild
// Run this file manually: `ts-node src/deploy-commands.ts`

import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';

config();

if (!process.env.DISCORD_TOKEN) throw new Error('DISCORD_TOKEN missing');
if (!process.env.CLIENT_ID) throw new Error('CLIENT_ID missing');

// Optional: register commands to a dev guild for faster propagation
// Put GUILD_ID in your .env if you want instant updates
const guildId = process.env.GUILD_ID;

const commands: unknown[] = [];
const commandsPath = path.join(__dirname, 'commands');

// Accept both .ts and .js files (ts-node or compiled build)
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command) {
    commands.push(command.data.toJSON());
    console.log(`Loaded for deployment: ${command.data.name}`);
  } else {
    console.warn(`⚠️ Command ${file} is missing 'data' property.`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function deploy() {
  try {
    if (guildId) {
      console.log(`Deploying commands to guild ${guildId}...`);
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID!, guildId),
        { body: commands }
      );
      console.log('Guild commands deployed ✔️');
    } else {
      console.log('Deploying GLOBAL commands...');
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
        body: commands,
      });
      console.log('Global commands deployed ✔️');
    }
  } catch (error) {
    console.error('❌ Deployment error:', error);
  }
}

deploy();
