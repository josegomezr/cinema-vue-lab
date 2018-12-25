var routes = [
  { 
    name: 'home',
    path: '/', 
    component: Vue.component('index-view') 
  },
  { 
    name: 'mapa',
    path: '/mapa/:id', 
    component: Vue.component('mapa-view') 
  },
];

var router = new VueRouter({
  routes: routes,
})

var app = new Vue({
  router: router,
}).$mount('#app');