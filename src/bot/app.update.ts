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
import { showList } from './app.utils';

const dataGoods = [
  {
    id: 1,
    name: 'Ворсовый коврик Mitsubishi Lanser',
    count: 1000,
    price: 2300,
    color: 'черный красный',
    category: 'ворс',
    visibility: true,
  },
  {
    id: 2,
    name: 'Ворсовый коврик Mitsubishi Lanser',
    count: 1000,
    price: 2300,
    color: 'черный белый',
    category: 'alkanatara',
    visibility: false,
  },
  {
    id: 3,
    name: 'Ворсовый коврик Mitsubishi Lanser',
    count: 1000,
    price: 2300,
    color: 'черынй серый',
    category: 'ворс',
    visibility: true,
  },
];

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('ggagagaga');
    await ctx.reply('выбери', actionButtons());
  }

  @Hears('Список товаров')
  async getAll(ctx: Context) {
    const visibleGoods = dataGoods.filter((good) => good.visibility === true);

    const visibleGoodNames = visibleGoods.map((good) => good.name);

    await ctx.reply(`Список товаров:\n${visibleGoodNames.join('\n')}`);
  }

  @Hears('Категории товаров')
  async getAllCategory(ctx: Context) {
    const categories = showList(dataGoods);
    await ctx.reply(`Список категорий товаров:\n${categories.join('\n')}`);
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
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;
//TODO доделать утилс и нормально реализовать функции
//TODO сделать редактирование (уже с бд)
    if (ctx.session.type === 'edit') {
      const goods = dataGoods.find((mes) => mes.name === message);
      if (!goods) {
        await ctx.reply('Товара с таким названием не найдено');
        return;
      }
      await ctx.reply(
        `Это нужный товар?\n\n-${goods.name}\n-Цвет: ${goods.color}\n-Цена: ${goods.price}\n-Кол-во: ${goods.count}\n-Продается: ${goods.visibility ? `да` : `нет`} `,
      );
    }
//TODO сделать удаление (уже с бд)
    if (ctx.session.type === 'remove') {
      const goods = dataGoods.find((mes) => mes.name === message);
      if (!goods) {
        await ctx.reply('Товара с таким названием не найдено');
        return;
      }
      await ctx.reply(
        `Это нужный товар?\n\n-${goods.name}\n-Цвет: ${goods.color}\n-Цена: ${goods.price}\n-Кол-во: ${goods.count}\n-Продается: ${goods.visibility ? `да` : `нет`} `,
      );
    }
  }
  
}
