// 상근이의 플래너 1.9 - 종료 안정화
// Scriptable 전용 / 보라빛 핑크 에디션

const reminders = await Reminder.allIncomplete();
const calendars = await Calendar.forReminders();
const fmt = new Intl.DateTimeFormat("en-US", {timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"});
function dateKey(d){if(!d)return "";const p=Object.fromEntries(fmt.formatToParts(d).filter(x=>x.type!=="literal").map(x=>[x.type,x.value]));return p.year+"-"+p.month+"-"+p.day;}
function timeKey(d){return d?new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Seoul",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(d):"";}
const items=reminders.map((r,id)=>({id,title:r.title||"",date:dateKey(r.dueDate),time:r.dueDateIncludesTime?timeKey(r.dueDate):"",notes:r.notes||"",listId:r.calendar?r.calendar.identifier:""}));
const lists=calendars.map(c=>({id:c.identifier,title:c.title}));
function json(x){return JSON.stringify(x).replace(/</g,"\\u003c").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029");}
const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>
*{box-sizing:border-box}html{min-height:100%;background:#b98fa7}body{margin:0;min-height:100vh;padding:26px 14px 70px;color:white;font-family:-apple-system,sans-serif;background:linear-gradient(180deg,#455e9e 0%,#626ba8 24%,#837ba9 49%,#aa8fae 73%,#d59caa 100%);background-attachment:fixed}
h1{text-align:center;font-size:27px;font-weight:800;margin:12px 0 28px;text-shadow:0 2px 8px #43518455}button{cursor:pointer;touch-action:manipulation;font-family:inherit}.nav{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:20px}.nav h2{font-size:21px;margin:0;white-space:nowrap;text-shadow:0 1px 4px #33447755}.right{display:flex;gap:6px}.nav button,.edit,.del,.save,.cancel,.add{border:1px solid #ffffff66;border-radius:11px;padding:10px;background:#ffffff30;color:white;font-size:16px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}.nav .today,.save,.add{background:#e98e9d;border-color:#f5bdc8;color:white;font-weight:bold}
.calendarPanel{background:#ffffff0b;border:1px solid #ffffff20;border-radius:20px;padding:10px 7px 14px;box-shadow:0 8px 24px #35416a15}.grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}.weekday{text-align:center;padding:10px 0;font-size:13px;font-weight:700}.day{position:relative;border:1px solid #ffffff25;border-radius:10px;min-height:61px;padding:4px 2px;background:#ffffff18;color:white;font-size:13px;font-weight:600;text-shadow:0 1px 2px #00000020}.day.sunday{background:#d74763;color:white}.day.saturday{background:#3674ce;color:white}.day.marked{background:#facc15;color:#242024;font-weight:800;text-shadow:none}.day.selected{outline:2px solid white;outline-offset:-3px}@keyframes todayBlink{0%,100%{box-shadow:inset 0 0 0 3px white,0 0 4px white}50%{box-shadow:inset 0 0 0 3px #ffeb79,0 0 17px #ffe875}}.day.isToday{animation:todayBlink 1.2s ease-in-out infinite;z-index:1}@media(prefers-reduced-motion:reduce){.day.isToday{animation:none;box-shadow:inset 0 0 0 3px white}}.sat{color:#d5e5ff}.sun{color:#ffd1dc}
#date{margin:26px 0 14px;font-size:21px;font-weight:800}.detailsPanel{background:#ffffffd9;border:1px solid white;border-radius:20px;padding:18px 15px;color:#3d4054;box-shadow:0 10px 24px #4d4d6a18}.add{width:100%;margin:0 0 14px;padding:14px;font-size:17px}.task{display:flex;align-items:flex-start;gap:10px;padding:14px 2px;border-bottom:1px solid #c9c6d0}.task:last-child{border-bottom:0}.check{width:32px;height:32px;flex-shrink:0;border:2px solid #777c91;border-radius:50%;background:transparent;color:white;font-size:21px;padding:0;-webkit-appearance:none}.check.pending{background:#e98e9d;border-color:#e98e9d}.check:disabled{opacity:.65}.taskbody{flex:1;min-width:0;overflow-wrap:anywhere;line-height:1.6}.titlebtn{background:transparent;color:#34394e;border:0;padding:0;font-size:16px;font-weight:600;text-align:left}.note{color:#73768a;font-size:13px;margin-top:5px}.taskactions{display:flex;flex-direction:column;gap:6px;flex-shrink:0}.edit,.del{font-size:13px;padding:7px 10px;border:0}.edit{background:#7e8fc5}.del{background:#cc687d}.hint{color:#777b90;font-size:12px;margin-bottom:12px;line-height:1.5}#status{color:#4b5f94;font-size:13px;margin-top:12px;white-space:pre-wrap}
.overlay{position:fixed;inset:0;background:rgba(32,28,53,.68);display:none;align-items:center;justify-content:center;padding:18px;z-index:20}.panel{background:#f7f0f5;color:#34394e;border-radius:18px;padding:20px;width:100%;max-width:450px;max-height:90vh;overflow:auto;box-shadow:0 15px 40px #25243d55}.panel h2{margin-top:0;color:#596aa1}.panel label{display:block;margin:12px 0 5px;font-weight:600}.panel input,.panel textarea,.panel select{width:100%;font-size:16px;padding:10px;border-radius:9px;border:1px solid #c5bdce;background:white;color:#30334a}.panel textarea{min-height:90px}.actions{display:flex;justify-content:flex-end;gap:9px;margin-top:20px}.cancel{background:#e5dfe9;color:#4b4e63;border:0}.panel .save{background:#e98e9d;border:0;color:white}.danger{background:#d44c68;color:white;border:0;border-radius:9px;padding:11px 16px;font-size:16px;font-weight:bold}.warning{color:#b3485c;font-size:14px;line-height:1.6}#deleteName{overflow-wrap:anywhere;font-weight:bold}
</style></head><body><h1>상근이의 플래너</h1><div class="nav"><button onclick="move(-1)">◀</button><h2 id="month"></h2><div class="right"><button onclick="move(1)">▶</button><button class="today" onclick="goToday()">오늘</button></div></div><div class="calendarPanel"><div class="grid" id="grid"></div></div><h3 id="date"></h3><div class="detailsPanel"><button class="add" onclick="openAdd()">＋ 미리 알림 추가</button><div class="hint">체크하면 완료됩니다. 제목을 누르면 편집할 수 있습니다.</div><div id="details"></div><div id="status" role="status"></div></div><div class="overlay" id="overlay"><div class="panel"><h2 id="formTitle">미리 알림</h2><label for="etitle">제목</label><input id="etitle"><label for="edate">마감 날짜</label><input type="date" id="edate"><label for="etime">마감 시간 (선택)</label><input type="time" id="etime"><label for="enotes">메모</label><textarea id="enotes"></textarea><label for="elist">미리 알림 목록</label><select id="elist"></select><div class="actions"><button class="cancel" onclick="closeForm()">취소</button><button class="save" onclick="saveForm()">저장</button></div></div></div><div class="overlay" id="deleteOverlay"><div class="panel"><h2>미리 알림 삭제</h2><p id="deleteName"></p><p class="warning">이 미리 알림을 삭제하시겠습니까? 삭제하면 아이폰 미리 알림에서도 제거됩니다.</p><div class="actions"><button class="cancel" onclick="cancelDelete()">취소</button><button class="danger" onclick="confirmDelete()">삭제 확인</button></div></div></div>
<script>
let items=${json(items)};const lists=${json(lists)};
let pending=[],waiting=false,pendingId=null,editing=null,deleting=null,mode="add";
const $=id=>document.getElementById(id);
function statusText(s){$("status").textContent=s}
function todayParts(){const p=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Seoul",year:"numeric",month:"numeric",day:"numeric"}).formatToParts(new Date());return Object.fromEntries(p.filter(x=>x.type!=="literal").map(x=>[x.type,Number(x.value)]))}
const t=todayParts();let current=new Date(t.year,t.month-1,1),selected=new Date(t.year,t.month-1,t.day);
function key(y,m,d){return y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0")}
function selectedKey(){return key(selected.getFullYear(),selected.getMonth(),selected.getDate())}
function move(n){current=new Date(current.getFullYear(),current.getMonth()+n,1);selected=new Date(current.getFullYear(),current.getMonth(),1);render()}
function goToday(){const t=todayParts();current=new Date(t.year,t.month-1,1);selected=new Date(t.year,t.month-1,t.day);render()}
function choose(d){selected=new Date(current.getFullYear(),current.getMonth(),d);render()}
function fillLists(chosen){const el=$("elist");el.textContent="";for(const l of lists){const o=document.createElement("option");o.value=l.id;o.textContent=l.title;el.appendChild(o)}if(chosen&&lists.some(x=>x.id===chosen))el.value=chosen}
function openAdd(){if(waiting)return;if(!lists.length){statusText("사용 가능한 미리 알림 목록이 없습니다.");return}mode="add";editing=null;$("formTitle").textContent="미리 알림 추가";$("etitle").value="";$("edate").value=selectedKey();$("etime").value="";$("enotes").value="";fillLists(lists[0].id);$("overlay").style.display="flex"}
function openEdit(id){if(waiting)return;const x=items.find(x=>x.id===id);if(!x)return;mode="edit";editing=id;$("formTitle").textContent="미리 알림 편집";$("etitle").value=x.title;$("edate").value=x.date;$("etime").value=x.time;$("enotes").value=x.notes;fillLists(x.listId);$("overlay").style.display="flex"}
function closeForm(){if(waiting)return;editing=null;$("overlay").style.display="none"}
function enqueue(req){if(waiting)return;waiting=true;pendingId=req.type==="complete"?req.id:null;pending.push(req);statusText(req.type==="complete"?"완료 저장 중...":req.type==="delete"?"삭제 중...":"저장 중...");render()}
function saveForm(){if(waiting)return;const title=$("etitle").value.trim(),date=$("edate").value,time=$("etime").value,notes=$("enotes").value,listId=$("elist").value;if(!title){statusText("제목을 입력해 주세요.");return}if(time&&!date){statusText("시간을 입력하려면 날짜도 선택해 주세요.");return}if(mode==="add"&&!listId){statusText("미리 알림 목록을 선택해 주세요.");return}$("overlay").style.display="none";enqueue({type:mode,id:editing,title,date,time,notes,listId})}
function completeItem(id){if(waiting)return;if(!items.some(x=>x.id===id))return;enqueue({type:"complete",id})}
function openDelete(id){if(waiting)return;const x=items.find(x=>x.id===id);if(!x)return;deleting=id;$("deleteName").textContent=x.title;$("deleteOverlay").style.display="flex"}
function cancelDelete(){if(waiting)return;deleting=null;$("deleteOverlay").style.display="none"}
function confirmDelete(){if(waiting||deleting===null)return;const id=deleting;deleting=null;$("deleteOverlay").style.display="none";enqueue({type:"delete",id})}
function result(res){waiting=false;pendingId=null;if(res.ok){if(res.type==="complete"||res.type==="delete")items=items.filter(x=>x.id!==res.id);else if(res.type==="edit"){const x=items.find(x=>x.id===res.id);if(x)Object.assign(x,res.item)}else if(res.type==="add")items.push(res.item);statusText(res.message||"저장 완료")}else statusText("처리 실패: "+res.message);render()}
function render(){const y=current.getFullYear(),m=current.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,last=new Date(y,m+1,0).getDate();$("month").textContent=y+"년 "+(m+1)+"월";let s="";["월","화","수","목","금","토","일"].forEach((w,i)=>{s+='<div class="weekday '+(i===5?"sat":i===6?"sun":"")+'">'+w+'</div>'});for(let i=0;i<first;i++)s+="<span></span>";const now=todayParts(),todayKey=key(now.year,now.month-1,now.day);for(let d=1;d<=last;d++){const date=key(y,m,d),count=items.filter(x=>x.date===date).length,chosen=selected.getFullYear()===y&&selected.getMonth()===m&&selected.getDate()===d,weekday=new Date(y,m,d).getDay();s+='<button class="day '+(weekday===0?"sunday ":"")+(weekday===6?"saturday ":"")+(count?"marked ":"")+(date===todayKey?"isToday ":"")+(chosen?"selected":"")+'" onclick="choose('+d+')">'+d+(count?" ·"+count:"")+"</button>"}$("grid").innerHTML=s;const date=selectedKey();$("date").textContent=date+" 미리 알림";const area=$("details");area.textContent="";const matches=items.filter(x=>x.date===date);if(!matches.length){area.textContent="등록된 미리 알림 없음";return}for(const item of matches){const row=document.createElement("div");row.className="task";const circle=document.createElement("button");circle.className="check"+(pendingId===item.id?" pending":"");circle.textContent=pendingId===item.id?"✓":"";circle.disabled=waiting;circle.setAttribute("aria-label","완료 처리");circle.onclick=()=>completeItem(item.id);const body=document.createElement("div");body.className="taskbody";const title=document.createElement("button");title.className="titlebtn";title.textContent=item.title;title.onclick=()=>openEdit(item.id);body.appendChild(title);if(item.time){const tm=document.createElement("div");tm.className="note";tm.textContent="시간 "+item.time;body.appendChild(tm)}if(item.notes){const note=document.createElement("div");note.className="note";note.textContent=item.notes;body.appendChild(note)}const actions=document.createElement("div");actions.className="taskactions";const edit=document.createElement("button");edit.className="edit";edit.textContent="편집";edit.disabled=waiting;edit.onclick=()=>openEdit(item.id);const del=document.createElement("button");del.className="del";del.textContent="삭제";del.disabled=waiting;del.onclick=()=>openDelete(item.id);actions.append(edit,del);row.append(circle,body,actions);area.appendChild(row)}}
render();
<\/script></body></html>`;
const view=new WebView();
await view.loadHTML(html);
function makeDueDate(req){if(!req.date)return null;const [y,m,d]=req.date.split("-").map(Number);if(req.time){const [hh,mm]=req.time.split(":").map(Number);return new Date(y,m-1,d,hh,mm)}return new Date(y,m-1,d,12,0)}
function applyFields(r,req){r.title=req.title;r.notes=req.notes;r.dueDate=makeDueDate(req);r.dueDateIncludesTime=Boolean(req.time)}
let active=true;
const worker=(async()=>{
  while(active){
    let raw;
    try{
      raw=await view.evaluateJavaScript("setTimeout(function(){completion(pending.length?JSON.stringify(pending.shift()):null)},300)",true);
    }catch(e){break}
    if(!active)break;
    if(!raw)continue;
    let req;try{req=JSON.parse(raw)}catch(e){continue}
    let response;
    try{
      if(req.type==="complete"){
        const r=reminders[req.id];if(!r)throw Error("항목을 찾지 못했습니다.");r.isCompleted=true;await r.save();response={ok:true,type:"complete",id:req.id,message:"완료 처리되었습니다."};
      }else if(req.type==="delete"){
        const r=reminders[req.id];if(!r)throw Error("삭제할 항목을 찾지 못했습니다.");await r.remove();response={ok:true,type:"delete",id:req.id,message:"미리 알림이 삭제되었습니다."};
      }else if(req.type==="edit"){
        const r=reminders[req.id];if(!r)throw Error("항목을 찾지 못했습니다.");const list=calendars.find(x=>x.identifier===req.listId);if(list)r.calendar=list;applyFields(r,req);await r.save();response={ok:true,type:"edit",id:req.id,item:{title:req.title,date:req.date,time:req.time,notes:req.notes,listId:req.listId},message:"수정 완료"};
      }else if(req.type==="add"){
        const list=calendars.find(x=>x.identifier===req.listId);if(!list)throw Error("목록을 찾지 못했습니다.");const r=new Reminder();r.calendar=list;applyFields(r,req);await r.save();const id=reminders.length;reminders.push(r);response={ok:true,type:"add",item:{id,title:req.title,date:req.date,time:req.time,notes:req.notes,listId:req.listId},message:"새 미리 알림 등록 완료"};
      }else throw Error("지원하지 않는 요청입니다.");
    }catch(e){response={ok:false,message:String(e)}}
    if(!active)break;
    try{await view.evaluateJavaScript("result("+json(response)+")",false)}catch(e){break}
  }
})();
try{
  await view.present(true);
}finally{
  active=false;
  Script.complete();
}
