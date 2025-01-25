import { HomeScene } from "./src/modules/hello.module/home.scene";

export enum SceneEnum {
  Home = "home",
  Users = "/users",
  Settings = "settings",
  Notifications = "notifications",
  Language = "language",
  Theme = "theme",
}

export interface iScene {
  name: SceneEnum;
  nextScenes: SceneEnum[] | null;
  prevScene: SceneEnum | null;
  enter: () => void;
}

export class AllScenes {
  public readonly HomeScene = HomeScene;

  public allScenes: iScene[] = [
    {
      name: SceneEnum.Home,
      nextScenes: [SceneEnum.Users, SceneEnum.Settings],
      prevScene: null,

      enter: this.HomeScene.enter,
    },

    {
      name: SceneEnum.Users,
      nextScenes: null,
      prevScene: SceneEnum.Home,

      enter: this.HomeScene.enter,
    },
    {
      name: SceneEnum.Notifications,
      nextScenes: null,
      prevScene: SceneEnum.Settings,
      enter: this.HomeScene.enter,
    },
    {
      name: SceneEnum.Language,
      nextScenes: null,
      prevScene: SceneEnum.Settings,
      enter: this.HomeScene.enter,
    },
    {
      name: SceneEnum.Theme,
      nextScenes: null,
      prevScene: SceneEnum.Settings,
      enter: this.HomeScene.enter,
    },
    {
      name: SceneEnum.Settings,
      nextScenes: [
        SceneEnum.Notifications,
        SceneEnum.Language,
        SceneEnum.Theme,
      ],
      prevScene: SceneEnum.Home,
      enter: this.HomeScene.enter,
    },
  ];
}
