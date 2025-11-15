// src/commands/allo.ts
// This file defines a Discord slash command named "allo"
// When executed, it replies "à l'huile" in the current channel

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('allo')
  .setDescription('Renvoie "à l\'huile" dans le channel courant.');

export async function execute(interaction: ChatInputCommandInteraction) {
  // Reply directly in the channel where the interaction happens
  await interaction.reply("à l'huile");
}
