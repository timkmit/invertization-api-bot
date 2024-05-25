import { Scene, SceneEnter, SceneLeave, Hears, Ctx, Message } from 'nestjs-telegraf';
import { Context2 } from '../context.interface';
import { PrismaService } from 'src/prisma.service';
import { CategoryService } from 'src/category/category.service';

// @Scene('add_product_scene')
// export class AddProductScene {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly categoryService: CategoryService,
//   ) {}

//   @SceneEnter()
//   async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
//     console.log('Enter to add_product_scene');

//     const categories = await this.prisma.category.findMany();
//     const categoriesList = categories.map(cat => `${cat.id}: ${cat.name}`).join('\n');
    
//     await ctx.reply(`Выберите категорию из списка:\n${categoriesList}`);

//     ctx.session.product = {};
//   }

//   @Hears(/^\d+$/)
//   async onCategoryId(@Ctx() ctx: Context2): Promise<void> {
//     const message = ctx.message;
//     if (!('text' in message)) {
//       await ctx.reply('Пожалуйста, введите текстовое сообщение.');
//       return;
//     }
    
//     const categoryId = parseInt(message.text, 10);
//     const category = await this.prisma.category.findUnique({
//       where: { id: categoryId },
//     });
  
//     if (!category) {
//       await ctx.reply('Категория с таким ID не найдена. Пожалуйста, введите правильный ID категории товара:');
//       return;
//     }
  
//     ctx.session.product.category_id = categoryId;
//     await ctx.reply('Введите название товара:');
//   }

//   @Hears(/.*/)
//   async onMessage(@Ctx() ctx: Context2): Promise<void> {
//     const message = ctx.message;
//     if (!('text' in message)) {
//       await ctx.reply('Пожалуйста, введите текстовое сообщение.');
//       return;
//     }
//     const text = message.text;

//     if (!ctx.session.product.name) {
//       ctx.session.product.name = text;
//       await ctx.reply('Введите количество товара:');
//     } else if (ctx.session.product.count === undefined) {
//       const count = parseInt(text, 10);
//       if (isNaN(count)) {
//         await ctx.reply('Пожалуйста, введите допустимое число для количества товара:');
//         return;
//       }
//       ctx.session.product.count = count;
//       await ctx.reply('Введите цену товара:');
//     } else if (ctx.session.product.price === undefined) {
//       const price = parseInt(text, 10);
//       if (isNaN(price)) {
//         await ctx.reply('Пожалуйста, введите допустимое число для цены товара:');
//         return;
//       }
//       ctx.session.product.price = price;
//       await ctx.reply('Введите цвет товара:');
//     } else if (!ctx.session.product.color) {
//       ctx.session.product.color = text;
//       await ctx.reply('Введите видимость товара (Да/Нет)=(Продается/Не продается):');
//     } else if (ctx.session.product.visibility === undefined) {
//       const visibility = text.trim().toLowerCase();
//       if (visibility !== 'да' && visibility !== 'нет') {
//         await ctx.reply('Пожалуйста, введите Да или Нет для видимости товара:');
//         return;
//       }
//       ctx.session.product.visibility = visibility === 'да' ;
//       await ctx.reply('Введите URL изображения товара (сейчас не работает, напишите пару точек):');
//     } else if (!ctx.session.product.images) {
//       ctx.session.product.images = text.split(',').map((url: string) => url.trim());
//       await ctx.reply('Введите год производства товара:');
//     } else if (ctx.session.product.year === undefined) {
//       const year = parseInt(text, 10);
//       if (isNaN(year)) {
//         await ctx.reply('Пожалуйста, введите допустимое число для года производства товара:');
//         return;
//       }
//       ctx.session.product.year = year;

//       const productData = {
//         name: ctx.session.product.name,
//         count: ctx.session.product.count,
//         price: ctx.session.product.price,
//         color: ctx.session.product.color,
//         category: {
//           connect: { id: ctx.session.product.category_id },
//         },
//         visibility: ctx.session.product.visibility,
//         images: ctx.session.product.images,
//         year: ctx.session.product.year,
//       };

//       const product = await this.prisma.product.create({
//         data: productData,
//       });
//       const categoryId = product.category_id;

//       const category = await this.prisma.category.findUnique({
//         where: { id: categoryId },
//       });

//       const categoryName = category.name;

//       await ctx.reply(`Товар успешно создан с ID: ${product.id}`);
//       await ctx.reply(
//         `${product.name}\n` +
//         `Цвет: ${product.color}\n` +
//         `Цена: ${product.price}\n` +
//         `Количество: ${product.count}\n` +
//         `Продается: ${product.visibility ? 'да' : 'нет'}\n` +
//         `Категория: ${categoryName}\n` +
//         `Год выпуска: ${product.year}\n` +
//         `Изображение: ${product.images.join(', ')}\n`
//       );
//       ctx.session.product = {};
//       await ctx.scene.enter('greeting_scene');
//     }
//   }

//   @SceneLeave()
//   async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
//     console.log('Leave from add_product_scene');
//     ctx.scene.enter('greeting_scene')
//   }

//   @Hears('leave')
//   async onLeaveCommand(@Ctx() ctx: Context2): Promise<void> {
//     await ctx.scene.leave();
//   }
// }




@Scene('add_product_scene')
export class AddProductScene {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    console.log('Enter to add_product_scene');
    await ctx.reply('Введите название товара:');
    ctx.session.product = {};
  }

  @Hears(/.*/)
  async onMessage(@Ctx() ctx: Context2): Promise<void> {
    const message = ctx.message;
    if (!('text' in message)) {
      await ctx.reply('Пожалуйста, введите текстовое сообщение.');
      return;
    }
    const text = message.text;

    if (!ctx.session.product.name) {
      ctx.session.product.name = text;
      await ctx.reply('Введите количество товара:');
    } else if (ctx.session.product.count === undefined) {
      const count = parseInt(text, 10);
      if (isNaN(count)) {
        await ctx.reply('Пожалуйста, введите допустимое число для количества товара:');
        return;
      }
      ctx.session.product.count = count;
      await ctx.reply('Введите цену товара:');
    } else if (ctx.session.product.price === undefined) {
      const price = parseInt(text, 10);
      if (isNaN(price)) {
        await ctx.reply('Пожалуйста, введите допустимое число для цены товара:');
        return;
      }
      ctx.session.product.price = price;
      await ctx.reply('Введите цвет товара:');
    } else if (!ctx.session.product.color) {
      ctx.session.product.color = text;
      const categories = await this.prisma.category.findMany();
      const categoriesList = categories.map(cat => `${cat.id}: ${cat.name}`).join('\n');
    
      
      await ctx.reply('Выберите номер категории товара:');
      await ctx.reply(`Список категорий:\n${categoriesList}`);
    } else if (ctx.session.product.category_id === undefined) {
      const categoryId = parseInt(text, 10);
      if (isNaN(categoryId)) {
        await ctx.reply('Пожалуйста, введите допустимое число для ID категории товара:');
        return;
      }
      ctx.session.product.category_id = categoryId;
      await ctx.reply('Введите видимость товара Да/Нет = Продается/Не продается:');
    } else if (ctx.session.product.visibility === undefined) {
      const visibility = text.trim().toLowerCase();
      if (visibility !== 'да' && visibility !== 'нет' && visibility !== 'продается' && visibility !== 'не продается') {
        await ctx.reply('Пожалуйста, введите Да/Нет для установки видимости товара:');
        return;
      }
      ctx.session.product.visibility = visibility === 'да' ;
      await ctx.reply('Введите URL изображения товара (сейчас не работает, напишите пару точек):');
    } else if (!ctx.session.product.images) {
      ctx.session.product.images = text.split(',').map((url: string) => url.trim());
      await ctx.reply('Введите год производства товара:');
    } else if (ctx.session.product.year === undefined) {
      const year = parseInt(text, 10);
      if (isNaN(year)) {
        await ctx.reply('Пожалуйста, введите допустимое число для года производства товара:');
        return;
      }
      ctx.session.product.year = year;

      const productData = {
        name: ctx.session.product.name,
        count: ctx.session.product.count,
        price: ctx.session.product.price,
        color: ctx.session.product.color,
        category: {
          connect: { id: ctx.session.product.category_id },
        },
        visibility: ctx.session.product.visibility,
        images: ctx.session.product.images,
        year: ctx.session.product.year,
      };

      const product = await this.prisma.product.create({
        data: productData,
      });
      const categoryId = product.category_id;

      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      const categoryName = category.name;

      await ctx.reply(`Товар успешно создан с ID: ${product.id}`);
      await ctx.reply(
        `${product.name}\n` +
        `Цвет: ${product.color}\n` +
        `Цена: ${product.price}\n` +
        `Количество: ${product.count}\n` +
        `Продается: ${product.visibility ? 'да' : 'нет'}\n` +
        `Категория: ${categoryName}\n` +
        `Год выпуска: ${product.year}\n` +
        `Изображение: ${product.images.join(', ')}\n`
      );
      ctx.session.product = {};
      await ctx.scene.enter('greeting_scene');
    }
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    console.log('Leave from add_product_scene');
    ctx.scene.enter('greeting_scene')
  }

  @Hears('leave')
  async onLeaveCommand(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }
}