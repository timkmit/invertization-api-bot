
import { Scene, SceneEnter, SceneLeave, Hears, Ctx, Action } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';
import { PrismaService } from 'src/prisma.service';
import { CategoryService } from 'src/category/category.service';
import { Markup } from 'telegraf';

@Scene('info_product_scene')
export class InfoProductScene {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx: Context2): Promise<void> {
    await ctx.reply('🟢Необходимое действие:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Список товаров', callback_data: 'show_products' }],
          [{ text: 'Категории товаров', callback_data: 'show_categories' }],
          [{ text: 'Найти по артикулу', callback_data: 'search_by_article' }],
          [{ text: 'Найти по названию', callback_data: 'search_by_name' }],
          [{ text: 'Вернуться в главное меню', callback_data: 'back_to_menu' }],
        ],
      },
    });
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.enter('greeting_scene');
  }

  @Hears(['🔎Найти товар', '✍️Изменить товар', '✅Добавить товар', '❌Удалить товар'])
  async onInvalidCommand(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply('Эта функция не работает тут, перейдите в главное меню.');
    await ctx.reply('Напишите "Вернуться" или "Назад".')
  }

  @Hears(['leave', 'Leave', 'Выйти', 'выйти', 'Вернуться', 'вернуться', 'Назад', 'назад'])
  async onLeaveCommand(ctx: Context2): Promise<void> {
    await ctx.scene.enter('greeting_scene');
  }

  @Action('show_products')
  async showProducts(ctx: Context2): Promise<void> {
    ctx.session.productPage = 0;
    await this.displayProducts(ctx);
  }

  @Action('show_next_products')
  async showNextProducts(ctx: Context2): Promise<void> {
    ctx.session.productPage = (ctx.session.productPage || 0) + 1; 
    await this.displayProducts(ctx);
  }

  async displayProducts(ctx: Context2): Promise<void> {
    const page = ctx.session.productPage || 0;
    const pageSize = 10;

    const products = await this.prisma.product.findMany({
      skip: page * pageSize,
      take: pageSize,
    });

    if (products.length === 0) {
      await ctx.reply('Товаров больше нет.');
      ctx.session.productPage = 0;
      return;
    }

    const productsDetails = products.map((product, key) => {
      return `${key + 1 + page * pageSize}) ${product.name}\n🟢Цвет: ${product.color}\n🟢Цена: ${product.price}\n🟢Артикул: ${product.article_number}\n🟢Количество: ${product.count}\n🟢Продается: ${product.visibility ? 'да' : 'нет'}\n`;
    });

    await ctx.reply(`${productsDetails.join('\n')}`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Следующие', callback_data: 'show_next_products' }],
          [{ text: 'Вернуться в главное меню', callback_data: 'back_to_menu' }]
        ],
      },
    });
  }

  @Action('show_categories')
  async showCategories(ctx: Context2): Promise<void> {
    const categories = await this.categoryService.getAll();

    await ctx.reply(
      `Список категорий товаров:\n\n${categories.map(({ name }, i) => `${i + 1}) ${name}`).join('\n')}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Вернуться в главное меню', callback_data: 'back_to_menu' }]
          ],
        },
      }
    );
  }

  @Action('search_by_article')
  async searchByArticle(ctx: Context2): Promise<void> {
    await ctx.reply('Введите артикул товара:');
    ctx.session.type = 'by_article';
  }

  @Action('search_by_name')
  async searchByName(ctx: Context2): Promise<void> {
    await ctx.reply('Введите часть названия товара:');
    ctx.session.type = 'by_name';
  }

  @Hears(/.*/)
  async onMessage(@Ctx() ctx: Context2): Promise<void> {
    const message = ctx.message;
    if (!('text' in message)) {
      await ctx.reply('Пожалуйста, введите текстовое сообщение.');
      return;
    }
    const text = message.text;
    if (ctx.session.type === 'by_article') {
      await this.findByArticle(ctx, text);
    } else if (ctx.session.type === 'by_name') {
      await this.findByName(ctx, text);
    } else {
      await ctx.reply('Неверная команда. Пожалуйста, используйте кнопки для навигации.');
    }
  }

  async findByArticle(ctx: Context2, article: string): Promise<void> {
    const product = await this.prisma.product.findFirst({
      where: { article_number: article },
    });

    if (!product) {
      await ctx.reply('Товар с таким артикулом не найден. Введите еще раз!',
      Markup.inlineKeyboard([
        Markup.button.callback('Вернуться в главное меню', 'back_to_menu')
      ])
      );
      return;
    }

    const category = await this.prisma.category.findUnique({
      where: { id: product.category_id },
    });

    const categoryName = category ? category.name : 'Неизвестно';

    await ctx.reply(
      `${product.name}\n` +
      `🟢Цвет: ${product.color}\n` +
      `🟢Цена: ${product.price}\n` +
      `🟢Количество: ${product.count}\n` +
      `🟢Продается: ${product.visibility ? 'да' : 'нет'}\n` +
      `🟢Категория: ${categoryName}\n` +
      `🟢Год выпуска: ${product.year}\n` +
      `🟢Артикул: ${product.article_number}\n`,
      Markup.inlineKeyboard([
        Markup.button.callback('Найти еще товар', 'add_more'),
        Markup.button.callback('Вернуться в главное меню', 'back_to_menu')
      ])
    );
  }

  async findByName(ctx: Context2, name: string): Promise<void> {
    const products = await this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    if (products.length === 0) {
      await ctx.reply('Товары с таким названием не найдены. Введите название еще раз!');
      return;
    }

    const productsDetails = products.map((product, key) => {
      return `${key + 1}) ${product.name}\n🟢Цвет: ${product.color}\n🟢Цена: ${product.price}\n🟢Количество: ${product.count}\n🟢Продается: ${product.visibility ? 'да' : 'нет'}\n`;
    });

    await ctx.reply(`${productsDetails.join('\n')}`,       
    Markup.inlineKeyboard([
      Markup.button.callback('Найти еще товар', 'add_more'),
      Markup.button.callback('Вернуться в главное меню', 'back_to_menu')
    ]));
  }

  @Action('add_more')
  async onAddMore(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.reenter();
  }

  @Action('back_to_menu')
  async onEditSceneCommand(ctx : Context2): Promise<void> {
    ctx.session.productPage = 0;
    await ctx.scene.enter('greeting_scene');
  }

  @Action('remove_product')
  async removeGood(ctx: Context2): Promise<void> {
    await ctx.reply('Напиши название и цвет товара');
    ctx.session.type = 'remove';
  }
}