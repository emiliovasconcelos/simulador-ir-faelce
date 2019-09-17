var botaoCalcular = document.querySelector("#realizar-calculo");

botaoCalcular.addEventListener("click", function(event) {
    event.preventDefault();

    var limparTabelaResultado = document.querySelector("#tabela-resultado");
    var limparMensagemErro = document.querySelector("#mensagem-erro");
    var limparNotaContribuicao = document.querySelector("#nota-contribuicao");
    
    //limpar tela
    limparTabelaResultado.innerHTML = "";
    limparMensagemErro.innerHTML = "";

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
    
    //tratamento de erros
    var erros = [];
    
    if (dataNascimento >= dataSimulacao) {
        erros.push("Data de nascimento maior ou igual a data atual");
        document.getElementById("data-nascimento").focus();
    }

    if (sexo == 1 && idadeAposentadoria < 53) {
        erros.push("A idade mínima de aposentadoria para homens é 53 anos");
        document.getElementById("idade-aposentadoria").focus();
    }

    if (sexo == 2 && idadeAposentadoria < 48) {
        erros.push("A idade mínima de aposentadoria para mulheres é 48 anos");
        document.getElementById("idade-aposentadoria").focus();
    }

    if (salario < 0) {
        erros.push("Salário não pode ser negativo");
        document.getElementById("salario-real-contribuicao").focus();
    }

    if (aporte < 0) {
        erros.push("Aporte Inicial não pode ser menor que zero");
        document.getElementById("aporte-inicial").focus();
    }

    if (contribuicaoEspontanea < 0) {
        erros.push("Contribuição Espontânea não pode ser menor que zero");
        document.getElementById("contribuicao-espontanea").focus();
    }

    if (rentabilidadeEsperada < 0 || rentabilidadeEsperada > 6) {
        erros.push("Rentabilidade esperada deve ser um valor entre 0 e 6");
        document.getElementById("rentabilidade-esperada").focus();
    }

    if (prazoRecebimento < 10 || prazoRecebimento > 50) {
        erros.push("Prazo de recebimento deve ser um valor entre 10 e 50");
        document.getElementById("prazo-recebimento").focus();
    }

    if (erros.length > 0) {
        var ulMensagemErro = document.querySelector("#mensagem-erro");
        ulMensagemErro.innerHTML = "";

        erros.forEach(function(erro){
            var li = document.createElement("li");
            li.textContent = erro;
            ulMensagemErro.appendChild(li);
        });
    }

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
    tdTextoContribuicao.textContent = "Contribuição mensal: ";
    tdTextoContribuicao.classList.add("resultado-contribuicao-texto");
    var tdValorContribuicao = document.createElement("td");
    tdValorContribuicao.textContent = contribuicaoTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    tdValorContribuicao.classList.add("resultado-contribuicao-valor");

    //criando td para reserva acumulada
    var valorReserva = vetorResultado[vetorResultado.length-1][9]
    var tdTextoReserva = document.createElement("td");
    tdTextoReserva.textContent = "Reserva total acumulada: ";
    tdTextoReserva.classList.add("resultado-reserva-texto");
    var tdValorReserva = document.createElement("td");
    tdValorReserva.textContent = valorReserva.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    tdValorReserva.classList.add("resultado-reserva-valor");
    
    //criando td para benefício
    var tdTextoBeneficio = document.createElement("td");
    tdTextoBeneficio.textContent = "Benefício inicial mensal: ";
    tdTextoBeneficio.classList.add("resultado-beneficio-texto");
    var tdValorBeneficio = document.createElement("td");
    tdValorBeneficio.textContent = valorBeneficioSimulacao.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    tdValorBeneficio.classList.add("resultado-beneficio-valor");

    //criando td para prazo de recebimento
    var tdTextoPrazoRecebimento = document.createElement("td");
    tdTextoPrazoRecebimento.textContent = "Prazo de recebimento: ";
    tdTextoPrazoRecebimento.classList.add("resultado-prazo-recebimento-texto");
    var tdValorPrazoRecebimento = document.createElement("td");
    tdValorPrazoRecebimento.textContent = prazoRecebimento + " anos";
    tdValorPrazoRecebimento.classList.add("resultado-prazo-recebimento-valor");

    //criando tr contribuição
    var trContribuicao = document.createElement("tr");
    trContribuicao.appendChild(tdTextoContribuicao);
    trContribuicao.appendChild(tdValorContribuicao);

    //criando tr reserva acumulada
    var trReserva = document.createElement("tr");
    trReserva.appendChild(tdTextoReserva);
    trReserva.appendChild(tdValorReserva);
    
    //criando tr benefício
    var trBeneficio = document.createElement("tr");
    trBeneficio.appendChild(tdTextoBeneficio);
    trBeneficio.appendChild(tdValorBeneficio);

    //criando tr prazo de recebimento
    var trPrazoRecebimento = document.createElement("tr");
    trPrazoRecebimento.appendChild(tdTextoPrazoRecebimento);
    trPrazoRecebimento.appendChild(tdValorPrazoRecebimento);

    //inserindo tr e td na tabela
    var tabela = document.querySelector("#tabela-resultado");
    tabela.appendChild(trContribuicao);
    tabela.appendChild(trReserva);
    tabela.appendChild(trBeneficio);
    tabela.appendChild(trPrazoRecebimento);

    //inserindo notas ao resultado da simulação
    var ulNotaSimulacao = document.querySelector("#nota-contribuicao");
    ulNotaSimulacao.innerHTML = "";
    var notaSimulacao = [];
    notaSimulacao.push("As contribuições para o plano são feitas inclusive sobre o 13º salário");
    notaSimulacao.push("O benefício simulado considera 12 pagamentos por ano");
    notaSimulacao.forEach(function(nota){
        var liNotaSimulacao = document.createElement("li");
        liNotaSimulacao.textContent = nota;
        ulNotaSimulacao.appendChild(liNotaSimulacao);
    });
    
    if (erros.length > 0) {
        limparTabelaResultado.innerHTML = "";
        limparNotaContribuicao.innerHTML = "";      
    }
})