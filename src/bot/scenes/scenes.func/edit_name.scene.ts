import { Scene, SceneEnter, SceneLeave, On, Ctx, Message } from 'nestjs-telegraf';
import { Context2 } from 'src/bot/context.interface';
import { PrismaService } from 'src/prisma.service';

@Scene('edit_product_name_scene')
export class EditNameProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply('Введите новое название товара:');
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    ctx.session.type = ''; 
    ctx.session.productId = 999999;
  }

  @On('text')
  async getMessage(
    @Message('text') message: {text: string},
    @Ctx() ctx: Context2,): Promise<void> {

    const newProductName = ctx.text
    const productId = ctx.session.productId;

    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }

    try {
      await this.prisma.product.update({
        where: { id: productId },
        data: { name: newProductName },
      });
      await ctx.reply(`Название товара успешно изменено на ${newProductName}`);
    } catch (error) {
      await ctx.reply('Произошла ошибка при изменении названия товара');
    } finally {
      await ctx.scene.enter('greeting_scene');
    }
  }
}