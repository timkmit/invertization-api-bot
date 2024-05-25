import { Telegraf } from 'telegraf';
import {
  Command,
  InjectBot,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, 
  Context2 } from './context.interface';
import { isAllowedToEnterScene } from './app.utils';
// import { PrismaService } from 'src/prisma.service';
// import { CategoryService } from '../category/category.service';


@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    // private readonly prisma: PrismaService,
    // private readonly categoryService: CategoryService,
  ) {}

  @Start()
  @Command('scene')
  async onSceneCommand(ctx : Context2): Promise<void>{
    await ctx.scene.enter('greeting_scene')
  }

  @Command('webapp_scene')
  async onWebAppCommand(ctx : Context2): Promise<void>{

    if(isAllowedToEnterScene('webapp_scene', ctx.message.chat.id.toString())){
      await ctx.scene.enter('webapp_scene')
    }else ctx.reply('У вас нет прав перейти на эту сцену')

  }

  @Command('info_product_scene')
  async onInfoSceneCommand(ctx : Context2): Promise<void>{
    //TODO убрать вебапп отсюда и отовсюду
    if(isAllowedToEnterScene('info_product_scene', ctx.message.chat.id.toString())){
      ctx.session.type = 'edit';
      console.log(`Scene type set to: ${ctx.session.type}`);
      await ctx.scene.enter('info_product_scene')
    }else ctx.reply('У вас нет прав перейти на эту сцену')
  }

  @Command('add_product_scene')
  async onAddSceneCommand(ctx : Context2): Promise<void>{

    if(isAllowedToEnterScene('add_product_scene', ctx.message.chat.id.toString())){
      await ctx.scene.enter('add_product_scene')
    }else ctx.reply('У вас нет прав перейти на эту сцену')

  }

  @Command('edit_product_scene')
  async onEditSceneCommand(ctx : Context2): Promise<void>{
    ctx.session.type = 'edit';
    if (isAllowedToEnterScene('edit_product_scene', ctx.message.chat.id.toString())) {
      await ctx.scene.enter('edit_product_scene');
    } else {
      ctx.reply('У вас нет прав перейти на эту сцену');
    }
  }

  @Command('delete_product_scene')
  async onDeleteSceneCommand(ctx : Context2): Promise<void>{

    if(isAllowedToEnterScene('delete_product_scene', ctx.message.chat.id.toString())){
      await ctx.scene.enter('delete_product_scene')
    }else ctx.reply('У вас нет прав перейти на эту сцену')

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
