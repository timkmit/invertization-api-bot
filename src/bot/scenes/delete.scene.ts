import { Scene, SceneEnter, SceneLeave, Hears, Ctx, Action } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';
import { PrismaService } from 'src/prisma.service';
import { Markup } from 'telegraf';


@Scene('delete_product_scene')
export class DeleteProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply('Введите название товара, который хотите удалить:',
    Markup.inlineKeyboard([
      Markup.button.callback('Отменить удаление', 'back_to_menu')
    ])
    );
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
      await ctx.reply(`Товар "${text}" успешно удален.`,
      Markup.inlineKeyboard([
        Markup.button.callback('Удалить еще', 'add_more'),
        Markup.button.callback('Вернуться в главное меню', 'back_to_menu')
      ])
      );
    } else {
      await ctx.reply(`Товар с названием "${text}" не найден.`);
      await ctx.scene.reenter();
    }
  }

  @Action('add_more')
  async onAddMore(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.reenter();
  }

  @Action('back_to_menu')
  async onBackToMenu(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.enter('greeting_scene');
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }
}