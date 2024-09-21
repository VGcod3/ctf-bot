import { MessageType, Sender } from "../sender";
import { UserDb } from "../../db.utils/user.utils";
import { SceneNavigator } from "../../../SceneNavigator";
import { SessionManager } from "../../../SessionManager";
import { SceneEnum } from "../../../scenesList";
import { prisma } from "../../db.utils/prisma.client";
import { objectIdSchema } from "../../z.schemas/schema.ObjectID";
import { BACK } from "../../sharedText";

export class TeamJoinService {
  private readonly UserDb: UserDb;
  private readonly sender: Sender;
  private readonly sceneNavigator: SceneNavigator;
  private readonly sessionManager: SessionManager;

  constructor() {
    this.UserDb = new UserDb();
    this.sender = new Sender();

    this.sessionManager = new SessionManager(this.UserDb);
    this.sceneNavigator = new SceneNavigator(this.sessionManager);
  }

  async handleKeyboard(message: MessageType) {
    const chatId = message.chat.id;
    const enteredText = message.text;

    if (enteredText === BACK) {
      this.sceneNavigator.goBack(chatId);
      this.sendLocalStageKeyboard(chatId, "Оберіть дію");
    } else {
      try {
        await this.joinTeam(enteredText, chatId);
      } catch (error) {
        await this.sender.sendText(
          chatId,
          "Сталася помилка. Спробуйте ще раз пізніше.",
        );
        await this.sceneNavigator.setScene(chatId, SceneEnum.Home);
        this.sendLocalStageKeyboard(chatId, "Оберіть дію");
      }
    }
  }

  private async joinTeam(teamId: string, chatId: number) {
    const parsedData = objectIdSchema.safeParse(teamId);

    if (!parsedData.success) {
      await this.sender.sendText(
        chatId,
        `Помилка: ${parsedData.error.errors[0].message}`,
      );
      return;
    }

    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        await this.sender.sendText(chatId, "Команду з таким ID не знайдено.");
        await this.sceneNavigator.setScene(chatId, SceneEnum.TeamHandle);
      } else {
        const members = await prisma.teamMember.findMany({
          where: {
            teamId: teamId,
          },
        });

        if (members.length >= 5) {
          await this.sender.sendText(chatId, "Команда вже заповнена");
          await this.sceneNavigator.setScene(chatId, SceneEnum.TeamHandle);
        } else {
          await this.sender.sendText(chatId, "Ви приєдналися до команди!");

          const user = await prisma.user.findUnique({
            where: {
              userId: chatId,
            },
          });
          await prisma.teamMember.update({
            where: {
              userId: user?.id,
            },
            data: {
              teamId: teamId,
            },
          });
          await this.sceneNavigator.setScene(chatId, SceneEnum.Home);
        }
      }
    } catch (error) {
      await this.sender.sendText(chatId, "Сталася помилка при пошуку команди.");
      await this.sceneNavigator.setScene(chatId, SceneEnum.Home);
    }
    await this.sendLocalStageKeyboard(chatId, "Оберіть дію");
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
  private async sendLocalStageKeyboard(chatId: number, text: string) {
    const currentScene = await this.sceneNavigator.getCurrentScene(chatId);
    const teamMember = await this.UserDb.getTeamMember(chatId);

    const availableScenesNames =
      await this.sceneNavigator.getAvailableNextScenes(chatId, teamMember);

    const scenesButtons = availableScenesNames.map((scene) => ({
      text: scene,
    }));

    const canGoBack = !!currentScene.prevScene;
    const allButtons = canGoBack
      ? [...scenesButtons, { text: BACK }]
      : scenesButtons;

    const keyboardButtons = this.chunkArray(allButtons, 2);
    await this.sender.sendKeyboard(chatId, text, keyboardButtons);
  }
}
