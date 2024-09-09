import { HomeScene } from "./src/modules/hello.module/home.scene";
import { PostingScene } from "./src/modules/posting.module/posting.scene";
import { RegistrationScene } from "./src/modules/registration.module/registration.scene";

export enum SceneEnum {
  Home = "home",
  Registration = "/registration",
  // Users = "/users",
  // Settings = "settings",
  // Notifications = "notifications",

  // Posting = "posting",
}

export interface iScene {
  name: SceneEnum;
  nextScenes: SceneEnum[] | null;
  prevScene: SceneEnum | null;
  enter: () => void;
}

// export class AllScenes {
//   public readonly HomeScene = HomeScene;
//   public readonly PostingScene = PostingScene;

//   public allScenes: iScene[] = [
//     {
//       name: SceneEnum.Home,
//       nextScenes: [SceneEnum.Users, SceneEnum.Settings, SceneEnum.Posting],
//       prevScene: null,
//       // module: HomeScene,
//       enter: this.HomeScene.enter,
//     },
//     {
//       name: SceneEnum.Posting,
//       nextScenes: null,
//       prevScene: SceneEnum.Home,
//       // module: PostingScene,
//       enter: this.PostingScene.enter,
//     },
//     {
//       name: SceneEnum.Users,
//       nextScenes: null,
//       prevScene: SceneEnum.Home,
//       // module: HomeScene,
//       enter: this.HomeScene.enter,
//     },
//     {
//       name: SceneEnum.Notifications,
//       nextScenes: null,
//       prevScene: SceneEnum.Settings,
//       // module: HomeScene,
//       enter: this.HomeScene.enter,
//     },
//     {
//       name: SceneEnum.Language,
//       nextScenes: null,
//       prevScene: SceneEnum.Settings,
//       // module: HomeScene,
//       enter: this.HomeScene.enter,
//     },
//     {
//       name: SceneEnum.Theme,
//       nextScenes: null,
//       prevScene: SceneEnum.Settings,
//       // module: HomeScene,
//       enter: this.HomeScene.enter,
//     },
//     {
//       name: SceneEnum.Settings,
//       nextScenes: [
//         SceneEnum.Notifications,
//         SceneEnum.Language,
//         SceneEnum.Theme,
//       ],
//       prevScene: SceneEnum.Home,
//       // module: HomeScene,
//       enter: this.HomeScene.enter,
//     },
//   ];
// }


export class AllScenes {
  public readonly HomeScene = HomeScene;
  public readonly RegistrationScene = RegistrationScene;

  public allScenes: iScene[] = [
    {
      name: SceneEnum.Home,
      nextScenes: [SceneEnum.Registration],
      prevScene: null,
      // module: HomeScene,
      enter: this.HomeScene.enter,
    },
    {
      name: SceneEnum.Registration,
      nextScenes: null,
      prevScene: SceneEnum.Home,
      // module: PostingScene,
      enter: this.RegistrationScene.enter,
    }
  ];
}
