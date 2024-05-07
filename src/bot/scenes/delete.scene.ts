import { Scene, SceneEnter, SceneLeave, Command, Hears } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';


@Scene('delete_product_scene')
export class DeleteProductScene {
  @SceneEnter()
  onSceneEnter(): string {
    console.log('Enter to delete_product_scene');
    return 'Welcome братишка';
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