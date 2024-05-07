import { Context as ContextTelegraf, Scenes } from 'telegraf';

export interface Context extends ContextTelegraf {
  session: {
    type?: 'list' | 'category' | 'edit' | 'remove';
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context2 extends Scenes.SceneContext {}