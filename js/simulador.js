var botaoCalcular = document.querySelector("#realizar-calculo");

botaoCalcular.addEventListener("click", function(event) {
    event.preventDefault();

    //recebendo os valores do formulário
    var dataNascimento = new Date(document.getElementById("data-nascimento").value);
    var sexo = document.getElementById("sexo").value;
    var idadeAposentadoria = document.getElementById("idade-aposentadoria").value;
    var salario = document.getElementById("salario-real-contribuicao").value;
    var aporteInicial = document.getElementById("aporte-inicial").value;
    var contribuicaoEspontanea = document.getElementById("contribuicao-espontanea").value;
    var rentabilidadeEsperada = document.getElementById("rentabilidade-esperada").value;
    var prazoRecebimento = document.getElementById("prazo-recebimento").value;

    //calculando a idade
    var dataSinulacao = new Date();
    var idadeAtualEmMeses = Math.trunc((dataSinulacao.getTime() - dataNascimento.getTime()) / (1000 * 3600 * 24 * 365.25) * 12);
    
    //calculando o tempo de acumulação em meses
    var tempoAcumulacaoReservaEmMeses = idadeAposentadoria * 12 - idadeAtualEmMeses;

    //tabela de contribuição
    var unidadeDeReferência = (211.76*1.0271*1.0478*1.0726*1.0418*1.0539*1.0666*1.0599*1.0558*1.0634*1.1033*1.085*1.0183).toFixed(2);
    var tabelaContribuição = [
        ["Faixa 1", unidadeDeReferência * 5, 0.025],
        ["Faixa 2", unidadeDeReferência * 10, 0.04],
        ["Faixa 3", "Sem teto", 0.09]
    ];

    //calculo da contribuição
    var contribuicaoTotal = 


    //array para guardar os elementos

    alert(unidadeDeReferência);
})