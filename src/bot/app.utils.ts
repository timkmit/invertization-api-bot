export const showList = (goods) => {
  const categoryGood = goods.map((good) => good.category);
  return categoryGood;
};

const hashMapSceneNames: Record<string, Record<string, boolean>> = {};


export const isAllowedSceneNames = (hashMapSNs : object, sceneName : string) => {
  return sceneName in hashMapSNs;
}



export const isAllowedToEnterScene = (sceneName: string, userId: string) => {

  
  hashMapSceneNames['webapp_scene'] = {'418777193': true};
  hashMapSceneNames['info_product_scene'] = {'418777193': true};
  hashMapSceneNames['add_product_scene'] = {'418777193': true};
  hashMapSceneNames['edit_product_scene'] = {'418777193': true};
  hashMapSceneNames['delete_product_scene'] = {'418777193': false}; 

  console.log('зашел на сцену')

  Object.keys(hashMapSceneNames).forEach((key) => {
    hashMapSceneNames[key] = {...hashMapSceneNames[key]} as Record<string, boolean>;
  });

  if (sceneName in hashMapSceneNames) {
    console.log('первая проверка')
    console.log(sceneName in hashMapSceneNames)

    if (userId in hashMapSceneNames[sceneName]) {
      console.log('вторая проверка')
      console.log(hashMapSceneNames[sceneName][userId])
      return hashMapSceneNames[sceneName][userId];
    }
  }

  return false;
}
