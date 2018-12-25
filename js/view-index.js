(function(window, Vue, $, luxon, axios){
  var DateTime = luxon.DateTime;

  Vue.component('index-view', {
    mounted: function(){
      var self = this;
      var url = window.CARTELERA_URL();
      axios.get(url, window.AXIOS_CFG()).then(function(response){
        self.peliculas = response.data;
      })
    },
    template: '#index-tpl',
    methods: {
      pagIr: function(p){
        p = Math.min(this.total_paginas, Math.max(p, 0));
        this.pagina = p;
      },
      pagAnterior: function(){
        this.pagina = this.pagina_anterior;
      },
      pagSiguiente: function(){
        if (this.hay_pagina_siguiente) {
          this.pagina = this.pagina_siguiente;
        }
      },
    },
    computed: {
      funciones_disponibles: function(){
        if(!this.peliculas)
          return [];

        return this.peliculas.filter(function(e){
          var now = DateTime.fromObject(new Date());
          var row_fecha = e.fecha + 'T'+ e.hora.substr(0, 2) + ':' + e.hora.substr(2);
          row_fecha = DateTime.fromISO(row_fecha);
          var diff = row_fecha - now;
          var diff = diff / (1000*60);
          return diff > -60;
        })
      },
      total_paginas: function(){
        return Math.ceil(this.funciones_disponibles.length / this.per_page);
      },
      pagina_anterior: function(){
        var page = this.pagina - 1;
        return Math.max(page, 0)
      },
      pagina_siguiente: function(){
        var page = this.pagina + 1;
        return Math.min(page, this.total_paginas);
      },
      hay_pagina_anterior: function(){
        return this.pagina > 0;
      },
      hay_pagina_siguiente: function(){
        return this.pagina < (this.total_paginas-1);
      },
      funciones: function(){
        var per_page = this.per_page;
        var actual = this.pagina;
        var siguiente = this.pagina_siguiente;

        var desde = per_page*actual;
        var hasta = per_page*siguiente;

        return this.funciones_disponibles.slice(desde, hasta);
      }
    },
    data: function(){
      return {
        per_page: 10,
        pagina: 0,
        peliculas: null,
      }
    }
  });
})(window, Vue, jQuery, luxon, axios);
