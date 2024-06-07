import { Scene, SceneEnter, SceneLeave, On, Ctx, Message } from 'nestjs-telegraf';
import { Context2 } from 'src/bot/context.interface';
import { PrismaService } from 'src/prisma.service';

@Scene('edit_product_price_scene')
export class EditPriceProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply('Введите новую цену товара:');
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    ctx.session.type = ''; 
    ctx.session.productId = undefined;
  }

  @On('text')
  async getMessage(
    @Message() message: any,
    @Ctx() ctx: Context2
  ): Promise<void> {

    const text = message.text;

    if (!text) {
      await ctx.reply('Пожалуйста, введите действительное положительное число для цены.');
      return;
    }

    const newProductPrice = parseInt(text, 10);
    const productId = ctx.session.productId;

    if (isNaN(newProductPrice) || newProductPrice <= 0) {
      await ctx.reply('Пожалуйста, введите действительное положительное число для цены.');
      return;
    }

    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }

    try {
      await this.prisma.product.update({
        where: { id: productId },
        data: { price: newProductPrice },
      });
      await ctx.reply(`Цена товара успешно изменена на ${newProductPrice}`);
    } catch (error) {
      await ctx.reply('Произошла ошибка при изменении цены товара');
    } finally {
      await ctx.scene.enter('greeting_scene');
    }
  }
}