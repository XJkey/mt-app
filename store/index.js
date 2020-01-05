import axios from '../server/interface/utils/axios'

const actions = {
  async nuxtServerInit({
    commit
  }, {
    req,app
  }) {
    const {
      status,
      data: {
        province,
        city
      }
    } = await axios.get('/geo/getPosition')
    commit('geo/setPosition', status === 200 ? {
      city,
      province
    } : {
      city: '',
      province: ''
    })


    const {
      status: status2,
      data: {
        menu
      }
    } = await axios.get('/geo/menu');
    commit('home/setMenu', status2 === 200 ? menu : [])

    const {
      status: status3,
      data: {
        result
      }
    } = await axios.get('/search/hotPlace', {
      params: {
        city: app.store.state.geo.position.city.replace('市','')
      }
    });

    commit('home/setHotPlace', status3 === 200 ? result : [])

  }
}

export {
  actions
}
