'use strict';

const crypto = require('crypto');

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.method !== 'POST') {
      return next();
    }

    const path = ctx.request.url.split('?')[0];
    if (path !== '/admin/forgot-password') {
      return next();
    }

    const email = ctx.request.body && ctx.request.body.email;
    if (!email) {
      return next();
    }

    const resetPasswordToken = crypto.randomBytes(20).toString('hex');

    const user = await strapi
      .query('admin::user')
      .update({ where: { email }, data: { resetPasswordToken } });

    if (!user) {
      return next();
    }

    ctx.status = 200;
    ctx.body = { ok: true, code: resetPasswordToken };
  };
};