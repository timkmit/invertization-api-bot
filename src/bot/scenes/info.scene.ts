import { Scene, SceneEnter, SceneLeave, Hears, Ctx, Action } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';
import { PrismaService } from 'src/prisma.service';
import { CategoryService } from 'src/category/category.service';

@Scene('info_product_scene')
export class InfoProductScene {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}
  
  @SceneEnter()
  async onSceneEnter(ctx: Context2): Promise<void> {
    console.log('Enter to info_product_scene');
    await ctx.reply('🟢Необходимое действие:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Список товаров', callback_data: 'show_products' }],
          [{ text: 'Категории товаров', callback_data: 'show_categories' }],
          [{ text: 'Вернуться', callback_data: 'show_outscene' }],
        ],
      },
    });
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    console.log('Leave from scene info');
    await ctx.scene.leave();
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
    const products = await this.prisma.product.findMany();
    console.log(products);

    const productsDetails = products.map((product, key) => {
      return `${key}) ${product.name}\nЦвет: ${product.color}\nЦена: ${product.price}\nКоличество: ${product.count}\nПродается: ${product.visibility ? 'да' : 'нет'}\n`;
    });

    await ctx.reply(`${productsDetails.join('\n')}`);
  }

  @Action('show_categories')
  async showCategories(ctx: Context2): Promise<void> {
    const categories = await this.categoryService.getAll();

    await ctx.reply(
      `Список категорий товаров:\n\n${categories.map(({ name }, i) => `${i + 1}) ${name}`).join('\n')}`,
    );
  }

  @Action('show_outscene')
  async onEditSceneCommand(ctx : Context2): Promise<void> {
    ctx.scene.enter('greeting_scene')
  }

  @Action('remove_product')
  async removeGood(ctx: Context2): Promise<void> {
    await ctx.reply('Напиши название и цвет товара');
    ctx.session.type = 'remove';
  }
}





// @Scene('info_product_scene')
// export class InfoProductScene {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly categoryService: CategoryService,
//   ) {}
  
//   @SceneEnter()
//   onSceneEnter(): string {
//     console.log('Enter to info_product_scene');
//     return 'Welcome братишка info_product_scene';
//   }

//   @Hears('Список товаров')
//   async getAll(ctx: Context) {
//     const products = await this.prisma.product.findMany();
//     console.log(products);

//     const productsDetails = products.map((product, key) => {
//       return `${key}) ${product.name}\nЦвет: ${product.color}\nЦена: ${product.price}\nКоличество: ${product.count}\nПродается: ${product.visibility ? 'да' : 'нет'}\n`;
//     });

//     await ctx.reply(`${productsDetails.join('\n')}`);
//   }

//   @Hears('Категории товаров')
//   async getAllCategory(ctx: Context) {
//     const categories = await this.categoryService.getAll();

//     await ctx.reply(
//       `Список категорий товаров:\n\n${categories.map(({ name }, i) => `${i + 1}) ${name}`).join('\n')}`,
//     );
//   }

//   @Hears('Отредактировать')
//   async onEditSceneCommand(ctx : Context2): Promise<void>{

//     if(isAllowedToEnterScene('webapp_scene', ctx.message.chat.id.toString())){
//       await ctx.reply('переход на сцену edit_product_scenee');
//       await ctx.scene.enter('edit_product_scene')
//     }else ctx.reply('У вас нет прав перейти на эту сцену')

//   }

//   @Hears('Удалить')
//   async removeGood(ctx: Context) {
//     await ctx.reply('Напиши название и цвет товара');
//     ctx.session.type = 'remove';
//   }

//   @SceneLeave()
//   async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
//     console.log('Leave from scene');
//     await ctx.scene.enter('greeting_scene');
//   }

//   @Hears('leave')
//   async onLeaveCommand(ctx: Context2): Promise<void> {
//     await ctx.scene.leave();
//   }
// }