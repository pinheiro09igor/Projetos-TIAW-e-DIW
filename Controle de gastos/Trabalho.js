$(function(){
    var operacao = "A"; //"A"=Adição; "E"=Edição
    var indice_selecionado = -1;
    var tbClientes = localStorage.getItem("tbClientes");// Recupera os dados armazenados
    var datas;
    tbClientes = JSON.parse(tbClientes); // Converte string para objeto

    if(tbClientes == null) // Caso não haja conteúdo, iniciamos um vetor vazio
        tbClientes = [];

    $("gasto").on("change",function(){
        $(this).val(parseFloat($(this).val()).toFixed(2));
    });

    function Adicionar(){
        var data = $("#data").val();
        let split = data.split('-');
        let formated = split[2]+"/"+split[1]+"/"+split[0];

         var cliente = JSON.stringify({
            Descrição: $("#descricao").text(),
            Gasto:     $("#gasto").val(),
            Data:      formated,
            Categoria: $("#categoria").val()
        });
        tbClientes.push(cliente);

        localStorage.setItem("tbClientes", JSON.stringify(tbClientes));

        alert("Registro adicionado.");
        return true;
    }

    function Editar(){
        tbClientes[indice_selecionado] = JSON.stringify({
                Descrição: $("#descricao").val(),
                Gasto:     $("#gasto").val(),
                Data:      $("#data").val(),
                Categoria: $("#categoria").val()
            });
        localStorage.setItem("tbClientes", JSON.stringify(tbClientes));
        alert("Informações editadas.")
        operacao = "A";
        return true;
    }

    function Listar(){
        $("#tblListar").html("");
        $("#tblListar").html(
            "<thead>"+
            "   <tr>"+
            "   <th scope='col'>Descrição</th>"+
            "   <th scope='col'>Gasto</th>"+
            "   <th scope='col'>Data</th>"+
            "   <th scope='col'>Categoria</th>"+
            "   <th scope='col'></th>"+
            "   </tr>"+
            "</thead>"+
            "<tbody>"+
            "</tbody>"
            );
        var soma=0,soma1=0,soma2=0,soma3=0,soma4=0,soma5=0,soma6=0,soma7=0, somaData=[];
        var listaData=[], novaArr=[];
         for(var i in tbClientes){
            var cli = JSON.parse(tbClientes[i]);
            $("#tblListar tbody").append("<tr>"+
                                         "  <td>"+cli.Descricao+"</td>" + 
                                         "  <td>"+cli.Gasto+"</td>" + 
                                         "  <td>"+cli.Data+"</td>" + 
                                         "  <td>"+cli.Categoria+"</td>" + 
                                         "  <td><img src='edit.png' alt='"+i+"' class='btnEditar'/><img src='delete.png' alt='"+i+"' class='btnExcluir'/></td>" +
                                         "</tr>");
            if(cli.Categoria=="Sem categoria")
                soma+= parseFloat(cli.Gasto);
            if(cli.Categoria=="Hortifruti e mercearia")
                soma1+= parseFloat(cli.Gasto);
            if(cli.Categoria=="Higiene e limpeza")
                soma2+= parseFloat(cli.Gasto);
            if(cli.Categoria=="Temperos")
                soma3+= parseFloat(cli.Gasto);
            if(cli.Categoria=="Açougue")
                soma4+= parseFloat(cli.Gasto);
            if(cli.Categoria=="Adega e bebidas")
                soma5+= parseFloat(cli.Gasto);
            if(cli.Categoria=="Cereais")
                soma6+= parseFloat(cli.Gasto);
            if(cli.Categoria=="Frios e laticínios")
                soma7+= parseFloat(cli.Gasto);
            
            listaData.push(cli.Data);           
            novaArr = listaData.filter((este, i) => listaData.indexOf(este) === i);
            
            for(var j in novaArr){
               if(cli.Data == novaArr[j]){
                    somaData[j] = 0;
                    somaData[j]+= somaData[j]+ parseFloat(cli.Gasto);
                }
            }
         }

        let segundoGrafico = document.getElementById('segundoGrafico').getContext('2d');
        let chart2 = new Chart(segundoGrafico, {
            type: 'bar',
            data: {
                labels: novaArr,
                datasets: [{
                    label: 'Gastos por Dia',
                    data: somaData,
                    backgroundColor: ["#ff2200"]
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Grafico de Gastos por Dia'
                }
            }
        });

        let primeiroGrafico = document.getElementById('primeiroGrafico').getContext('2d');
        let chart = new Chart(primeiroGrafico, {
            type: 'pie',
            data: {
                labels: ['Sem categoria', 'Hortifruti e mercearia', 'Higiene e limpeza', 'Temperos', 'Açougue', 'Adega e bebidas', 'Cereais', 'Frios e laticínios'],
                datasets: [{
                    label: 'Gastos por Categoria',
                    data: [soma, soma1, soma2, soma3, soma4, soma5, soma6, soma7],
                    backgroundColor: ["#ff2200","#088A08","#0404B4","#6E6E6E","#FFFF00","#3B0B0B","#58D3F7","#74DF00"]
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Grafico de Gastos por Categoria'
                }
            }
        });
    }

    function Excluir(){
        tbClientes.splice(indice_selecionado, 1);
        localStorage.setItem("tbClientes", JSON.stringify(tbClientes));
        alert("Registro excluído.");
    }

    Listar();

    $("#frmCadastro").on("submit",function(){
        if(operacao == "A")
            return Adicionar();
        else
            return Editar();        
    });

    $("#tblListar").on("click", ".btnEditar", function(){
        operacao = "E";
        indice_selecionado = parseInt($(this).attr("alt"));
        var cli = JSON.parse(tbClientes[indice_selecionado]);
        $("#descricao").text(cli.Descricao);
        $("#gasto").val(cli.Gasto);
        $("#data").val(cli.Data);
        $("#categoria").val(cli.Categoria);
    });

    $("#tblListar").on("click", ".btnExcluir", function(){
        indice_selecionado = parseInt($(this).attr("alt"));
        Excluir();
        Listar();
    });
});
