import { Client, GatewayIntentBits, Message, PermissionFlagsBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const PREFIX = "!rr";
const CHAMBERS = 6; // 1 in 6 chance, like a revolver

// Messages for when the target survives
const SURVIVE_MESSAGES = [
  "🎰 *click* ... The chamber was empty. **{user}** lives to see another day.",
  "😅 *click* ... Nothing happened. **{user}** got lucky this time.",
  "🍀 The revolver clicks harmlessly. **{user}** survives!",
  "💨 *click* ... Fate smiles upon **{user}**. They're safe... for now.",
  "🎲 Lady Luck favors **{user}** today. The chamber was empty.",
  "😮‍💨 *click* ... **{user}** wipes the sweat from their brow. They live!",
];

// Messages for when the target gets hit
const DEATH_MESSAGES = [
  "💥 **BANG!** The revolver fires! **{user}** has been sent to the shadow realm.",
  "☠️ **BANG!** RIP **{user}**. They weren't so lucky after all.",
  "💀 *BANG* ... **{user}** has met their fate. Goodbye, friend.",
  "🔫 **BANG!** And just like that, **{user}** is gone. F in the chat.",
  "⚰️ **BANG!** The odds were not in **{user}**'s favor. They have been eliminated.",
  "🪦 **BANG!** **{user}** rolled the dice and lost. Rest in pieces.",
];

function getRandomMessage(messages: string[], username: string): string {
  const message = messages[Math.floor(Math.random() * messages.length)];
  return message.replace("{user}", username);
}

function pullTrigger(): boolean {
  // Returns true if the "bullet" is in the chamber (1 in CHAMBERS chance)
  return Math.floor(Math.random() * CHAMBERS) === 0;
}

client.once("ready", () => {
  console.log(`🎰 Russian Roulette Bot is online as ${client.user?.tag}`);
  console.log(`Loaded with ${CHAMBERS} chambers (1/${CHAMBERS} chance to hit)`);
});

client.on("messageCreate", async (message: Message) => {
  // Ignore bots and DMs
  if (message.author.bot || !message.guild) return;

  // Check if message starts with the command prefix
  if (!message.content.startsWith(PREFIX)) return;

  // Get the mentioned user
  const target = message.mentions.members?.first();

  if (!target) {
    await message.reply("🎯 You need to mention someone to play! Usage: `!rr @user`");
    return;
  }

  // Don't allow targeting bots
  if (target.user.bot) {
    await message.reply("🤖 You can't play Russian Roulette with a bot!");
    return;
  }

  // Check if the bot has permission to ban
  const botMember = message.guild.members.me;
  if (!botMember?.permissions.has(PermissionFlagsBits.BanMembers)) {
    await message.reply("⚠️ I don't have permission to ban members!");
    return;
  }

  // Check if the target is bannable (not owner, bot has higher role, etc.)
  if (!target.bannable) {
    await message.reply(
      "🛡️ I can't ban this person! They might be the server owner or have a higher role than me."
    );
    return;
  }

  // Pull the trigger!
  const isHit = pullTrigger();

  if (isHit) {
    // They got hit - ban them!
    try {
      await target.ban({ reason: "Lost at Russian Roulette 🎰" });
      await message.reply(getRandomMessage(DEATH_MESSAGES, target.user.username));
    } catch (error) {
      console.error("Failed to ban user:", error);
      await message.reply("💥 The gun fired but... something went wrong with the ban!");
    }
  } else {
    // They survived
    await message.reply(getRandomMessage(SURVIVE_MESSAGES, target.user.username));
  }
});

// Validate that we have a token
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("❌ Error: DISCORD_TOKEN is not set in .env file!");
  process.exit(1);
}

client.login(token);
