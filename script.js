let records = JSON.parse(localStorage.getItem("workRecords")) || [];

const tbody = document.getElementById("tbody");

const dateInput = document.getElementById("date");
const startInput = document.getElementById("start");
const endInput = document.getElementById("end");

const rateInput = document.getElementById("hourRate");

const daysText = document.getElementById("days");
const hoursText = document.getElementById("hours");
const incomeText = document.getElementById("income");
const averageText = document.getElementById("average");


// افزودن روز کاری
document.getElementById("addBtn").onclick = function(){

    let date = dateInput.value;
    let start = startInput.value;
    let end = endInput.value;

    if(!date || !start || !end){
        alert("لطفاً تاریخ و ساعت ورود و خروج را وارد کنید");
        return;
    }


    let minutes = calculateMinutes(start,end);


    if(minutes <= 0){
        alert("ساعت خروج باید بعد از ساعت ورود باشد");
        return;
    }


    let record = {

        id: Date.now(),

        date: date,

        start: start,

        end: end,

        minutes: minutes

    };


    records.push(record);

    save();

    render();


    dateInput.value="";
    startInput.value="";
    endInput.value="";

};



// محاسبه مدت زمان کار
function calculateMinutes(start,end){


    let startTime = start.split(":");

    let endTime = end.split(":");


    let startMinutes =
    Number(startTime[0])*60+
    Number(startTime[1]);


    let endMinutes =
    Number(endTime[0])*60+
    Number(endTime[1]);



    // برای شیفت شب
    if(endMinutes < startMinutes){

        endMinutes += 24*60;

    }


    return endMinutes-startMinutes;

}



// تبدیل دقیقه به ساعت
function formatTime(minutes){

    let h = Math.floor(minutes/60);

    let m = minutes%60;


    return `${h} ساعت و ${m} دقیقه`;

}



// ذخیره اطلاعات
function save(){

    localStorage.setItem(
        "workRecords",
        JSON.stringify(records)
    );

}



// نمایش جدول
function render(){


    tbody.innerHTML="";


    records.forEach(item=>{


        let tr=document.createElement("tr");


        let money =
        (item.minutes/60) *
        Number(rateInput.value);



        tr.innerHTML=`

        <td>${item.date}</td>

        <td>${item.start}</td>

        <td>${item.end}</td>

        <td>${formatTime(item.minutes)}</td>

        <td>${Math.round(money).toLocaleString("fa-IR")} تومان</td>

        <td>

        <button onclick="removeRecord(${item.id})">
        🗑 حذف
        </button>

        </td>

        `;


        tbody.appendChild(tr);


    });


    updateSummary();

}



// حذف رکورد
function removeRecord(id){

    records =
    records.filter(
        item=>item.id!==id
    );


    save();

    render();

}



// بروزرسانی اطلاعات کلی
function updateSummary(){


    let totalMinutes = 0;


    records.forEach(item=>{

        totalMinutes += item.minutes;

    });



    let totalMoney =
    (totalMinutes/60) *
    Number(rateInput.value);



    daysText.innerText =
    records.length;



    hoursText.innerText =
    formatTime(totalMinutes);



    incomeText.innerText =
    Math.round(totalMoney)
    .toLocaleString("fa-IR")
    +" تومان";



    let average =
    records.length ?
    totalMinutes/records.length :
    0;



    averageText.innerText =
    formatTime(Math.round(average));


}



// تغییر حقوق ساعتی
rateInput.oninput=function(){

    render();

};


// اجرای اولیه
render();
// حالت تیره و روشن

const themeBtn = document.getElementById("themeBtn");


if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");

    themeBtn.innerHTML="☀️ حالت روشن";

}


themeBtn.onclick=function(){


    document.body.classList.toggle("dark");


    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML="☀️ حالت روشن";

    }

    else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML="🌙 حالت تیره";

    }

};
// خروجی Excel (CSV)

document.getElementById("excelBtn").onclick = function(){

    let csv = "تاریخ,ورود,خروج,مدت کار,حقوق روزانه\n";

    let totalMinutes = 0;
    let totalMoney = 0;


    records.forEach(function(item){

        let money = Math.round(
            (item.minutes / 60) * Number(rateInput.value)
        );


        totalMinutes += item.minutes;
        totalMoney += money;


        csv += 
        item.date + "," +
        item.start + "," +
        item.end + "," +
        formatTime(item.minutes) + "," +
        money.toLocaleString("fa-IR") + " تومان\n";

    });


    csv += "\n";
    csv +=
    "جمع کل,,," +
    formatTime(totalMinutes) +
    "," +
    totalMoney.toLocaleString("fa-IR") +
    " تومان";


    let file = new Blob(
        ["\uFEFF" + csv],
        {
            type:"text/csv;charset=utf-8"
        }
    );


    let link = document.createElement("a");

    link.href = URL.createObjectURL(file);

    link.download = "گزارش_کاری.csv";

    link.click();

};



// چاپ

document.getElementById("printBtn").onclick=function(){

    window.print();

};

// خروجی PDF

document.getElementById("pdfBtn").onclick = function(){

    let report = document.createElement("div");

    report.style.direction = "rtl";
    report.style.padding = "20px";
    report.style.background = "white";
    report.style.color = "black";


    let html = "";

    html += "<h2 style='text-align:center'>گزارش ساعات کاری</h2>";

    html += "<table border='1' style='width:100%;border-collapse:collapse;text-align:center'>";


    html += "<tr>";
    html += "<th>تاریخ</th>";
    html += "<th>ورود</th>";
    html += "<th>خروج</th>";
    html += "<th>مدت کار</th>";
    html += "<th>حقوق</th>";
    html += "</tr>";


    let totalMinutes = 0;
    let totalMoney = 0;


    records.forEach(function(item){

        let money = Math.round(
            (item.minutes / 60) * Number(rateInput.value)
        );


        totalMinutes += item.minutes;
        totalMoney += money;


        html += "<tr>";

        html += "<td>" + item.date + "</td>";
        html += "<td>" + item.start + "</td>";
        html += "<td>" + item.end + "</td>";
        html += "<td>" + formatTime(item.minutes) + "</td>";
        html += "<td>" + money.toLocaleString("fa-IR") + " تومان</td>";

        html += "</tr>";

    });


    html += "</table>";

    html += "<h3>مجموع کار: " + formatTime(totalMinutes) + "</h3>";

    html += "<h3>درآمد کل: " + totalMoney.toLocaleString("fa-IR") + " تومان</h3>";


    report.innerHTML = html;


    document.body.appendChild(report);


    html2pdf()
    .set({
        filename:"گزارش-ساعات-کاری.pdf",
        margin:10,
        html2canvas:{
            scale:2
        }
    })

   .from(report)
.save()
.then(()=>{

    alert("درساخت PDF مشکلی پیش آمد");

});

};
 