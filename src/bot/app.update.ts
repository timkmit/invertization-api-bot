import { Markup, Telegraf } from 'telegraf';
import {
  Command,
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { actionButtons } from './app.buttons';
import { Context, Context2 } from './context.interface';
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

  // УДАЛИТЬ DELETE
  @Hears('WebApp')
  async startWebApp(ctx: Context) {
    await ctx.reply(
      'Debug Reply',
      Markup.keyboard([
        Markup.button.webApp(
          '/search/process',
          'https://subtle-chimera-51b2eb.netlify.app/search/process',
        ),
        Markup.button.webApp(
          '/add',
          'https://subtle-chimera-51b2eb.netlify.app/add',
        ),
        Markup.button.webApp(
          '/search/byid',
          'https://subtle-chimera-51b2eb.netlify.app/search/byid',
        ),
      ]),
    );
  }


  @Start()
  @Command('scene')
  async onSceneCommand(ctx : Context2): Promise<void>{
    await ctx.reply('переход на сцену');
    await ctx.scene.enter('greetengscene')
  }

  @Command('info_product_scene')
  async onInfoSceneCommand(ctx : Context2): Promise<void>{
    await ctx.reply('переход на сцену info');
    await ctx.scene.enter('info_product_scene')
  }

  @Command('add_product_scene')
  async onAddSceneCommand(ctx : Context2): Promise<void>{
    await ctx.reply('переход на сцену');
    await ctx.scene.enter('add_product_scene')
  }

  @Command('edit_product_scene')
  async onEditSceneCommand(ctx : Context2): Promise<void>{
    await ctx.reply('переход на сцену');
    await ctx.scene.enter('Enter to edit_product_scene')
  }
  @Command('delete_product_scene')
  async onDeleteSceneCommand(ctx : Context2): Promise<void>{
    await ctx.reply('переход на сцену');
    await ctx.scene.enter('delete_product_scene')
  }

  // @On('text')
  // async getMessage(
  //   @Message('text') message: string,
  //   @Ctx() ctx: Context,
  // ): Promise<Product | null> {
  //   if (!ctx.session.type) return;
  //   //TODO доделать утилс и нормально реализовать функции
  //   //TODO добить редактирование
  //   if (ctx.session.type === 'edit') {
  //     const products = await this.prisma.product.findFirst({
  //       where: { name: message },
  //     });
  //     if (!products) {
  //       await ctx.reply('Товара с таким названием не найдено');
  //       return;
  //     }
  //     await ctx.reply(
  //       `Это нужный товар?\n\n-${products.name}\n-Цвет: ${products.color}\n-Цена: ${products.price}\n-Кол-во: ${products.count}\n-Продается: ${products.visibility ? `да` : `нет`} `,
  //     );
  //   }
  //   //TODO сделать удаление (уже с бд)
  //   if (ctx.session.type === 'remove') {
  //   }
  // }
}
