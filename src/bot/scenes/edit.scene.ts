
import { Scene, SceneEnter, SceneLeave, Hears, On, Ctx, Message, Action } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';
import { PrismaService } from 'src/prisma.service';
import { Markup } from 'telegraf';

@Scene('edit_product_scene')
export class EditProductScene {
  constructor(private readonly prisma: PrismaService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    ctx.session.type = 'edit'
    await ctx.reply('Введите название товара для редактирования:',
    Markup.inlineKeyboard([
      Markup.button.callback('Отменить редактирование', 'back_to_menu')
    ])
    );
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }

  @Hears('leave')
  async onLeaveCommand(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.leave();
    await ctx.scene.enter('greeting_scene');
  }

  @Action('edit_name')
  async onEditNameAction(@Ctx() ctx: Context2): Promise<void> {
    const productId = ctx.session.productId;
    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }
    ctx.session.type = 'edit_name';
    await ctx.scene.enter('edit_product_name_scene');
  }

  @Action('edit_price')
  async onEditPriceAction(@Ctx() ctx: Context2): Promise<void> {
    const productId = ctx.session.productId;
    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }
    ctx.session.type = 'edit_price';
    await ctx.scene.enter('edit_product_price_scene');
  }

  @Action('edit_count')
  async onEditCountAction(@Ctx() ctx: Context2): Promise<void> {
    const productId = ctx.session.productId;
    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }
    ctx.session.type = 'edit_count';
    await ctx.scene.enter('edit_product_count_scene');
  }

  @Action('edit_color') 
  async onEditColorAction(@Ctx() ctx: Context2): Promise<void> {
    const productId = ctx.session.productId;
    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }
    ctx.session.type = 'edit_color';
    await ctx.scene.enter('edit_product_color_scene');
  }

  @Action('edit_visibility') 
  async onEditVisibilityAction(@Ctx() ctx: Context2): Promise<void> {
    const productId = ctx.session.productId;
    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }
    ctx.session.type = 'edit_visibility';
    await ctx.scene.enter('edit_product_visibility_scene');
  }

  @Action('edit_outscene') 
  async onEditOutsceneAction(@Ctx() ctx: Context2): Promise<void> {
    const productId = ctx.session.productId;
    if (!productId) {
      await ctx.reply('Произошла ошибка, попробуйте еще раз');
      return;
    }
    await ctx.scene.enter('greeting_scene')
  }

  @Action('back_to_menu')
  async onBackToMenu(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.enter('greeting_scene');
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context2): Promise<void> {

    if (ctx.session.type === 'edit_name') {
      await ctx.scene.enter('edit_product_name_scene');

    }

    if (ctx.session.type === 'edit_price') {
      await ctx.scene.enter('edit_product_price_scene');
    }
    
    if (ctx.session.type === 'edit_count') {
      await ctx.scene.enter('edit_product_count_scene');
    }

    if (ctx.session.type === 'edit_color') {
      await ctx.scene.enter('edit_product_color_scene');
    }

    if (ctx.session.type === 'edit_visibility') {
      await ctx.scene.enter('edit_product_visibility_scene');
    }

    if (ctx.session.type === 'edit_outscene') {
      await ctx.scene.enter('greeting_scene')
    }

    else if (ctx.session.type === 'edit') {
      const product = await this.prisma.product.findFirst({
        where: { name: message },
      });
      ctx.session.productId = product?.id;
      if (!product) {
        await ctx.reply('🔴Товара с таким названием не найдено');
        await ctx.scene.reenter();
        return;
      }
      await ctx.reply(
        `🟢Товар найден:\n\n-${product.name}\n-Цвет: ${product.color}\n-Цена: ${product.price}\n-Кол-во: ${product.count}\n-Продается: ${product.visibility ? 'да' : 'нет'}`,
        Markup.inlineKeyboard([
          
          [Markup.button.callback('Изменить название', 'edit_name')],
          [Markup.button.callback('Изменить цвет', 'edit_color')],
          [Markup.button.callback('Изменить цену', 'edit_price')],
          [Markup.button.callback('Изменить количество', 'edit_count')],
          [Markup.button.callback('Установить видимость', 'edit_visibility')],
          [Markup.button.callback('Отменить редактирование', 'edit_outscene')],
        ])
      );
    }
  }
}


