import Router from 'koa-router';
import Redis from 'koa-redis';
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Passport from './utils/passport'
import Config from '../dbs/config'
import axios from './utils/axios'

let router = new Router({
  prefix: '/users'
});

let Store = new Redis({
  port: Config.redis.post, // Redis port
  host: Config.redis.host, // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: Config.redis.password,
  db: 0
}).client

//注册
router.post('/singup', async (ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body;

  if (code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code');
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire');
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false;
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证吗'
      }
      return false;
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证吗'
    }
    return false;
  }
  let user = await User.find({
    username
  });
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return false;
  }

  let nuser = await User.create({
    username,
    password,
    email
  })
  if (nuser) {
    let res = await axios.post('/user/singin', {
      username,
      password
    })

    if (res.data && res.data.code == 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功'
      }
      return true;
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
      return false;
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
    return false;
  }
})

//登陆
router.post('/sing', async (ctx, next) => {
  return Passport.authenticate('local', function (err, user, info, atatus) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登陆成功'
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

//邮件验证
router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username;
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire');
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，一分钟内一次'
    }
    return false
  }
  //发邮件
  let transporter = nodeMailer.createTransport({
    host: Config.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Config.smtp.user,
      pass: Config.smtp.pass
    }
  })
  //接收方
  let ko = {
    code: Config.smtp.code(),
    expire: Config.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }

  let mailOption = {
    from: `"认证邮件"<${Config.smtp.user}>`,
    to: ko.email,
    subject: '注册码',
    html: `邀请码：${ko.code}`
  }
  await transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，有效期一分钟'
  }

})

//退出
router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

//获取用户名

router.get('/getUser', async (ctx) => {
  //passport固定api
  if (ctx.isAuthenticated()) {
    const {
      username,
      email
    } = ctx.session.Passport.user;
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: "",
      email: ""
    }
  }
})

export default router
