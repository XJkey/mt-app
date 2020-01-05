<template>
  <div class="" />
</template>

<script>
  export default {
    layout: 'blank',
    //中间件允许您定义一个自定义函数运行在一个页面或一组页面渲染之前
    middleware: async (ctx) => {
      let {
        status,
        data
      } = await ctx.$axios.get('/users/exit')
      if (status == 200 && data && data.code == 0) {
        window.location.href = '/'
      }
    }
  }

</script>
