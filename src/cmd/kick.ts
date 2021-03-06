import { Message } from "discord.js";
import { lang } from "../app";
import { envConf } from "../settings";

export async function kickMember(message: Message) {
    await message.delete().catch((err: any) => console.error(err));
    if (message.author.id != envConf.OwnerID) return;

    const args = message.content.split(" ");

    if (!args[1]) {
        const msg = await message.channel.send(lang.moderation.noUser);
        await msg
            .delete({ timeout: 60000 })
            .catch((err: any) => console.error(err));

        return;
    }

    const user = message.mentions.users.first();
    const reason = args[2] ? args[2] : lang.moderation.noReason;
    const member = message.guild.member(user);
    const typeStaff = args[0].includes("kick")
        ? lang.moderation.kick
        : undefined;
    const typeUser = args[0].includes("kick")
        ? lang.moderation.kickU
        : undefined;

    if (member.hasPermission("ADMINISTRATOR")) {
        const blockAction = lang.moderation.staff.replace(
            "{{ action }}",
            typeStaff
        );

        const msg = await message.channel.send(blockAction);
        await msg
            .delete({ timeout: 60000 })
            .catch((err: any) => console.error(err));

        return;
    }

    const kickMessage = lang.moderation.action
        .replace("{{ action }}", typeUser)
        .replace("{{ reason }}", reason);

    member.send(kickMessage).catch((err: any) => console.error(err));
    member.kick().catch((err) => console.error(err));
}
