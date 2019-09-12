function formatar(mascara, documento){
    let i = documento.value.length;
    let saida = mascara.substring(0,1);
    let texto = mascara.substring(i)
  
    if (texto.substring(0,1) != saida){
        documento.value += texto.substring(0,1);
    }
}
