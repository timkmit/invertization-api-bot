import { Scene, SceneEnter, Hears, Ctx, Action } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';
import { PrismaService } from 'src/prisma.service';
import { Markup } from 'telegraf';

@Scene('add_category_scene')
export class AddCategoryScene {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply('Введите название категории:',
    Markup.inlineKeyboard([
        Markup.button.callback('Отменить создание категории', 'back_to_menu')
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
    const categoryName = message.text;

    try {
      const category = await this.prisma.category.create({
        data: {
          name: categoryName,
        },
      });

      await ctx.reply(`Категория "${category.name}" успешно добавлена с ID: ${category.id}`);
      await ctx.scene.enter('greeting_scene');
    } catch (error) {
      console.error('Ошибка при создании категории:', error);
      await ctx.reply('Произошла ошибка при создании категории. Пожалуйста, попробуйте еще раз.');
    }
  }

  @Action('back_to_menu')
  async onBackToMenu(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.enter('greeting_scene');
  }

}