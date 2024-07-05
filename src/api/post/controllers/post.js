'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    
    const newData = await Promise.all(data.map(async (item) => {
      const { image, ...rest } = item.attributes;
      const imageUrl = image?.data?.attributes?.url ? strapi.config.get('server.url') + image.data.attributes.url : null;
      return { 
        id: item.id, 
        attributes: { 
          ...rest, 
          imageUrl 
        } 
      };
    }));

    return { data: newData, meta };
  },

  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    
    const { image, ...rest } = data.attributes;
    const imageUrl = image?.data?.attributes?.url ? strapi.config.get('server.url') + image.data.attributes.url : null;
    
    return { 
      data: { 
        id: data.id, 
        attributes: { 
          ...rest, 
          imageUrl 
        } 
      }, 
      meta 
    };
  },
}));