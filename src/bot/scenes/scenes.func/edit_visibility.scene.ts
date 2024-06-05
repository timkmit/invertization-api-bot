import { Scene, SceneEnter, SceneLeave, On, Ctx, Message, Action } from 'nestjs-telegraf';
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

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    console.log('Leave from edit_product_visibility_scene');
    await ctx.scene.enter('greeting_scene');
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

  @On('text')
  async getMessage(
    @Message('text') message: {text: string},
    @Ctx() ctx: Context2,): Promise<void> {

    const newProductVisibility = parseInt(ctx.text)
    let newProductVisibilityBool = false;
    if(newProductVisibility === 1){
        newProductVisibilityBool = true
    }else if(newProductVisibility === 0){
        newProductVisibilityBool = false
    }
    const productId = ctx.session.productId;

    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }

    try {
      await this.prisma.product.update({
        where: { id: productId },
        data: { visibility: newProductVisibilityBool },
      });
      await ctx.reply(`Видимость изменена ${newProductVisibility}`);
    } catch (error) {
      console.error('Error updating product visibility:', error);
      await ctx.reply('Произошла ошибка при изменении видимости товара');
    } finally {
      await ctx.scene.leave();
    }
  }
}



@Scene('edit_product_visibility_true_scene')
export class EditVisibilityTrueProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply('Выбран метод выставления товара на продажу')
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
      await ctx.scene.enter('greeting_scene')
    } catch (error) {
      console.error('Error updating product visibility:', error);
      await ctx.reply('Произошла ошибка при изменении видимости товара');
    } 
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    console.log('Leave from edit_product_visibility_true_scene');
    ctx.scene.enter('greeting_scene');
  }
}

@Scene('edit_product_visibility_false_scene')
export class EditVisibilityFalseProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply('Выбран метод снятия товара с продажи')
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
      await ctx.scene.enter('greeting_scene')
    } catch (error) {
      console.error('Error updating product visibility:', error);
      await ctx.reply('Произошла ошибка при изменении видимости товара');
    } 
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    console.log('Leave from edit_product_visibility_false_scene');
    ctx.scene.enter('greeting_scene');
  }

}