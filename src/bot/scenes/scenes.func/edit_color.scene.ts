import { Scene, SceneEnter, SceneLeave, On, Ctx, Message } from 'nestjs-telegraf';
import { Context2 } from 'src/bot/context.interface';
import { PrismaService } from 'src/prisma.service';

@Scene('edit_product_color_scene')
export class EditColorProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply('Введите цвет товара:');
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    console.log('Leave from edit_product_color_scene');
    ctx.session.type = ''; 
    ctx.session.productId = 999999;
    await ctx.scene.enter('greeting_scene');
  }

  @On('text')
  async getMessage(
    @Message('text') message: {text: string},
    @Ctx() ctx: Context2,): Promise<void> {

    const newProductColor = ctx.text
    const productId = ctx.session.productId;

    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }

    try {
      await this.prisma.product.update({
        where: { id: productId },
        data: { color: newProductColor },
      });
      await ctx.reply(`Цвет товара успешно изменен на ${newProductColor}`);
    } catch (error) {
      console.error('Error updating product color:', error);
      await ctx.reply('Произошла ошибка при изменении цвета товара');
    } finally {
      await ctx.scene.leave();
    }
  }
}