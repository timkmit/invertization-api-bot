import { Telegraf } from 'telegraf';
import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { actionButtons } from './app.buttons';
import { Context } from './context.interface';
//import { showList } from './app.utils';
import { PrismaService } from 'src/prisma.service';
import { Product } from '@prisma/client';
import { CategoryService } from '../category/category.service';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('ggagagaga');
    await ctx.reply('выбери', actionButtons());
  }

  @Hears('Список товаров')
  async getAll(ctx: Context) {
    const products = await this.prisma.product.findMany();
    console.log(products);

    const productsDetails = products.map((product, key) => {
      return `${key}) ${product.name}\nЦвет: ${product.color}\nЦена: ${product.price}\nКоличество: ${product.count}\nПродается: ${product.visibility ? 'да' : 'нет'}\n`;
    });

    await ctx.reply(`${productsDetails.join('\n')}`);
  }

  @Hears('Категории товаров')
  async getAllCategory(ctx: Context) {
    const categories = await this.categoryService.getAll();

    await ctx.reply(
      `Список категорий товаров:\n\n${categories.map(({ name }, i) => `${i + 1}) ${name}`).join('\n')}`,
    );
  }

  @Hears('Отредактировать')
  async editGood(ctx: Context) {
    await ctx.reply('Напиши название и цвет товара');
    ctx.session.type = 'edit';
  }

  @Hears('Удалить')
  async removeGood(ctx: Context) {
    await ctx.reply('Напиши название и цвет товара');
    ctx.session.type = 'remove';
  }

  @On('text')
  async getMessage(
    @Message('text') message: string,
    @Ctx() ctx: Context,
  ): Promise<Product | null> {
    if (!ctx.session.type) return;
    //TODO доделать утилс и нормально реализовать функции
    //TODO добить редактирование
    if (ctx.session.type === 'edit') {
      const products = await this.prisma.product.findFirst({
        where: { name: message },
      });
      if (!products) {
        await ctx.reply('Товара с таким названием не найдено');
        return;
      }
      await ctx.reply(
        `Это нужный товар?\n\n-${products.name}\n-Цвет: ${products.color}\n-Цена: ${products.price}\n-Кол-во: ${products.count}\n-Продается: ${products.visibility ? `да` : `нет`} `,
      );
    }
    //TODO сделать удаление (уже с бд)
    if (ctx.session.type === 'remove') {
    }
  }
}
