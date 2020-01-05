<template>
  <div class="m-menu"  @mouseleave='mouseleave'>
    <dl class="nav">
      <dt>全部分类</dt>
      <dd v-for="(item, index) in $store.state.home.menu" :key="'menu'+index" @mouseenter="mouseenter">
        <i :class='item.type' />{{item.name}}<span class="arrow"></span>
      </dd>
    </dl>
    <div class="detail" v-if="kind">
      <template v-for="(item, index) in curdetail">
        <h4 :key="index+'y'">{{item.title}}</h4>
        <span v-for="(v, idx) in item.child" :key="index+'x'+idx">
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
      }
    },
    computed: {
      curdetail: function () {
        return this.$store.state.home.menu.filter((item) => item.type == this.kind)[0].child
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
