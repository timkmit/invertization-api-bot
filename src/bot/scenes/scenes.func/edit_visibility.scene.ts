import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { Context2 } from 'src/bot/context.interface';
import { PrismaService } from 'src/prisma.service';
import { Markup } from 'telegraf';


@Scene('edit_product_visibility_scene')
export class EditVisibilityProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply('Выберите дейтсвие:',
    Markup.inlineKeyboard([
      [Markup.button.callback('Выставить на продажу', 'edit_visibility_true')],
      [Markup.button.callback('Снять с продажи', 'edit_visibility_false')],
    ]));
  }

  

  @Action('edit_visibility_true') 
  async onEditVisibilityTrueAction(@Ctx() ctx: Context2): Promise<void> {
    const productId = ctx.session.productId;
    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }
    ctx.session.type = 'edit_visibility_true';
    await ctx.scene.enter('edit_product_visibility_true_scene');
  }
  @Action('edit_visibility_false') 
  async onEditVisibilityFalseAction(@Ctx() ctx: Context2): Promise<void> {
    const productId = ctx.session.productId;
    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }
    ctx.session.type = 'edit_visibility_false';
    await ctx.scene.enter('edit_product_visibility_false_scene');
  }

}


@Scene('edit_product_visibility_true_scene')
export class EditVisibilityTrueProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {

    const newProductVisibility = true
    const productId = ctx.session.productId;

    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }

    try {
      await this.prisma.product.update({
        where: { id: productId },
        data: { visibility: newProductVisibility },
      });
      await ctx.reply(`Видимость изменена`);
      await ctx.scene.enter('greeting_scene');
    } catch (error) {
      await ctx.reply('Произошла ошибка при изменении видимости товара');
      await ctx.scene.enter('greeting_scene');
    } 
  }

}

@Scene('edit_product_visibility_false_scene')
export class EditVisibilityFalseProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {

    const newProductVisibility = false
    const productId = ctx.session.productId;

    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }

    try {
      await this.prisma.product.update({
        where: { id: productId },
        data: { visibility: newProductVisibility },
      });
      await ctx.reply(`Видимость изменена`);
      await ctx.scene.enter('greeting_scene');
    } catch (error) {
      await ctx.reply('Произошла ошибка при изменении видимости товара');
      await ctx.scene.enter('greeting_scene');
    } 
  }

}