(function(window, Vue, $, luxon, axios){
  var DateTime = luxon.DateTime;
  var TIMER = null;
  Vue.component('mapa-view', {
    mounted: function(){
      var self = this;
      var fid = this.$route.params.id;
      var url = window.SALA_URL(fid);
      
      axios.get(url, window.AXIOS_CFG()).then(function(response){
        self.sala = response.data;
      });

      TIMER = setInterval(function(){
        var url = window.OCUPADOS_URL(fid)
        axios.get(url, window.AXIOS_CFG()).then(function(response){
          self.sala.asientos_ocupados = self.sala.asientos_ocupados || [];
          if(response.data.asientos_ocupados != 0){
            self.sala.asientos_ocupados = response.data.asientos_ocupados.split(',');
            self.updateSelected();
          }
        });
      }, 5000)
    },
    template: '#mapa-tpl',
    methods: {
      toggle: function(cell){
        this.$set(
          this.seleccionados, 
          cell.nombre_real, 
          !(this.seleccionados[cell.nombre_real] || false)
        )
      },
      updateSelected: function(){
        var self = this;
        (self.sala.asientos_ocupados || []).forEach(function(s){
          self.seleccionados[s] = false;
        })
      },
    },
    destroyed: function(){
      clearInterval(TIMER);
    },
    computed: {
      ocupados: function(){
        var ocupados = {}
        this.sala.asientos_ocupados; // hack
        (this.sala.asientos_ocupados || []).forEach(function(e){
          ocupados[e] = true;
        })
        return ocupados;
      },
      selectedCells: function(){
        var cells = [];
        for(var i in this.seleccionados){
          if(this.seleccionados.hasOwnProperty(i)){
            var col = i.substring(0,1);
            var fila = i.substring(1);
            if(this.seleccionados[i] === true){

              cells.push(this.mapa_hash[col][fila]);
            }
          }
        }
        return cells;
      },
      mapa_hash: function(){
        if(!this.sala)
          return {};

        var self = this;
        
        var hash = {};
        var ocupados = self.ocupados;

        (this.sala.mapa || []).forEach(function(e){
          var key;
          for (var i in e) {
            if(e.hasOwnProperty(i) && i != 'nombre_real'){
              key = i;
              break;
            }
          }
          e.tipo = e[key];

          var columna = e.nombre_real.substr(0, 1);
          var fila = e.nombre_real.substr(1);
          var fila_pad = ('00' + fila).substr(-2);
          
          e.ocupado = false;

          if(ocupados[e.nombre_real]){
            e.ocupado = ocupados[e.nombre_real];
          }
          e.columna = columna;
          e.fila = fila;

          e.fila_pad = fila_pad;
          e.nombre_mostrar = columna + fila_pad;

          hash[columna] = hash[columna] || {};
          hash[columna][fila] = e;
        });

        return hash;
      },
      columnas: function(){
        if(!this.sala)
          return {};

        var obj = (this.sala.mapa || []).map(function(e){
          return e.nombre_real.substr(0, 1)
        }).reduce(function(c, n){ c[n] = true ;return c }, {});

        var keys = [];

        for ( var i in obj ){
          if(obj.hasOwnProperty(i) && obj[i] === true){
            keys.push(i);
          }
        }

        return keys.reverse()
      },
      filas: function(){
        if(!this.sala)
          return {};

        var obj = (this.sala.mapa || []).map(function(e){
          return e.nombre_real.substr(1)
        }).reduce(function(c, n){ c[n] = true ;return c }, {});

        var keys = [];

        for ( var i in obj ){
          if(obj.hasOwnProperty(i) && obj[i] === true){
            keys.push(i);
          }
        }

        return keys.reverse()
      }
    },
    data: function(){
      return {
        sala: {},
        seleccionados: {},
      }
    }
  });
})(window, Vue, jQuery, luxon, axios);
