
import { Context as ContextTelegraf, Scenes } from 'telegraf';

export interface Context extends ContextTelegraf {
  session: {
    type?: 'list' | 'category' | 'edit' | 'remove';
    productID?: number
  };
}

interface MySceneSessionData extends Scenes.SceneSessionData {
  type?: 'category' | 'edit' | 'remove';
}

interface MySceneSession extends Scenes.SceneSession<MySceneSessionData> {
  productId?: number;
  type?: string;
  product?: {
    name?: string;
    count?: number;
    price?: number;
    color?: string;
    category_id?: number;
    visibility?: boolean;
    images?: string[];
    year?: number;
  };
}

export interface Context2 extends Scenes.SceneContext<MySceneSessionData> {
  session: MySceneSession;
}
