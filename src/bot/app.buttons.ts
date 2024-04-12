import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('Список товаров', 'list'),
      Markup.button.callback('Категории товаров', 'list'),
      Markup.button.callback('Отредактировать', 'edit'),
      Markup.button.callback('Удалить', 'delete'),
    ],
    {
      //columns
    },
  );
}
