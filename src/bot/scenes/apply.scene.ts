import { Scene, SceneEnter, SceneLeave, Ctx, Action } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';
import { Markup } from 'telegraf';
import { isAllowedToEnterScene } from '../app.utils';

@Scene('apply_scene')
export class ApplyScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    console.log('Enter to apply_scene');
    await ctx.reply(
      'Привет! Это бот-помощник в твоей инвертизации! Чтобы начать работу, нажми на кнопку ниже',
      Markup.inlineKeyboard([
        Markup.button.callback('Начать работу', 'start_work')
      ])
    );
  }

  @SceneLeave()
  async onSceneLeave(): Promise<void> {
    console.log('Leave from apply_scene');
  }

  @Action('start_work')
  async onStartWork(@Ctx() ctx: Context2): Promise<void> {
    const userId = ctx.message?.chat?.id.toString() || ctx.callbackQuery?.from?.id.toString();

    if (isAllowedToEnterScene('edit_product_scene', userId) ||
        isAllowedToEnterScene('add_product_scene', userId) ||
        isAllowedToEnterScene('delete_product_scene', userId) ||
        isAllowedToEnterScene('info_product_scene', userId)) {
      await ctx.scene.enter('greeting_scene');
    } else {
      await ctx.reply('У вас нет доступа!');
    }
  }
}