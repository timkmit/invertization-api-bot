import { Scene, SceneEnter, SceneLeave, Command, Hears } from 'nestjs-telegraf';
import { Context, Context2 } from '../context.interface';
import { PrismaService } from 'src/prisma.service';
import { CategoryService } from 'src/category/category.service';

@Scene('info_product_scene')
export class InfoProductScene {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}
  
  @SceneEnter()
  onSceneEnter(): string {
    console.log('Enter to info_product_scene');
    return 'Welcome братишка info_product_scene';
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

  @SceneLeave()
  onSceneLeave(): string {
    console.log('Leave from scene');
    return 'Пока пока';
  }

  @Hears('leave')
  async onLeaveCommand(ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }
}