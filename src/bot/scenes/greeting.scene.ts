import { Scene, SceneEnter, SceneLeave, Hears } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';


@Scene('greeting_scene')
export class GreetingScene {
  @SceneEnter()
  onSceneEnter(): string {
    console.log('Enter to greetingscene');
    return 'Welcome братишка greetingscene';
  }

  @Hears('leave')
  async onLeaveCommand(ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }

  // @Hears('проверка')
  // async onTestCommand(ctx: Context) : Promise<void> {
  //   await ctx.reply('тестовое сообщение со сцены гритинг')
  // }

  @SceneLeave()
  onSceneLeave(): string {
    console.log('Leave from scene');
    return 'Пока пока';
  }

}