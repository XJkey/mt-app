export default {
  dbs: 'mongodb://root:123456@47.244.185.66:27017/mt?authSource=admin',
  redis: {
    get host() {
      return '47.244.185.66'
    },
    get post() {
      return 6379
    },
    get password() {
      return "12345678"
    }
  },
  smtp: {
    get host() {
      return 'smtp.qq.com'
    },
    get user() {
      return "1193695252@qq.com"
    },
    get pass() {
      return "tkuybvxwfghogebj"
    },
    get code() {
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase()
      }
    },
    get expire() {
      return () => {
        return new Date().getTime() + 60 * 60 * 1000
      }
    }
  },

}
