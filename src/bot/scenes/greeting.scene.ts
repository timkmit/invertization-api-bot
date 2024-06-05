import { Scene, SceneEnter, SceneLeave, Hears, Ctx } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';
import { Markup } from 'telegraf';


@Scene('greeting_scene')
export class GreetingScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    console.log('Enter to greetingscene');
    await ctx.reply(
      'Главное меню, выберите необходимое действие:',
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
  async onSceneLeave(): Promise<void> {
    console.log('Out of greeting scene')
  }

  @Hears('✍️Изменить товар')
  async onEditProduct(@Ctx() ctx: Context2): Promise<void> {
      await ctx.scene.enter('edit_product_scene');
  }

  @Hears('✅Добавить товар')
  async onAddProduct(@Ctx() ctx: Context2): Promise<void> {
      await ctx.scene.enter('add_product_scene');
  }

  @Hears('❌Удалить товар')
  async onDeleteProduct(@Ctx() ctx: Context2): Promise<void> {
      await ctx.scene.enter('delete_product_scene');
  }

  @Hears('🔎Найти товар')
  async onFindProduct(@Ctx() ctx: Context2): Promise<void> {
      await ctx.scene.enter('info_product_scene');
  }
}