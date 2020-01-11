<template>
  <section class="m-istyle">
    <dl @mouseover="over">
      <dt>有格调</dt>
      <dd :class="{active:kind==='all'}" kind="all" keyword="景点">全部</dd>
      <dd :class="{active:kind==='part'}" kind="part" keyword="美食">约会聚餐</dd>
      <dd :class="{active:kind==='spa'}" kind="spa" keyword="丽人">丽人SPA</dd>
      <dd :class="{active:kind==='movie'}" kind="movie" keyword="电影">电影演出</dd>
      <dd :class="{active:kind==='travel'}" kind="travel" keyword="旅游">品质出游</dd>
    </dl>
    <ul class="ibody" style="height: 964px;" id="output" ref="showMore">
      <li v-for="item in cur" :key="item.title">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img :src="item.img" class="image">
          <ul class="cbody">
            <li class="title">{{ item.title }}</li>
            <li class="pos"><span>{{ item.pos }}</span></li>
            <li class="price">￥<em>{{ item.price }}</em><span>/起</span></li>
          </ul>
        </el-card>
      </li>
    </ul>
  </section>
</template>
<script>
  export default {
    data: () => {
      return {
        kind: 'all',
        isquest: true,
        list: {
          all: [],
          part: [],
          spa: [],
          movie: [],
          travel: []
        }
      }
    },
    computed: {
      cur: function () {
        return this.list[this.kind]
      }
    },
    async mounted() {
      window.addEventListener('scroll', this.handleScroll)
      let self = this;
      let {
        status,
        data: {
          count,
          pois
        }
      } = await self.$axios.get('/search/resultsByKeywords', {
        params: {
          keyword: '景点',
          city: self.$store.state.geo.position.city
        }
      })
      if (status === 200 && count > 0) {
        let r = pois.filter(item => item.photos.length).map(item => {
          return {
            title: item.name,
            pos: item.type.split(';')[0],
            price: item.biz_ext.cost || '暂无',
            img: item.photos[0].url,
            url: '//abc.com'
          }
        })
        self.list[self.kind] = r.slice(0, 9)
      } else {
        self.list[self.kind] = []
      }

    },
    methods: {
      over: async function (e) {
        let dom = e.target
        let tag = dom.tagName.toLowerCase()
        let self = this
        if (tag === 'dd') {
          if (!this.isquest) return;
          this.kind = dom.getAttribute('kind');
          if (this.list[this.kind].length) return;
          this.isquest = false;
          let keyword = dom.getAttribute('keyword');
          (async function (kind) {
            let {
              status,
              data: {
                count,
                pois
              }
            } = await self.$axios.get('/search/resultsByKeywords', {
              params: {
                keyword,
                city: self.$store.state.geo.position.city
              }
            })
            if (status === 200 && count > 0) {
              let r = pois.filter(item => item.photos.length).map(item => {
                return {
                  title: item.name,
                  pos: item.type.split(';')[0],
                  price: item.biz_ext.cost || '暂无',
                  img: item.photos[0].url,
                  url: '//abc.com'
                }
              })
              self.list[kind] = r.slice(0, 9)
            } else {
              self.list[kind] = []
            }
          })(self.kind)

          this.isquest = true;
        }
      },
      showScroll() {
        let st = document.getElementById('output').scrollTop
        // let sh = document.getElementById('output').scrollHeight

        if (st === 0) {
          console.log('到顶了;')
          // 你的业务逻辑
        }
      },
      handleScroll() {
        this.$nextTick(()=>{
              console.log(this.$refs.showMore.getBoundingClientRect())
          })
      },
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },
  }

</script>
<style lang="scss">
  @import "@/assets/css/index/artistic.scss";

</style>
