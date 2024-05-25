import { Scene, SceneEnter, SceneLeave, Hears, Ctx } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';
import { PrismaService } from 'src/prisma.service';


@Scene('delete_product_scene')
export class DeleteProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    console.log('Enter to delete_product_scene');
    await ctx.reply('Введите название товара, который хотите удалить:');
  }

  @Hears(/.*/)
  async onMessage(@Ctx() ctx: Context2): Promise<void> {
    const message = ctx.message;
    if (!('text' in message)) {
      await ctx.reply('Пожалуйста, введите текстовое сообщение.');
      return;
    }
    const text = message.text;

    const product = await this.prisma.product.findFirst({
      where: { name: text },
    });

    if (product) {
      await this.prisma.product.delete({
        where: { id: product.id },
      });
      await ctx.reply(`Товар "${text}" успешно удален.`);
    } else {
      await ctx.reply(`Товар с названием "${text}" не найден.`);
    }

    await ctx.scene.enter('greeting_scene');
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    console.log('Leave from delete scene');
    ctx.scene.enter('greeting_scene')
  }

  @Hears('leave')
  async onLeaveCommand(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }
}