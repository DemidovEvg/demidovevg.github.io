/*Настройка при маленьком экране*/
document.addEventListener("DOMContentLoaded", function(event) { 
    var widthWind = document.querySelector('body').offsetWidth;
    if (widthWind <= 1000) {
        var cell1=document.querySelector("#len_notification_calc_head");
        cell1.textContent="L уч. изв. расч.(м)";
        var cell1=document.querySelector("#len_notification_fact_head");
        cell1.textContent="L уч. изв. факт.(м)";
        cell1=document.querySelector("#time_notification_head");
        cell1.textContent="t изв. ф.(с)";
        cell1=document.querySelector("#delay_notification_head");
        cell1.textContent="t зад. изв. р.(с)";
        cell1=document.querySelector("#l_from_light_head");
        cell1.textContent="L от тон. до св.(м)";
        cell1=document.querySelector("#time_from_light_head");
        cell1.textContent="t тр. с места(с)";
        cell1=document.querySelector("#delay_open_light_head");
        cell1.textContent="t зад. откр. св.(с)";
    }
});
const colors = {
    blue:'#92b4fd',
    grey:'#c5c6ca',
    yellow:'#ffd540',
    black:'#000',
    white:'#f4f5ff',
    red:'#ff7575',
    green: '#a2cff0'
}
function store_value(id){
    let element_storage;
    let element_input;
    let value;
    element_storage = localStorage.getItem(id);
    element_input = document.getElementById(id);

    if (element_input){
        
        value = element_input.value;
        localStorage.setItem(id, value);
    }
    else if (element_input.value){
        value = element_storage.value;
        element_input.value = value
    }
    else {
        value = null;
    }
    return;  
}

function get_value_put_event(id,event){

}
function get_data_check_enought_data(){

}

function move_track(ordinate_start, ordinate_end, speed_begin, speed_max){
    let trafic_section = {
        speed_max: speed_max,
        speed_begin_: speed_begin,
        ordinate_start_: ordinate_start,
        ordinate_end_: ordinate_end,
    }
    let S = Math.abs(ordinate_end - ordinate_start);
    //1) Движение с одной максимальной скоростью
    if (speed_begin>=speed_max) {
        trafic_section.speed_end_ = speed_max;
        trafic_section.time_mov = S/speed_max;
        trafic_section.type = "speed const";
        return trafic_section;
    }
    //2) Движение с ускорением
    //Определим время достижения максимальной скорости поезда
    let time_to_max_speed;
    const a = 0.8; //Ускорение в м/с 
    time_to_max_speed = (speed_max - speed_begin)/a;
    let time_with_acceleration;
     
    //По расстоянию определим время движения по участку если двигаемся только с ускорением
    time_with_acceleration = (-speed_begin + Math.sqrt(Math.pow(speed_begin,2) + 2 * a * S))/a;
    //alert(time_with_acceleration);
    if (time_with_acceleration<=time_to_max_speed) {
        trafic_section.speed_end_ = speed_begin + a * time_with_acceleration;
        trafic_section.time_mov = time_with_acceleration;   
        trafic_section.type = "speed only with acceleration";    
        return trafic_section;
    } else {
        //Если попали сюда, то значит часть участка разгоняемся, а по части едим с одной скоростью
        let s_with_aceleration;
        s_with_aceleration = speed_begin *  time_to_max_speed + a*Math.pow(time_to_max_speed,2)/2;
        
        let s_with_const_speed;
        s_with_const_speed = S - s_with_aceleration;
        //alert(s_with_const_speed);
        let time_with_const_speed;
        time_with_const_speed = s_with_const_speed/speed_max;
        trafic_section.speed_end_ = speed_max;
        trafic_section.time_mov = time_to_max_speed + time_with_const_speed;
        trafic_section.type = "speed with acceleration and const";
        trafic_section.len_section_with_const_speed = ordinate_end- s_with_const_speed;
        trafic_section.time_with_const_speed_ = time_with_const_speed;
        return trafic_section;
    }

}
var common_calc = 0;
function reset_view(){
    let message_error = document.getElementById("message_error");
    let message_result = document.getElementById("message_result");
    let message_info = document.getElementById("message_info");
    message_error.textContent='';
    message_result.textContent='';
    message_info.textContent='';
    message_error.style.backgroundColor = colors.blue;
    message_result.style.backgroundColor = colors.blue;
    message_info.style.backgroundColor = colors.blue;
    const max_sector = 10;
    let sector_picket = [];
    let sector_ord = [];
    let speed_on_sector = [];
    for(let i=1; i<=max_sector; i++){
        sector_picket[i-1] = localStorage.getItem("sector_picket" + i);
        sector_ord[i-1] = localStorage.getItem("sector_ord" + i);
        speed_on_sector[i-1] = localStorage.getItem("speed_on_sector" + i);
        input = document.getElementById("sector_picket" + i);
        input.style.backgroundColor = colors.white;
        input = document.getElementById("sector_ord" + i);
        input.style.backgroundColor = colors.white;
        input = document.getElementById("speed_on_sector" + i);
        input.style.backgroundColor = colors.white;
    }
    let train = document.getElementById("train");
    train.style.backgroundColor = colors.white;
    let len_notification_calc = document.getElementById("len_notification_calc");
    let len_notification_fact = document.getElementById("len_notification_fact");
    let time_notification = document.getElementById("time_notification");
    let delay_notification = document.getElementById("delay_notification");
    let l_from_light = document.getElementById("l_from_light");
    let time_from_light = document.getElementById("time_from_light");
    let delay_open_light = document.getElementById("delay_open_light");
    len_notification_calc.textContent = "---";
    len_notification_fact.textContent = "---";
    time_notification.textContent = "---";
    delay_notification.textContent = "---";
    l_from_light.textContent = "---";
    time_from_light.textContent = "---";
    delay_open_light.textContent = "---";
}
function try_recalc(){
    reset_view();
    let notification_time_required =  parseFloat(localStorage.getItem("notification_time_required"));
    let obj_width =  localStorage.getItem("obj_width");
    let obj_picket = localStorage.getItem("obj_picket");
    let obj_ordinate = localStorage.getItem("obj_ordinate");
    let start_speed = localStorage.getItem("start_speed");

    let message_error = document.getElementById("message_error");
    let message_result = document.getElementById("message_result");
    let message_info = document.getElementById("message_info");
    /////////////
    if (!notification_time_required){
        message_error.textContent = "Введите время извещения";
        message_error.style.backgroundColor = colors.red;
        return;
    } else if (notification_time_required<=0)
    {
        message_error.textContent = "Введите корректное время";
        message_error.style.backgroundColor = colors.red;
        return;
    }
    //////////////
    if (!obj_picket){
        message_error.textContent = "Введите пикет объекта";
        message_error.style.backgroundColor = colors.red;
        return;
    } else {
        message_error.textContent = "";
        message_error.style.backgroundColor = colors.blue;
    }
    ///////////////
    if (!obj_ordinate){
        message_error.textContent = "Введите ординату объекта";
        message_error.style.backgroundColor = colors.red;
        return;
    } else {
        message_error.textContent = "";
        message_error.style.backgroundColor = colors.blue;
    }
    ////////////////
    if (!start_speed){
        message_error.textContent = "Введите начальную скорость";
        message_error.style.backgroundColor = colors.red;
        return;
    } else {
        if (start_speed==0) {
            message_info.textContent = "Трогание с места"
            message_info.style.backgroundColor = colors.yellow;
        } else {
            message_info.textContent = "Расчет на скорости"
            message_info.style.backgroundColor = colors.green;
        }
    }
    //////////////
    // Считаем параметры движения по всем возможным участкам {
    const max_sector = 10;
    let sector_picket = [];
    let sector_ord = [];
    let speed_on_sector = [];
    let ord_speed_for_calc = {
        ord:[],
        max_speed:[],
        count:0,
        count_ord_in_table:[]
    }
    let input;
    
    for(let i=1; i<=max_sector; i++){
        sector_picket[i-1] = String(localStorage.getItem("sector_picket" + i));
        sector_ord[i-1] = String(localStorage.getItem("sector_ord" + i));
        speed_on_sector[i-1] = String(localStorage.getItem("speed_on_sector" + i));
        input = document.getElementById("sector_picket" + i);
        input.style.backgroundColor = colors.white;
        input = document.getElementById("sector_ord" + i);
        input.style.backgroundColor = colors.white;
        //alert(sector_picket[i-1]);
        if (!((sector_picket[i-1] === "null") || (sector_picket[i-1] === "")) && ((sector_ord[i-1] === "null") || (sector_ord[i-1] === ""))){
            input = document.getElementById("sector_ord" + i);        
            input.style.backgroundColor = colors.grey;
            input.setAttribute("placeholder", "Не требуется");
        }else {
            input = document.getElementById("sector_ord" + i);
            input.style.backgroundColor = colors.white;
            input.setAttribute("placeholder", "");
        }
        if (((sector_picket[i-1] === "null") || (sector_picket[i-1] === "")) && !((sector_ord[i-1] === "null") || (sector_ord[i-1] === ""))){
            input = document.getElementById("sector_picket" + i);        
            input.style.backgroundColor = colors.grey;
            input.setAttribute("placeholder", "Не требуется");
        }else {
            input = document.getElementById("sector_picket" + i);
            input.style.backgroundColor = colors.white;
            input.setAttribute("placeholder", "");
        }
        if (!((sector_ord[i-1] === "null") || (sector_ord[i-1] === ""))){
            //alert(typeof(sector_ord[i-1]));
            ord_speed_for_calc.ord[ord_speed_for_calc.count] = parseFloat(sector_ord[i-1]);
            ord_speed_for_calc.max_speed[ord_speed_for_calc.count] = parseFloat(speed_on_sector[i-1]/(3.6));
            ord_speed_for_calc.count_ord_in_table[ord_speed_for_calc.count] = i;
            ord_speed_for_calc.count++;
        } else if (!((sector_picket[i-1] === "null") || (sector_picket[i-1] === ""))){
            ord_speed_for_calc.ord[ord_speed_for_calc.count] = parseFloat(sector_picket[i-1]) - parseFloat(obj_picket) + parseFloat(obj_ordinate);
            ord_speed_for_calc.max_speed[ord_speed_for_calc.count] = parseFloat(speed_on_sector[i-1]/(3.6));
            ord_speed_for_calc.count_ord_in_table[ord_speed_for_calc.count] = i;
            ord_speed_for_calc.count++;
        }
          
    }
    //alert(ord_speed_for_calc.count);
    //} Считаем параметры движения по всем возможным участкам

    //Проверяем наличие ординат пути
    if (ord_speed_for_calc.count===0){
        alert("нет ординат")
        return;
    }

    // Проверяем порядок ординат если значений больше одного{
    if (ord_speed_for_calc.count>=2) {
        let mov_direction;
        if (obj_ordinate < ord_speed_for_calc.ord[0]) {
            mov_direction = "ord_must_rise";
        } else if (obj_ordinate > ord_speed_for_calc.ord[0]) {
            mov_direction = "ord_must_fall";
        } else {
            input = document.getElementById("sector_picket" + ord_speed_for_calc.count_ord_in_table);
            input.style.backgroundColor = colors.red;
            input = document.getElementById("sector_ord" + ord_speed_for_calc.count_ord_in_table);
            input.style.backgroundColor = colors.red;
            return;
        }
        for (let i = 1; i < ord_speed_for_calc.count; i++){ 
            function select_wrong_row(row){
                input = document.getElementById("sector_picket" + ord_speed_for_calc.count_ord_in_table[row]);
                input.style.backgroundColor = colors.red;
                input = document.getElementById("sector_ord" + ord_speed_for_calc.count_ord_in_table[row]);
                input.style.backgroundColor = colors.red;
                let message_error = document.getElementById("message_error");
                message_error.textContent='Ошибка ординат/пк';
                message_error.style.backgroundColor = colors.red;
            }     
            if ((mov_direction === "ord_must_rise") &&
                    ((+ord_speed_for_calc.ord[i-1]) >= (+ord_speed_for_calc.ord[i]))){
                        //alert(ord_speed_for_calc.ord[i-1] + "/" + ord_speed_for_calc.ord[i]);
                select_wrong_row(i);
                return;  
            } else if ((mov_direction === "ord_must_fall") &&
                        (ord_speed_for_calc.ord[i-1] < ord_speed_for_calc.ord[i])){
                select_wrong_row(i);
                return; 

            }
        }

    }
    //} Проверяем порядок ординат если значений больше одного

    // Проверяем наличие скоростей{
        for (let i = 0; i < ord_speed_for_calc.count; i++){
            if (isNaN(ord_speed_for_calc.max_speed[i])){
                return;
            } else if (ord_speed_for_calc.max_speed[i]<=0){
                let input = document.getElementById("speed_on_sector" + ord_speed_for_calc.count_ord_in_table[i]);            
                input.style.backgroundColor = colors.red;
                return;
            }
        }
    //} Проверяем наличие скоростей

    let move_time = 0;
    let trafic_sections = []
    //alert(previous_trafic_section.speed_end_);
    let start_speed_local = parseFloat(start_speed/(3.6));
    for (let i = ord_speed_for_calc.count-1; i > 0; i--){
        //alert(ord_speed_for_calc.ord[i] + "/" + ord_speed_for_calc.ord[i-1]+ "/" +start_speed_local
        //+ "/" + ord_speed_for_calc.max_speed[i]);
        trafic_sections[i] = move_track(
            ord_speed_for_calc.ord[i],
            ord_speed_for_calc.ord[i-1],
            start_speed_local,
            ord_speed_for_calc.max_speed[i]
            );
            start_speed_local = trafic_sections[i].speed_end_;   
        move_time += trafic_sections[i].time_mov;
        //alert(ord_speed_for_calc.ord[i-1] + "/" +ord_speed_for_calc.ord[i]+ "/" + previous_trafic_section.speed_end_ + "/" + ord_speed_for_calc.max_speed[i]);
    }
    trafic_sections[0] = move_track(
        ord_speed_for_calc.ord[0],
        obj_ordinate,
        start_speed_local,
        ord_speed_for_calc.max_speed[0]
        );
    move_time += trafic_sections[0].time_mov;
    alert(ord_speed_for_calc.max_speed[0]+'/'+start_speed_local+'/'+obj_ordinate+'/'+ord_speed_for_calc.ord[0]);
    //alert(move_time);
    let len_notification_calc = document.getElementById("len_notification_calc");
    let len_notification_fact = document.getElementById("len_notification_fact");
    let time_notification = document.getElementById("time_notification");
    let delay_notification = document.getElementById("delay_notification");
    let l_from_light = document.getElementById("l_from_light");
    let time_from_light = document.getElementById("time_from_light");
    let delay_open_light = document.getElementById("delay_open_light");  
    let train = document.getElementById("train");
    
    //Выведем значения при трогании с места
    if (start_speed==0){
        l_from_light.textContent = Math.abs(ord_speed_for_calc.ord[ord_speed_for_calc.ord.length-1] - obj_ordinate);
        time_from_light.textContent = Math.floor(move_time*10)/10;
        if (move_time<notification_time_required){
            delay_open_light.textContent = Math.round((notification_time_required-move_time)*10)/10;
        }   
        return;  
    }

    if (move_time>=notification_time_required){ 
        train.style.backgroundColor = colors.green;
        message_result.textContent = 'Извещения хватает';
        message_result.style.backgroundColor = colors.green;
    } else {
        train.style.backgroundColor = colors.white;
        message_result.textContent = 'Извещения не хватает';
        message_result.style.backgroundColor = colors.yellow;
        
    }

    time_notification.textContent = Math.floor(move_time*10)/10;
    len_notification_fact.textContent = Math.abs(ord_speed_for_calc.ord[ord_speed_for_calc.ord.length-1] - obj_ordinate);
    delay_notification.textContent = Math.floor((move_time - notification_time_required)*10)/10;
    
    // Рассчитаем Длину участка извещения расчетную
    // 1) Идет с конца и набираем извещение
    let time_select_for_notif_calc = 0;
    let len_remaining_current_section;
    const a = 0.8; //Ускорение в м/с
    for (let i = 0; i <  ord_speed_for_calc.count; i++){
        //alert(trafic_sections[i].time_mov);
        time_select_for_notif_calc += trafic_sections[i].time_mov;
        if ((time_select_for_notif_calc >= notification_time_required)||(i===(ord_speed_for_calc.count-1))){
            time_select_for_notif_calc -= trafic_sections[i].time_mov;
            let time_remaining_current_section = notification_time_required - time_select_for_notif_calc; 
            
            //time_select_for_notif_calc += trafic_sections[i].time_with_const_speed_;
            if (trafic_sections[i].type==="speed const"){
                len_remaining_current_section = trafic_sections[i].speed_end_*time_remaining_current_section;
            } else if(trafic_sections[i].type==="speed only with acceleration"){
                len_remaining_current_section = 
                    trafic_sections[i].speed_end_*time_remaining_current_section - 
                    a * Math.pow(time_remaining_current_section,2)/2;
            } else{
                if (time_select_for_notif_calc+trafic_sections[i].time_with_const_speed_>= notification_time_required){
                    //значит подучастка с постоянной скоростью достаточно
                    len_remaining_current_section = trafic_sections[i].speed_end_*time_remaining_current_section;
                } else {
                    //значит определяем сколько осталось набрать на участке ускорения
                    time_select_for_notif_calc += time_remaining_current_section;
                    time_remaining_current_section -= trafic_sections[i].time_with_const_speed_;
                    len_remaining_current_section = trafic_sections[i].len_section_with_const_speed + 
                        trafic_sections[i].speed_end_*time_remaining_current_section - 
                        a * Math.pow(time_remaining_current_section,2)/2;                   
                }
            }
            //alert(len_remaining_current_section);
            len_notification_calc.textContent = Math.round((Math.abs(obj_ordinate - 
                trafic_sections[i].ordinate_end_)+
                len_remaining_current_section)*10)/10;

            break;
        }
    }   
}

function reload_recalc_listener(id){
    let input = document.getElementById(id);
    //При обновлении страницы пробуем восстановить значение из хранилища
    let element_storage;
    element_storage = localStorage.getItem(id);  
    //alert(element_storage);
    if (localStorage.hasOwnProperty(id) && (element_storage !== "null") && (element_storage !== "")){      
        //alert(element_storage);
        input.value = element_storage;
    }
    
    input.addEventListener('input', function(){
        store_value(id);       
        try_recalc();
    });
}
reload_recalc_listener("notification_time_required");
reload_recalc_listener("obj_width");
reload_recalc_listener("obj_picket");
reload_recalc_listener("obj_ordinate");
reload_recalc_listener("start_speed");

const max_sector = 10;
for(let i=1; i<=max_sector; i++){
    reload_recalc_listener("sector_picket" + i);
    reload_recalc_listener("sector_ord" + i);
    reload_recalc_listener("speed_on_sector" + i);
}
try_recalc();
///Блок---Организуем управление через стрелки по таблице
{
    document.getElementById('notification_time_required').addEventListener('keydown', function(e){ 
        control(e,'','obj_width','obj_picket','','obj_width'); });
    document.getElementById('obj_width').addEventListener('keydown', function(e){ 
        control(e,'','','start_speed','notification_time_required','obj_picket'); });
    document.getElementById('obj_picket').addEventListener('keydown', function(e){ 
        control(e,'notification_time_required','obj_ordinate','sector_picket1','','obj_ordinate'); });
    document.getElementById('obj_ordinate').addEventListener('keydown', function(e){ 
        control(e,'notification_time_required','start_speed','sector_ord1','obj_picket','start_speed'); });
    document.getElementById('start_speed').addEventListener('keydown', function(e){ 
        control(e,'obj_width','','speed_on_sector1','obj_ordinate','sector_picket1'); });

    ///Управление столбца "Пикет точки отсчета"
    document.getElementById('sector_picket1').addEventListener('keydown', function(e){ 
        control(e,'obj_picket','sector_ord1','sector_picket2','','sector_ord1'); });
    for (let i=2; i<=max_sector-1;i++){
        document.getElementById('sector_picket'+i).addEventListener('keydown', function(e){ 
            control(e,'sector_picket'+(i-1),'sector_ord'+i,'sector_picket'+(i+1),'','sector_ord'+i); });
    }
    document.getElementById('sector_picket'+max_sector).addEventListener('keydown', function(e){ 
        control(e,'sector_picket'+(max_sector-1),'sector_ord'+max_sector,'','','sector_ord'+max_sector); });   

    ///Управление столбца "Ордината точки отсчета"
    document.getElementById('sector_ord1').addEventListener('keydown', function(e){ 
        control(e,'obj_ordinate','speed_on_sector1','sector_ord2','sector_picket1','speed_on_sector1'); });
    for (let i=2; i<=max_sector-1;i++){
        document.getElementById('sector_ord'+i).addEventListener('keydown', function(e){ 
            control(e,'sector_ord'+(i-1),'speed_on_sector'+i,'sector_ord'+(i+1),'sector_picket'+i,'speed_on_sector'+i); });
    }
    document.getElementById('sector_ord'+max_sector).addEventListener('keydown', function(e){ 
        control(e,'sector_ord'+(max_sector-1),'speed_on_sector'+max_sector,'','sector_picket'+max_sector,'speed_on_sector'+max_sector); });    

    ///Управление столбца "Uмакс начиная от точки"
    document.getElementById('speed_on_sector1').addEventListener('keydown', function(e){ 
        control(e,'start_speed','','speed_on_sector2','sector_ord1','sector_picket2'); });
    for (let i=2; i<=max_sector-1;i++){
        document.getElementById('speed_on_sector'+i).addEventListener('keydown', function(e){ 
            control(e,'speed_on_sector'+(i-1),'','speed_on_sector'+(i+1),'sector_ord'+i,'sector_picket'+(i+1)); });
    }   
    document.getElementById('speed_on_sector'+max_sector).addEventListener('keydown', function(e){ 
        control(e,'speed_on_sector'+(max_sector-1),'','','sector_ord'+max_sector,'notification_time_required'); });

    function control(e,top,right,bottom,left,enter){
        switch(e.key){
            case "ArrowLeft":  // если нажата клавиша влево
                e.preventDefault();
                if (left.length>0) {
                    element_for_select = document.getElementById(left);
                    element_for_select.focus();
                    element_for_select.select();
                }
                break;
            case "ArrowUp":   // если нажата клавиша вверх 
                e.preventDefault();
                if (top.length>0) {
                    element_for_select = document.getElementById(top);
                    element_for_select.focus();
                    element_for_select.select(); 
                }        
                break;
            case "ArrowRight":   // если нажата клавиша вправо
                e.preventDefault();
                if (right.length>0) {
                    element_for_select = document.getElementById(right);
                    element_for_select.focus();
                    element_for_select.select(); 
                } 
                break;   
            case "ArrowDown":   // если нажата клавиша вниз
                e.preventDefault();
                if (bottom.length>0) {
                    element_for_select = document.getElementById(bottom);
                    element_for_select.focus();
                    element_for_select.select(); 
                }
                break;
            case "Enter":   // если нажата клавиша вправо
                e.preventDefault();
                if (enter.length>0) {                  
                    element_for_select = document.getElementById(enter);
                    element_for_select.focus();
                    element_for_select.select(); 
                } 
                break;           
        }
            
        
    }
}
