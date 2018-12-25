Vue.filter('hora_numerica', function(value){
  value = value ? (value+'') :  '';
  return value.substring(0, 2) + ':' + value.substring(2);
})

Vue.filter('fecha_humana', function(value){
  value = value ? (value+'') :  '';
  return value.split('-').reverse().join('/');
})