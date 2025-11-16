// src/types/discord.d.ts
// Extends the Discord.js Client type to include a strongly typed commands collection

import {
  Client,
  Collection,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

// Strongly typed Command interface
export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

// Module augmentation to extend Client
declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}
