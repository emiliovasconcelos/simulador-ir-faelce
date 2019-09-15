var botaoCalcular = document.querySelector("#realizar-calculo");

botaoCalcular.addEventListener("click", function(event) {
    event.preventDefault();

    //recebendo os valores do formulário
    var dataNascimento = new Date(document.getElementById("data-nascimento").value);
    var sexo = document.getElementById("sexo").value;
    var idadeAposentadoria = document.getElementById("idade-aposentadoria").value;
    var salario = document.getElementById("salario-real-contribuicao").value;
    var aporte = document.getElementById("aporte-inicial").value;
    var contribuicaoEspontanea = document.getElementById("contribuicao-espontanea").value;
    var rentabilidadeEsperada = document.getElementById("rentabilidade-esperada").value;
    var prazoRecebimento = document.getElementById("prazo-recebimento").value;

    //calculando a idade
    var dataSimulacao = new Date();
    var idadeAtualEmMeses = Math.trunc((dataSimulacao.getTime() - dataNascimento.getTime()) / (1000 * 3600 * 24 * 365.25) * 12);
    
    //calculando o tempo de acumulação em meses
    var tempoAcumulacaoReservaEmMeses = idadeAposentadoria * 12 - idadeAtualEmMeses;

    //tabela de contribuição
    var unidadeDeReferência = (211.76*1.0271*1.0478*1.0726*1.0418*1.0539*1.0666*1.0599*1.0558*1.0634*1.1033*1.085*1.0183);
    var tabelaContribuicao = [
        ["Faixa 1", unidadeDeReferência * 5, 0.025],
        ["Faixa 2", unidadeDeReferência * 10, 0.04],
        ["Faixa 3", "Sem teto", 0.09]
    ];

    //divisão do salário por faixa de contribuição
    var salarioFaixa1 = Math.min(salario, tabelaContribuicao[0][1]);
    var salarioFaixa2 = Math.min(salario - salarioFaixa1, tabelaContribuicao[1][1] - tabelaContribuicao[0][1]);
    var salarioFaixa3 = (salario - salarioFaixa1 - salarioFaixa2);

    //cálculo da contribuição por faixa salarial
    var contribuicaoFaixa1 = (salarioFaixa1 * tabelaContribuicao[0][2]);
    var contribuicaoFaixa2 = (salarioFaixa2 * tabelaContribuicao[1][2]);
    var contribuicaoFaixa3 = (salarioFaixa3 * tabelaContribuicao[2][2]);
    var contribuicaoTotal = (contribuicaoFaixa1 + contribuicaoFaixa2 + contribuicaoFaixa3);

    //contribuição destinada à formação da reserva
    var contribuicaoBasica = (contribuicaoTotal * 0.8375);
    var contribuicaoParticipante = contribuicaoBasica;
    var contribuicaoPatrocinador = contribuicaoBasica;
    
    /*criando variáveis para guardar ano e mês, getMonth retorna o mês
    de 0 a 11, por isso somei um para retornar de 1 a 12*/
    if (dataSimulacao.getMonth() != 11) {
        var anoSimulacao = dataSimulacao.getFullYear();
        var mesSimulacao = dataSimulacao.getMonth() + 1;
    } else {
        var anoSimulacao = dataSimulacao.getFullYear() + 1;
        var mesSimulacao = 1;
    }

    var vetorResultado = new Array();
    var saldoInicialMes = 0;
    var saldoFinalMes = 0;
    var contribuicaoTotalMes;
    var valorRentabilidadeMes;

    for (let i = 0; i < tempoAcumulacaoReservaEmMeses; i++) {
        
        if (mesSimulacao != 12) {
            anoSimulacao = anoSimulacao;
            mesSimulacao ++
        } else {
            anoSimulacao ++;
            mesSimulacao = 1;
        }
        
        if (mesSimulacao != 12) {
            contribuicaoParticipante = contribuicaoBasica;
            contribuicaoPatrocinador = contribuicaoBasica;
        } else {
            contribuicaoParticipante = contribuicaoBasica * 2;
            contribuicaoPatrocinador = contribuicaoBasica * 2;
        }
        if(i != 0) aporte = 0;

        saldoInicialMes = saldoFinalMes;
        contribuicaoTotalMes = parseFloat(saldoInicialMes) + parseFloat(contribuicaoParticipante) + parseFloat(contribuicaoPatrocinador) + parseFloat(contribuicaoEspontanea) + parseFloat(aporte);
        valorRentabilidadeMes = contribuicaoTotalMes * (Math.pow(1 + rentabilidadeEsperada/100, 1/12) - 1);
        saldoFinalMes = parseFloat(contribuicaoTotalMes) + parseFloat(valorRentabilidadeMes);

        vetorResultado.push([
            anoSimulacao,
            mesSimulacao,
            saldoInicialMes,
            contribuicaoParticipante,
            contribuicaoPatrocinador,
            contribuicaoEspontanea,
            aporte,
            contribuicaoTotalMes,
            valorRentabilidadeMes,
            saldoFinalMes
        ])

        console.log(vetorResultado[i][0] + "\t" + vetorResultado[i][1] + "\t" + vetorResultado[i][2] + "\t" + vetorResultado[i][3] + "\t" + vetorResultado[i][4] + "\t" + vetorResultado[i][5] + "\t" + vetorResultado[i][6] + "\t" + vetorResultado[i][7] + "\t" + vetorResultado[i][8] + "\t" + vetorResultado[i][9]);
    }

    var valorSaldoFinal = vetorResultado[tempoAcumulacaoReservaEmMeses-1][9];
    var fator = Math.pow(1 + rentabilidadeEsperada / 100, 1 / 12) * (1 - Math.pow(1 + rentabilidadeEsperada / 100, -prazoRecebimento)) / (Math.pow(1 + rentabilidadeEsperada / 100, 1 / 12) - 1);
    var valorBeneficioSimulacao = valorSaldoFinal / fator;
    
    //criando td para contribuição
    var tdTextoContribuicao = document.createElement("td");
    tdTextoContribuicao.textContent = "Contribuição simulada";
    tdTextoContribuicao.classList.add("resultado-contribuicao-texto");
    var tdValorContribuicao = document.createElement("td");
    tdValorContribuicao.textContent = contribuicaoParticipante.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    tdValorContribuicao.classList.add("resultado-contribuicao-valor");

    //criando td para benefício
    var tdTextoBeneficio = document.createElement("td");
    tdTextoBeneficio.textContent = "Benefício simulado";
    tdTextoBeneficio.classList.add("resultado-beneficio-texto");
    var tdValorBeneficio = document.createElement("td");
    tdValorBeneficio.textContent = valorBeneficioSimulacao.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    tdValorBeneficio.classList.add("resultado-beneficio-valor");

    //criando tr contribuição
    var trContribuicao = document.createElement("tr");
    trContribuicao.appendChild(tdTextoContribuicao);
    trContribuicao.appendChild(tdValorContribuicao);

    //criando tr benefício
    var trBeneficio = document.createElement("tr");
    trBeneficio.appendChild(tdTextoBeneficio);
    trBeneficio.appendChild(tdValorBeneficio);

    //inserindo tr e td na tabela
    var tabela = document.querySelector("#tabela-resultado");
    tabela.appendChild(trContribuicao);
    tabela.appendChild(trBeneficio);










})