var botaoCalcular = document.querySelector("#realizar-calculo-incentivo-fiscal");

botaoCalcular.addEventListener("click", function(event) {
    event.preventDefault();

    var limparTabelaResultado = document.querySelector("#tabela-resultado-incentivo-fiscal");
    var limparMensagemErro = document.querySelector("#mensagem-erro-incentivo-fiscal");
    var limparNotaContribuicao = document.querySelector("#nota-contribuicao-incentivo-fiscal");
    
    //limpar tela
    limparTabelaResultado.innerHTML = "";
    limparMensagemErro.innerHTML = "";
    limparNotaContribuicao.innerHTML = "";

    //recebendo os valores do formulário
    var salario = document.getElementById("salario-real-contribuicao-incentivo-fiscal").value;
    var qtdDependente = document.getElementById("quantidade-dependente-incentivo-fiscal").value;
    
    //tratamento de erros
    var erros = [];

    if (salario < 0) {
        erros.push("Salário não pode ser menor que zero");
        document.getElementById("salario-real-contribuicao-incentivo-fiscal").focus();
    }

    if (qtdDependente < 0) {
        erros.push("Quantidade de dependentes não pode ser menor que zero");
        document.getElementById("quantidade-dependente-incentivo-fiscal").focus();
    }
    if (erros.length > 0) {
        var ulMensagemErro = document.querySelector("#mensagem-erro-incentivo-fiscal");
        ulMensagemErro.innerHTML = "";

        erros.forEach(function(erro){
            var li = document.createElement("li");
            li.textContent = erro;
            ulMensagemErro.appendChild(li);
        });
    }

    //tabela de contribuição INSS
    var tabelaContribuicaoInss = [
        ["Faixa 1", 1751.81, 0.08],
        ["Faixa 2", 2919.72, 0.09],
        ["Faixa 3", 5839.45, 0.11]
    ];
    
    var contribuicaoTotalInss;

    if (salario <= tabelaContribuicaoInss[0][1]) contribuicaoTotalInss = salario * tabelaContribuicaoInss[0][2];
    else if (salario <= tabelaContribuicaoInss[1][1]) contribuicaoTotalInss = salario * tabelaContribuicaoInss[1][2];
    else if (salario <= tabelaContribuicaoInss[2][1]) contribuicaoTotalInss = salario * tabelaContribuicaoInss[2][2];
    else if (salario > tabelaContribuicaoInss[2][1]) contribuicaoTotalInss = tabelaContribuicaoInss[2][1] * tabelaContribuicaoInss[2][2];

    //tabela de contribuição FAELCE
    var unidadeDeReferênciaFaelce = (211.76*1.0271*1.0478*1.0726*1.0418*1.0539*1.0666*1.0599*1.0558*1.0634*1.1033*1.085*1.0183*1.04);
    var tabelaContribuicaoFaelce = [
        ["Faixa 1", unidadeDeReferênciaFaelce * 5, 0.025],
        ["Faixa 2", unidadeDeReferênciaFaelce * 10, 0.04],
        ["Faixa 3", "Sem teto", 0.09]
    ];

    //divisão do salário por faixa de contribuição FAELCE
    var salarioFaixa1Faelce = Math.min(salario, tabelaContribuicaoFaelce[0][1]);
    var salarioFaixa2Faelce = Math.min(salario - salarioFaixa1Faelce, tabelaContribuicaoFaelce[1][1] - tabelaContribuicaoFaelce[0][1]);
    var salarioFaixa3Faelce = (salario - salarioFaixa1Faelce - salarioFaixa2Faelce);

    //cálculo da contribuição por faixa salarial FAELCE
    var contribuicaoFaixa1Faelce = (salarioFaixa1Faelce * tabelaContribuicaoFaelce[0][2]);
    var contribuicaoFaixa2Faelce = (salarioFaixa2Faelce * tabelaContribuicaoFaelce[1][2]);
    var contribuicaoFaixa3Faelce = (salarioFaixa3Faelce * tabelaContribuicaoFaelce[2][2]);
    var contribuicaoTotalFaelce = (contribuicaoFaixa1Faelce + contribuicaoFaixa2Faelce + contribuicaoFaixa3Faelce);

    //tabela de Imposto de Renda - IR
    var tabelaContribuicaoIr = [
        ["Faixa 0", 1903.98, 0.00],
        ["Faixa 1", 2826.66, 0.075],
        ["Faixa 2", 3751.05, 0.15],
        ["Faixa 3", 4664.68, 0.225],
        ["Faixa 4", "Sem teto", 0.275]
    ];

    //Dedução na base de cálculo do IR por dependente
    var deducaoPorDependente = 189.59

    //Salário líquido para IR sem Faelce
    //******************************************************//
    var salarioLiquidoIrSemFaelce = salario - contribuicaoTotalInss - qtdDependente * deducaoPorDependente;
  
    //divisão do salário por faixa de contribuição Imposto de Renda
    var salarioFaixa0IrSemFaelce = Math.min(salarioLiquidoIrSemFaelce, tabelaContribuicaoIr[0][1]);
    var salarioFaixa1IrSemFaelce = Math.min(salarioLiquidoIrSemFaelce - salarioFaixa0IrSemFaelce, tabelaContribuicaoIr[1][1] - tabelaContribuicaoIr[0][1]);
    var salarioFaixa2IrSemFaelce = Math.min(salarioLiquidoIrSemFaelce - salarioFaixa0IrSemFaelce - salarioFaixa1IrSemFaelce, tabelaContribuicaoIr[2][1] - tabelaContribuicaoIr[1][1]);
    var salarioFaixa3IrSemFaelce = Math.min(salarioLiquidoIrSemFaelce - salarioFaixa0IrSemFaelce - salarioFaixa1IrSemFaelce - salarioFaixa2IrSemFaelce, tabelaContribuicaoIr[3][1] - tabelaContribuicaoIr[2][1]);
    var salarioFaixa4IrSemFaelce = salarioLiquidoIrSemFaelce - salarioFaixa0IrSemFaelce - salarioFaixa1IrSemFaelce - salarioFaixa2IrSemFaelce - salarioFaixa3IrSemFaelce;
    
    //cálculo do imposto de renda por faixa salarial
    var contribuicaoFaixa0IrSemFaelce = salarioFaixa0IrSemFaelce * tabelaContribuicaoIr[0][2];
    var contribuicaoFaixa1IrSemFaelce = salarioFaixa1IrSemFaelce * tabelaContribuicaoIr[1][2];
    var contribuicaoFaixa2IrSemFaelce = salarioFaixa2IrSemFaelce * tabelaContribuicaoIr[2][2];
    var contribuicaoFaixa3IrSemFaelce = salarioFaixa3IrSemFaelce * tabelaContribuicaoIr[3][2];
    var contribuicaoFaixa4IrSemFaelce = salarioFaixa4IrSemFaelce * tabelaContribuicaoIr[4][2];
    var contribuicaoTotalIrSemFaelce = contribuicaoFaixa0IrSemFaelce + contribuicaoFaixa1IrSemFaelce + contribuicaoFaixa2IrSemFaelce + contribuicaoFaixa3IrSemFaelce + contribuicaoFaixa4IrSemFaelce;
    //******************************************************//
    
    //Salário líquido para IR
    //******************************************************
    var salarioLiquidoIr = salario - contribuicaoTotalInss - contribuicaoTotalFaelce - qtdDependente * deducaoPorDependente;
    
    //divisão do salário por faixa de contribuição Imposto de Renda
    var salarioFaixa0Ir = Math.min(salarioLiquidoIr, tabelaContribuicaoIr[0][1]);
    var salarioFaixa1Ir = Math.min(salarioLiquidoIr - salarioFaixa0Ir, tabelaContribuicaoIr[1][1] - tabelaContribuicaoIr[0][1]);
    var salarioFaixa2Ir = Math.min(salarioLiquidoIr - salarioFaixa0Ir - salarioFaixa1Ir, tabelaContribuicaoIr[2][1] - tabelaContribuicaoIr[1][1]);
    var salarioFaixa3Ir = Math.min(salarioLiquidoIr - salarioFaixa0Ir - salarioFaixa1Ir - salarioFaixa2Ir, tabelaContribuicaoIr[3][1] - tabelaContribuicaoIr[2][1]);
    var salarioFaixa4Ir = salarioLiquidoIr - salarioFaixa0Ir - salarioFaixa1Ir - salarioFaixa2Ir - salarioFaixa3Ir;

    //cálculo do imposto de renda por faixa salarial
    var contribuicaoFaixa0Ir = salarioFaixa0Ir * tabelaContribuicaoIr[0][2];
    var contribuicaoFaixa1Ir = salarioFaixa1Ir * tabelaContribuicaoIr[1][2];
    var contribuicaoFaixa2Ir = salarioFaixa2Ir * tabelaContribuicaoIr[2][2];
    var contribuicaoFaixa3Ir = salarioFaixa3Ir * tabelaContribuicaoIr[3][2];
    var contribuicaoFaixa4Ir = salarioFaixa4Ir * tabelaContribuicaoIr[4][2];
    var contribuicaoTotalIr = contribuicaoFaixa0Ir + contribuicaoFaixa1Ir + contribuicaoFaixa2Ir + contribuicaoFaixa3Ir + contribuicaoFaixa4Ir;
    //******************************************************
    
    var contribuicaoTotalIrDiferenca = contribuicaoTotalIrSemFaelce - contribuicaoTotalIr;
    var contribuicaoTotalFaelceMenosIr = contribuicaoTotalFaelce - contribuicaoTotalIrDiferenca;
    //criando td para contribuição INSS
    var tdTextoContribuicaoInss = document.createElement("td");
    tdTextoContribuicaoInss.textContent = "Contribuição mensal para o INSS: ";
    tdTextoContribuicaoInss.classList.add("resultado-contribuicao-texto");
    var tdValorContribuicaoInss = document.createElement("td");
    tdValorContribuicaoInss.textContent = contribuicaoTotalInss.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    tdValorContribuicaoInss.classList.add("resultado-contribuicao-valor");

    //criando td para contribuição FAELCE
    var tdTextoContribuicaoFaelce = document.createElement("td");
    tdTextoContribuicaoFaelce.textContent = "Contribuição mensal para o Plano CD: ";
    tdTextoContribuicaoFaelce.classList.add("resultado-contribuicao-texto");
    var tdValorContribuicaoFaelce = document.createElement("td");
    tdValorContribuicaoFaelce.textContent = contribuicaoTotalFaelce.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    tdValorContribuicaoFaelce.classList.add("resultado-contribuicao-valor");

    //criando td para imposto de renda sem FAELCE
    var tdTextoContribuicaoIrSemFaelce = document.createElement("td");
    tdTextoContribuicaoIrSemFaelce.textContent = "Valor do imposto de renda sem a contribuição para o Plano CD: ";
    tdTextoContribuicaoIrSemFaelce.classList.add("resultado-contribuicao-texto");
    var tdValorContribuicaoIrSemFaelce = document.createElement("td");
    tdValorContribuicaoIrSemFaelce.textContent = contribuicaoTotalIrSemFaelce.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    tdValorContribuicaoIrSemFaelce.classList.add("resultado-contribuicao-valor");

    //criando td para imposto de renda com FAELCE
    var tdTextoContribuicaoIr = document.createElement("td");
    tdTextoContribuicaoIr.textContent = "Valor do imposto de renda com a contribuição para o Plano CD: ";
    tdTextoContribuicaoIr.classList.add("resultado-contribuicao-texto");
    var tdValorContribuicaoIr = document.createElement("td");
    tdValorContribuicaoIr.textContent = contribuicaoTotalIr.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    tdValorContribuicaoIr.classList.add("resultado-contribuicao-valor");

    //criando tr contribuição INSS
    var trContribuicaoInss = document.createElement("tr");
    trContribuicaoInss.appendChild(tdTextoContribuicaoInss);
    trContribuicaoInss.appendChild(tdValorContribuicaoInss);

    //criando tr contribuição FAELCE
    var trContribuicaoFaelce = document.createElement("tr");
    trContribuicaoFaelce.appendChild(tdTextoContribuicaoFaelce);
    trContribuicaoFaelce.appendChild(tdValorContribuicaoFaelce);

    //criando tr contribuição imposto de renda sem FAELCE
    var trContribuicaoIrSemFaelce = document.createElement("tr");
    trContribuicaoIrSemFaelce.appendChild(tdTextoContribuicaoIrSemFaelce);
    trContribuicaoIrSemFaelce.appendChild(tdValorContribuicaoIrSemFaelce);

    //criando tr contribuição imposto de renda com FAELCE
    var trContribuicaoIr = document.createElement("tr");
    trContribuicaoIr.appendChild(tdTextoContribuicaoIr);
    trContribuicaoIr.appendChild(tdValorContribuicaoIr);

    //inserindo tr e td na tabela
    var tabela = document.querySelector("#tabela-resultado-incentivo-fiscal");
    tabela.appendChild(trContribuicaoInss);
    tabela.appendChild(trContribuicaoFaelce);
    tabela.appendChild(trContribuicaoIrSemFaelce);
    tabela.appendChild(trContribuicaoIr);

    //inserindo notas ao resultado da simulação
    var ulNotaSimulacao = document.querySelector("#nota-contribuicao-incentivo-fiscal");
    ulNotaSimulacao.innerHTML = "";
    var notaSimulacao = [];
    notaSimulacao.push(
        `
        Para um Salário Real de Contribuição de ${parseFloat(salario).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
        , a contribuição mensal ao Plano CD corresponde a ${contribuicaoTotalFaelce.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
        , proporcionando uma dedução mensal de ${contribuicaoTotalIrDiferenca.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
        no valor do Imposto de Renda na própria folha de pagamento. Ou seja, mensalmente você contribui com ${contribuicaoTotalFaelce.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
        , o patrocinador também contribui com ${contribuicaoTotalFaelce.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
        , mas você desenbolsa somente ${contribuicaoTotalFaelceMenosIr.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
        `
    );
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