import { MessageType, Sender } from "../sender";
import { UserDb } from "../../db.utils/user.utils";
import { SceneNavigator } from "../../../SceneNavigator";
import { SessionManager } from "../../../SessionManager";
import { SceneEnum } from "../../../scenesList";

export class HomeService {
  constructor(
    private readonly userDb: UserDb,
    private readonly sender: Sender,
    private readonly sceneNavigator: SceneNavigator,
    private readonly sessionManager: SessionManager,
  ) {
    this.userDb = userDb;
    this.sender = sender;
    this.sessionManager = sessionManager;
    this.sceneNavigator = sceneNavigator;
  }

  async handleStart(message: MessageType) {
    const chatId = message.chat.id;

    await this.sessionManager.initSession(chatId);

    const user = await this.userDb.getUser(chatId);

    if (user) {
      await this.sender.sendText(chatId, "Welcome back!");
    } else {
      await this.userDb.createUser(chatId);
      await this.sender.sendText(chatId, "Welcome, nice to see you!");
    }

    await this.sendLocalStageKeyboard(chatId);
  }

  async handleKeyboard(message: MessageType) {
    const chatId = message.chat.id;

    const availableSceneNames =
      await this.sceneNavigator.getAvailableNextScenes(chatId);

    if (message.text === "Back") {
      this.sceneNavigator.goBack(chatId);
    } else if (availableSceneNames.includes(message.text as SceneEnum)) {
      this.sceneNavigator.setScene(chatId, message.text as SceneEnum);
    } else {
      await this.sender.sendText(chatId, "Invalid option");
    }

    await this.sendLocalStageKeyboard(chatId);
  }

  async handleUsers(message: MessageType) {
    const chatId = message.chat.id;

    try {
      const users = await this.userDb.getAllUsers();

      await this.sender.sendText(chatId, `Users: ${users.length}`);
    } catch (error) {
      await this.sender.sendText(chatId, `Error: ${error}`);
    }
  }

  private async sendLocalStageKeyboard(chatId: number) {
    await this.sceneNavigator.sendStagenavigationKeyboard(
      chatId,
      this.sender,
      "Choose a scene",
    );
  }
}
