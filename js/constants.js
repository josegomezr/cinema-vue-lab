(function(window, Vue, $){
  var BASE = "da-domain";
  var API_KEY = 'da-key';
  window.CARTELERA_URL = function(id){
    // return 'json/json-cartelera.json';
    return BASE + '/cartelera';
  }

  window.SALA_URL = function(fid){
    // return 'json/json-sala.json'
    return BASE + '/sala/' + fid;
  };

  window.OCUPADOS_URL = function(fid){
    // return 'json/json-ocupados.json'
    return BASE + '/listar/ocupados/' + fid;
  };

  window.API_HEADERS = function(){
    return {
      Authorization: API_KEY
    }
  }

  window.AXIOS_CFG = function(){
    return {
      headers: window.API_HEADERS()
    }
  }
})(window, Vue, jQuery);
