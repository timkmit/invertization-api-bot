import { Scene, SceneEnter, SceneLeave, On, Ctx, Message } from 'nestjs-telegraf';
import { Context2 } from 'src/bot/context.interface';
import { PrismaService } from 'src/prisma.service';

@Scene('edit_product_count_scene')
export class EditCountProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply('Введите актуальное количество товара:');
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    console.log('Leave from edit_product_count_scene');
    ctx.session.type = ''; 
    ctx.session.productId = undefined;
    await ctx.scene.enter('greeting_scene');
  }

  @On('text')
  async getMessage(
    @Message() message: any,
    @Ctx() ctx: Context2
  ): Promise<void> {
    console.log('Full message object:', message);

    const text = message.text;
    console.log('Received message:', text);

    if (!text) {
      await ctx.reply('Пожалуйста, введите действительное положительное число для количества.');
      return;
    }

    const newProductCount = parseInt(text, 10);
    const productId = ctx.session.productId;

    console.log('Parsed count:', newProductCount);

    if (isNaN(newProductCount) || newProductCount < 0) {
      await ctx.reply('Пожалуйста, введите действительное положительное число для количества.');
      return;
    }

    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }

    try {
      await this.prisma.product.update({
        where: { id: productId },
        data: { count: newProductCount },
      });
      await ctx.reply(`Количество товара успешно изменено на ${newProductCount}`);
    } catch (error) {
      console.error('Error updating product count:', error);
      await ctx.reply('Произошла ошибка при изменении количества товара');
    } finally {
      await ctx.scene.leave();
    }
  }
}