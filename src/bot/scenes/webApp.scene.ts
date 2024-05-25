import { Scene, SceneEnter, SceneLeave, Hears } from 'nestjs-telegraf';
import { Context, Context2 } from '../context.interface';
import { Markup } from 'telegraf';

@Scene('webapp_scene')
export class WebAppScene {
  @SceneEnter()
  onSceneEnter(): string {
    console.log('Enter to webappscene');
    return 'Welcome братишка webappscene';
  }

  @Hears('leave')
  async onLeaveCommand(ctx: Context2): Promise<void> {
    await ctx.scene.leave();
  }

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

  @SceneLeave()
  onSceneLeave(): string {
    console.log('Leave from scene');
    return 'Пока пока';
  }

}