'use strict';

const crypto = require('crypto');

module.exports = (plugin) => {
  plugin.controllers.auth.forgotPassword = async (ctx) => {
    const { email } = ctx.request.body;

    let user = null;
    try {
      user = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { email: (email || '').toLowerCase() } });
    } catch (err) {
      return ctx.send({ ok: true });
    }

    if (!user || user.blocked) {
      return ctx.send({ ok: true });
    }

    const resetPasswordToken = crypto.randomBytes(64).toString('hex');

    await strapi
      .query('plugin::users-permissions.user')
      .update({ where: { id: user.id }, data: { resetPasswordToken } });

    ctx.send({ ok: true, code: resetPasswordToken });
  };

  return plugin;
};