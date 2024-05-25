import { Scene, SceneEnter, SceneLeave, Hears, Ctx } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';
import { Markup } from 'telegraf';
import { isAllowedToEnterScene } from '../app.utils';


@Scene('greeting_scene')
export class GreetingScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    console.log('Enter to greetingscene');
    await ctx.reply(
      'Главное меню',
      Markup.keyboard([
        ['🔎Найти товар', '✍️Изменить товар'], 
        ['✅Добавить товар', '❌Удалить товар'], 
      ]).resize()
    );
  }

  @Hears('leave')
  async onLeaveCommand(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.enter('greeting_scene');
  }

  @Hears('✍️Изменить товар')
  async onEditProduct(@Ctx() ctx: Context2): Promise<void> {
    if (isAllowedToEnterScene('edit_product_scene', ctx.message.chat.id.toString())) {
      await ctx.scene.enter('edit_product_scene');
    } else {
      ctx.reply('У вас нет прав перейти на эту сцену');
    }
  }

  @Hears('✅Добавить товар')
  async onAddProduct(@Ctx() ctx: Context2): Promise<void> {
    if (isAllowedToEnterScene('add_product_scene', ctx.message.chat.id.toString())) {
      await ctx.scene.enter('add_product_scene');
    } else {
      ctx.reply('У вас нет прав перейти на эту сцену');
    }
  }

  @Hears('❌Удалить товар')
  async onDeleteProduct(@Ctx() ctx: Context2): Promise<void> {
    if (isAllowedToEnterScene('delete_product_scene', ctx.message.chat.id.toString())) {
      await ctx.scene.enter('delete_product_scene');
    } else {
      ctx.reply('У вас нет прав перейти на эту сцену');
    }
  }

  @Hears('🔎Найти товар')
  async onFindProduct(@Ctx() ctx: Context2): Promise<void> {
    if (isAllowedToEnterScene('info_product_scene', ctx.message.chat.id.toString())) {
      await ctx.scene.enter('info_product_scene');
    } else {
      ctx.reply('У вас нет прав перейти на эту сцену');
    }
  }
}