export const showList = (goods) => {
  const categoryGood = goods.map((good) => good.category);
  return categoryGood;
};

const hashMapSceneNames: Record<string, Record<string, boolean>> = {
  webapp_scene: { '418777193': true, '671159368': true, '942583043': true },
  info_product_scene: {
    '418777193': true,
    '671159368': true,
    '942583043': true,
  },
  add_product_scene: {
    '418777193': true,
    '671159368': true,
    '942583043': true,
  },
  edit_product_scene: {
    '418777193': true, 
    '671159368': true,
    '942583043': true,
  },
  delete_product_scene: {
    '418777193': true,
    '671159368': true,
    '942583043': true,
  },
};

export const isAllowedSceneNames = (hashMapSNs: object, sceneName: string) => {
  return sceneName in hashMapSNs;
};

export const isAllowedToEnterScene = (sceneName: string, userId: string) => {

  Object.keys(hashMapSceneNames).forEach((key) => {
    hashMapSceneNames[key] = { ...hashMapSceneNames[key] } as Record<string, boolean>;
  });
  if (sceneName in hashMapSceneNames) {
    if (userId in hashMapSceneNames[sceneName]) {
      return hashMapSceneNames[sceneName][userId];
    } 
  } 
  return false;
};
