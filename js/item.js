(function(window, Vue, $){
  Vue.component('map-item', {
    template: '#item-tpl',
    props:{
      icon: {
        type: Boolean,
      },
      asiento: {
        type: Object,
        default: function(){
          return {
            tipo: 'P',
            nombre_mostrar: '',
            nombre_real: '',
          }
        } 
      },
      ocupado: {
        type: Boolean,
        default: false,
      },
      fixed: {
        type: Boolean,
        default: false,
      },
      padded: {
        type: Boolean,
        default: false,
      },
      seleccionado: {
        default: false,
        type: Boolean,
      },
    },
    computed: {
      show_icon: function(){
        return this.icon || this.es_usable || this.es_silla_ruedas;
      },
      tipo: function(){
        return (this.asiento || {}).tipo
      },
      es_pasillo: function(){
        return this.tipo == 'P'
      },
      es_no_disponible: function(){
        return this.tipo == 'N';
      },
      es_silla_ruedas: function(){
        return this.tipo == 'S';
      },
      es_usable: function(){
        return this.tipo == '';
      },
      label: function(){
        if(this.es_pasillo || this.es_no_disponible){
          return '&nbsp;&nbsp;&nbsp;';
        }
        return (this.asiento || {}).nombre_mostrar;
      }
    },
    methods:{
      handle: function(e){
        if(!this.asiento.ocupado && this.es_usable){
          this.$emit('select', this.asiento);
        }
      }
    }
  });
})(window, Vue, jQuery);
