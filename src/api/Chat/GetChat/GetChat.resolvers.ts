import Chat from "../../../entities/Chat";
import User from "../../../entities/User";
import { GetChatQueryArgs, GetChatResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetChat: privateResolver(
      async (_, args: GetChatQueryArgs, { req }): Promise<GetChatResponse> => {
        const user: User = req.user;
        await User.update({ id: 1 }, { isRiding: false, isTaken: false });
        try {
          const chat = await Chat.findOne(
            {
              id: args.chatId
            },
            { relations: ["passenger", "driver"] }
          );
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              return {
                ok: true,
                error: null,
                chat
              };
            } else {
              return {
                ok: false,
                error: "Not authorized to see this chat",
                chat: null
              };
            }
          } else {
            return {
              ok: false,
              error: "Not found",
              chat: null
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            chat: null
          };
        }
      }
    )
  }
};

export default resolvers;
