var river,title_temp, date_time, temp_value, category_temp, req_temp;
var r=1, t=1, d=1;
var or_at_ad, dataString, riverString, river_name, river_rate;
var dirt_array=["Азот нитритный", "Азот аммонийный", "Азот нитратный", "Фенол", "Нефтепродукты", "Органические вещества(по ХПК)", "Железо", "Медь", "Цинк", "Марганец", "БПК5"];


//On app load
function getAll(){
    loadRiver();
    loadData();
    insertTable();
}

//Запрос на получение наименований рек
function loadRiver(){
    function ajaxRequest(){
        return $.ajax({
           type:"GET",
           url:"/db_rivers",
           data:'river'
           });
       }
       $river=ajaxRequest();
       $river
       .done(function(data){
           riverString=data.split(';');
           for (i=0; i<riverString.length; i++)
           {
               $('#river').append('<option value="'+riverString[i]+'">'+riverString[i]+'</option>');
           }
       })
}

//Запрос на получение дат наблюдения
function loadData(){
    function ajaxRequest(){
        return $.ajax({
           type:"GET",
           url:"/db_dates",
           data:'date'
           });
       }
       $mod_data=ajaxRequest();
       $mod_data
       .done(function(data){
        dataString=data.split(';');
        dataString.sort();
           for (i=0; i<dataString.length; i++)
           {
               $('#date').append('<option value="'+dataString[i]+'">'+dataString[i]+'</option>');
           }
       })
}



//При смене выбора
function OnSelectionChange (id){
    var n=document.getElementById(id).options.selectedIndex;    
    var val = document.getElementById(id).options[n].value;
    

        if(val!='all')
        {
            switch (id){
                case 'river': r = 0; break;
                case 'date': t = 0; break;
                case 'dirt': d = 0; break;
            }
        }else switch(id){
                case 'river': r = 1; break;
                case 'date': t = 1; break;
                case 'dirt': d = 1; break;
        }

/*Разбор случаев выбора различных вариантов для графика,
где 001_100 значит, что выбрана одна река, в одно время с одним веществом,
011_101 - одна река, всё время, все вещества,
110_010 - все реки, всё время, одно вещество
*/
        if (r == 0 && t == 0 && d == 1 || r == 1 && t == 0 && d == 0) {  //001_100   
            var n = document.getElementById('date').options.selectedIndex;
            date_time = document.getElementById('date').options[n].text;       //время
            if (r == 0) {
                category_temp = 
                n = document.getElementById('river').options.selectedIndex;
                title_temp = document.getElementById('river').options[n].text;
                n = document.getElementById('dirt').options.selectedIndex;
                req_temp = document.getElementById('dirt').options[n].text;
            } else {
                category_temp = riverString;
                n = document.getElementById('dirt').options.selectedIndex;
                title_temp = document.getElementById('dirt').options[n].text;
                n = document.getElementById('river').options.selectedIndex;
                req_temp = document.getElementById('river').options[n].text;
            }
            temp_001_100 = title_temp + date_time+req_temp;
            OR_OT_AD__AR_OT_OD__temp(temp_001_100);
            OR_OT_AD__AR_OT_OD();
        }



        if (r == 0 && t == 1 && d == 1 || r == 1 && t == 0 && d == 1) { //011_101
            if (r == 0) {
                var n = document.getElementById('river').options.selectedIndex;
                title_temp = document.getElementById('river').options[n].text;
                category_temp = dataString;          
            } else {
                var n = document.getElementById('date').options.selectedIndex;
                title_temp = document.getElementById('date').options[n].text;
                category_temp = riverString;
            }
            var n = document.getElementById('dirt').options.selectedIndex;
            req_temp = document.getElementById('dirt').options[n].text;
            temp_011_101 = category_temp+title_temp+req_temp;
            OR_AT_AD__AR_OT_AD__temp(temp_011_101);
            OR_AT_AD__AR_OT_AD();
        }
    

        if (r == 1 && t == 1 && d == 0 || r == 0 && t == 1 && d == 0) { //110_010
            ajax_temp1; ajax_temp2;
            if (r == 1) {
                var n = document.getElementById('dirt').options.selectedIndex;
                title_temp = document.getElementById('dirt').options[n].text;
                n = document.getElementById('river').options.selectedIndex;
                ajax_temp1 = document.getElementById('river').options[n].text;
                category_temp= dataString;

            } else {
                var n = document.getElementById('river').options.selectedIndex;
                title_temp = document.getElementById('river').options[n].text;
                n = document.getElementById('dirt').options.selectedIndex;
                ajax_temp1 = document.getElementById('dirt').options[n].text;
                category_temp= dataString;
            }
            var n = document.getElementById('date').options.selectedIndex;
            ajax_temp2 = document.getElementById('date').options[n].text;
            temp_110_010=title_temp+ajax_temp1+ajax_temp2;
            OR_AT_OD__AR_AT_OD(temp_110_010);
            OR_AT_OD__AR_AT_OD();
        }
}

//написано 001_100
function OR_OT_AD__AR_OT_OD__temp(temp_001_100)  {
    function ajaxRequest(){
        return $.ajax({
           type:"GET",
           url:"/db_or_ot_ad",
           data:temp_001_100
           });
       }
       $ajax_temp=ajaxRequest();
       $ajax_temp
       .done(function(data){
       temp_value=data;
        })
}

//написано 011_101
function OR_AT_AD__AR_OT_AD__temp(temp_011_101) {

    if (r == 0) {
        function jsonRequest() {
            return $.getJSON('/db_or_at_ad', temp_011_101)
        } 
            $or_at_ad_temp=jsonRequest();
            $or_at_ad_temp
            .done(function(data) {
                or_at_ad=data;
            }) 
        }else {
            function jsonRequest() {
                return $.getJSON('/db_ar_ot_ad', temp_011_101)
            } 
                $or_at_ad_temp=jsonRequest();
                $or_at_ad_temp
                .done(function(data) {
                    or_at_ad=data;
                }) 
        } 
}

//написано 110_010
function OR_AT_OD__AR_AT_OD(temp_110_010) {
    if (r == 0) {
        function jsonRequest() {
            return $.getJSON('/db_or_at_od', temp_110_010)
        } 
            $or_at_od_temp=jsonRequest();
            $or_at_od_temp
            .done(function(data) {
                or_at_od=data;
            }) 
        }else {
            function jsonRequest() {
                return $.getJSON('/db_ar_at_od', temp_110_010)
            } 
                $or_at_od_temp=jsonRequest();
                $or_at_od_temp
                .done(function(data) {
                    or_at_od=data;
                }) 
        } 
}

//написано 001_100
function OR_OT_AD__AR_OT_OD() {
    tabcontent = document.getElementsByClassName("grafic");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById('OR_OT_AD__AR_OT_OD').style.display = "block";

    var chart = Highcharts.chart('dirt_one_river', {

        title: {
            text: title_temp
        },
    
        subtitle: {
            text: date_time
        },
    
        xAxis: {
            categories: category_temp
        },
    
        series: [{
            type: 'column',
            colorByPoint: true,
            data: temp_value,
            showInLegend: false
        }]
    });
}

//написано 011_101
function OR_AT_AD__AR_OT_AD() {
    tabcontent = document.getElementsByClassName("grafic");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById('OR_AT_AD__AR_OT_AD').style.display = "block";
    Highcharts.chart('oneriver_onetime', {
        chart: {
            type: 'column'
        },
        title: {
            text: title_temp
        },
        xAxis: {
            categories: category_temp,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'values'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} уе</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: or_at_ad
    });
}

//написано 010_110
function OR_AT_OD__AR_AT_OD() {
    tabcontent = document.getElementsByClassName("grafic");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById('AR_AT_OD__OR_AT_OD').style.display = "block";
    Highcharts.chart('onedirt_oneriverdirt', {

        title: {
            text: temp_title
        },

        yAxis: {
            title: {
                text: 'value'
            }
        },

        xAxis: {
            categories: category_temp
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
            }
        },

        series: or_at_od,

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
}

//Таблица рейтинга загрязнения
function ajaxRateTable(){
    function ajaxRequest(){
        return $.ajax({
           type:"GET",
           url:"/db_river_name" 
           });
       }
       $ajax_temp=ajaxRequest();
       $ajax_temp
       .done(function(data){
       //river_name=data;
       })
    function ajaxRequest(){
    return $.ajax({
        type:"GET",
        url:"/db_river_rate" 
        });
    }
    river_rate = ["8.5", "9", "9.5", "9.5", "9.5", "10", "10.5", "11", "11", "11.5", "12.5", "12.5"];
       $ajax_temp=ajaxRequest();
       $ajax_temp
       .done(function(data){
       //river_rate = data;
           //river_rate = ["8.5", "9", "9.5", "9.5", "9.5", "10", "10.5", "11", "11", "11.5", "12.5", "12.5"];
       })      
}

function insertTable(){
    var d=document;
    var tbody = d.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    river_name = ['р. Тура, в створе с. Покровское',
            'р. Ишим, в створе с. Абатское',
            'р. Тобол, в створе с. Иевлево',
            'р. Тура, в створе с. Салаирка',
            "р. Тура, выше г. Тюмени",
            "р. Тура, ниже г. Тюмени",
            "р. Ишим, в створе с. Ильинское",
            "р. Ишим, выше г. Ишима",
            "р. Ишим, ниже г. Ишима",
            "р. Тобол, в створе с. Коркино",
            "р. Тобол, выше г. Ялуторовска",
            "р. Тобол, ниже г. Ялуторовска"];
    river_rate = ["8.5", "9", "9.5", "9.5", "9.5", "10", "10.5", "11", "11", "11.5", "12.5", "12.5"];     
    for (i=0; i<11;i++)
    {
    // Создаем строку таблицы и добавляем ее
    var row = d.createElement("tr");
    tbody.appendChild(row);
    // Создаем ячейки в вышесозданной строке
    // и добавляем тх
    var td1 = d.createElement("td");
    var td2 = d.createElement("td");
    var td3 = d.createElement('td');

    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);

    // Наполняем ячейки
    td1.innerHTML = i+1;
    td2.innerHTML = river_name[i];
    td3.innerHTML = river_rate[i];
    }
}
