// AiCRO 기준 Setting의 DVS에서 사용할 수 있으며, 적용하고자 할 때 OID값을 확인하여야 한다.

// 입력 날짜가 YYYY-MM-DD 형식이 아니면 메세지 출력  2022-10-25  
// Date기능을 사용할 OID값 마다 각각 따로 사용하여야 한다.  즉, DTF 내 Date 기능이 3개라면 OID값을 변경하여 3번 사용 
var message =""; 
var trueFalse = false;
date=ITEM.getValue("DTF_SCANDTC_CT")  
const date_Check = /\d{4}-\d{2}-\d{2}/;  // 정규표현식    const는 최초 1회만 사용할 것
if((ITEM.getValue("DTF_SCANDTC_CT") === null) && megic.isNull(ITEM.getValue("DTF_SCANDTC_CT"))) {
    var message = "날짜 미기재";
    
    trueFalse = true;
    var mandatory = false;
    
    ITEM.alarm("prompt",trueFalse,message,mandatory,"DTF_SCANDTC_CT")
}else if (date !== null && !date_Check.test(date)){
    console.log(date_Check.test(date))
    var message = "YYYY-MM-DD 형식이 아닙니다.";
    trueFalse = true;
    var mandatory = false;
    
    ITEM.alarm("prompt",trueFalse,message,mandatory,"DTF_SCANDTC_CT");
}else{
    // 조건 만족시 경고메세지 삭제
    ITEM.alarm("prompt",trueFalse,message,mandatory,"DTF_SCANDTC_CT");
}



// Indicator NO -> All Change Null  2022-10-20
// Lesion Indicator를 No로 클릭하면, No.1 ~ No.5 안의 밸류 값들이 일체히 null값으로 변경
// 이전 일정의 Indicator 값을 가져오는 기능과 중복될 수 있어 사실상, New Lesion에만 활용될 것으로 사료됩니다.
if(ITEM.getValue("R_NEWLIND")!=="Yes") {    // Lesion Indicator의 OID값 확인하기
    let resetList=["R_NEWLOC_","R_NEWLOCOT_","R_NEWLOCSITE_","R_NEWLOCSITE_MUL_","R_NEWLDL_SE","R_NEWLDL_IM","R_NEWLMET_","R_NEWLMETOT_","R_NLIMG_","R_NLDTC_","R_NEWCMT_"];
    for (let i=1;i<6;i++){
        for (const resetItem of resetList){
            ITEM.setValue(null,resetItem+i); 
        }
    }
    // ITEM.setValue(null,"");
} 
// // Indicator NO -> All Change Null 검증하는 코드
// else{
//     let resetList=["R_NEWLOC_","R_NEWLOCOT_","R_NEWLOCSITE_","R_NEWLOCSITE_MUL_","R_NEWLDL_SE","R_NEWLDL_IM","R_NEWLMET_","R_NEWLMETOT_","R_NLIMG_","R_NLDTC_","R_NEWCMT_"];
//     for (let i=1;i<6;i++){
//         for (const resetItem of resetList){
//             let x=ITEM.getValue(resetItem+i);
//                 if (x !==null){
//             console.log(resetItem+i+" : "+x);
//                 }
//         }
//     }
// }



// New Lesion   리스트 안에는 OID 값을 넣는다.
var OIDarray = new Array("1","2","3","4");

// ----------test--------
var OIDarray_size=OIDarray.length;


// 2-1 Date_List = 각 VISIT 의 날짜 추출 
var Date_List = [];
for(var i=0; i<OIDarray_size; i++){
  var studyEventOID=OIDarray[i]; 
    value_date = ITEM.getValue('TUDTC_TUDATE',0,'mRECIST',0,'mRECIST',0,studyEventOID);
    Date_List.push(value_date);
    
}
console.log("Date@@"+Date_List);

 


// 2-2 {VISIT_DATE : VISIT  } VISIT과 해당 VISIT의 날짜를 Dictionary형태로 생성
var dict = {};

for (var i=0; i<Date_List.length; i++) {
    console.log(Date_List[i]);
    console.log(OIDarray[i]);
    dict[Date_List[i]] = OIDarray[i];
}








// 2-3 Dictionary 의 Key값(visit)을 기준으로 sorting -> 빠른 날짜 순으로
var dict_keys = Object.keys(dict);
console.log("check1"+dict_keys);
 
    //Get the number of keys - easy using the array 'length' property
    var i, len = dict_keys.length
    //Sort the keys. We can use the sort() method because 'keys' is an array
    dict_keys.sort();
    //This array will hold your key/value pairs in an ordered way : it will be an array of objects
    var arr = [];
    console.log("check2"+dict_keys);
    //Now let's go throught your keys in the sorted order
    for (i = 0; i < len; i++)
    {
        //get the current key
        v = dict_keys[i];
        //show you the key and the value (retrieved by accessing dict with current key)
        console.log("Sorted KEY , Values"+v + ':' + dict[v]);
        //Using the array 'push' method, we add an object at the end of the result array
        //It will hold the key/value pair
        arr.push(dict[v]);
    }
// //Result
console.log("Sorted Result",arr);

// -------





// 현재 방문 번호 찾기 
var number = 0;
for(var i=0; i<arr.length ;i++){
    if(arr[i] === currentStudyEventOID){
        number = i-1;
    }
}

for (var j = number; -1 < j ;j--){
    console.log("넘버 : " +number);
    var NEWIND = ITEM.getValue('NEWIND',0,'mRECIST',0,'mRECIST',0,arr[j]); 
    if(NEWIND !== null & NEWIND !== "" & NEWIND !== "0"){ // 뉴리전이 입력되어있다면~
        ITEM.setValue(NEWIND,'NEWIND',0,'mRECIST',0,'mRECIST',0,currentStudyEventOID); //현재 뉴리전에 넣어라!








//작성일자 날짜 초과 금지 
var today = new Date();

var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();

function parse(str) {
    var y = str.substr(0,4),
        m = str.substr(4,2) - 1,
        d = str.substr(6,2);
    return new Date(y,m,d);
}

var w_date = ITEM.getValue('DTF_SCANDTC_CT_CHEST',0,'DTF',0,'DTF');
var w_date3 = null;

if(w_date !== null) {
    var w_date1 = w_date.replace("-","");
    var w_date2 = w_date1.replace("-","");
    w_date3 = parse(w_date2);
   

}

if(today < w_date3 ){
    alert("올바른 형식으로 작성해 주세요");
    ITEM.setValue("",'DTF_SCANDTC_CT_CHEST',0,'DTF',0,'DTF');
}