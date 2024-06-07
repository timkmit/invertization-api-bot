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

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  @Start()
  @Command('scene')
  async onSceneCommand(ctx : Context2): Promise<void>{
    await ctx.scene.enter('apply_scene')
  }

  @Command('webapp_scene')
  async onWebAppCommand(ctx : Context2): Promise<void>{

    if(isAllowedToEnterScene('webapp_scene', ctx.message.chat.id.toString())){
      await ctx.scene.enter('webapp_scene')
    }else ctx.reply('У вас нет прав перейти на эту сцену')

  }

  @Command('info_product_scene')
  async onInfoSceneCommand(ctx : Context2): Promise<void>{

    if(isAllowedToEnterScene('info_product_scene', ctx.message.chat.id.toString())){
      ctx.session.type = 'edit';
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
}
