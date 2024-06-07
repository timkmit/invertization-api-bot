import { Scene, SceneEnter, SceneLeave, Hears, Ctx, Action } from 'nestjs-telegraf';
import { Context, Context2 } from '../context.interface';
import { Markup } from 'telegraf';

@Scene('webapp_scene')
export class WebAppScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context2): Promise<void> {
    await ctx.reply('Выберите необходимое действие в интерактивном приложении',
    Markup.keyboard([
      Markup.button.webApp(
        'Поиск по всем параметрам',
        'https://subtle-chimera-51b2eb.netlify.app/search/process',
      ),
      Markup.button.webApp(
        'Поиск по названию',
        'https://subtle-chimera-51b2eb.netlify.app/search/byid',
      ),
      Markup.button.webApp(
        'Добавить новый товар',
        'https://subtle-chimera-51b2eb.netlify.app/add',
      ),
      Markup.button.callback('Вернуться в меню', 'back_to_menu')
    ]),
    )
  }

  @Hears('leave')
  async onLeaveCommand(ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }

  @Hears('Вернуться в меню')
  async onLeaveTextCommand(ctx: Context2): Promise<void> {
    await ctx.scene.enter('greeting_scene');
  }

  @Hears('WebApp')
  async startWebApp(ctx: Context) {
    await ctx.reply(
      'Debug Reply',
      Markup.keyboard([
        Markup.button.webApp(
          'Поиск по всем параметрам',
          'https://subtle-chimera-51b2eb.netlify.app/search/process',
        ),
        Markup.button.webApp(
          'Поиск по названию',
          'https://subtle-chimera-51b2eb.netlify.app/search/byid',
        ),
        Markup.button.webApp(
          'Добавить товар',
          'https://subtle-chimera-51b2eb.netlify.app/add',
        )
      ]),
    );
  }

  @Action('back_to_menu')
  async onBackToMenu(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.enter('greeting_scene');
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context2): Promise<void> {
    await ctx.scene.leave()
  }

}