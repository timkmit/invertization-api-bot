import { Scene, SceneEnter, SceneLeave, Command, Hears } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';


@Scene('edit_product_scene')
export class EditProductScene {
  @SceneEnter()
  onSceneEnter(): string {
    console.log('Enter to edit_product_scene');
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