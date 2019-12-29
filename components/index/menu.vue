<template>
  <div class="m-menu"  @mouseleave='mouseleave'>
    <dl class="nav">
      <dt>全部分类</dt>
      <dd v-for="(item, index) in menu" :key="index" @mouseenter="mouseenter">
        <i :class='item.type' />{{item.name}}<span class="arrow"></span>
      </dd>
    </dl>
    <div class="detail" v-if="kind">
      <template v-for="(item, index) in curdetail">
        <h4 :key="index+'y'">{{item.title}}</h4>
        <span v-for="(v, index) in item.child" :key="index">
          {{v}}
        </span>
      </template>

    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        kind: '',
        menu: [{
          type: 'food',
          name: '美食',
          child: [{
            title: '美食',
            child: ['代金券', '甜点饮品', '火锅', '自助餐', '小吃快餐']
          }]
        }, {
          type: 'takeout',
          name: '外卖',
          child: [{
            title: '外卖',
            child: ['美团外卖']
          }]
        }, {
          type: 'hotel',
          name: '酒店',
          child: [{
            title: '酒店星级',
            child: ['经济型', '舒适/三星', '高档/四星', '豪华/五星']
          }]
        }]
      }
    },
    computed: {
      curdetail: function () {
        return this.menu.filter((item) => item.type == this.kind)[0].child
      }
    },
    methods: {
        mouseleave:function(){
            let self=this;
            self._time=setTimeout(function(){
                self.kind=""
            })
        },
        mouseenter:function(e){
            this.kind=e.target.querySelector('i').className;
        }
    },
  }

</script>
<style>
</style>
