import { Scene, SceneEnter, SceneLeave, Command, Hears } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';


@Scene('add_product_scene')
export class AddProductScene {
  @SceneEnter()
  onSceneEnter(): string {
    console.log('Enter to add_product_scene');
    return 'Welcome братишка add_product_scene';
  }

  @SceneLeave()
  onSceneLeave(): string {
    console.log('Leave from scene');
    return 'Пока пока';
  }

  @Hears('leave')
  async onLeaveCommand(ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }
}