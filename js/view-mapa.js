(function(window, Vue, $, luxon, axios){
  var DateTime = luxon.DateTime;
  var TIMER = null;
  Vue.component('mapa-view', {
    mounted: function(){
      var self = this;
      var fid = this.$route.params.id;
      var url = window.SALA_URL(fid);
      
      axios.get(url, window.AXIOS_CFG()).then(function(response){
        response.data.mapa = response.data.mapa.map(function(e){
          var coord = Object.keys(e).filter(function(e){
            return e != 'nombre_real'
          })[0];
          
          e.tipo = e[coord];
          e.nombre_mostrar = e.nombre_real;

          if(e.nombre_real.length == 2){
            var arr = e.nombre_real.split('')
            arr.splice(-1, 0, '0')
            e.nombre_mostrar = arr.join('')
          }
            
          e.coord = coord;
          e.columna = coord.substring(0, 1);
          e.fila = coord.substring(1);
          e.fila_mostrar = e.nombre_mostrar.substr(1);
          e.fila_mostrar = e.fila_mostrar.length == 1 ? ('0' + e.fila_mostrar) : e.fila_mostrar;
          return e;
        })
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
          cell.coord, 
          !(this.seleccionados[cell.coord] || false)
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

        (this.sala.mapa || []).forEach(function(e){
          hash[e.columna] = hash[e.columna] || {};
          hash[e.columna][e.fila] = e;
        });

        return hash;
      },
      columnas: function(){
        if(!this.sala)
          return {};

        var obj = (this.sala.mapa || []).map(function(e){
          return e.columna
        }).reduce(function(c, n){ c[n] = true ;return c }, {});

        return Object.keys(obj).sort().reverse()
      },
      filas: function(){
        if(!this.sala)
          return {};

        var obj = (this.sala.mapa || []).map(function(e){
          return e.fila
        }).reduce(function(c, n){ c[n] = true ;return c }, {});

        return Object.keys(obj)
          .map(function(e){ 
            return parseFloat(e) 
          })
          .sort(function(a, b) {
            return a - b
          }).map(function(e){
            return ''+e
          }).reverse()
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
