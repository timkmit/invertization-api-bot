import { Scene, SceneEnter, SceneLeave, Hears } from 'nestjs-telegraf';
import { Context, Context2 } from '../context.interface';


@Scene('greetengscene')
export class RandomNumberScene {
  @SceneEnter()
  onSceneEnter(): string {
    console.log('Enter to greetengscene');
    return 'Welcome братишка greetengscene';
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