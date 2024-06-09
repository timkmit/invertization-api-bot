import { Scene, SceneEnter, SceneLeave, Hears, Ctx } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';
import { Markup } from 'telegraf';


@Scene('greeting_scene')
export class GreetingScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply(
      'Главное меню, выберите необходимое действие:',
      Markup.keyboard([
        ['🔎Найти товар', '✍️Изменить товар'], 
        ['✅Добавить товар', '✅Добавить категорию'], 
        ['❌Удалить товар']
      ]).resize()
    );
  }

  @Hears('leave')
  async onLeaveCommand(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }

  @Hears('✍️Изменить товар')
  async onEditProduct(@Ctx() ctx: Context2): Promise<void> {
      await ctx.scene.enter('edit_product_scene');
  }

  @Hears('✅Добавить категорию')
  async onAddCategory(@Ctx() ctx: Context2): Promise<void> {
      await ctx.scene.enter('add_category_scene');
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